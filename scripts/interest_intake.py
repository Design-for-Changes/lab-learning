"""Private UUID intake. This module never emits student keys or source filenames."""
import zipfile,json,re,uuid,hashlib,hmac,secrets,os,io,collections,fcntl,csv,unicodedata
from pathlib import Path,PurePosixPath

def private_write(path,obj):
 path.parent.mkdir(parents=True,exist_ok=True);os.chmod(path.parent,0o700)
 temp=path.with_suffix(path.suffix+'.tmp');temp.write_text(json.dumps(obj,ensure_ascii=False,indent=2));os.chmod(temp,0o600);temp.replace(path)

def intake_archive(source,private_dir,session):
 private_dir=Path(private_dir).resolve();repo=Path(__file__).resolve().parents[1]
 if (repo/'.git').exists() and private_dir.is_relative_to(repo):raise ValueError('Private registry must stay outside the public repository.')
 private_dir.mkdir(parents=True,exist_ok=True);os.chmod(private_dir,0o700)
 lock=open(private_dir/'registry.lock','a');os.chmod(private_dir/'registry.lock',0o600);fcntl.flock(lock,fcntl.LOCK_EX)
 registry_file=private_dir/'uuid-registry.json'
 if (private_dir/'student-uuid.csv').exists() and not registry_file.exists():raise ValueError('Restore the UUID registry before importing more records.')
 registry=json.loads(registry_file.read_text()) if registry_file.exists() else {'version':1,'secret':secrets.token_hex(32),'students':{}}
 pairs={}
 csv_path=private_dir/'student-uuid.csv'
 if csv_path.exists():
  with csv_path.open(newline='') as f:pairs={r['student_id']:r['uuid'] for r in csv.DictReader(f)}
 secret=bytes.fromhex(registry['secret']);by_person=collections.defaultdict(list);formats=collections.Counter();errors=0;auxiliary=0
 with zipfile.ZipFile(source) as archive:
  for entry in archive.infolist():
   name=PurePosixPath(entry.filename).name;extension=PurePosixPath(name).suffix.lower()
   if entry.is_dir() or '__MACOSX' in entry.filename or name.startswith('._'):continue
   formats[extension]+=1;parts=name.split('_');key=unicodedata.normalize('NFKC',parts[0]).strip().upper()
   if not re.fullmatch(r'[A-Z]{2}[0-9]{5}',key):
    if key=='ASSIGNMENT' and extension=='.xlsx':auxiliary+=1;continue
    raise ValueError('Unrecognized student filename. Review the input before importing.')
   digest=hmac.new(secret,key.encode(),hashlib.sha256).hexdigest()
   uid=registry['students'].setdefault(digest,str(uuid.uuid4()))
   if key in pairs and pairs[key]!=uid:raise ValueError('Existing UUID mapping disagrees with the registry.')
   pairs[key]=uid
   text='';kind='unsupported';body=archive.read(entry)
   if extension=='.md':
    for enc in ['utf-8-sig']+(['utf-16'] if body.startswith((b'\xff\xfe',b'\xfe\xff')) else [])+['cp932']:
     try:text=body.decode(enc);break
     except UnicodeError:pass
    if not text:errors+=1
    kind='markdown'
   elif extension=='.xlsx':
    from openpyxl import load_workbook
    workbook=load_workbook(io.BytesIO(body),read_only=True,data_only=True)
    text='\n'.join(str(c.value) for sheet in workbook for row in sheet for c in row if c.value is not None);kind='excel'
   plain=re.sub(r'[*`]|\\','',text)
   name_week=re.search(r'第\s*([0-9０-９]+)\s*回',name)
   body_week=re.search(r'(?:^\s*#{1,3}[^\n]*第\s*([0-9０-９]+)\s*回|実施回\s*[：:]\s*(?:第)?\s*([0-9０-９]+))',plain[:1500],re.M)
   body_session=str(int(next(g for g in body_week.groups() if g))) .zfill(2) if body_week else None
   is_log='興味関心ログ' in name or bool(re.search(r'^\s*#\s*[^\n]*興味関心ログ',plain[:500],re.M))
   # Remove private identifiers and metadata; retain content in a private UUID record.
   redacted=re.sub(r'[A-Za-z]{2}\d{5}','[ID removed]',plain)
   if len(parts)>2:
    personal=parts[1].strip()
    if len(personal)>=2 and not re.search(r'第|レポート|提出|ログ',personal):redacted=redacted.replace(personal,'[name removed]')
   redacted='\n'.join(l for l in redacted.splitlines() if not re.search(r'^\s*[-・]?\s*(氏名|学籍番号|学番|学生番号|名前)\s*[：:]',l))
   by_person[uid].append({'text':redacted,'kind':kind,'role':'log' if is_log else 'report','bodySession':body_session,'filenameSession':str(int(name_week[1])).zfill(2) if name_week else None,'digest':hashlib.sha256(body).hexdigest(),'modified':list(entry.date_time)})
 private_write(registry_file,registry)
 csv_temp=csv_path.with_suffix('.csv.tmp')
 with csv_temp.open('w',newline='') as f:
  w=csv.DictWriter(f,fieldnames=['student_id','uuid']);w.writeheader();w.writerows({'student_id':k,'uuid':v} for k,v in sorted(pairs.items()))
 os.chmod(csv_temp,0o600);csv_temp.replace(csv_path)
 records=[]
 for uid,docs in by_person.items():
  # Prefer the submission report; cumulative logs are separate evidence, never concatenated into the research vector.
  reports=[d for d in docs if d['role']=='report' and d['kind']=='markdown'];candidates=reports or [d for d in docs if d['kind']=='markdown'] or docs
  current=[d for d in candidates if d['bodySession']==session or (not d['bodySession'] and d['filenameSession']==session)]
  candidates=current or candidates;chosen=max(candidates,key=lambda d:(d['modified'],len(d['text'])))
  records.append({'uuid':uid,'session':session,'text':chosen['text'],'kind':chosen['kind'],'role':chosen['role'],'bodySession':chosen['bodySession'],'filenameSession':chosen['filenameSession'],'documentCount':len(docs),'hasSeparateLog':any(d['role']=='log' for d in docs),'duplicateContent':len(set(d['digest'] for d in docs))<len(docs)})
 manifest={'session':session,'archiveDigest':hashlib.sha256(Path(source).read_bytes()).hexdigest(),'people':len(records),'files':sum(formats.values()),'formats':dict(formats),'multiplePeople':sum(len(d)>1 for d in by_person.values()),'decodeFailures':errors,'auxiliaryFiles':auxiliary,'registryPeople':len(registry['students'])}
 folder=private_dir/'sessions'/session;private_write(folder/'records.json',records);private_write(folder/'manifest.json',manifest)
 fcntl.flock(lock,fcntl.LOCK_UN);lock.close()
 return records,manifest

if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('zip',type=Path);p.add_argument('--private-dir',type=Path,required=True);p.add_argument('--session',required=True);args=p.parse_args()
 records,manifest=intake_archive(args.zip,args.private_dir,args.session.zfill(2));print(json.dumps(manifest,ensure_ascii=False))
