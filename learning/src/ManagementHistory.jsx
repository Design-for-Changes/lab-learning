import PageLink from './PageLink.jsx';
import { useId } from 'react';
import { managementLessons } from './managementContent.js';
import { managementIntroduction } from './managementIntroduction.js';
import { managementEpochs, managementStrands } from './managementEpochs.js';
import { managementSources } from './managementSources.js';

function Literature({ work }) {
  const source = managementSources[work.id];
  const strand = managementStrands[work.strand];
  const heading = { hawthorne: 'ホーソン研究', nonaka: '野中', ryan: 'ライアン', pink: 'ピンク' }[work.id] || work.name.split('＆')[0];
  const sections = work.id === 'drucker' ? managementIntroduction.sections : managementLessons.flatMap(lesson => lesson.sections);
  const section = sections.find(item => item.refs?.includes(work.id) && item.title.includes(heading));
  return <li className="management-work" style={{ '--strand-color': strand.color }}>
    <div className="management-work-meta">
      <span className="management-work-date">{source.year.replace('研究期間 ', '')}{work.id === 'hawthorne' && <small>研究期間</small>}</span>
      <span className="management-work-strand">{strand.label}</span>
    </div>
    <div className="management-work-main">
      <h4>{work.name}<span>{work.title}</span></h4>
      <dl className="management-work-argument">
        <div><dt>なぜ</dt><dd>{work.why}</dd></div>
        <div><dt>ポイント</dt><dd><ul>{work.points.map(point => <li key={point}>{point}</li>)}</ul></dd></div>
      </dl>
      <details className="management-work-reading">
        <summary>{work.name}の解説・文献を読む</summary>
        <div className="management-work-explanation">
          {work.paragraphs.map(index => <p key={index}>{section.paragraphs[index]}</p>)}
          {(work.reading || [work.id]).map(id => {
            const readingSource = managementSources[id];
            return <div className="management-work-source" key={id}>
            <h5>代表文献と読むポイント</h5>
            <p><PageLink href={readingSource.url} target="_blank" rel="noreferrer">{readingSource.title} ↗</PageLink></p>
            <p>{readingSource.author}（{readingSource.year}）. {readingSource.publication}</p>
            <p>{readingSource.reading}</p>
            <p className="small-note">リンク先：{readingSource.access}</p>
          </div>;
          })}
        </div>
      </details>
    </div>
  </li>;
}

export default function ManagementHistory() {
  const uid = useId();
  return <section className="management-history" aria-labelledby={uid}>
    <h2 id={uid}>この歴史でつかむこと</h2>
    <p className="management-history-thesis">組織を動かすには、何を理解し、何を整える必要があるのか。その答えが、作業の効率から、人々の協働・判断・学習へ広がってきた過程を読みます。</p>
    <div className="management-history-axes">
      {Object.entries(managementStrands).map(([id, strand]) => <section key={id} style={{ '--strand-color': strand.color }}>
        <span>{strand.label}</span><h3>{strand.question}</h3><p>{strand.change}</p>
      </section>)}
    </div>
    <p className="management-history-note">年表では、各文献が扱う問題を「なぜ」、そこへの答えを「ポイント」に整理しています。同じ色の問いをたどると、違う時代の文献を比較できます。新しい問いが加わっても、標準化や調整など、以前からの課題は残ります。</p>
    <ol className="management-chronology" aria-label="マネジメントの歴史年表">
      {managementEpochs.map((epoch, index) => <li className="management-era" key={epoch.id}>
        <div className="management-era-date"><span>{epoch.years}</span><small>{String(index + 1).padStart(2, '0')}</small></div>
        <section className="management-era-content" aria-labelledby={uid + '-' + epoch.id}>
          <h3 id={uid + '-' + epoch.id}>{epoch.title}</h3>
          <dl className="management-era-shift">
            <div><dt>背景にある問題</dt><dd>{epoch.context}</dd></div>
            <div><dt>捉え方の変化</dt><dd>{epoch.shift}</dd></div>
          </dl>
          <ul className="management-era-works" aria-label={epoch.years + '年の代表文献・研究'}>
            {epoch.works.map(work => <Literature key={work.id} work={work} />)}
          </ul>
        </section>
      </li>)}
    </ol>
    <p className="management-history-note">年は原著・原論文の刊行年で、ホーソン研究のみ研究期間です。区分と三つの問いは教材上の整理で、色は各文献の主な論点を示します。主に欧米の管理・組織研究と日本の知識創造論を取り上げており、直接の影響関係や一方向の進歩を示すものではありません。論文の日本語表記は内容を示すための訳です。</p>
  </section>;
}
