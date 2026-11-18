chrome.alarms.onAlarm.addListener(async alarm=>{
  if(!alarm.name.startsWith("job-"))return;
  const id=alarm.name.slice(4),{jobs=[]}=await chrome.storage.local.get("jobs");
  const job=jobs.find(x=>x.id===id);
  if(job)chrome.notifications.create("reminder-"+id,{type:"basic",iconUrl:"icon.svg",title:"Job deadline reminder",message:`Deadline tomorrow: ${job.role} at ${job.company}`,priority:2});
});
