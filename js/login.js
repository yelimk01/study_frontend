"use strict";
if (new URLSearchParams(location.search).has('registered')) EnjoyTrip.message('회원가입이 완료되었습니다. 로그인하세요.');
if (new URLSearchParams(location.search).has('reset')) EnjoyTrip.message('비밀번호가 변경되었습니다. 새 비밀번호로 로그인하세요.');
document.getElementById('page-form').addEventListener('submit', event => {
  event.preventDefault();
  EnjoyTrip.run(async () => {
    const id=document.getElementById('user-id').value.trim();
    const user=EnjoyTrip.users().find(u=>u.id.toLowerCase()===id.toLowerCase());
    if (!user || !await EnjoyTrip.verify(user,document.getElementById('password').value)) throw new Error('아이디 또는 비밀번호를 확인하세요.');
    EnjoyTrip.save(EnjoyTrip.keys.current,user.id);location.href='profile.html';
  });
});
