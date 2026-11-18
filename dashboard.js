const statuses=["Saved","Applied","Interview","Result"];
const board=document.getElementById("board"),search=document.getElementById("search");
let jobs=[];
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function load(){jobs=(await chrome.storage.local.get("jobs")).jobs||[];render();}
function render(){
 const q=search.value.toLowerCase();board.innerHTML="";
 statuses.forEach(status=>{
  const lane=document.createElement("section");lane.className="lane";lane.dataset.status=status;
  const list=jobs.filter(j=>j.status===status&&(j.role+" "+j.company).toLowerCase().includes(q));
  lane.innerHTML=`<h3>${status} <span class="count">(${list.length})</span></h3>`;
  lane.addEventListener("dragover",e=>e.preventDefault());
  lane.addEventListener("drop",async e=>{e.preventDefault();const id=e.dataTransfer.getData("text/plain");const j=jobs.find(x=>x.id===id);if(j){j.status=status;await save();}});
  if(!list.length)lane.insertAdjacentHTML("beforeend",'<div class="empty">Drop a job here</div>');
  list.forEach(j=>{
   const card=document.createElement("article");card.className="card";card.draggable=true;
   card.addEventListener("dragstart",e=>e.dataTransfer.setData("text/plain",j.id));
   card.innerHTML=`<h4>${esc(j.role)}</h4><div class="company">${esc(j.company)}</div><div class="meta">Deadline: ${esc(j.deadline||"Not added")}<br>Saved: ${new Date(j.createdAt).toLocaleDateString()}</div><a href="${esc(j.url)}" target="_blank" rel="noopener">Open job page ↗</a><textarea class="note" rows="2" placeholder="Notes...">${esc(j.notes)}</textarea><div class="actions"><button class="edit">Edit details</button><button class="del">Delete</button></div>`;
   card.querySelector(".note").addEventListener("change",async e=>{j.notes=e.target.value;await save(false);});
   card.querySelector(".edit").onclick=async()=>{const role=prompt("Job role:",j.role);if(role===null)return;const company=prompt("Company:",j.company);if(company===null)return;const deadline=prompt("Deadline (YYYY-MM-DD):",j.deadline||"");if(deadline===null)return;const url=prompt("Job link:",j.url);if(url===null)return;Object.assign(j,{role,company,deadline,url});await save();};
   card.querySelector(".del").onclick=async()=>{if(confirm("Delete this saved job?")){jobs=jobs.filter(x=>x.id!==j.id);await save();}};
   lane.appendChild(card);
  });board.appendChild(lane);
 });
}
async function save(refresh=true){await chrome.storage.local.set({jobs});if(refresh)render();}
search.addEventListener("input",render);
document.getElementById("add").onclick=async()=>{const role=prompt("Job role:");if(!role)return;const company=prompt("Company:");if(!company)return;const url=prompt("Job page URL:")||"";const deadline=prompt("Deadline (YYYY-MM-DD):")||"";jobs.unshift({id:crypto.randomUUID(),role,company,url,deadline,status:"Saved",createdAt:new Date().toISOString(),notes:""});await save();};
document.getElementById("export").onclick=()=>{const rows=[["Role","Company","Deadline","Status","URL","Notes"],...jobs.map(j=>[j.role,j.company,j.deadline,j.status,j.url,j.notes])];const csv=rows.map(r=>r.map(v=>'"'+String(v||"").replace(/"/g,'""')+'"').join(",")).join("\\r\\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="job-clipper-applications.csv";a.click();URL.revokeObjectURL(a.href);};
load();
