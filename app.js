const KEY='khushab_foundation_members_v1';
let members=JSON.parse(localStorage.getItem(KEY)||'[]');
const $=id=>document.getElementById(id);
function login(){if($('user').value==='admin'&&$('pass').value==='1234'){sessionStorage.ok='1';showApp()}else alert('یوزرنیم یا پاس ورڈ غلط ہے');}
function showApp(){ $('login').classList.add('hidden'); $('app').classList.remove('hidden'); render();}
function logout(){sessionStorage.removeItem('ok');location.reload()}
if(sessionStorage.ok==='1')showApp();
$('memberForm').addEventListener('submit',e=>{e.preventDefault();
 const fund=+$('fund').value,paid=+$('paid').value;
 members.push({id:'KF-'+String(Date.now()).slice(-6),name:$('name').value,date:$('date').value,fund,paid,city:$('city').value,saudi:$('saudi').value,pak:$('pak').value});
 save();e.target.reset();alert('ممبر محفوظ ہوگیا');});
function save(){localStorage.setItem(KEY,JSON.stringify(members));render()}
function render(){
 const q=($('search')?.value||'').toLowerCase();
 const list=members.filter(m=>(m.name+' '+m.city+' '+m.id).toLowerCase().includes(q));
 $('tbody').innerHTML=list.map(m=>`<tr><td>${m.id}</td><td>${esc(m.name)}</td><td>${m.date||''}</td><td>${esc(m.city||'')}</td><td>${m.fund}</td><td>${m.paid}</td><td>${Math.max(0,m.fund-m.paid)}</td><td class="actions"><button onclick="card('${m.id}')">ID Card</button><button onclick="del('${m.id}')" class="danger">حذف</button></td></tr>`).join('');
 $('memberCount').textContent=members.length;
 $('fundTotal').textContent=members.reduce((a,m)=>a+m.fund,0);
 $('paidTotal').textContent=members.reduce((a,m)=>a+m.paid,0);
 $('dueTotal').textContent=members.reduce((a,m)=>a+Math.max(0,m.fund-m.paid),0);
}
function del(id){if(confirm('کیا یہ ممبر حذف کرنا ہے؟')){members=members.filter(m=>m.id!==id);save()}}
function card(id){const m=members.find(x=>x.id===id);if(!m)return;const w=open('','_blank');w.document.write(`<html dir="rtl"><head><title>${m.name} ID Card</title><style>body{font-family:Arial;background:#eee;padding:30px}.card{max-width:420px;margin:auto;background:white;padding:25px;border-radius:18px;border:3px solid #126b4f;text-align:center}h1{color:#126b4f}.line{padding:8px;border-bottom:1px solid #ddd}button{padding:10px;background:#126b4f;color:#fff;border:0;border-radius:8px}@media print{button{display:none}}</style></head><body><div class="card"><h1>خوشاب فاؤنڈیشن</h1><h2>ممبر ID Card</h2><div class="line"><b>ID:</b> ${m.id}</div><div class="line"><b>نام:</b> ${esc(m.name)}</div><div class="line"><b>سٹی:</b> ${esc(m.city||'')}</div><div class="line"><b>کل فنڈ:</b> ${m.fund}</div><div class="line"><b>جمع شدہ:</b> ${m.paid}</div><div class="line"><b>باقی:</b> ${Math.max(0,m.fund-m.paid)}</div><br><button onclick="print()">پرنٹ کریں</button></div></body></html>`);w.document.close()}
function exportCSV(){let rows=[['ID','Name','Date','City','Fund','Paid','Due','Saudi','Pakistan'],...members.map(m=>[m.id,m.name,m.date,m.city,m.fund,m.paid,Math.max(0,m.fund-m.paid),m.saudi,m.pak])];let csv=rows.map(r=>r.map(x=>`"${String(x??'').replaceAll('"','""')}"`).join(',')).join('\n');let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='khushab-foundation-members.csv';a.click()}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}