import json,re,collections,math
import numpy as np
import argparse,zipfile,hashlib
from pathlib import Path,PurePosixPath
parser=argparse.ArgumentParser(description='Private ZIP -> public aggregate. No source text or identifiers are exported.')
parser.add_argument('zip',type=Path)
parser.add_argument('--output',type=Path,required=True)
parser.add_argument('--selection-codes',type=Path,help='Optional private previously verified row-to-field codes for this exact input only')
parser.add_argument('--selection-digest',help='SHA-256 of the archive used to verify the optional selection codes')
args=parser.parse_args()
if args.selection_codes and args.selection_digest!=hashlib.sha256(args.zip.read_bytes()).hexdigest():raise SystemExit('Verified codes require a matching source digest.')
repo=Path(__file__).resolve().parents[1]
if args.zip.resolve().is_relative_to(repo):raise SystemExit('Keep the submission archive outside the repository.')
if args.selection_codes and args.selection_codes.resolve().is_relative_to(repo):raise SystemExit('Keep optional verification codes outside the repository.')
collected=collections.defaultdict(list)
with zipfile.ZipFile(args.zip) as archive:
 for entry in archive.infolist():
  name=PurePosixPath(entry.filename).name
  if not name.lower().endswith('.md') or '__MACOSX' in entry.filename or name.startswith('._'):continue
  body=archive.read(entry);decoded=None
  encodings=['utf-8-sig']+(['utf-16'] if body.startswith((b'\xff\xfe',b'\xfe\xff')) else [])+['cp932']
  for encoding in encodings:
   try:decoded=body.decode(encoding);break
   except UnicodeError:pass
  if decoded is None:raise SystemExit('An input file could not be decoded. No output was saved.')
  collected[name.split('_')[0].upper()].append(decoded)
rows=[{'n':i,'text':re.sub(r'[*`]|\\','', '\n'.join(texts))} for i,texts in enumerate(collected.values(),1)]
if len(rows)<30:raise SystemExit('At least 30 records are required for this workflow.')
N=len(rows)
def chosen_field(text):
 candidates=[]
 for line in text.splitlines():
  match=re.match(r'^\s*[-・]?\s*(?:選択した(?:動画|分野)|選んだ動画|最も(?:興味|関心)を持った(?:動画|分野|研究分野))\s*[：:]\s*(.+)',line)
  if match:candidates.append(match[1])
 found=[]
 for t in candidates:
  hits=[d for d,pattern in [('S','感性|中島'),('C','認知|蘆澤|芦澤'),('B','生体|バイオメカ|山本')] if re.search(pattern,t)]
  if len(hits)==1:found.extend(hits)
 return found[0] if found and len(set(found))==1 else 'U'
coding={r['n']:{'domain':chosen_field(r['text'])} for r in rows}
if args.selection_codes:
 verified=json.loads(args.selection_codes.read_text())
 if set(r['n'] for r in verified)!=set(coding):raise SystemExit('Verification codes do not match the record count.')
 coding={r['n']:r for r in verified}
