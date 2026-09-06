const modal=document.querySelector('.project-lightbox');let lastOpener;
document.querySelectorAll('.gallery-image').forEach(link=>link.addEventListener('click',event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 event.preventDefault();lastOpener=link;
 modal.querySelector('img').src=link.href;modal.querySelector('img').alt=link.querySelector('img').alt;
 modal.querySelector('p').textContent=link.closest('figure').querySelector('figcaption').textContent;
 modal.showModal();modal.scrollTop=0;
}));
modal.querySelector('button').addEventListener('click',()=>modal.close());
modal.addEventListener('close',()=>{modal.querySelector('img').removeAttribute('src');lastOpener?.focus({preventScroll:true})});
modal.addEventListener('click',event=>{if(event.target!==modal)return;const r=modal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)modal.close()});
