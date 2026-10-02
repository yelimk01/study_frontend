"use strict";
let resetId = null;
const resetForm=document.getElementById('reset-form');
document.getElementById('page-form').addEventListener('input',()=> {resetId=null;resetForm.hidden=true;});
document.getElementById('page-form').addEventListener('submit',event=> {
 event.preventDefault();EnjoyTrip.run(()=> {
  const id=document.getElementById('user-id').value.trim().toLowerCase();
  const email=document.getElementById('email').value.trim().toLowerCase();
  const user=EnjoyTrip.users().find(u=>u.id.toLowerCase()===id && u.email===email);
  if (!user) throw new Error('입력한 정보에 해당하는 회원이 없습니다.');
  resetId=user.id;resetForm.hidden=false;document.getElementById('new-password').focus();EnjoyTrip.message('가입 정보가 확인되었습니다. 새 비밀번호를 입력하세요.');
 });
});
resetForm.addEventListener('submit',event=> {
 event.preventDefault();EnjoyTrip.run(async()=> {
  if (!resetId) throw new Error('가입 정보를 먼저 확인하세요.');
  const password=document.getElementById('new-password').value;
  EnjoyTrip.passwordRule(password);
  if (password!==document.getElementById('new-password-confirm').value) throw new Error('비밀번호 확인이 다릅니다.');
  const targetId=resetId, secret=await EnjoyTrip.credential(password);
  if (targetId!==resetId) throw new Error('가입 정보를 다시 확인하세요.');
  const users=EnjoyTrip.users(), user=users.find(u=>u.id===targetId);
  if (!user) throw new Error('회원이 존재하지 않습니다.');
  Object.assign(user,secret);EnjoyTrip.save(EnjoyTrip.keys.users,users);
  if (EnjoyTrip.current()?.id===targetId) localStorage.removeItem(EnjoyTrip.keys.current);
  location.href='login.html?reset=1';
 });
});
