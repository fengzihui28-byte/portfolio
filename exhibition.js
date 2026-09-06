const reel=document.querySelector('.exhibition-scroll');
const stage=document.querySelector('.exhibition-stage');
const slides=[...document.querySelectorAll('.exhibit-slide')];
const sceneButtons=[...document.querySelectorAll('[data-go]')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let framePending=false;
function sceneDistance(){return Math.max(1,(reel.offsetHeight-stage.offsetHeight)/3);}
function updateExhibition(){framePending=false;if(reduced.matches){slides.forEach(s=>{s.inert=false;s.classList.add('is-current');});return;}const top=parseFloat(getComputedStyle(stage).top)||0;const position=Math.max(0,Math.min(3,(top-reel.getBoundingClientRect().top)/sceneDistance()));const current=Math.min(3,Math.floor(position+.55));slides.forEach((slide,i)=>{const offset=(i-position)*108;slide.style.transform=`translateY(${Math.max(-108,Math.min(108,offset))}%)`;slide.style.visibility=Math.abs(i-position)<1.05?'visible':'hidden';slide.classList.toggle('is-current',i===current);slide.inert=i!==current;const img=slide.querySelector('img');img.style.transform=`scale(${1.045+Math.min(.09,Math.abs(i-position)*.07)})`;});sceneButtons.forEach((b,i)=>b.setAttribute('aria-current',String(i===current)));document.querySelector('.scene-progress i').style.width=`${25+position*25}%`;}
function schedule(){if(!framePending){framePending=true;requestAnimationFrame(updateExhibition);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);
function goScene(index){if(reduced.matches){slides[index].scrollIntoView();return;}const target=scrollY+reel.getBoundingClientRect().top-(parseFloat(getComputedStyle(stage).top)||0)+sceneDistance()*index;scrollTo({top:target,behavior:'smooth'});}
sceneButtons.forEach(b=>b.addEventListener('click',()=>goScene(Number(b.dataset.go))));document.querySelector('#scroll-exhibition').addEventListener('click',e=>{e.preventDefault();goScene(1);});updateExhibition();
// A quiet, locally synthesized ambient melody. Replace with a chosen recording later.
const musicButton=document.querySelector('#music-toggle');
let audioContext,master,musicTimer,notesIndex=0,nextNote=0,manualPause=false;
const melody=[60,64,67,71,69,67,64,62,57,60,64,67,65,64,60,55];
function note(midi,start,duration=3.5){const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.value=440*Math.pow(2,(midi-69)/12);gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.12,start+.08);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(gain);gain.connect(master);osc.start(start);osc.stop(start+duration+.1);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
function scheduleMusic(){if(!audioContext||audioContext.state!=='running')return;while(nextNote<audioContext.currentTime+.4){note(melody[notesIndex%melody.length],nextNote);if(notesIndex%4===0)note(melody[notesIndex%melody.length]-12,nextNote,5);notesIndex++;nextNote+=1.15;}}
function updateMusicUI(){const playing=audioContext?.state==='running';musicButton.setAttribute('aria-pressed',String(!!playing));musicButton.setAttribute('aria-label',playing?'暂停背景音乐':'播放背景音乐');document.querySelector('#music-label').textContent=playing?'音乐 · 播放中':'开启音乐';}
async function startMusic(){try{if(!audioContext){audioContext=new (window.AudioContext||window.webkitAudioContext)();master=audioContext.createGain();master.gain.value=.28;master.connect(audioContext.destination);audioContext.onstatechange=updateMusicUI;}await audioContext.resume();if(audioContext.state==='running'&&!musicTimer){nextNote=audioContext.currentTime+.05;musicTimer=setInterval(scheduleMusic,180);scheduleMusic();}updateMusicUI();}catch{document.querySelector('#music-label').textContent='音乐暂不可用';}}
async function pauseMusic(){if(audioContext){await audioContext.suspend();}if(musicTimer){clearInterval(musicTimer);musicTimer=null;}updateMusicUI();}
musicButton.addEventListener('click',async()=>{if(audioContext?.state==='running'){manualPause=true;await pauseMusic();}else{manualPause=false;await startMusic();}});
document.addEventListener('click',e=>{if(!manualPause&&!musicButton.contains(e.target)&&!e.target.closest('[data-project="film"],video'))startMusic();},{once:true});
document.addEventListener('play',e=>{if(e.target.tagName==='VIDEO'){manualPause=true;pauseMusic();}},true);
startMusic();
