function Plot({rows,title,labelColumn=0}){
 const xIndex=rows.columns.indexOf('軸1'),yIndex=rows.columns.indexOf('軸2');
 const points=rows.rows.map((row,i)=>({x:row[xIndex],y:row[yIndex],label:String(row[labelColumn]),number:i+1}));
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
 const scale=Math.min(260/Math.max(xmax-xmin,.01),200/Math.max(ymax-ymin,.01)),mx=(xmin+xmax)/2,my=(ymin+ymax)/2;
 const sx=x=>180+(x-mx)*scale,sy=y=>130-(y-my)*scale;
 return <figure className="method-coordinate"><figcaption><strong>{title}</strong></figcaption><svg viewBox="0 0 360 280" role="img" aria-label={`${title}。出力された座標を、両軸で同じ縮尺で配置した図。`}><rect x="35" y="20" width="290" height="225" fill="white" stroke="#ddd"/>{sx(0)>35&&sx(0)<325&&<line x1={sx(0)} x2={sx(0)} y1="20" y2="245" stroke="#ddd"/>}{sy(0)>20&&sy(0)<245&&<line x1="35" x2="325" y1={sy(0)} y2={sy(0)} stroke="#ddd"/>}<text x="180" y="273" textAnchor="middle">軸1</text><text x="15" y="135" textAnchor="middle">軸2</text>{points.map(p=><g key={p.number}><circle cx={sx(p.x)} cy={sy(p.y)} r="5" fill="#cc2939"/><text x={sx(p.x)+8} y={sy(p.y)-8}>{p.number}</text></g>)}</svg><ol className="coordinate-key">{points.map(p=><li key={p.number}>{p.label}</li>)}</ol></figure>;
}
export function MethodCoordinatePlot({id,example}){
 if(id==='quant3'||id==='mca')return null;
 if(id==='pca'&&example.scores)return <Plot rows={example.scores} title="主成分得点を図にする"/>;
 if(!example.output.columns.includes('軸1'))return null;
 if(id==='ca')return <><Plot rows={{...example.output,rows:example.output.rows.filter(row=>row[1]==='製品')}} title="製品どうしの位置"/><Plot rows={{...example.output,rows:example.output.rows.filter(row=>row[1]==='印象語')}} title="印象語どうしの位置"/></>;
 return <Plot rows={example.output} title="出てきた座標を図にする"/>;
}