# Closed vocabulary: personal names, uncommon anecdotes, filenames never become public labels.
D=[
('色・配色','配色|カラー|色彩|色の|色が|色を|色と|色や|赤色|青色','perception'),('形・形状','形状|形の|形が|フォルム','perception'),('音・音楽','音楽|音色|音の|音が|聴覚|サウンド','perception'),('触感・素材','触感|触覚|手触り|質感|素材','perception'),('香り・味','香り|嗅覚|匂い|臭い|味覚','perception'),('感情・印象','感情|印象|感動|気持ち','perception'),('好み・魅力','好み|好き|魅力|美し|かわい|可愛','perception'),('無意識・直感','無意識|直感|意識の前|意識する前','perception'),('心地よさ','心地|快適|居心地','perception'),
('注意・集中','注意|集中','cognition'),('認知の負荷','認知負荷|負荷|高次|低次','cognition'),('判断・選択','判断|意思決定|選択肢|選び|選ぶ','cognition'),('錯覚・思い込み','錯覚|思い込み|錯視|バイアス','cognition'),('記憶・学習','記憶|学習|覚え|習得','cognition'),('誤操作・ミス','誤操作|操作ミス|間違|誤り|ミス','cognition'),('見やすさ・理解','見やす|分かりやす|わかりやす|理解しやす|読みやす','cognition'),('習慣・行動','習慣|行動|無意識に','cognition'),
('筋肉・力','筋肉|筋力|筋挫傷|肉離れ','body'),('姿勢・動作','姿勢|動作|歩行|歩き|動き','body'),('疲労・負担','疲労|疲れ|負担','body'),('痛み・損傷','痛み|痛く|損傷|怪我|けが|傷害','body'),('加齢・身体差','高齢|加齢|年齢|個人差|体格','body'),('運動・技能','スポーツ|運動|技能|技術の習得','body'),('安全・予防','安全|予防|事故|危険','body'),('医療・支援','医療|リハビリ|福祉|支援|介護','body'),
('画面・UI','UI|インターフェース|インターフェイス|画面|アプリ','subject'),('表示・サイン','サイン|案内|表示|標識|ピクト','subject'),('ボタン・操作','ボタン|操作|スイッチ','subject'),('製品・道具','製品|道具|商品|モノ|ものづくり','subject'),('椅子・座り方','椅子|イス|座り|座る|座面','subject'),('衣服・身につける','衣服|服の|衣類|靴|アクセサリ','subject'),('空間・居場所','空間|居場所|部屋|室内|教室|建築','subject'),('移動・交通','交通|移動|運転|車の|自動車|公共交通','subject'),('ゲーム・映像','ゲーム|映像|動画表現|アニメ|漫画','subject'),('情報・伝達','情報|伝達|伝わ|コミュニケーション','subject'),('日常生活','日常|生活|普段|身近','subject'),
('計測・センサー','計測|測定|センサー|測る|測れ','method'),('視線・注視','視線|注視|アイトラッ','method'),('脳・生理反応','脳|血流|生理反応|心拍','method'),('実験・比較','実験|比較|条件を変|変えて','method'),('評価・アンケート','アンケート|評価|評定|尺度','method'),('観察・聞き取り','観察|インタビュー|聞き取り|ヒアリング','method'),('モデル・再現','モデル|シミュレーション|再現','method'),('試作・検証','試作|プロトタイプ|検証|テスト','method'),
('仕組みを知る','仕組み|メカニズム|なぜ|どうして','question'),('条件の違い','条件|違い|変わる|変化|影響|どのよう','question'),('他への適用・動物と人','当てはめ|適用|応用|一般化|カエル|蛙|動物|人間に|人に','question'),('測り方の妥当性','どう測|測れる|測れるの|定量|客観|数値|信頼|妥当','question'),('使いやすくする','使いやす|使いづら|使いにく|改善|設計','question'),('言葉にする','言語化|言葉に|説明できない|説明しにく','question'),('個人差・文化差','人によ|個人差|多様|人それぞれ|文化|性別','question')]
patterns=[re.compile(p,re.I) for _,p,_ in D]

