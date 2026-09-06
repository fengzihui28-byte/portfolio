const photoReel=document.querySelector('.photo-reel');
function movePhotos(direction){const card=photoReel.querySelector('.photo-card');photoReel.scrollBy({left:direction*(card.offsetWidth+parseFloat(getComputedStyle(photoReel).gap)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
document.querySelectorAll('[data-photo-direction]').forEach(button=>button.addEventListener('click',()=>movePhotos(Number(button.dataset.photoDirection))));
photoReel.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();movePhotos(event.key==='ArrowLeft'?-1:1);}});
