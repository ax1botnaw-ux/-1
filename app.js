const IC=n=>`<svg class="ic ic-${n}" aria-hidden="true"><use href="#i-${n}"/></svg>`;const COIN=IC('coin');
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];const toast=$('#toast');
function notify(message){$('#toastText').textContent=message;toast.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('show'),2300)}
const arabicOnly=/^[\u0600-\u06FF\u0660-\u0669\s_]+$/;
function showApp(name){const auth=$('#authScreen'),shell=$('#appShell');if(auth)auth.hidden=true;if(shell)shell.hidden=false;const clean=name||'ريبوتر';['#headerName','#sideName','#welcomeName','#mobileName'].forEach((selector)=>{const el=$(selector);if(el)el.textContent=selector==='#welcomeName'?clean+'.':clean});document.title=`ريبوت | ${clean}`;try{localStorage.setItem('reibot-session',JSON.stringify({name:clean}))}catch(e){}}
function authError(message){$('#authError').textContent=message}
function openAuth(type){$$('.auth-tab').forEach(t=>t.classList.toggle('active',t.dataset.auth===type));$('#loginForm').hidden=type!=='login';$('#registerForm').hidden=type!=='register';authError('')}
$$('.auth-tab').forEach(tab=>tab.addEventListener('click',()=>openAuth(tab.dataset.auth)));
$('#loginButton').addEventListener('click',()=>{const username=$('#loginUsername').value.trim(),password=$('#loginPassword').value;if(!username||!password){authError('اكتب اسم المستخدم وكلمة السر أولًا.');return}if(!arabicOnly.test(username)){authError('اسم المستخدم يجب أن يكون بالعربية فقط.');return}showApp(username)});
$('#registerButton').addEventListener('click',()=>{const username=$('#registerUsername').value.trim(),age=Number($('#registerAge').value),password=$('#registerPassword').value;if(!username||!age||!password){authError('أكمل الاسم والعمر وكلمة السر.');return}if(!arabicOnly.test(username)){authError('استخدم أحرفًا عربية فقط في اسم المستخدم.');return}if(age<6||age>100){authError('العمر يجب أن يكون بين 6 و100.');return}if(password.length<6){authError('كلمة السر يجب أن تكون 6 أحرف أو أكثر.');return}showApp(username);notify('تم إنشاء حسابك محليًا بنجاح');});
let session=null;try{session=JSON.parse(localStorage.getItem('reibot-session')||'null')}catch(error){try{localStorage.removeItem('reibot-session')}catch(e){}}if(session?.name)showApp(session.name);
function openAvatar(){ $('#avatarModal').hidden=false; }function closeAvatar(){$('#avatarModal').hidden=true}const avatarNavButton=$('.side-link[data-view="shop"]');avatarNavButton?.addEventListener('click',openAvatar);$('#closeAvatar')?.addEventListener('click',closeAvatar);$('#avatarBackdrop').addEventListener('click',closeAvatar);$('#customizeButton')?.addEventListener('click',openAvatar);$('#saveAvatar').addEventListener('click',()=>{closeAvatar();notify('تم حفظ مظهر شخصيتك')});
const cameraPreview=$('.avatar-preview');const cameraAvatar=cameraPreview?.querySelector('.avatar-small');let cameraDragging=false;let cameraLastX=0;let cameraLastY=0;let cameraY=-18;let cameraX=-3;let cameraZoom=1;
function updateCamera(){if(!cameraAvatar)return;cameraAvatar.style.transform=`rotateX(${cameraX}deg) rotateY(${cameraY}deg) scale(${cameraZoom})`;cameraAvatar.style.setProperty('--camera-y',`${cameraY}deg`)}
function cameraStart(event){if(!cameraPreview||!cameraAvatar)return;cameraDragging=true;cameraLastX=event.clientX;cameraLastY=event.clientY;cameraPreview.classList.add('dragging');cameraPreview.setPointerCapture?.(event.pointerId);event.preventDefault()}
function cameraMove(event){if(!cameraDragging)return;const dx=event.clientX-cameraLastX;const dy=event.clientY-cameraLastY;cameraY=(cameraY+dx*.7)%360;cameraX=Math.max(-35,Math.min(35,cameraX-dy*.45));cameraLastX=event.clientX;cameraLastY=event.clientY;updateCamera()}
function cameraEnd(){cameraDragging=false;cameraPreview?.classList.remove('dragging')}
cameraPreview?.addEventListener('pointerdown',cameraStart);cameraPreview?.addEventListener('pointermove',cameraMove);cameraPreview?.addEventListener('pointerup',cameraEnd);cameraPreview?.addEventListener('pointercancel',cameraEnd);cameraPreview?.addEventListener('wheel',event=>{cameraZoom=Math.max(.7,Math.min(1.45,cameraZoom-event.deltaY*.0015));updateCamera();event.preventDefault()},{passive:false});updateCamera();window.zoomCamera=function(delta){cameraZoom=Math.max(.7,Math.min(1.45,cameraZoom+delta));updateCamera()};
const menuDrawer=$('#menuDrawer');const openMenu=()=>{if(menuDrawer)menuDrawer.hidden=false};const closeMenu=()=>{if(menuDrawer)menuDrawer.hidden=true};$('.mobile-menu')?.addEventListener('click',openMenu);$('#closeMenu')?.addEventListener('click',closeMenu);$('#menuOverlay')?.addEventListener('click',closeMenu);