def segment(t):
 sections={'video':[],'questions':[],'proposal':[],'choice':[],'ai':[]};vid={'S':[],'C':[],'B':[]};channel=None;domain=None;proposal=False;ai_top=False
 for line in t.splitlines():
  h=re.match(r'^\s*(#{1,6})\s*(.+)',line)
  if h:
   level=len(h[1]); title=h[2]
   if re.search('AIによる学習レポート|AI学習レポート',title):ai_top=True
   elif level<=2:ai_top=False
   if ai_top:
    channel='ai';continue
   if re.search('取り組むなら|研究案|研究提案|研究アイデア|研究テーマ|研究の問い|研究で明らか|背景と目的',title):proposal=True;channel='proposal'
   elif re.search('選択した動画|選択.*興味|選んだ.*理由|興味を持った',title):proposal=False;channel='choice'
   elif re.search('動画[123１２３①②③]|認知心理|感性工学|生体力学|バイオメカ',title):
    proposal=False;channel='video'
    domain='S' if re.search('感性|中島',title) else 'C' if re.search('認知|蘆澤|芦澤',title) else 'B' if re.search('生体|バイオ|山本',title) else None
   elif re.search('AIから受けた説明|AIが説明|AIの補足|フィードバック',title):channel='ai'
   elif re.search('疑問|分から|わから|不明|要確認|質問|曖昧|専門家に聞',title):channel='questions'
   elif re.search('動画の内容|専門用語|キーワード|伝えよう|研究対象とフォーカス|社会的背景',title):channel='video'
   elif proposal:channel='proposal'
   elif ai_top:channel='ai'
   elif level<=2:channel=None
   continue
  if re.search('氏名|学籍番号|学番|学生番号|提出日|AI向け|作成日',line):continue
  if re.match(r'^\s*(動画の内容|専門用語|キーワード|研究対象とフォーカス)[：:]',line):channel='video'
  if re.match(r'^\s*[-・]?\s*(研究テーマ|研究対象|研究で明らかにしたい|研究方法|研究の問い)[：:]',line):channel='proposal'
  if re.match(r'^\s*[-・]?\s*(選択した動画|選んだ動画|最も関心|最も興味)',line):channel='choice'
  if channel and line.strip():
   if re.fullmatch(r'\s*[-・]?\s*(なし|特になし|未確認|不明|未実施|未記入|未提出|まだない)[。\s]*',line):continue
   sections[channel].append(line)
   if channel=='video' and domain:vid[domain].append(line)
 return {k:'\n'.join(v) for k,v in sections.items()},{k:'\n'.join(v) for k,v in vid.items()}

parsed=[]
for r in rows:
 sec,vid=segment(r['text']); parsed.append((sec,vid))
# Binary incidence once per record per concept and channel. No repeated-word inflation.
X={c:np.array([[int(bool(p.search(sec[c]))) for p in patterns] for sec,_ in parsed],float) for c in ['video','questions','proposal','choice','ai']}
# Discard universal classroom vocabulary and rare terms from similarity calculations.
Xnorm={c:X[c]/np.maximum(np.linalg.norm(X[c],axis=1,keepdims=True),1e-9) for c in X}
Xbase=Xnorm['proposal']*.55+Xnorm['questions']*.3+Xnorm['choice']*.15
support=((X['proposal']+X['questions']+X['choice'])>0).sum(0)
keep=(support>=5)&(support<=len(rows)*.88)
weights=np.log((len(rows)+1)/(support+1))+1
Xbase=Xbase[:,keep]*weights[keep]
active=(Xbase>0).sum(1)>=3
indices=np.where(active)[0];B=Xbase[active]; B=B/np.maximum(np.linalg.norm(B,axis=1,keepdims=True),1e-9)
# Deterministic cosine k-means; compare multiple initializations and group sizes.
best=None
for k in range(5,10):
 for seed in range(12):
  rng=np.random.default_rng(seed);centers=B[rng.choice(len(B),k,replace=False)].copy()
  for it in range(100):
   assignment=(B@centers.T).argmax(1);new=[]
   for j in range(k):
    a=B[assignment==j];c=a.mean(0) if len(a) else B[rng.integers(len(B))];new.append(c/max(np.linalg.norm(c),1e-9))
   new=np.array(new)
   if np.max(np.abs(new-centers))<1e-7:break
   centers=new
  sizes=np.bincount(assignment,minlength=k)
  if min(sizes)<5:continue
  dist=np.maximum(0,1-B@B.T);sil=[]
  for i,j in enumerate(assignment):
   a=dist[i,assignment==j].sum()/max(1,sizes[j]-1);b=min(dist[i,assignment==z].mean() for z in range(k) if z!=j);sil.append((b-a)/max(a,b,1e-9))
  score=float(np.mean(sil))
  if best is None or score>best[0]:best=(score,assignment.copy(),k)
