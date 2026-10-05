(() => {
  const root = document.getElementById('interest-map-root');
  if (!root) return;
  const data = JSON.parse(root.querySelector('#interest-map-data').textContent);
  const nodes = new Map(data.nodes.map(node => [node.id,node]));
  const canvas = root.querySelector('.map-canvas');
  const svg = root.querySelector('.map-links');
  const buttons = [...root.querySelectorAll('.interest-island')];
  const detail = root.querySelector('.map-detail-title');
  const list = root.querySelector('.map-detail-links');
  const reset = root.querySelector('.map-reset');
  let selected = null;
  function draw() {
    const box = canvas.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.replaceChildren();
    if (matchMedia('(max-width: 700px)').matches) return;
    const centers = new Map(buttons.map(button => {
      const orb = button.querySelector('.island-orb').getBoundingClientRect();
      return [button.dataset.node,{x:orb.left+orb.width/2-box.left,y:orb.top+orb.height/2-box.top,r:orb.width/2}];
    }));
    for (const link of data.links) {
      const a=centers.get(link.source), b=centers.get(link.target);
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      const x1=a.x+a.r, x2=b.x-b.r, bend=(x2-x1)*.5;
      path.setAttribute('d',`M${x1},${a.y} C${x1+bend},${a.y} ${x2-bend},${b.y} ${x2},${b.y}`);
      path.setAttribute('stroke',link.source.startsWith('q-')?'var(--question-color)':'var(--subject-color)');
      path.setAttribute('stroke-width',link.count*.7);
      path.dataset.source=link.source;path.dataset.target=link.target;
      svg.appendChild(path);
    }
    paint();
  }
  function paint() {
    const adjacent=data.links.filter(link => link.source===selected||link.target===selected);
    const connected=new Set(adjacent.flatMap(link=>[link.source,link.target]));
    for(const button of buttons){
      button.setAttribute('aria-pressed',String(button.dataset.node===selected));
      button.classList.toggle('is-dim',!!selected&&!connected.has(button.dataset.node)&&button.dataset.node!==selected);
    }
    for(const path of svg.querySelectorAll('path')){
      const lit=path.dataset.source===selected||path.dataset.target===selected;
      path.classList.toggle('is-lit',!!selected&&lit);path.classList.toggle('is-dim',!!selected&&!lit);
    }
    reset.hidden=!selected;
    list.replaceChildren();
    if(!selected){detail.textContent='気になる島を選んで、つながりを見る';return;}
    const node=nodes.get(selected);
    detail.textContent=`${node.label} / ${node.count}人`;
    for(const link of adjacent.sort((a,b)=>b.count-a.count)){
      const item=document.createElement('span');
      item.textContent=`${nodes.get(link.source).label} → ${nodes.get(link.target).label}：${link.count}人`;
      list.appendChild(item);
    }
    if(!adjacent.length){const item=document.createElement('span');item.textContent='表示条件を満たすつながりはありません。未確認や少人数の組み合わせは表示していません。';list.appendChild(item);}
  }
  function select(id){selected=selected===id?null:id;paint();}
  for(const button of buttons)button.addEventListener('click',()=>select(button.dataset.node));
  for(const focus of root.querySelectorAll('[data-focus]'))focus.addEventListener('click',()=>{
    selected=focus.dataset.focus;paint();canvas.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  });
  reset.addEventListener('click',()=>{selected=null;paint();});
  new ResizeObserver(draw).observe(canvas);
  document.fonts.ready.then(draw);
  draw();
})();
