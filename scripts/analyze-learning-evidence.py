"""Extract reported learning evidence for a private teacher review; never score learners."""
import argparse, json, re, unicodedata, uuid
from pathlib import Path
from interest_intake import private_write

def extract_record(record):
    text = record['text']
    headings = list(re.finditer(r'^[ \t]*(#{1,6})[ \t]+([^\n]+)', text, re.M))
    videos = {}
    general = []
    current = None
    current_level = 0
    patterns = [
        ('response', r'説明後|新たに生じた疑問|自分の反応|さらなる思考|学生の反応|対話で考えた|自分の考え'),
        ('baseline', r'最初.*(?:分から|疑問|理解)|分からなかった|不明点|生じた疑問'),
        ('explanation', r'AI.*(?:説明|補足|解説)|疑問に対するAI'),
        ('remaining', r'残.*疑問|要確認事項|未確認事項|曖昧な点'),
        ('feedback', r'フィードバック|動画.*まとめ'),
        ('reconstruction', r'手掛かり|推測.*確認|学生が説明した内容'),
        ('content', r'動画の内容|動画から分かった|動画タイトル|概要|学んだ|学び|理解した内容'),
    ]
    for index, match in enumerate(headings):
        title = unicodedata.normalize('NFKC', match[2]).strip()
        body = text[match.end():headings[index + 1].start() if index + 1 < len(headings) else len(text)].strip()
        level = len(match[1])
        video_match = re.search(r'(?:動画|ビデオ)\s*([123])\s*(?:[：:(】]|$)', title)
        if video_match:
            current = video_match[1]
            current_level = level
            videos.setdefault(current, {'number': current, 'title': title, 'fields': {}})
        elif current is not None and level <= current_level:
            current = None
        field = next((key for key, pattern in patterns if re.search(pattern, title)), None)
        # Some submissions put the entire answer on the heading line.
        if level >= 3 and ':' in title and field:
            body = (title.split(':', 1)[1] + '\n' + body).strip()
        if level >= 3 and '：' in title and field:
            body = (title.split('：', 1)[1] + '\n' + body).strip()
        item = {'heading': title, 'line': text[:match.start()].count('\n') + 1, 'text': body}
        if field and current is not None:
            videos[current]['fields'].setdefault(field, []).append(item)
        elif re.search(r'最初の理解|理解が変化|説明後に学生|総合フィードバック|根拠となる|比較|研究の問い', title):
            general.append(item)
    blocks = list(videos.values())
    return {'uuid': record['uuid'], 'role': record['role'], 'bodySession': record['bodySession'],
            'videoEvidence': blocks, 'generalEvidence': general, 'fullText': text,
            'extraction': {'videoBlocks': len(blocks),
                           'blocksWithBaselineExplanationResponse': sum(all(v['fields'].get(f) for f in ['baseline','explanation','response']) for v in blocks)},
            'assessment': 'ungraded; reported evidence requires teacher interpretation and independent learner confirmation'}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-dir', type=Path, required=True)
    parser.add_argument('--session', required=True)
    parser.add_argument('--updated-at', required=True)
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[1]
    private = args.private_dir.resolve()
    if private.is_relative_to(repo):
        raise SystemExit('Keep learner evidence outside the public repository.')
    session = args.session.zfill(2)
    if not re.fullmatch(r'\d{2}', session):
        raise SystemExit('Invalid session.')
    folder = private / 'sessions' / session
    records = json.loads((folder / 'records.json').read_text())
    if len({r['uuid'] for r in records}) != len(records):
        raise SystemExit('Duplicate UUID.')
    for record in records:
        uuid.UUID(record['uuid'])
    manifest = json.loads((folder / 'manifest.json').read_text())
    evidence = [extract_record(record) for record in records]
    result = {'version': 'learning-evidence-1', 'updatedAt': args.updated_at,
              'session': session, 'archiveDigest': manifest['archiveDigest'],
              'scope': 'AI-produced submission reports, not authenticated dialogue or an independent understanding test',
              'records': evidence}
    private_write(folder / 'learning-evidence.json', result)
    print(json.dumps({'records': len(evidence), 'videoBlocks': sum(len(r['videoEvidence']) for r in evidence),
                      'output': 'private learning-evidence.json', 'learnerGrades': 'not generated'}))

if __name__ == '__main__':
    main()
