const acModel = [['A',0,.5],['B',.5,.75],['C',.75,1]];
function acSplit(lo,hi) { return acModel.map(([symbol,a,b])=>({symbol,lo:lo+(hi-lo)*a,hi:lo+(hi-lo)*b})); }
function acTrace(word) {
  let lo=0,hi=1;
  return [...word].map(symbol=>{
    const next=acSplit(lo,hi).find(row=>row.symbol===symbol);
    if(!next) throw new Error('Unknown symbol');
    const row={...next,parentLo:lo,parentHi:hi};lo=next.lo;hi=next.hi;return row;
  });
}
function acDecode(z,n) {
  if(!(z>=0&&z<1)||!Number.isInteger(n)||n<0||n>3) throw new Error('Invalid teaching input');
  let lo=0,hi=1,word='';
  for(let i=0;i<n;i++){const row=acSplit(lo,hi).find(r=>z>=r.lo&&z<r.hi);word+=row.symbol;lo=row.lo;hi=row.hi;}
  return word;
}

// A 紙本圖解：所有位置與寬度都由同一座標推導，left =（左端 − 軸最小值）/ 軸範圍、width = 長度 / 軸範圍。
// 圖解只使用本檔的可信常數，不接受讀者輸入或遠端內容。
const acTicks=(ticks,min,max)=>`<div class="ac-ticks" aria-hidden="true">${ticks.map((t,i)=>{const [v,label]=Array.isArray(t)?t:[t,String(t)];const cls=v===min?'ac-tick-first':v===max?'ac-tick-last':i===ticks.length-2&&ticks.length>3?'ac-tick-alt':'';return `<span class="${cls}" style="left:${100*(v-min)/(max-min)}%">${label}${v===max?'<small>（不含）</small>':''}</span>`;}).join('')}</div>`;
const acGrid=(ticks,min,max)=>ticks.map(t=>{const v=Array.isArray(t)?t[0]:t;return v===min||v===max?'':`<span class="ac-grid" style="left:${100*(v-min)/(max-min)}%"></span>`;}).join('');

// 放大圖：上方整條 [0,1) 標出目前區間，漏斗接到放大後的 A／B／C 切分。
function acDiagram(lo,hi,selected='',opts={}) {
  const {ticks='all',z=null}=opts, w=hi-lo, pos=v=>100*(v-lo)/w, parts=acSplit(lo,hi);
  const context=lo===0&&hi===1?'':`<div class="ac-context"><div class="ac-context-label"><span>整條 [0, 1)</span><span>目前 [${lo}, ${hi})</span></div><div class="ac-track ac-thin"><span class="ac-range ac-parent" style="left:${100*lo}%;width:${100*w}%"></span></div><div class="ac-funnel" aria-hidden="true" style="clip-path:polygon(${100*lo}% 0,${100*hi}% 0,100% 100%,0 100%)"></div></div>`;
  const tickVals=ticks==='all'?[lo,...parts.slice(1).map(r=>r.lo),hi]:[lo,hi];
  const marker=z===null?'':`<span class="ac-marker" style="left:${pos(z)}%"><b>z</b></span>`;
  return `<div class="ac-zoom">${context}<div class="ac-bar" role="img" aria-label="目前區間 [${lo}, ${hi}) 依 A 二分之一、B 四分之一、C 四分之一切分${selected?`，選取 ${selected}`:''}">${parts.map(r=>`<span class="ac-part ac-${r.symbol.toLowerCase()} ${r.symbol===selected?'ac-selected':''}" style="left:${pos(r.lo)}%;width:${pos(r.hi)-pos(r.lo)}%">${r.symbol}</span>`).join('')}${marker}</div>${acTicks(tickVals,lo,hi)}<p class="ac-note">${context?'下方把目前區間放大到整列寬度；':''}每格包含左端、不含右端。${selected?`框選 ${selected}。`:''}</p></div>`;
}