if best is None:raise SystemExit('No valid grouping with at least five records in each group. Review locally; no output was saved.')
score,assignment,k=best
members=[indices[assignment==j] for j in range(k)]
# Order by size, labels are reviewed below, no person-level output exported.
members.sort(key=lambda ix:-len(ix))
profiles=[];groups=[]
for j,ix in enumerate(members):
 cnt=((X['proposal'][ix]+X['questions'][ix]+X['choice'][ix])>0).sum(0)
 # Only counts >=5 escape; automatic title candidates are common terms, not private quotes.
 terms=sorted([i for i,v in enumerate(cnt) if v>=5],key=lambda i:-cnt[i]*weights[i])[:8]
 group={'id':'g'+str(j+1),'count':len(ix),'label':' / '.join(D[i][0] for i in terms[:2]),'terms':[{'label':D[i][0],'count':int(cnt[i]),'category':D[i][2]} for i in terms]}
 groups.append(group)
profiles={};explained={}
for lens,ws in [('interests',{'proposal':.55,'questions':.3,'choice':.15}),('video',{'video':1}),('questions',{'questions':1}),('proposal',{'proposal':1})]:
 matrix=sum(Xnorm[c]*w for c,w in ws.items())[:,keep]*weights[keep]
 # The same groups, their centroid profiles change by lens. No identity-level coordinates are produced.
 available=[int(np.sum(np.any(matrix[ix]>0,axis=1)))>=5 for ix in members]
 cent=np.array([matrix[ix].mean(0) for ix in members]);cent=cent/np.maximum(np.linalg.norm(cent,axis=1,keepdims=True),1e-9)
 fitted=cent[np.array(available)];u,s,vt=np.linalg.svd(fitted-fitted.mean(0),full_matrices=False);xy=u[:,:2]*s[:2]
 for a in range(2):
  if xy[np.argmax(np.abs(xy[:,a])),a]<0:xy[:,a]*=-1
 
 if lens!='interests':
  target=np.array([[p['x'],p['y']] for p,yes in zip(profiles['interests']['positions'],available) if yes]);uu,ss,vv=np.linalg.svd(xy.T@target);xy=xy@(uu@vv)
 extent=max(np.abs(xy).max(),1e-9); positions=[];j=0
 for g,yes in zip(groups,available):
  positions.append({'id':g['id'],'x':round(float(xy[j,0]/extent),5) if yes else 0,'y':round(float(xy[j,1]/extent),5) if yes else 0,'available':bool(yes)})
  if yes:j+=1
 context=[]
 for g,ix in zip(groups,members):
  incidence=sum(X[c] for c in ws)>0;counts=incidence[ix].sum(0)
  context.append({'id':g['id'],'terms':[{'label':D[i][0],'count':int(counts[i])} for i in sorted(range(len(D)),key=lambda i:-counts[i]*weights[i]) if counts[i]>=5][:6]})
 profiles[lens]={'positions':positions,'context':context,'retained':round(float(sum(s[:2]**2)/max(sum(s**2),1e-9)),4),'coverage':sum(bool(parsed[i][0][list(ws)[0]].strip()) for i in indices)}
# Preference lens uses confirmed chosen fields, not missingness as a trait.
known_counts=[collections.Counter(coding[rows[i]['n']]['domain'] for i in ix) for ix in members]
cent=np.array([[c[d] for d in ['S','C','B']] for c in known_counts],float)
cent=cent/np.maximum(np.linalg.norm(cent,axis=1,keepdims=True),1e-9)
available=[sum(c[d] for d in ['S','C','B'])>=5 for c in known_counts]
fitted=cent[np.array(available)]
if len(fitted)>=2:
 u,s,vt=np.linalg.svd(fitted-fitted.mean(0),full_matrices=False);xy=u[:,:2]*s[:2]
 target=np.array([[p['x'],p['y']] for p,yes in zip(profiles['interests']['positions'],available) if yes]);uu,ss,vv=np.linalg.svd(xy.T@target);xy=xy@(uu@vv);extent=max(np.abs(xy).max(),1e-9);retained=float(sum(s[:2]**2)/max(sum(s**2),1e-9))
else:xy=np.zeros((len(fitted),2));extent=1;retained=0
positions=[];j=0
for g,yes in zip(groups,available):
 positions.append({'id':g['id'],'x':round(float(xy[j,0]/extent),5) if yes else 0,'y':round(float(xy[j,1]/extent),5) if yes else 0,'available':bool(yes)})
 if yes:j+=1
