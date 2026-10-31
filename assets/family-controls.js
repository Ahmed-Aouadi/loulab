/* Loulab family controls — device-local MVP. Server-backed accounts are not enabled yet. */
(()=>{
'use strict';
const KEY='loulab_family_controls_v1',USAGE='loulab_family_usage_v1';
const defaults={dailyLimit:90,breakEvery:30,bedtimeStart:'21:00',bedtimeEnd:'07:00',books:true,games:true,creative:true,pin:'',childName:'طفلي'};
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const settings=()=>({...defaults,...read(KEY,{})});
const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
const dateKey=()=>new Date().toLocaleDateString('en-CA');
const getUsage=()=>{let u=read(USAGE,{date:dateKey(),seconds:0,breakAt:0});if(u.date!==dateKey())u={date:dateKey(),seconds:0,breakAt:0};return u};
const setUsage=u=>localStorage.setItem(USAGE,JSON.stringify(u));
const mins=n=>Math.max(0,Math.ceil(n/60));
const toMinutes=t=>{const [h,m]=String(t||'00:00').split(':').map(Number);return h*60+m};
const inBedtime=s=>{const now=new Date(),n=now.getHours()*60+now.getMinutes(),a=toMinutes(s.bedtimeStart),b=toMinutes(s.bedtimeEnd);return a===b?false:a<b?n>=a&&n<b:n>=a||n<b};
function overlay(className,html){const el=document.createElement('div');el.className=className;el.innerHTML=html;document.body.append(el);return el}
function initParentPage(){
 const page=document.getElementById('familyDashboard');if(!page)return;
 const s=settings(),u=getUsage();
 const pinScreen=overlay('family-pin-screen',`<div class="family-pin-card"><div style="font-size:38px">🔐</div><h2>مساحة الوالدين</h2><p id="pinHelp">${s.pin?'أدخل رمز الوالدين للمتابعة':'أنشئ رمزاً سرياً من 4 أرقام على الأقل لحماية الإعدادات على هذا الجهاز.'}</p><input id="familyPinInput" type="password" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="••••"><button class="primary" id="familyPinSubmit" style="width:100%">${s.pin?'دخول آمن':'حفظ الرمز والمتابعة'}</button><a href="index.html" style="display:block;margin-top:14px;color:#17634f">العودة إلى مساحة الطفل</a></div>`);
 const input=pinScreen.querySelector('#familyPinInput'),submit=pinScreen.querySelector('#familyPinSubmit');
 const render=()=>{
  const current=settings(),usage=getUsage(),spent=mins(usage.seconds),left=Math.max(0,current.dailyLimit-spent);
  document.getElementById('familyTodayUsed').textContent=spent+' د';
  document.getElementById('familyTodayLeft').textContent=left+' د';
  document.getElementById('familyLimit').value=current.dailyLimit;
  document.getElementById('familyLimitValue').textContent=current.dailyLimit+' دقيقة';
  document.getElementById('familyBreak').value=current.breakEvery;
  document.getElementById('familyBreakValue').textContent=current.breakEvery?current.breakEvery+' دقيقة':'متوقف';
  document.getElementById('familyBedStart').value=current.bedtimeStart;
  document.getElementById('familyBedEnd').value=current.bedtimeEnd;
  document.getElementById('familyBooks').checked=current.books;
  document.getElementById('familyGames').checked=current.games;
  document.getElementById('familyCreative').checked=current.creative;
  document.getElementById('familyChildName').value=current.childName;
  document.getElementById('familyPinStatus').textContent=current.pin?'تم إعداد رمز على هذا الجهاز':'لم يتم إعداد رمز بعد';
  document.getElementById('familyProgress').style.width=Math.min(100,spent/current.dailyLimit*100)+'%';
  document.getElementById('familyProgressText').textContent=spent+' من '+current.dailyLimit+' دقيقة';
  document.getElementById('familyBedStatus').textContent=inBedtime(current)?'وقت الراحة مفعّل الآن':'وقت الاستخدام مسموح حالياً';
 };
 const unlock=()=>{
  const val=input.value.trim(),current=settings();
  if(!/^\d{4,8}$/.test(val)){document.getElementById('pinHelp').textContent='استخدم رمزاً من 4 إلى 8 أرقام.';return}
  if(!current.pin){current.pin=val;save(current)}
  else if(current.pin!==val){document.getElementById('pinHelp').textContent='الرمز غير صحيح. حاول مرة أخرى.';input.value='';return}
  pinScreen.remove();render();
 };
 submit.addEventListener('click',unlock);input.addEventListener('keydown',e=>{if(e.key==='Enter')unlock()});
 document.getElementById('familyLimit').addEventListener('input',e=>document.getElementById('familyLimitValue').textContent=e.target.value+' دقيقة');
 document.getElementById('familyBreak').addEventListener('input',e=>document.getElementById('familyBreakValue').textContent=e.target.value?e.target.value+' دقيقة':'متوقف');
 document.getElementById('familySave').addEventListener('click',()=>{
  const current=settings();current.dailyLimit=Number(document.getElementById('familyLimit').value);current.breakEvery=Number(document.getElementById('familyBreak').value);current.bedtimeStart=document.getElementById('familyBedStart').value;current.bedtimeEnd=document.getElementById('familyBedEnd').value;current.books=document.getElementById('familyBooks').checked;current.games=document.getElementById('familyGames').checked;current.creative=document.getElementById('familyCreative').checked;current.childName=document.getElementById('familyChildName').value.trim().slice(0,32)||'طفلي';save(current);render();document.getElementById('familySaved').textContent='تم حفظ الإعدادات على هذا الجهاز ✓';
 });
 document.getElementById('familyChangePin').addEventListener('click',()=>{const old=prompt('أدخل الرمز الحالي');if(old!==settings().pin){alert('الرمز غير صحيح');return}const next=prompt('أدخل رمزاً جديداً من 4 إلى 8 أرقام');if(!/^\d{4,8}$/.test(next||'')){alert('الرمز غير صالح');return}const current=settings();current.pin=next;save(current);render();alert('تم تغيير الرمز على هذا الجهاز.')});
 document.getElementById('familyResetUsage').addEventListener('click',()=>{if(!confirm('هل تريد تصفير عداد اليوم على هذا الجهاز؟'))return;setUsage({date:dateKey(),seconds:0,breakAt:0});render()});
 document.getElementById('familyLogout').addEventListener('click',()=>{location.href='index.html'});
 render();
}
function initChildPage(){
 const page=document.body.dataset.page||'home';if(page==='dashboard'||page==='parents')return;
 const s=settings(),usage=getUsage();
 const lock=overlay('family-lock','<div class="family-lock-card"><div class="lock-icon">🌙</div><h2 id="familyLockTitle">حان وقت الراحة</h2><p id="familyLockText">انتهى وقت الاستخدام المحدد لهذا اليوم. خذ استراحة وعد غداً بنشاط جديد.</p><button class="soft" id="familyLockHome">العودة إلى الرئيسية</button></div>');
 const title=lock.querySelector('#familyLockTitle'),message=lock.querySelector('#familyLockText');
 const apply=()=>{
  const current=settings(),u=getUsage();
  const disabled=(page==='library'&&!current.books)||(page==='games'&&!current.games);
  if(disabled){title.textContent='هذا القسم مغلق حالياً';message.textContent='قام ولي الأمر بإيقاف هذا القسم مؤقتاً. يمكنك اختيار نشاط آخر مسموح.';lock.classList.add('show');return}
  if(inBedtime(current)){title.textContent='حان وقت الراحة';message.textContent='وقت الراحة الذي حدده ولي الأمر بدأ الآن. نراك غداً!';lock.classList.add('show');return}
  if(u.seconds>=current.dailyLimit*60){title.textContent='أحسنت! انتهى وقت اليوم';message.textContent='وصلت إلى الوقت اليومي المحدد. خذ استراحة وعد غداً لمغامرة جديدة.';lock.classList.add('show');return}
  lock.classList.remove('show');
 };
 lock.querySelector('#familyLockHome').addEventListener('click',()=>location.href='index.html');
 apply();
 let lastBreak=usage.breakAt||0;
 setInterval(()=>{
  if(document.visibilityState!=='visible')return;
  const current=settings(),u=getUsage();
  if(inBedtime(current)||u.seconds>=current.dailyLimit*60){apply();return}
  u.seconds+=1;
  if(current.breakEvery&&u.seconds-lastBreak>=current.breakEvery*60){u.breakAt=u.seconds;lastBreak=u.seconds;setUsage(u);title.textContent='استراحة قصيرة 🌿';message.textContent='ابتعد عن الشاشة قليلاً، حرّك جسمك واشرب الماء، ثم أكمل عندما يسمح وقتك.';lock.classList.add('show');return}
  setUsage(u);
  if(u.seconds%5===0)apply();
 },1000);
 document.addEventListener('visibilitychange',apply);
}
document.addEventListener('DOMContentLoaded',()=>{initParentPage();initChildPage()});
})();