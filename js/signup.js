"use strict";
const signupForm = document.getElementById('page-form');
signupForm.addEventListener('submit', event => {
  event.preventDefault();
  EnjoyTrip.run(async () => {
    const id = document.getElementById('user-id').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    if (!/^[A-Za-z0-9_]{4,20}$/.test(id)) throw new Error('아이디는 영문·숫자·밑줄로 4~20자 입력하세요.');
    if (!name) throw new Error('이름을 입력하세요.');
    EnjoyTrip.passwordRule(password);
    if (password !== document.getElementById('password-confirm').value) throw new Error('비밀번호 확인이 다릅니다.');
    const secret = await EnjoyTrip.credential(password);
    const users = EnjoyTrip.users();
    if (users.some(u => u.id.toLowerCase() === id.toLowerCase())) throw new Error('이미 사용 중인 아이디입니다.');
    if (users.some(u => u.email === email)) throw new Error('이미 가입한 이메일입니다.');
    users.push({id,name,email,...secret,createdAt:new Date().toISOString()});
    EnjoyTrip.save(EnjoyTrip.keys.users, users);
    location.href='login.html?registered=1';
  });
});