window.showFavorites=function(){const screen=$('#favoritesScreen');if(screen){$('#homeView').hidden=true;screen.hidden=false}$('#menuDrawer').hidden=true};$('#openFavorites')?.addEventListener('click',window.showFavorites);$('#closeFavorites')?.addEventListener('click',()=>{$('#favoritesScreen').hidden=true;$('#homeView').hidden=false});$('#favoriteFilter')?.addEventListener('click',()=>{const options=$('#favoriteOptions');options.hidden=!options.hidden;$('#favoriteFilter span').textContent=options.hidden?'⌄':'⌃'});$$('.favorite-option').forEach(option=>option.addEventListener('click',()=>{$$('.favorite-option').forEach(item=>item.classList.remove('active'));option.classList.add('active');$('#favoriteFilter').firstChild.textContent=option.dataset.label+' ';$('#favoriteOptions').hidden=true;$('#favoriteFilter span').textContent='⌄';$('#favoritesEmptyTitle').textContent=option.dataset.label+' — لا توجد عناصر بعد'}));


/* ===== Working buttons ===== */
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* --- generic section screens --- */
const sectionScreen=$('#sectionScreen'),sectionBody=$('#sectionBody');
function emptyBox(icon,title,text){return `<div class="favorites-empty"><div class="favorites-empty-icon">${IC(icon)}</div><h2>${title}</h2><p>${text}</p></div>`}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
let friends=store.get('reibot-friends',[]);
function renderFriends(){
  const list=friends.length?`<ul class="simple-list">${friends.map((f,i)=>`<li><span>${IC('users')} ${esc(f)}</span><button data-remove="${i}">إزالة</button></li>`).join('')}</ul>`:emptyBox('users','لا يوجد أصدقاء بعد','أضف أصدقاءك بكتابة اسم المستخدم بالعربية.');
  sectionBody.innerHTML=`<form class="inline-form" id="friendForm"><input id="friendInput" placeholder="اسم المستخدم العربي" autocomplete="off"><button class="primary-button" type="submit">إضافة</button></form>${list}`;
  $('#friendForm').addEventListener('submit',e=>{e.preventDefault();const name=$('#friendInput').value.trim();
    if(!name)return notify('اكتب اسم الصديق أولًا');
    if(!arabicOnly.test(name))return notify('اسم المستخدم يجب أن يكون بالعربية فقط');
    if(friends.includes(name))return notify('هذا الصديق مضاف مسبقًا');
    friends.push(name);store.set('reibot-friends',friends);updateFriendsSummary();renderFriends();notify('تمت إضافة '+name)});
  $$('[data-remove]').forEach(b=>b.addEventListener('click',()=>{friends.splice(Number(b.dataset.remove),1);store.set('reibot-friends',friends);updateFriendsSummary();renderFriends()}));
}
function updateFriendsSummary(){const el=$('#friendsSummary');if(el)el.textContent=friends.length?`${friends.length} من الأصدقاء`:'ابدأ ببناء مجتمعك'}
function renderSettings(){
  const name=(store.get('reibot-session',{})||{}).name||'';
  sectionBody.innerHTML=`<form class="inline-form" id="nameForm"><input id="nameInput" value="${esc(name)}" placeholder="اسم المستخدم" autocomplete="off"><button class="primary-button" type="submit">حفظ الاسم</button></form><div class="inline-form"><button class="ghost-danger" id="settingsLogout" type="button">تسجيل الخروج</button></div>`;
  $('#nameForm').addEventListener('submit',e=>{e.preventDefault();const n=$('#nameInput').value.trim();if(!n||!arabicOnly.test(n))return notify('اسم المستخدم يجب أن يكون بالعربية فقط');showApp(n);notify('تم تحديث الاسم')});
  $('#settingsLogout').addEventListener('click',logout);
}
const sections={
  'متابعة التشغيل':()=>emptyBox('clock','لا يوجد شيء لمتابعته','الألعاب التي تلعبها ستظهر هنا لتكمل منها.'),
  'الأصدقاء':renderFriends,
  'المجتمعات':()=>emptyBox('group','لا توجد مجتمعات','لم تنضم إلى أي مجتمع بعد.'),
  'مقتنيات':()=>emptyBox('gem','لا توجد مقتنيات','المقتنيات التي تحصل عليها ستظهر هنا.'),
  'وظيفة':renderJobs,
  'الرسائل':()=>emptyBox('mail','لا توجد رسائل','صندوق الرسائل فارغ.'),
  'الإعدادات':renderSettings,
  'المساعدة والأمان':()=>`<div class="help-text"><h3>نصائح الأمان</h3><p>لا تشارك كلمة سرك مع أي شخص.</p><p>لا تكتب بياناتك الشخصية في الدردشة.</p><p>اختر اسم مستخدم لا يكشف معلوماتك.</p></div>`,
  'التعلم':()=>emptyBox('book','لا توجد دروس بعد','ستظهر مواد التعلم هنا قريبًا.'),
  'إنشاء':()=>emptyBox('pencil','لا توجد أدوات إنشاء','أدوات صنع الألعاب غير متاحة حاليًا.'),
  'الدردشة':()=>emptyBox('chat','لا توجد محادثات','ابدأ محادثة بعد إضافة أصدقاء.')
};
function openSection(title){const build=sections[title];if(!build)return;$('#sectionTitle').textContent=title;const r=build();if(typeof r==='string')sectionBody.innerHTML=r;sectionScreen.hidden=false;$('#menuDrawer').hidden=true}
function closeSection(){sectionScreen.hidden=true;$$('.side-link').forEach(i=>i.classList.toggle('active',i.dataset.view==='home'))}
$('#closeSection')?.addEventListener('click',closeSection);
$$('.menu-list button:not(#openFavorites)').forEach(item=>item.addEventListener('click',()=>openSection(item.dataset.menu)));
$('#addFriends')?.addEventListener('click',()=>openSection('الأصدقاء'));$('#addFriendsCircle')?.addEventListener('click',()=>openSection('الأصدقاء'));updateFriendsSummary();

