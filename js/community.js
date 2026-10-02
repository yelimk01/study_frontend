"use strict";
const boardKey='enjoytrip.'+document.getElementById('main').dataset.board;
const list=document.getElementById('post-list'), detail=document.getElementById('post-detail'),form=document.getElementById('post-form');
let editId=null;
function posts() {const value=EnjoyTrip.read(boardKey,[]);if (!Array.isArray(value)) throw new Error('게시글 데이터 형식 오류');return value;}
function button(label,action,style='btn-outline-primary') {const b=document.createElement('button');b.type='button';b.className='btn btn-sm '+style;b.textContent=label;b.addEventListener('click',()=>EnjoyTrip.run(action));return b;}
function render() {
 const query=document.getElementById('query').value.trim().toLowerCase();list.replaceChildren();
 const items=posts().filter(p=>(p.title+' '+p.content).toLowerCase().includes(query)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
 if (!items.length) {const empty=document.createElement('p');empty.textContent=query?'검색 결과가 없습니다.':'등록된 게시글이 없습니다.';list.append(empty);}
 items.forEach(p=> {const row=document.createElement('div');row.className='border-bottom py-3 d-flex flex-wrap align-items-center gap-3';row.append(button(p.title,()=>show(p.id)));const meta=document.createElement('span');meta.className='small text-secondary';meta.textContent=p.authorName+' · '+new Date(p.createdAt).toLocaleString('ko-KR');row.append(meta);list.append(row);});
 document.getElementById('new-post').hidden=!EnjoyTrip.current();
}
function editor(post=null) {
 if (!EnjoyTrip.current()) throw new Error('로그인 후 작성하세요.');
 editId=post?.id||null;form.hidden=false;detail.hidden=true;
 document.getElementById('editor-title').textContent=post?'글 수정':'글 작성';document.getElementById('post-title').value=post?.title||'';document.getElementById('post-content').value=post?.content||'';document.getElementById('post-title').focus();
}
function owner(post) {if (!EnjoyTrip.current() || post.authorId!==EnjoyTrip.current().id || post.authorCreatedAt!==EnjoyTrip.current().createdAt) throw new Error('작성자만 수정·삭제할 수 있습니다.');}
function show(id) {
 const post=posts().find(p=>p.id===id);if (!post) throw new Error('게시글이 없습니다.');detail.replaceChildren();detail.hidden=false;form.hidden=true;
 const title=document.createElement('h2');title.className='h4';title.textContent=post.title;
 const meta=document.createElement('p');meta.className='small text-secondary';meta.textContent=post.authorName+' · '+new Date(post.createdAt).toLocaleString('ko-KR')+(post.updatedAt?' · 수정됨':'');
 const content=document.createElement('p');content.className='post-content';content.textContent=post.content;
 detail.append(title,meta,content,button('목록',()=>detail.hidden=true));
 const user=EnjoyTrip.current();
 if (user && user.id===post.authorId && user.createdAt===post.authorCreatedAt) {
  const actions=document.createElement('div');actions.className='d-flex gap-2 mt-3';
  actions.append(button('수정',()=> {const fresh=posts().find(p=>p.id===id);owner(fresh);editor(fresh);}),button('삭제',()=> {
   const items=posts(),fresh=items.find(p=>p.id===id);owner(fresh);
   if (!confirm('게시글을 삭제하시겠습니까?')) return;
   EnjoyTrip.save(boardKey,items.filter(p=>p.id!==id));detail.hidden=true;render();EnjoyTrip.message('게시글이 삭제되었습니다.');
  },'btn-outline-danger'));detail.append(actions);
 }
}
document.getElementById('search-form').addEventListener('submit',e=> {e.preventDefault();EnjoyTrip.run(render);});
document.getElementById('new-post').addEventListener('click',()=>EnjoyTrip.run(()=>editor()));
document.getElementById('cancel-edit').addEventListener('click',()=> {form.hidden=true;editId=null;});
form.addEventListener('submit',e=> {e.preventDefault();EnjoyTrip.run(()=> {
 const user=EnjoyTrip.current();if (!user) throw new Error('로그인 후 저장하세요.');
 const title=document.getElementById('post-title').value.trim(),content=document.getElementById('post-content').value.trim();
 if (!title || !content) throw new Error('제목과 내용을 입력하세요.');
 const items=posts();let id=editId;
 if (id) {const post=items.find(p=>p.id===id);if (!post) throw new Error('게시글이 삭제되었습니다.');owner(post);Object.assign(post,{title,content,updatedAt:new Date().toISOString()});}
 else {id=crypto.randomUUID();items.push({id,title,content,authorId:user.id,authorCreatedAt:user.createdAt,authorName:user.name,createdAt:new Date().toISOString()});}
 EnjoyTrip.save(boardKey,items);form.hidden=true;editId=null;render();show(id);EnjoyTrip.message('게시글이 저장되었습니다.');
});});
window.addEventListener('storage',()=>EnjoyTrip.run(()=> {form.hidden=true;detail.hidden=true;editId=null;render();}));
EnjoyTrip.run(render);
