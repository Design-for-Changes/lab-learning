import { shareMetadata, SITE_URL, SITE_NAME } from './share-metadata.mjs';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const name of ['research','learning']) await cp(name+'/dist','dist/'+name,{recursive:true});
await writeFile('dist/.nojekyll','');
const metadata=shareMetadata({title:'学習と研究の資料｜'+SITE_NAME,description:'動態デザイン研究室の学習資料と研究ガイド。',url:SITE_URL});
await writeFile('dist/index.html','<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+metadata+'<script>location.replace("./learning/"+location.search+location.hash);</script></head><body><a href="./research/">研究ガイド</a> / <a href="./learning/">学習資料</a></body></html>');
console.log('GitHub Pages output: dist/research/ and dist/learning/');
