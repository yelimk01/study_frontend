"use strict";
document.body.dataset.protected='true';
EnjoyTrip.run(()=> {
 const user=EnjoyTrip.requireUser();if (!user) return;
 ['id','name','email'].forEach((key,i)=>document.getElementById(['user-id','name','email'][i]).value=user[key]);
 const modal=document.getElementById('delete-modal');
 document.addEventListener('keydown',event=> {
  if (modal.hidden) return;
  if (event.key==='Escape') {event.preventDefault();modal.hidden=true;document.getElementById('delete-button').focus();}
  if (event.key==='Tab') {
   const first=document.getElementById('cancel-delete-button'),last=document.getElementById('confirm-delete-button');
   if (event.shiftKey && document.activeElement===first) {event.preventDefault();last.focus();}
   else if (!event.shiftKey && document.activeElement===last) {event.preventDefault();first.focus();}
  }
 });
 document.getElementById('page-form').addEventListener('submit',event=> {
  event.preventDefault();EnjoyTrip.run(()=> {
   const current=EnjoyTrip.requireUser();if (!current) return;
   const name=document.getElementById('name').value.trim(),email=document.getElementById('email').value.trim().toLowerCase();
   if (!name) throw new Error('이름을 입력하세요.');
   const users=EnjoyTrip.users();if (users.some(u=>u.id!==current.id && u.email===email)) throw new Error('이미 사용 중인 이메일입니다.');
   Object.assign(users.find(u=>u.id===current.id),{name,email});EnjoyTrip.save(EnjoyTrip.keys.users,users);EnjoyTrip.message('회원정보가 수정되었습니다.');
  });
 });
 document.getElementById('logout-button').addEventListener('click',()=>EnjoyTrip.run(EnjoyTrip.logout));
 document.getElementById('delete-button').addEventListener('click',()=> {modal.hidden=false;document.getElementById('cancel-delete-button').focus();});
 document.getElementById('cancel-delete-button').addEventListener('click',()=> {modal.hidden=true;document.getElementById('delete-button').focus();});
 document.getElementById('confirm-delete-button').addEventListener('click',()=>EnjoyTrip.run(()=> {
  const current=EnjoyTrip.requireUser();if (!current) return;
  EnjoyTrip.save(EnjoyTrip.keys.users,EnjoyTrip.users().filter(u=>u.id!==current.id));localStorage.removeItem(EnjoyTrip.keys.current);location.href='index.html';
 }));
});
