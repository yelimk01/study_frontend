"use strict";
// 모든 페이지가 사용하는 저장소와 회원 기능. 실제 서버 인증을 대체하지 않는 수업용 구현입니다.
window.EnjoyTrip = (() => {
  const keys = {users: 'enjoytrip.users', current: 'enjoytrip.currentUser'};
  function read(key, fallback) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    try { return JSON.parse(raw); } catch { throw new Error('저장 데이터가 손상되었습니다. 개발자 도구에서 해당 저장 키를 확인하세요.'); }
  }
  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function users() { const value = read(keys.users, []); if (!Array.isArray(value)) throw new Error('회원 데이터 형식이 올바르지 않습니다.'); return value; }
  function current() { const id = read(keys.current, null); return users().find(u => u.id === id) || null; }
  function message(text, error = false) { const el = document.getElementById('page-message'); if (el) { el.textContent = text; el.className = 'mt-3 alert ' + (error ? 'alert-danger' : 'alert-success'); } }
  async function run(action) { try { await action(); } catch (e) { message(e.message || '처리 중 오류가 발생했습니다.', true); } }
  function passwordRule(value) { if (value.length < 8 || value.length > 64 || !/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) throw new Error('비밀번호는 영문과 숫자를 포함한 8~64자로 입력하세요.'); }
  async function digest(password, salt) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + password));
    return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
  }
  async function credential(password) { const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2,'0')).join(''); return {salt, passwordHash: await digest(password, salt)}; }
  async function verify(user, password) { return user.passwordHash === await digest(password, user.salt); }
  function logout() { localStorage.removeItem(keys.current); location.href = 'login.html'; }
  function nav() {
    const user = current();
    document.querySelectorAll('nav a[href="signup.html"], nav a[href="login.html"]').forEach(a => a.hidden = !!user);
    document.querySelectorAll('nav a[href="profile.html"]').forEach(a => a.hidden = !user);
    const menu = document.querySelector('nav');
    if (!menu) return;
    ['notices','board'].forEach((name,i) => { if (!menu.querySelector(`[href="${name}.html"]`)) { const a=document.createElement('a'); a.href=name+'.html'; a.textContent=['공지사항','공유게시판'][i]; menu.append(a); } });
    let button = menu.querySelector('[data-logout]');
    if (!button) { button=document.createElement('button');button.type='button';button.dataset.logout='';button.className='btn btn-outline-secondary btn-sm';button.textContent='로그아웃';button.addEventListener('click',()=>run(logout));menu.append(button); }
    button.hidden=!user;
  }
  function requireUser() { const u=current(); if (!u) { location.replace('login.html'); return null; } return u; }
  document.addEventListener('DOMContentLoaded',()=>run(nav));
  window.addEventListener('storage',()=> { run(()=> { nav(); if (document.body.dataset.protected && !current()) location.replace('login.html'); }); });
  return {keys,read,save,users,current,message,run,passwordRule,credential,verify,logout,nav,requireUser};
})();
