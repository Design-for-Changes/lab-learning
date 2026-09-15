import { aiIntroLinks } from './navigation/aiIntro.js';
export { aiIntroLinks, aiIntroAliases, resolveAiIntroRoute } from './navigation/aiIntro.js';
import PageLink from './PageLink.jsx';
import { Next } from './Common.jsx';
import Systems from './AiSystemsLesson.jsx';
import Behavior from './AiBehaviorLesson.jsx';
import Partnership from './AiPartnershipLesson.jsx';






const lessons = [Systems, Behavior, Partnership];

export default function AiIntroCourse({ route }) {
 const index = aiIntroLinks.findIndex(([path]) => path === route);
 if (index < 0) return <><h1>ページが見つかりません</h1><PageLink href="#/ai-intro">AI入門へ戻る</PageLink></>;
 const Lesson = lessons[index];
 return <>
  <p className="eyebrow">AI入門 / {String(index + 1).padStart(2, '0')}</p>
  <h1>{aiIntroLinks[index][1].replace(/^\d+　/, '')}</h1>
  <Lesson/>
  {index < aiIntroLinks.length - 1
   ? <Next href={aiIntroLinks[index + 1][0]} label={`${aiIntroLinks[index + 1][1]}へ進む`}/>
   : <Next href="/" label="学習資料へ戻る"/>}
 </>;
}
