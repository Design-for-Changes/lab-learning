import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('dist'), base='/lab-learning/';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.csv':'text/csv','.pdf':'application/pdf','.zip':'application/zip'};
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/'){res.writeHead(302,{Location:base});res.end();return;}
  if(!url.pathname.startsWith(base)){res.writeHead(404);res.end('Not found');return;}
  let path=resolve(root,decodeURIComponent(url.pathname.slice(base.length)));
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  if((await stat(path)).isDirectory())path=resolve(path,'index.html');
  const content=await readFile(path);
  res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(content);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(4179,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4179/lab-learning/research/'));