/* --- account --- */
function logout(){try{localStorage.removeItem('reibot-session')}catch(e){}location.reload()}
$('#switchAccount')?.addEventListener('click',()=>{try{localStorage.setItem('reibot-last',JSON.stringify({name:(store.get('reibot-session',{})||{}).name||''}))}catch(e){}logout()});
$('#quickLogin')?.addEventListener('click',()=>{const last=(store.get('reibot-last',null)||{}).name;if(!last)return notify('لا يوجد حساب محفوظ للدخول السريع');closeMenu();showApp(last);notify('مرحبًا '+last)});

/* --- notifications, search, home buttons --- */
$('#notificationButton')?.addEventListener('click',()=>notify('لا توجد إشعارات جديدة'));
const searchPanel=$('#searchPanel');
$('#mobileSearch')?.addEventListener('click',()=>{searchPanel.hidden=false;$('#globalSearch').focus()});
$('#closeSearch')?.addEventListener('click',()=>{searchPanel.hidden=true;$('#globalSearch').value='';$('#searchResult').textContent='ابدأ الكتابة للبحث.'});
$('#globalSearch')?.addEventListener('input',e=>{const q=e.target.value.trim();$('#searchResult').textContent=q?`لا توجد نتائج لـ «${q}»`:'ابدأ الكتابة للبحث.'});
$('#heroDiscover')?.addEventListener('click',()=>notify('لا توجد ألعاب مضافة بعد'));
$('#moreFollowing')?.addEventListener('click',()=>notify('لا توجد ألعاب تتابعها حاليًا'));