// 共同座標：每列用同一個 [min, max) 比例，縮小幅度才能直接比較。
function acAxis(rows, min=0, max=1, z=null, opts={}) {
  const range=max-min, ticks=opts.ticks||[min,max], pct=v=>100*(v-min)/range;
  const guide=opts.guide?opts.guide.map(v=>`<span class="ac-guide" style="left:${pct(v)}%"></span>`).join(''):'';
  return `<div class="ac-axis"><p class="ac-axis-head">共同座標 [${opts.minLabel??min}, ${opts.maxLabel??max})${z===null?'':`；固定 z = ${opts.zLabel??z}（朱紅直線）`}</p><div class="ac-rows">${acGrid(ticks,min,max)}${guide}${rows.map(r=>`<div class="ac-axis-row${r.current?' ac-current':''}"><p class="ac-row-label"><strong>${r.label}</strong><span>${r.text??`[${r.lo}, ${r.hi})`}</span></p><div class="ac-track"><span class="ac-range ${r.tone||(r.symbol?`ac-${r.symbol.toLowerCase()}`:'')}" style="left:${pct(r.lo)}%;width:${100*(r.hi-r.lo)/range}%"></span>${r.over?`<span class="ac-over" style="left:${pct(r.over[0])}%;width:${100*(r.over[1]-r.over[0])/range}%"></span>`:''}</div></div>`).join('')}${z===null?'':`<span class="ac-marker" style="left:${pct(z)}%"><b>z</b></span>`}</div>${acTicks(ticks,min,max)}</div>`;
}
function acSteps(word) {
  if(!word)return `<div class="ac-stack"><section class="ac-card"><h2>起點 [0, 1)</h2>${acDiagram(0,1)}</section></div>`;
  const rows=acTrace(word);
  const zoom=rows.map((r,i)=>`<section class="ac-card"><h2>第 ${i+1} 步：${r.symbol}</h2>${acDiagram(r.parentLo,r.parentHi,r.symbol)}<p>選取後：[${r.lo}, ${r.hi})</p></section>`).join('');
  const axisRows=[{label:'起點',lo:0,hi:1,tone:'ac-start'},...rows.map((r,i)=>({...r,label:word.slice(0,i+1),current:i===rows.length-1}))];
  return `<div class="ac-stack"><section class="ac-card ac-main"><h2>整體如何縮小</h2>${acAxis(axisRows,0,1,null,{ticks:[0,.5,.75,1]})}</section>${word.length>1?`<details class="ac-more"><summary>展開每一步的局部放大</summary><div class="ac-stack">${zoom}</div></details>`:zoom}</div>`;
}
function mountAc(root,state) {
  state.word??='';
  const buttons=[...root.querySelectorAll('[data-ac]')], output=root.querySelector('[data-ac-output]');
  const render=()=>{output.innerHTML=`<p class="ac-number">序列 ${state.word?`<b>${state.word}</b>`:'<i>（空）</i>'}<span>${state.word.length} / 3</span></p>`+acSteps(state.word);buttons.forEach(b=>b.disabled=b.dataset.ac==='reset'||b.dataset.ac==='undo'?!state.word:state.word.length===3);};
  const click=e=>{const action=e.currentTarget.dataset.ac;if(action==='reset')state.word='';else if(action==='undo')state.word=state.word.slice(0,-1);else if(state.word.length<3)state.word+=action;render();};
  buttons.forEach(b=>b.addEventListener('click',click));render();
  return ()=>buttons.forEach(b=>b.removeEventListener('click',click));
}
const acLegend=`<ul class="ac-legend">${acSplit(0,1).map(r=>`<li><i class="ac-chip ac-${r.symbol.toLowerCase()}"></i><strong>${r.symbol}</strong><span>機率 ${r.symbol==='A'?'1/2':'1/4'}</span><span>[${r.lo}, ${r.hi})</span></li>`).join('')}</ul>`;
const acBac=acTrace('BAC').at(-1), acAaa=acTrace('AAA').at(-1);
const story={title:'算術編碼如何縮小區間？',label:'EE274 / 算術編碼',back:{href:'../../06-arithmetic-coding.html',label:'返回第 06 章'},pages:[
{id:'shared-model',section:'01 / 雙方的契約',title:'先約定怎麼切，再傳送符號',lead:'固定 A 的機率為 1/2，B 與 C 各 1/4。編碼器與解碼器都使用 A→B→C 的順序。',art:`<section class="ac-card">${acDiagram(0,1)}${acLegend}</section>`,point:'[L, H) 包含左端、不含右端；恰好 0.5 屬於 B。',detail:'自建教學模型，各位置使用相同機率。本篇最多三個符號，長度另行約定；不包含模型與長度的傳輸成本。'},
{id:'first-b',section:'02 / 第一刀',title:'看到 B，留下中間的四分之一',lead:'從 [0, 1) 開始，B 的累計機率是 0.5、機率是 0.25。',art:acSteps('B'),point:'新區間是 [0.5, 0.75)，寬度 0.25。',detail:'更新用舊寬度 W=H−L：新左端 L+0.5W，新右端 L+0.75W。'},
{id:'then-a',section:'03 / 在裡面再切',title:'下一個 A，取 B 區間的左半',lead:'第二次切的是目前留下的區間。把它放大後，仍依同一個機率模型分成 A、B、C。',art:`<section class="ac-card">${acDiagram(.5,.75,'A')}<p class="ac-result"><strong>BA：[0.5, 0.625)</strong><span>寬度：0.25 × 0.5 = 0.125</span></p></section>`,point:'每個新符號只在目前區間內縮小範圍。'},
{id:'predict-c',section:'04 / 先預測',title:'BA 後面接 C，會留下哪一段？',lead:'目前 BA 是 [0.5, 0.625)。C 仍占目前區間的最右四分之一。',art:`<section class="ac-card">${acDiagram(.5,.625,'',{ticks:'ends'})}</section>`,point:'先找目前的寬度，再依比例移動端點。',question:{prompt:'BAC 的區間是哪一個？',hideFuturePreviews:true,choices:[{value:'global',label:'[0.75, 1)',feedback:'這是第一層 C 的區間；第三步必須留在 BA 裡面。'},{value:'nested',label:'[0.59375, 0.625)',feedback:'對。左端是 0.5 + 0.125 × 0.75；右端仍是 0.625。'}]}},
{id:'try-symbols',section:'05 / 親手縮小',title:'換一個符號，觀察端點怎麼走',lead:'依序按 B、A、C 重現算例，也可試其他序列。先在共同座標看縮小，再展開局部放大，最多三步。',art:'<div class="ac-controls"><button data-ac="A"><i class="ac-chip ac-a" aria-hidden="true"></i>加入 A</button><button data-ac="B"><i class="ac-chip ac-b" aria-hidden="true"></i>加入 B</button><button data-ac="C"><i class="ac-chip ac-c" aria-hidden="true"></i>加入 C</button><button data-ac="undo">退一步</button><button data-ac="reset">重設</button></div><div data-ac-output role="status" aria-live="polite"></div>',previewArt:acSteps('B'),mount:mountAc,point:'區間會保留整段前綴的資訊；離頁再返回會保留操作。',detail:'按鈕可用 Tab 聚焦、Enter 或空白鍵操作。所有端點都是此短序列可精確表示的二進位分數。'},
{id:'width-product',section:'06 / 機率變成寬度',title:'BAC 的寬度，就是這個序列的模型機率',lead:'固定獨立模型下，每一步把寬度乘上新符號的機率。',art:`<div class="ac-pair"><section class="ac-card"><h2>B → BA → BAC</h2><p class="ac-big">1/32</p><p>1/4 × 1/2 × 1/4<br>0.625 − 0.59375 = 0.03125</p></section><section class="ac-card"><h2>比較 AAA</h2><p class="ac-big">1/8</p><p>1/2 × 1/2 × 1/2<br>AAA 的區間寬度是 BAC 的 4 倍。</p></section></div><section class="ac-card">${acAxis([{label:'BAC',lo:acBac.lo,hi:acBac.hi,symbol:'C',current:true},{label:'AAA',lo:acAaa.lo,hi:acAaa.hi,tone:'ac-a'}],0,1,null,{ticks:[0,.125,.5,1]})}</section>`,point:'模型認為越常見的序列，分到的區間越寬。',detail:'有脈絡模型時，改乘每一步的條件機率；雙方仍須使用相同模型。'},
{id:'binary-prefix',section:'07 / 區間變成位元',title:'10011 不只是一個點，也能圈出一段範圍',lead:'五位二進位前綴 0.10011，對應從 19/32 到 20/32（不含）的區間。',art:`<section class="ac-card"><h2>同一座標比較覆蓋範圍</h2>${acAxis([{label:'BAC',lo:19/32,hi:20/32,text:'[19/32, 20/32)',symbol:'C',current:true},{label:'五位 10011',lo:19/32,hi:20/32,text:'[19/32, 20/32)',tone:'ac-fit'},{label:'四位 1001',lo:18/32,hi:20/32,text:'[18/32, 20/32)',tone:'ac-fit',over:[18/32,19/32]}],18/32,21/32,null,{ticks:[[18/32,'18/32'],[19/32,'19/32'],[20/32,'20/32'],[21/32,'21/32']],guide:[19/32,20/32],minLabel:'18/32',maxLabel:'21/32'})}<p>1001 多蓋住左邊 [18/32,19/32)（斜線段），因此整段沒有落在 BAC 內。</p><p class="ac-note">此圖放大 [18/32,21/32)，三列共用比例；虛線是 BAC 的兩端。</p></section>`,point:'選有限前綴時，檢查它代表的整個半開區間都落在目標區間內。',detail:'使用二進位前綴的標準半開區間約定（不採無限個 1 的非標準端點寫法）。本例用 5 bits 表示序列；沒有計入模型、長度與封裝成本。'},
{id:'decode-back',section:'08 / 反向尋找',title:'固定同一個 z，連續找三次',lead:'取 z=19/32=0.59375，已約定序列長度是 3。每次看 z 落在哪個子區間。',art:`<section class="ac-card">${acAxis(acTrace('BAC').map((r,i)=>({...r,label:`第 ${i+1} 次找到 ${r.symbol}`,current:i===2})),0,1,19/32,{ticks:[0,.5,.75,1]})}<p>沿朱紅直線向下看：同一個 z 依次落在 B、BA、BAC 範圍裡。</p></section><section class="ac-card"><h2>放大第三步的 BA</h2>${acDiagram(.5,.625,'C',{z:19/32})}<p>z 正好在 C 的左端；左端包含，所以選 C。</p></section>`,point:'得到 BAC 後，因為已讀滿 3 個符號而停止。',detail:'z 恰好等於第三步的左端，仍屬於 C。單靠 z 不知道何時停止；也可設計 EOF 符號，但本模型沒有 EOF。'},
{id:'real-coder',section:'09 / 回到實務',title:'換成 CA，你能自己選區間嗎？',lead:'沿用相同模型與符號順序，這次序列長度是 2。先推導區間，再檢查二進位前綴。',art:`<section class="ac-card"><h2>先自己推導 CA</h2>${acDiagram(.75,1,'',{ticks:'ends'})}<p>目前 C：[0.75,1)。下一個符號 A，取目前的左半。</p><p>另比較二位前綴 11：[0.75,1)。</p></section>`,question:{prompt:'CA 的區間是什麼？二位前綴 11 能否整段落入？',hideFuturePreviews:true,choices:[{value:'narrow',label:'[0.75,0.875)；11 太寬',feedback:'對。C 寬度 1/4，再乘 A 的 1/2，得到 1/8。11 覆蓋到 1，超出 CA；三位 110 的 [0.75,0.875) 才恰好相同。長度仍需另行約定。'},{value:'wide',label:'[0.75,1)；11 已足夠',feedback:'下一個 A 還要再取左半，右端縮到 0.875。11 的區間沒有跟著縮小，仍包含 CA 以外的值。'}]},point:'每個符號繼續縮小目前區間；前綴代表的整段範圍都要符合。',detail:'實務需管理有限精度、重縮放、跨中點窄區間與終止；不能無限縮小浮點區間。<a href="../../06-arithmetic-coding.html">第 06 章：算術編碼</a> · <a href="../../09-context-ac-llm.html">第 09 章：脈絡模型</a>。本互動不是可處理任意長度資料的壓縮器。<a href="https://stanforddatacompressionclass.github.io/notes/lossless_iid/arithmetic_coding.html">來源：Stanford EE274 算術編碼講義</a>。'}
]};
