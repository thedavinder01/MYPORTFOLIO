(() => {
  const palettes=['neon','aurora','violet','coral'];
  const paletteToggle=document.querySelector('.palette-toggle');
  const paletteMenu=document.querySelector('.palette-menu');
  const paletteOptions=[...document.querySelectorAll('.palette-option')];
  const themeButton=document.querySelector('.theme-toggle');
  const savedPalette=localStorage.getItem('davinder-palette');
  const savedMode=localStorage.getItem('davinder-mode');
  const applyPalette=value=>{const palette=palettes.includes(value)?value:'neon';document.body.dataset.palette=palette;localStorage.setItem('davinder-palette',palette);const option=paletteOptions.find(item=>item.dataset.paletteChoice===palette);document.querySelector('.palette-current-name').textContent=option?option.textContent.trim():'Neon';paletteOptions.forEach(item=>{const selected=item.dataset.paletteChoice===palette;item.classList.toggle('selected',selected);item.setAttribute('aria-checked',selected?'true':'false');});};
  const closePaletteMenu=()=>{paletteMenu.hidden=true;paletteToggle.setAttribute('aria-expanded','false');};
  const updateMode=()=>{const light=document.body.classList.contains('light-theme');themeButton.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');themeButton.title=light?'Switch to dark theme':'Switch to light theme';themeButton.querySelector('.theme-icon').textContent=light?'☾':'☼';};
  applyPalette(savedPalette||'neon');
  if(savedMode==='light')document.body.classList.add('light-theme');
  updateMode();
  paletteToggle.addEventListener('click',()=>{const open=paletteToggle.getAttribute('aria-expanded')==='true';paletteMenu.hidden=open;paletteToggle.setAttribute('aria-expanded',open?'false':'true');});
  paletteOptions.forEach(option=>option.addEventListener('click',()=>{applyPalette(option.dataset.paletteChoice);closePaletteMenu();}));
  document.addEventListener('click',event=>{if(!event.target.closest('.theme-picker'))closePaletteMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closePaletteMenu();});
  themeButton.addEventListener('click',()=>{document.body.classList.toggle('light-theme');localStorage.setItem('davinder-mode',document.body.classList.contains('light-theme')?'light':'dark');updateMode();});

  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
  const page=document.body.dataset.page;
  document.querySelectorAll('.nav-link').forEach(link=>{if(link.dataset.page===page){link.classList.add('active');link.setAttribute('aria-current','page');}});
  const revealItems=document.querySelectorAll('.reveal');
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});revealItems.forEach(item=>observer.observe(item));}
  else revealItems.forEach(item=>item.classList.add('visible'));
  document.querySelectorAll('.filter-button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter-button').forEach(item=>item.classList.remove('active'));button.classList.add('active');const filter=button.dataset.filter;document.querySelectorAll('.project-card').forEach(card=>card.hidden=filter!=='all'&&card.dataset.category!==filter);}));
  const lightbox=document.getElementById('lightbox');
  const bindGalleryItem=item=>item.addEventListener('click',()=>{if(!lightbox)return;const img=lightbox.querySelector('img');img.src=item.dataset.full||item.querySelector('img').src;img.alt=item.querySelector('img').alt;lightbox.querySelector('p').textContent=item.querySelector('span').textContent;lightbox.showModal();});
  if(lightbox){document.querySelectorAll('.gallery-item').forEach(bindGalleryItem);lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close();});}
  document.querySelectorAll('.image-file-input[data-image-target]').forEach(input=>input.addEventListener('change',()=>{const file=input.files&&input.files[0];const target=document.getElementById(input.dataset.imageTarget);if(!file||!target)return;const reader=new FileReader();reader.onload=()=>{target.src=String(reader.result);target.alt=file.name;};reader.readAsDataURL(file);}));
  const galleryGrid=document.getElementById('gallery-grid');
  const galleryUpload=document.getElementById('gallery-upload');
  if(galleryGrid&&galleryUpload){let activeGalleryGroup='all';document.querySelectorAll('.gallery-filter').forEach(button=>button.addEventListener('click',()=>{activeGalleryGroup=button.dataset.filter;document.querySelectorAll('.gallery-filter').forEach(item=>item.classList.toggle('active',item===button));galleryGrid.querySelectorAll('.gallery-item').forEach(item=>{item.hidden=activeGalleryGroup!=='all'&&item.dataset.galleryGroup!==activeGalleryGroup;});}));galleryUpload.addEventListener('change',()=>{const files=[...galleryUpload.files||[]];const group=document.getElementById('gallery-group-select').value;const accent=document.getElementById('gallery-color-select').value;files.forEach(file=>{if(!file.type.startsWith('image/'))return;const url=URL.createObjectURL(file);const item=document.createElement('button');item.type='button';item.className='gallery-item gallery-dynamic reveal visible';item.dataset.galleryGroup=group;item.dataset.full=url;item.style.setProperty('--image-accent',accent);item.setAttribute('aria-label','View '+group+' image: '+file.name);const image=document.createElement('img');image.src=url;image.alt=file.name;const caption=document.createElement('span');caption.textContent=group.toUpperCase()+' / '+file.name+' ↗';item.append(image,caption);item.hidden=activeGalleryGroup!=='all'&&activeGalleryGroup!==group;galleryGrid.append(item);bindGalleryItem(item);});galleryUpload.value='';});}
    const form=document.getElementById('contact-form');
  if(form)form.addEventListener('submit',event=>{event.preventDefault();const fields={name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),phone:form.elements.phone.value.trim(),message:form.elements.message.value.trim()};const errors={name:fields.name.length<2?'Please enter at least 2 characters.':'',email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)?'':'Enter a valid email address.',message:fields.message.length<10?'Please add a little more detail (at least 10 characters).':''};Object.entries(errors).forEach(([key,message])=>{form.querySelector('[data-error="'+key+'"]').textContent=message;form.elements[key].setAttribute('aria-invalid',message?'true':'false');});const first=Object.keys(errors).find(key=>errors[key]);const note=document.getElementById('form-note');if(first){form.elements[first].focus();note.textContent='Please review the highlighted fields.';return;}const emailLink=document.querySelector('.contact-direct a').getAttribute('href');const destination=emailLink.replace(/^mailto:/i,'');if(!destination||destination.includes('your.email@example.com')){note.textContent='Add your email address in index.html before using this form.';return;}const subject=encodeURIComponent('Portfolio enquiry from '+fields.name);const body=encodeURIComponent(fields.message+'\n\nFrom: '+fields.name+' ('+fields.email+')'+(fields.phone?'\nPhone: '+fields.phone:''));note.textContent='Opening your email app with the message details…';window.location.href='mailto:'+destination+'?subject='+subject+'&body='+body;});

})();
