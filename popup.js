const $=id=>document.getElementById(id);
(async()=>{
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  $("url").value=tab?.url||"";
  try{
    const [data]=await chrome.scripting.executeScript({target:{tabId:tab.id},func:()=>{
      const meta=(names)=>{for(const n of names){const e=document.querySelector(`meta[property="${n}"],meta[name="${n}"]`);if(e?.content)return e.content;}return ""};
      const title=meta(["og:title","twitter:title"])||document.querySelector("h1")?.innerText||document.title||"";
      const company=meta(["og:site_name"])||"";
      const body=document.body.innerText;
      const m=body.match(/(?:apply\s+by|application\s+deadline|closing\s+date|last\s+date|deadline)\s*[:\-]?\s*((?:\d{1,2}[\/.-]){2}\d{2,4}|\d{4}-\d{2}-\d{2}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})/i);
      return {title,company,deadline:m?m[1]:""};
    }});
    $("role").value=data?.result?.title||"";
    $("company").value=data?.result?.company||"";
    const d=data?.result?.deadline||"";
    if(/^\d{4}-\d{2}-\d{2}$/.test(d)) $("deadline").value=d;
  }catch(e){}
})();
$("save").addEventListener("click",async()=>{
  const role=$("role").value.trim(),company=$("company").value.trim(),url=$("url").value.trim(),deadline=$("deadline").value;
  if(!role||!company||!url){$("msg").style.color="#b42318";$("msg").textContent="Please enter the role, company and job link.";return;}
  const {jobs=[]}=await chrome.storage.local.get("jobs");
  jobs.unshift({id:crypto.randomUUID(),role,company,url,deadline,status:"Saved",createdAt:new Date().toISOString(),notes:""});
  await chrome.storage.local.set({jobs});
  if(deadline){const when=new Date(deadline+"T09:00:00").getTime()-86400000;if(when>Date.now())await chrome.alarms.create("job-"+jobs[0].id,{when});}
  $("msg").style.color="#18794e";$("msg").textContent="Saved successfully!";
});
$("board").addEventListener("click",()=>chrome.tabs.create({url:chrome.runtime.getURL("dashboard.html")}));
