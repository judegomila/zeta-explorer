const fs=require('fs'),p=require('playwright');
const routes=fs.readFileSync('/tmp/allroutes.txt','utf8').split('\n').map(s=>s.trim()).filter(Boolean);
(async()=>{const b=await p.chromium.launch();const pg=await b.newPage();const bad=[];
for(const r of routes){
  const errs=[];const h=e=>errs.push(e.message.split('\n')[0].slice(0,100));pg.on('pageerror',h);
  try{
    // fresh load
    await pg.goto('http://localhost:3003/#'+r,{waitUntil:'networkidle',timeout:15000});await pg.waitForTimeout(300);
    // re-nav: go home then back (the trigger that caught full-story)
    await pg.evaluate(()=>{location.hash='#/';});await pg.waitForTimeout(250);
    await pg.evaluate(rr=>{location.hash='#'+rr;},r);await pg.waitForTimeout(500);
  }catch(e){errs.push('NAV:'+e.message.slice(0,60));}
  const crash=await pg.evaluate(()=>/Page crashed|is not defined|before initialization/i.test(document.body.innerText||''));
  pg.off('pageerror',h);
  if(errs.length||crash) bad.push(r+' :: '+(errs[0]||'crash-card'));
}
fs.writeFileSync('/tmp/crashsweep_result.txt','BROKEN '+bad.length+' / '+routes.length+'\n'+bad.join('\n'));
console.log('DONE: BROKEN '+bad.length+' / '+routes.length);
await b.close();})();