profiles['choice']={'positions':positions,'context':[{'id':g['id'],'terms':[{'label':{'S':'感性を選んだ記録','C':'認知を選んだ記録','B':'身体を選んだ記録'}[d],'count':c[d]} for d in ['S','C','B'] if c[d]>=5]} for g,c in zip(groups,known_counts)],'retained':round(retained,4),'coverage':sum(c[d] for c in known_counts for d in ['S','C','B'])}
# Per-video explanation concepts, each record counted once, only >=5 cells.
videoCells=[]
for domain,title in [('S','感性の動画'),('C','認知の動画'),('B','身体の動画')]:
 texts=[v[domain] for _,v in parsed];counts=[sum(bool(p.search(t)) for t in texts) for p in patterns]
 for i in sorted(range(len(D)),key=lambda i:-counts[i])[:12]:
  if counts[i]>=5:videoCells.append({'video':title,'label':D[i][0],'count':counts[i]})
# Aggregate question x research-method incidence, not inferred intent or causation.
questionCells=[]
Q=[i for i,(_,_,cat) in enumerate(D) if cat=='question'];M=[i for i,(_,_,cat) in enumerate(D) if cat=='method']
for q in Q:
 for m in M:
  count=int(((X['questions'][:,q]>0)&((X['questions'][:,m]+X['proposal'][:,m])>0)).sum())
  if count>=5:questionCells.append({'question':D[q][0],'method':D[m][0],'count':count})
choices=[]
for g,ix in zip(groups,members):
 counts=collections.Counter(coding[rows[i]['n']]['domain'] for i in ix)
 for d,n in counts.items():
  if n>=5:choices.append({'group':g['id'],'video':{'S':'感性','C':'認知','B':'身体','U':'未確認'}[d],'count':n})
coverage={c:sum(bool(s[c].strip()) for s,_ in parsed) for c in X}
result={'students':N,'minimumGroup':5,'groups':groups,'lenses':profiles,'videoCells':videoCells,'videoCoverage':{title:sum(bool(v[d].strip()) for _,v in parsed) for d,title in [('S','感性の動画'),('C','認知の動画'),('B','身体の動画')]},'questionCells':questionCells,'choices':choices,'coverage':coverage,'mapped':int(active.sum()),'unmapped':int((~active).sum()),'quality':{'silhouette':round(score,3),'features':int(keep.sum()),'candidateGroups':[5,9],'stability':'群の境界は弱く、書式やAIによるまとめ方の影響も残る。確定的なタイプ分類ではない。'},'method':'見出しで動画説明・疑問・研究案・選択理由・AI説明を分離し、事前に定義した語彙の有無を抽出。各欄の特徴を正規化して長い記述の影響を抑え、1人の複数提出はまとめ、同じ語の反復で人数を増やさない。説明はAIがまとめた記録を含む。本人の発言原文とAIによる言い換えは分離できない。AI説明欄は関心の類似度から除外。研究案55%、疑問30%、選択理由15%の特徴から、重み付きコサイン類似度によるk-meansを実施。5〜9群・各12初期値を比較し、全群5人以上でシルエット係数が最大の分割を採用。各見方で5人以上に特徴が拾える集団だけを対象とし、集団の平均特徴を再計算し、古典的MDSと等価な中心化SVDで2次元配置。選択動画の見方は既存の確認済み分野の構成比を使い、未確認は距離の特徴にしない。見方の間で不要な回転を抑えるよう位置を整列。各配置は別の尺度なので距離の絶対値を見方の間で比較しない。軸の向きは意味や優劣を表さない。少人数の語・交差セルは非公開。'}
assert sum(g['count'] for g in groups)==result['mapped'];assert result['unmapped']>=0
result['analysisVersion']='atlas-2'

args.output.parent.mkdir(parents=True,exist_ok=True)
args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2))
# Local audit only: no IDs or raw text in printed output.
print(json.dumps({'coverage':coverage,'mapped':result['mapped'],'quality':result['quality'],'groups':groups,'cells':len(videoCells),'questions':len(questionCells)},ensure_ascii=False,indent=2))
