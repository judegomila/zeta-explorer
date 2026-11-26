import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {primesUpTo,logIntegral,chebyshevPsi,psiFromZeros} from '../dist/learn/learn.js';

test('prime sieve and logarithmic integral match known values',()=>{
  const primes=primesUpTo(1000);
  assert.equal(primes.length,168);
  assert.deepEqual(primes.slice(0,6),[2,3,5,7,11,13]);
  // Li(1000) = li(1000) - li(2) = 177.6097 - 1.0452
  assert.ok(Math.abs(logIntegral(1000,2000)-176.5645)<2e-3);
});

test('Chebyshev psi counts prime powers with weight ln p',()=>{
  const primes=primesUpTo(100);
  // prime powers up to 10: 2,3,4,5,7,8,9 -> 3 ln2 + 2 ln3 + ln5 + ln7 = ln 2520
  assert.ok(Math.abs(chebyshevPsi(10,primes)-Math.log(2520))<1e-12);
  assert.equal(chebyshevPsi(1.5,primes),0);
});

test('the truncated explicit formula approaches psi as zeros are added',()=>{
  const primes=primesUpTo(100);
  // Compare away from jumps, where the formula converges to psi itself.
  const points=[6,10,12,14.5,18,21,24,30,34,40,45];
  const error=count=>Math.sqrt(points.reduce((sum,x)=>sum+(psiFromZeros(x,count)-chebyshevPsi(x,primes))**2,0)/points.length);
  assert.ok(error(25)<error(5)&&error(5)<error(0),[error(0),error(5),error(25)].join(' '));
  assert.ok(error(25)<.6,String(error(25)));
});

test('the exposition page loads only same-origin code and the shared tokens',()=>{
  const html=readFileSync(new URL('../dist/learn/index.html',import.meta.url),'utf8');
  assert.match(html,/href="\.\.\/tokens\.css"/);
  assert.doesNotMatch(html,/<script(?![^>]*src="\.\/learn\.js")[^>]*>/);
  assert.doesNotMatch(html,/\son[a-z]+="/);
  const main=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
  assert.ok(main.indexOf('./tokens.css')<main.indexOf('./styles.css'));
  assert.doesNotMatch(readFileSync(new URL('../dist/styles.css',import.meta.url),'utf8'),/^:root\{--bg/);
});

test('the site bar accepts only well-formed internal routes and counts pages',async()=>{
  const {cleanNav,pageCount,siteHref}=await import('../dist/site-bar.js');
  const nav=cleanNav([{label:'A',sections:[{heading:'h',items:[{to:'/x',label:'X'},{to:'javascript:alert(1)',label:'bad'},{to:'//evil.example',label:'bad'},{to:'/y-z/2',label:'Y'}]}]},
    {label:'',sections:[]},{label:'Empty',sections:[{heading:'h',items:[]}]},null]);
  assert.equal(nav.length,1);
  assert.deepEqual(nav[0].sections[0].items.map(item=>item.to),['/x','/y-z/2']);
  assert.equal(pageCount(nav),2);
  assert.equal(siteHref('/atlas'),'../#/atlas');
  assert.deepEqual(cleanNav('nope'),[]);
});

test('the site bar is written as escaped markup that holds the page actions',async()=>{
  const {renderSiteBar}=await import('../dist/site-bar.js');
  const html=renderSiteBar([{label:'Tools & <b>',sections:[{heading:'',items:[{to:'/a',label:'"A" <x>'},{to:'/b',label:'B'}]}]}],'<nav class="header-actions"></nav>');
  assert.match(html,/^<nav class="site-bar" aria-label="Site sections">/);
  assert.ok(html.includes('Tools &amp; &lt;b&gt;<small>2</small>'));
  assert.ok(html.includes('<a href="../#/a">&quot;A&quot; &lt;x&gt;</a>'));
  assert.ok(!html.includes('<b>')&&!html.includes('<x>'));
  assert.ok(html.includes('Research<small>2 pages</small>'));
  assert.ok(html.endsWith('<div class="sb-right"><nav class="header-actions"></nav></div></nav>'));
});
