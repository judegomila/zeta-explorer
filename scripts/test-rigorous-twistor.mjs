import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import katex from 'katex';
import { abs, multiply, divide, angularDimension, angularMultiplier, xiDiagnostic, arithmeticDiagnostic, windowEvidence, COMMON_WINDOW_SAFE } from '../src/math/rigorousTwistor.js';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let checks = 0;
function check(condition, message) { checks++; assert.ok(condition, message); }
function near(a, b, eps = 1e-10) { return abs([a[0] - b[0], a[1] - b[1]]) <= eps; }
for (const x of [0, .05, .7, 2, 4]) for (const t of [-20, -2, 0, 2, 20]) {
  check(near(angularMultiplier([x,t],0), [1,0]), 'constant mode');
  for (let m = 1; m <= 40; m++) {
    const b = angularMultiplier([x,t],m);
    check(abs(b) <= 1 + 1e-13, 'angular contraction');
    if (x === 0) check(Math.abs(abs(b)-1)<1e-12,'boundary angular modulus');
    if (x === 2 && t === 0) check(near(b,[0,0]),'rank-one anchor');
    const reflected = angularMultiplier([-x,-t],m);
    if (reflected && abs(b)>1e-14) check(near(multiply(b,reflected),[1,0],1e-11),'reflection inverse');
  }
}
check(angularDimension(0)===1 && angularDimension(1)===9 && angularDimension(2)===25,'harmonic dimensions');
assert.throws(()=>angularDimension(-1),RangeError); checks++;
check(angularMultiplier([-2,0],1)===null,'actual angular pole sentinel');
check(divide([1,0],[0,0])===null,'zero denominator not fabricated as zero');
check(near(xiDiagnostic([0,0]),[.5,0]) && near(xiDiagnostic([1,0]),[.5,0]),'removable xi points');
check(near(xiDiagnostic([2,0]),[Math.PI/6,0]),'xi(2)');
for (const s of [[.5,2],[2,4],[.25,14],[-1,0],[3,6]]) {
  check(near(xiDiagnostic(s),xiDiagnostic([1-s[0],-s[1]])),'xi reflection');
}
const wide=arithmeticDiagnostic([2,0],1.5);
check(wide.ok && !wide.certified && Math.abs(wide.magnitude-15/(2*Math.PI**2))<1e-9,'exact wide anchor');
for (const [w,a] of [[[1,0],.25],[[.7,2],1.5],[[4,0],1],[[.05,12],.05]]) {
  const result=arithmeticDiagnostic(w,a); check(result.ok && result.certified===false,'diagnostic stays uncertified');
}
for (const [w,a] of [[[1,100],.25],[[1,0],0],[[1,0],NaN],[[Infinity,0],1]]) check(!arithmeticDiagnostic(w,a).ok,'display domain guard');
check(windowEvidence(.25,1.5).kind==='certified','signed closed boundary');
for (const [a,L] of [[.2500000001,1.5],[.25,1.5000000001],[0,1.1],[-1,1.1],[.25,1],[1.0000001,COMMON_WINDOW_SAFE],[NaN,1.5],['',1.5]]) check(windowEvidence(a,L).bound===null,'no out-of-scope certification');
check(windowEvidence(.25,COMMON_WINDOW_SAFE).kind==='proved','prefer stronger analytical window');
check(windowEvidence(1,COMMON_WINDOW_SAFE).bound===.5,'common-window endpoint');
check(windowEvidence(.5,COMMON_WINDOW_SAFE+1e-10).bound===null,'conservative L0 boundary');
check(windowEvidence(.25,1.5).exact==='\\frac{49999}{50000}','KaTeX escape');
katex.renderToString('\\|\\mathsf H_{a,L}\\|\\le '+windowEvidence(.25,1.5).exact+'<1',{throwOnError:true}); checks++;
const component=readFileSync(resolve(root,'src/components/RigorousTwistorModel.jsx'),'utf8');
for (const formula of component.matchAll(/(?:tex=|<Formula>)\{("(?:\\.|[^"\\])*")\}/g)) {
  katex.renderToString(JSON.parse(formula[1]),{throwOnError:true}); checks++;
}
for (const label of ['CONJECTURAL','FLOATING-POINT DIAGNOSTIC','not a proof of RH','full omitted infinite tail','positive operators are I ± H']) check(component.includes(label),'evidence label '+label);
check(existsSync(resolve(root,'public/papers/twistor-bridge-continuation-2026-10-03.pdf')),'report link target exists');
const certificate=JSON.parse(readFileSync(resolve(root,'research/twistor-bridge-2026-10-03/signed_certificate/signed_certificate.json')));
check(certificate.signed_strict_contraction_certified===true,'saved interval certificate accepted');
check(certificate.simplified_rational_norm_upper==='49999/50000','certificate/UI bound agreement');
console.log('PASS: '+checks+' twistor mathematical, scope, formula-rendering, and source checks.');
