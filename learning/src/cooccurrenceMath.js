export function cooccurrenceCounts(documents,words){
 const binary=documents.map(({terms})=>words.map(word=>Number(terms.includes(word))));
 const counts=words.map((_,i)=>words.map((_,j)=>binary.reduce((sum,row)=>sum+row[i]*row[j],0)));
 return {binary,counts};
}
