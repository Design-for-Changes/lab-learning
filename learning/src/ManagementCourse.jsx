import { Section, Next } from './Common.jsx';
import { managementChapters } from './managementContent.js';
import { managementSources } from './managementSources.js';
import ManagementHistory from './ManagementHistory.jsx';
import './management.css';
export { resolveManagementRoute } from './managementContent.js';

export const managementLinks = managementChapters.map(chapter => [
  `/management/${chapter.slug}`, `${chapter.number}　${chapter.title}`,
]);

function SourceLink({ id }) {
  const source = managementSources[id];
  return <a href={source.url} target="_blank" rel="noreferrer">{source.author}（{source.year}） ↗</a>;
}

function References({ ids }) {
  return <div className="management-citations" aria-label="この節の文献">
    <span>文献</span>{ids.map(id => <SourceLink key={id} id={id} />)}
  </div>;
}

function TopicList({ topics }) {
  return <div className="management-topics">
    {topics.map((topic, index) => <article className="management-topic" id={`management-topic-${topic.id}`} key={topic.id}>
      <h3><span>{String(index + 1).padStart(2, '0')}</span>{topic.title}</h3>
      <p className="management-topic-question">{topic.question}</p>
      <p className="management-topic-why"><span>なぜ必要か</span>{topic.why}</p>
      <ul className="management-topic-points">
        {topic.points.map(([point, explanation]) => <li key={point}><strong>{point}</strong>{explanation}</li>)}
      </ul>
      <details className="management-topic-reading">
        <summary>文献と論点<span>{topic.readingLabel}</span></summary>
        <div className="management-topic-sources">
          {topic.readings.map(reading => {
            const source = managementSources[reading.source];
            return <section key={reading.source}>
              <p className="management-source-kind">{reading.kind}</p>
              <h4><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></h4>
              <p className="management-bibliography">{source.author}（{source.year}）. {source.publication}</p>
              <p>{reading.note}</p>
              <p className="management-access">リンク先：{source.access}</p>
            </section>;
          })}
        </div>
      </details>
    </article>)}
  </div>;
}

function ReadingList({ ids }) {
  return <Section title="文献をひらく" id="management-reading">
    <p>本文で参照した文献と辞書です。書籍・論文は原著の年を記し、リンク先が再刊版や紹介ページの場合は、各項目に示しています。</p>
    <div className="management-reading-list">
      {ids.map((id, index) => {
        const source = managementSources[id];
        return <article className="management-reading" key={id}>
          <p className="eyebrow">{String(index + 1).padStart(2, '0')}　{source.author} · {source.year}</p>
          <h3><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></h3>
          <p>{source.person}</p>
          <details>
            <summary>読むポイント・書誌を確認する</summary>
            <div className="answer"><p>{source.reading}</p>
              <p className="management-bibliography">{source.author}（{source.year}）. {source.title}. {source.publication}</p>
              <p className="management-access">リンク先：{source.access}</p>
            </div>
          </details>
        </article>;
      })}
    </div>
  </Section>;
}

export default function ManagementCourse({ route }) {
  const index = managementChapters.findIndex(chapter => route === `/management/${chapter.slug}`);
  const chapter = managementChapters[index];
  if (!chapter) return <><h1>ページが見つかりません</h1><a href="#/management">マネジメント入門へ</a></>;
  const previous = managementChapters[index - 1];
  const next = managementChapters[index + 1];
  return <article className="management-course">
    <p className="eyebrow">マネジメント入門 / {chapter.number}</p>
    <h1>{chapter.title}</h1>
    {chapter.slug === 'history' && <ManagementHistory />}
    {chapter.scene && <Section title="一つの場面から考える">
      <p>{chapter.scene}</p>
      <div className="management-epoch"><span className="eyebrow">この章で考えること · {chapter.period}</span><p>{chapter.epoch}</p></div>
    </Section>}
    {chapter.sections.map((section, sectionIndex) => <Section key={section.title}
      id={`management-${chapter.slug}-${sectionIndex + 1}`} title={section.title}>
      {section.definition && <p className="management-definition">{section.definition}</p>}
      {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
      {section.ideas && <div className="management-ideas">
        {section.ideas.map(([title, explanation], i) => <section key={title}>
          <h3><span>{i + 1}</span>{title}</h3><p>{explanation}</p>
        </section>)}
      </div>}
      {section.topics && <TopicList topics={section.topics} />}
      {section.table && <table className="management-concept-table">
        <caption>{section.table.caption}</caption>
        <thead><tr>{section.table.headings.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
        <tbody>{section.table.rows.map(([term, meaning]) => <tr key={term}><th scope="row">{term}</th><td>{meaning}</td></tr>)}</tbody>
      </table>}
      {section.after?.map((paragraph, i) => <p key={'after-' + i}>{paragraph}</p>)}
      {section.refs && <References ids={section.refs} />}
    </Section>)}
    {chapter.exercise && <Section title="自分の活動に戻って確かめる" id="management-practice">
      <p>{chapter.exercise.task}</p>
      <details className="management-exercise"><summary>考える手がかりを読む</summary><p className="answer">{chapter.exercise.hint}</p></details>
    </Section>}
    {chapter.reading.length > 0 && <ReadingList ids={chapter.reading} />}
    <nav className="management-pagination" aria-label="章を移動する">
      {previous && <a href={`#/management/${previous.slug}`}>← {previous.number}　{previous.title}</a>}
      {next ? <Next href={`/management/${next.slug}`} label={`${next.number}　${next.title}`} /> : <Next href="/management/foundations" label="01へ戻り、最初の問いを読み直す" />}
    </nav>
  </article>;
}