/* --- bottom navigation --- */
$$('.side-link').forEach(link=>link.addEventListener('click',()=>{
  $$('.side-link').forEach(i=>i.classList.remove('active'));link.classList.add('active');
  const view=link.dataset.view;
  if(view!=='chat')sectionScreen.hidden=true;
  if(view==='home'){$('#favoritesScreen').hidden=true;$('#homeView').hidden=false;window.scrollTo({top:0,behavior:'smooth'})}
  if(view==='shop')openAvatar();
  if(view==='discover'){$('#favoritesScreen').hidden=true;$('#homeView').hidden=false;$('.following-empty')?.scrollIntoView({behavior:'smooth',block:'center'})}
  if(view==='chat')openSection('الدردشة');
}));

/* --- avatar: customize / store --- */
const worn=Object.assign({hair:true,hat:true,skin:'#f3dfc3',pants:true,shirt:true},store.get('reibot-worn',{}));
let wornHistory=[{...worn}],hIndex=0,mode='customize',activeCat='الكل',query='';
function applyWorn(){const av=$('.avatar-small');if(av){av.classList.toggle('no-hair',!worn.hair);av.classList.toggle('no-hat',!worn.hat);document.documentElement.style.setProperty('--avatar-skin',worn.skin);av.classList.toggle('no-shirt',!worn.shirt);av.classList.toggle('no-pants',!worn.pants)}$$('.owned-item').forEach(b=>b.classList.toggle('active',!!worn[b.dataset.item]));$$('#skinSwatches button').forEach(b=>b.classList.toggle('selected',b.dataset.color===worn.skin));const sc=$('#skinCustom');if(sc&&/^#[0-9a-f]{6}$/i.test(worn.skin))sc.value=worn.skin}
function pushHistory(){wornHistory=wornHistory.slice(0,hIndex+1);wornHistory.push({...worn});hIndex=wornHistory.length-1;updateHistoryButtons()}
function updateHistoryButtons(){const u=$('#undoBtn'),r=$('#redoBtn');if(u)u.disabled=hIndex<=0;if(r)r.disabled=hIndex>=wornHistory.length-1}
function restore(i){hIndex=i;Object.assign(worn,wornHistory[i]);applyWorn();updateHistoryButtons()}
$('#undoBtn')?.addEventListener('click',()=>{if(hIndex>0)restore(hIndex-1)});
$('#redoBtn')?.addEventListener('click',()=>{if(hIndex<wornHistory.length-1)restore(hIndex+1)});
$$('.owned-item').forEach(btn=>btn.addEventListener('click',()=>{const k=btn.dataset.item;worn[k]=!worn[k];applyWorn();pushHistory();notify((worn[k]?'تم ارتداء ':'تم خلع ')+btn.querySelector('b').textContent.trim())}));
$('#saveAvatar')?.addEventListener('click',()=>{store.set('reibot-worn',worn);closeAvatar();notify('تم حفظ مظهر شخصيتك')});
function refreshItems(){
  const match=el=>(activeCat==='الكل'||el.dataset.cat===activeCat)&&(!query||el.textContent.includes(query));
  const shop=mode==='shop';
  $('.owned-items').hidden=shop;$('#itemGrid').hidden=!shop;$('#recommendedTitle').hidden=true;const skinOn=!shop&&activeCat==='الجسم';$('#skinPanel').hidden=!skinOn;
  let shown=0;
  $$('.owned-item').forEach(b=>{const ok=match(b);b.hidden=!ok;if(ok&&!shop)shown++});
  $$('.item-card').forEach(c=>{const ok=match(c);c.hidden=!ok;if(ok&&shop)shown++});
  $('#itemsEmpty').hidden=shown>0||skinOn;
}
$$('.customize-tab').forEach(tab=>tab.addEventListener('click',()=>{
  $$('.customize-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');
  mode=tab.dataset.customizeTab;$('#itemSectionTitle').textContent=mode==='shop'?'المتجر':'أغراضي';refreshItems()}));
$$('.category').forEach(c=>c.addEventListener('click',()=>{$$('.category').forEach(x=>x.classList.remove('active'));c.classList.add('active');activeCat=c.dataset.cat;refreshItems()}));
$('#customizeSearch')?.addEventListener('click',()=>{const i=$('#itemSearch');i.hidden=!i.hidden;if(i.hidden){i.value='';query='';refreshItems()}else i.focus()});
$('#itemSearch')?.addEventListener('input',e=>{query=e.target.value.trim();refreshItems()});
applyWorn();updateHistoryButtons();refreshItems();

/* ===== Coins ===== */
let coins=Number(store.get('reibot-coins',0))||0;
let ownedShop=store.get('reibot-owned',[]);
const fmt=n=>n.toLocaleString('en-US');
function updateCoins(){
  $$('.currency-balance').forEach(e=>e.innerHTML=COIN+' '+fmt(coins));
  $$('.customize-coins strong').forEach(e=>e.textContent=fmt(coins));
  $('#currencyButton')?.setAttribute('title','رصيدك: '+fmt(coins));
  const jb=$('#jobsBalance');if(jb)jb.innerHTML=COIN+' '+fmt(coins);
}
function addCoins(n){coins+=n;store.set('reibot-coins',coins);updateCoins()}
$$('.item-card').forEach(card=>{
  const name=card.querySelector('strong').textContent;
  const mark=()=>{const owned=ownedShop.includes(name);card.classList.toggle('is-owned',owned);card.querySelector('small').dataset.owned=owned?'1':''};
  mark();
  card.addEventListener('click',()=>{
    if(ownedShop.includes(name))return notify(`${name} مملوك بالفعل`);
    const price=Number(card.querySelector('small').textContent.replace(/[^\d]/g,''))||0;
    if(coins<price)return notify(`رصيدك غير كافٍ لشراء ${name} — اعمل في «مهن» لتكسب عملات`);
    coins-=price;store.set('reibot-coins',coins);ownedShop.push(name);store.set('reibot-owned',ownedShop);updateCoins();mark();notify(`تم شراء ${name}`)});
});
updateCoins();

/* ===== Jobs (100) ===== */
const JOB_DATA=[
 ['الطبخ والمطاعم',['طباخ','نادل','خباز','حلواني','صانع قهوة','بائع عصير','شوّاء','طاهي بيتزا','غسّال صحون','مدير مطعم']],
 ['الصحة',['طبيب','ممرض','صيدلي','طبيب أسنان','مسعف','أخصائي تغذية','طبيب بيطري','فني مختبر','معالج طبيعي','مدلّك']],
 ['التعليم',['معلم','مدرّب','أمين مكتبة','مدرّس لغات','مشرف حضانة','مدرّب رياضة','مرشد طلابي','باحث','مصحّح اختبارات','مدرّب سباحة']],
 ['التقنية',['مبرمج','مصمم جرافيك','مطوّر ألعاب','فني حاسوب','محلل بيانات','مهندس شبكات','مصوّر فيديو','مونتير','كاتب محتوى','مختبر ألعاب']],
 ['البناء والصناعة',['بنّاء','نجّار','كهربائي','سبّاك','حدّاد','دهّان','مهندس مدني','سائق رافعة','لحّام','مقاول']],
 ['النقل',['سائق أجرة','سائق شاحنة','طيّار','قبطان سفينة','سائق قطار','ساعي بريد','عامل توصيل','سائق حافلة','مرشد سياحي','مراقب مرور']],
 ['الأمن والخدمات',['شرطي','إطفائي','حارس أمن','جندي','منقذ سباحة','حارس غابات','قاضٍ','محامٍ','مفتش','عامل نظافة']],
 ['الفنون والترفيه',['مغنٍّ','عازف','ممثل','رسّام','نحّات','مصوّر فوتوغرافي','راقص','مقدّم برامج','مخرج','مصمم أزياء']],
 ['التجارة',['بائع','محاسب','صرّاف','تاجر','مسوّق','أمين صندوق','وسيط عقاري','مدير متجر','بائع زهور','جوهري']],
 ['الطبيعة والعلوم',['مزارع','راعي أغنام','صيّاد سمك','بستاني','خبير أرصاد','عالم آثار','عالم فلك','جيولوجي','نحّال','مدرّب حيوانات']]
];
const JOBS=[];JOB_DATA.forEach(([cat,names],ci)=>names.forEach((name,i)=>JOBS.push({id:JOBS.length,cat,name,pay:10+i*10+ci*5,secs:4+i*2})));
let jobStats=store.get('reibot-jobs',{done:0});
let activeJob=null,jobTimer=null,jobCat='الكل';
function jobCard(j){
  const busy=activeJob&&activeJob.id===j.id;
  return `<li class="job-card${busy?' working':''}" data-job="${j.id}"><div><strong>${j.name}</strong><small>${j.cat} • ${COIN} ${j.pay} • ${j.secs} ث</small><span class="job-bar"><i style="width:${busy?Math.min(100,(Date.now()-activeJob.start)/(j.secs*10)):0}%"></i></span></div><button class="primary-button job-btn" ${activeJob&&!busy?'disabled':''}>${busy?'جارٍ العمل…':'اعمل'}</button></li>`;
}
function renderJobs(){
  const list=JOBS.filter(j=>jobCat==='الكل'||j.cat===jobCat);
  sectionBody.innerHTML=`<div class="jobs-top"><span>رصيدك <b id="jobsBalance">${COIN} ${fmt(coins)}</b></span><span>أنهيت <b id="jobsDone">${jobStats.done}</b> وظيفة من ${JOBS.length}</span></div><div class="job-chips">${['الكل',...JOB_DATA.map(d=>d[0])].map(c=>`<button class="job-chip${c===jobCat?' active':''}" data-jcat="${c}">${c}</button>`).join('')}</div><ul class="job-list">${list.map(jobCard).join('')}</ul>`;
  $$('.job-chip').forEach(b=>b.addEventListener('click',()=>{jobCat=b.dataset.jcat;renderJobs()}));
  $$('.job-btn').forEach(b=>b.addEventListener('click',()=>startJob(Number(b.closest('.job-card').dataset.job))));
}
function startJob(id){
  if(activeJob)return notify('أنهِ عملك الحالي أولًا');
  const j=JOBS[id];activeJob={id,start:Date.now()};notify(`بدأت العمل: ${j.name}`);
  if(!sectionScreen.hidden&&$('#sectionTitle').textContent==='وظيفة')renderJobs();
  clearInterval(jobTimer);
  jobTimer=setInterval(()=>{
    const el=Date.now()-activeJob.start;
    const bar=$(`.job-card[data-job="${id}"] .job-bar i`);if(bar)bar.style.width=Math.min(100,el/(j.secs*10))+'%';
    if(el>=j.secs*1000){clearInterval(jobTimer);activeJob=null;jobStats.done++;store.set('reibot-jobs',jobStats);addCoins(j.pay);notify(`أنهيت عمل ${j.name} وكسبت ${j.pay} عملة`);
      if(!sectionScreen.hidden&&$('#sectionTitle').textContent==='وظيفة')renderJobs()}
  },200);
}

/* --- body colour (shown under "الجسم") --- */
function setSkin(c){worn.skin=c;applyWorn();pushHistory();notify('تم تغيير لون الجسم')}
$$('#skinSwatches button').forEach(b=>b.addEventListener('click',()=>setSkin(b.dataset.color)));
$('#skinCustom')?.addEventListener('change',e=>setSkin(e.target.value));
/* --- every purchased item becomes a square tile in "أغراضي" --- */
function addOwnedTile(card){
  const name=card.querySelector('strong').textContent;if($(`.owned-item[data-name="${name}"]`))return;
  const art=card.querySelector('.item-art').cloneNode(true);art.classList.add('tile-art');
  const b=document.createElement('button');b.className='owned-item';b.dataset.item='shop:'+name;b.dataset.name=name;b.dataset.cat=card.dataset.cat;
  b.append(art);const l=document.createElement('b');l.textContent=name;b.append(l);
  b.addEventListener('click',()=>{const k=b.dataset.item;worn[k]=!worn[k];applyWorn();pushHistory();notify((worn[k]?'تم ارتداء ':'تم خلع ')+name)});
  $('.owned-items').append(b);applyWorn();refreshItems();
}
$$('.item-card').forEach(card=>{if(ownedShop.includes(card.querySelector('strong').textContent))addOwnedTile(card);card.addEventListener('click',()=>setTimeout(()=>{if(ownedShop.includes(card.querySelector('strong').textContent))addOwnedTile(card)},0))});
