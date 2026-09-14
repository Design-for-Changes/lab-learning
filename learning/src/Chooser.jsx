import { Next } from './Common.jsx';
import { SelectionChart } from './AnalysisMap.jsx';

export default function Chooser(){return <>
 <p className="eyebrow">05 / 解析を選ぶ・調べる</p><h1>解析を選ぶ・調べる</h1>
 <SelectionChart/>
 <Next href="/statistics/checks" label="06　解析の注意点へ進む"/>
 </>;}
