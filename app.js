
const STAGES=[["朝の参道", "鳥の声・木々の葉音"], ["境内の朝", "鳥の声・遠い鈴"], ["杉木立の道", "木漏れ日・葉擦れ"], ["午後の大鳥居", "風・砂利の音"], ["夕暮れの境内", "ひぐらし"], ["薄暮の石段", "虫の声・鈴"], ["宵の大鳥居", "夜風"], ["雨の参道", "雨・遠い鐘"], ["深夜の境内", "梟・風"], ["灯籠の道", "灯籠・夜風"], ["奥宮への石段", "低い鐘"], ["奥宮前", "風・虫の声"], ["本殿前", "静寂・本殿の鐘"]];
const MAX=13,$=id=>document.getElementById(id);
let stage=1,locked=false,soundOn=true;
const KEY='fate8192_cinematic_v1', SOUND='fate8192_sound_v1';
const defaults={attempts:0,best:0,clears:0,reach:Array(MAX).fill(0),history:[]};
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return structuredClone(defaults)}}
let stats=load(); if(!Array.isArray(stats.reach)||stats.reach.length!==MAX)stats.reach=Array(MAX).fill(0); if(!Array.isArray(stats.history))stats.history=[];
try{soundOn=localStorage.getItem(SOUND)!=='off'}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify(stats))}catch{}}
function rand(){try{let a=new Uint32Array(1);crypto.getRandomValues(a);return(a[0]&1)?'g':'r'}catch{return Math.random()<.5?'g':'r'}}
function pct(){return (100/(2**stage)).toFixed(stage<7?3:5)+'%'}
function playAmbient(){
 const a=$('ambient'); a.pause(); a.src=`./assets/sounds/stage${String(stage).padStart(2,'0')}.wav`;
 if(soundOn){a.volume=.28;a.play().catch(()=>{})}
}
function render(){
 $('bg').style.backgroundImage=`url("./assets/backgrounds/stage${String(stage).padStart(2,'0')}.jpg?v=5")`;
 $('stageName').textContent=STAGES[stage-1][0];
 $('prob').textContent='1 / '+(2**stage).toLocaleString();
 $('pct').textContent=pct();
 $('att').textContent=stats.attempts;$('best').textContent=stats.best;$('clear').textContent=stats.clears;
 $('sound').textContent=soundOn?'♪':'×';
 const h=$('history');h.innerHTML='';stats.history.slice(-13).forEach(v=>{let d=document.createElement('i');d.className='dot '+v;h.appendChild(d)});
 playAmbient();
}
function lock(v){locked=v;$('green').disabled=v;$('red').disabled=v}
function resetVisual(){$('bg').classList.remove('pick-left','pick-right');$('green').classList.remove('ok','ng');$('red').classList.remove('ok','ng')}
function toast(b,s,ms=800){$('toastB').textContent=b;$('toastS').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),ms)}
function autoReset(){stage=1;resetVisual();render();lock(false)}
function choose(side){
 if(locked)return; lock(true);resetVisual();
 const answer=rand(); $('bg').classList.add(side==='g'?'pick-left':'pick-right');
 setTimeout(()=>{
  const chosen=side==='g'?$('green'):$('red'),correct=answer==='g'?$('green'):$('red');
  stats.history.push(answer);stats.history=stats.history.slice(-13);save();
  if(side===answer){
   chosen.classList.add('ok');stats.reach[stage-1]++;stats.best=Math.max(stats.best,stage);save();
   if(navigator.vibrate)navigator.vibrate(24);toast('SUCCESS',STAGES[stage-1][0]+' 突破');
   if(stage===MAX){
    stats.attempts++;stats.clears++;stats.best=13;save();$('flash').classList.remove('on');void $('flash').offsetWidth;$('flash').classList.add('on');
    setTimeout(()=>{toast('1 / 8192 CLEAR','本殿到達。朝の参道へ戻ります',1400);setTimeout(autoReset,1500)},650);
   }else{stage++;setTimeout(()=>{resetVisual();render();lock(false)},780)}
  }else{
   chosen.classList.add('ng');correct.classList.add('ok');stats.attempts++;save();if(navigator.vibrate)navigator.vibrate([70,45,120]);
   toast('FAILED','正解は'+(answer==='g'?'緑':'赤')+'。1 / 2へ戻ります',1050);setTimeout(autoReset,1200);
  }
 },560);
}
function openStats(){
 $('ambient').pause();$('game').classList.remove('active');$('statsView').classList.add('active');
 $('sAtt').textContent=stats.attempts;$('sBest').textContent=stats.best;$('sClear').textContent=stats.clears;
 const b=$('tbody');b.innerHTML='';for(let i=0;i<MAX;i++){let rate=stats.attempts?stats.reach[i]/stats.attempts:0,tr=document.createElement('tr');
 tr.innerHTML=`<td>${i+1}</td><td>1 / ${(2**(i+1)).toLocaleString()}</td><td>${stats.reach[i]}</td><td>${(rate*100).toFixed(3)}%<div class="bar"><div class="fill" style="width:${Math.min(rate*100,100)}%"></div></div></td>`;b.appendChild(tr)}
 const c=$('catalog');c.innerHTML='';STAGES.forEach((s,i)=>{let r=document.createElement('div');r.className='stageRow';r.innerHTML=`<b>${i+1}. ${s[0]}（1 / ${(2**(i+1)).toLocaleString()}）</b><span>${s[1]}</span>`;c.appendChild(r)});
}
function closeStats(){$('statsView').classList.remove('active');$('game').classList.add('active');render()}
$('green').onclick=()=>choose('g');$('red').onclick=()=>choose('r');$('stats').onclick=openStats;$('back').onclick=closeStats;
$('sound').onclick=()=>{soundOn=!soundOn;try{localStorage.setItem(SOUND,soundOn?'on':'off')}catch{};if(!soundOn)$('ambient').pause();render()};
$('reset').onclick=()=>{if(confirm('統計と掛け軸の履歴をすべて消去しますか？')){stats=structuredClone(defaults);save();openStats()}};
document.addEventListener('pointerdown',()=>{if(soundOn)$('ambient').play().catch(()=>{})},{once:true});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
