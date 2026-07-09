const p=require('playwright');(async()=>{const b=await p.chromium.launch();const pg=await b.newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message.split('\n')[0].slice(0,120)));
try{await pg.goto('http://localhost:3012/#/full-story',{waitUntil:'networkidle',timeout:30000});}catch(e){console.log('nav err',e.message.slice(0,60));}
await pg.waitForTimeout(1500);
const crashed=await pg.evaluate(()=>/Page crashed|is not defined/i.test(document.body.innerText||''));
console.log('origin/main /full-story:', errs.length?('CRASH: '+errs[0]):(crashed?'crash-card':'OK'));
await b.close();})();
