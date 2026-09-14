import { Next } from './Common.jsx';
import Systems from './AiSystemsLesson.jsx';

export const aiIntroLinks = [
 ['/ai-intro/systems', '01　現代的なAIの計算ロジック'],
];

export function resolveAiIntroRoute(path) {
 return path === '/ai-intro' || path === '/ai/systems' ? '/ai-intro/systems' : path;
}

const lessons = [Systems];

export default function AiIntroCourse({ route }) {
 const index = aiIntroLinks.findIndex(([path]) => path === route);
 if (index < 0) return <><h1>ページが見つかりません</h1><a href="#/ai-intro">AI入門へ戻る</a></>;
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
