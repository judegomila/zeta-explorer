import { chromium } from 'playwright';
import fs from 'fs';
const out=[];
const b = await chromium.launch();
for (const route of ['/papers-download','/lambda-timeline','/papers']) {
  const p = await b.newPage();
  await p.goto('http://localhost:3003/#'+route, {waitUntil:'domcontentloaded', timeout:15000});
  await p.waitForTimeout(3500);
  const r = await p.evaluate(()=>{
    const root=document.getElementById('root');
    return {
      innerText: (document.body.innerText||'').trim().length,
      textContent: (document.body.textContent||'').trim().length,
      rootHtmlLen: root? root.innerHTML.length : -1,
      svgTextNodes: document.querySelectorAll('svg text').length,
      h1: (document.querySelector('h1')?.textContent||'(none)').slice(0,50),
      hasLoading: /Loading\.\.\./.test(document.body.textContent||''),
      hasCrashCard: /Page crashed/.test(document.body.textContent||''),
    };
  });
  out.push(route+' => '+JSON.stringify(r));
  await p.close();
}
await b.close();
fs.writeFileSync('/tmp/pfinal.txt', out.join('\n'));
