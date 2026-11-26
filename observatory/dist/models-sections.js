/**
 * Sections added to the model workbenches: rails and bridge, limiting
 * temperature, vacuum energy (twin ladder); level statistics and the trend
 * with mass (nucleus); the horizon model. Each section names its texts and
 * draws from the pure model modules; no number is computed here that a model
 * module does not export.
 *
 * Wording rule for every text below: a statement is classed as THEOREM,
 * IDENTITY, EQUIVALENT TO RH, NUMERICAL OBSERVATION or ANALOGY where that
 * matters, and nothing is offered as evidence for or against RH.
 */
import { ZERO_HEIGHTS, evaluatePolar } from './math.js';
import { railsInput, blackHoleInput, nucleusInput } from './models.js';
import { C, TAU, clamp, fmt, sig, esc, surface, label, line, dot, frame, curve, linspace, ticks, staircase, legend } from './models-draw.js';
import { railsConfig, railScan, delayPositivity, overlap, timeDelay, delayParts, varianceSeries, varianceExpansion, roundedVariance,
  truncatedVariance, measuredDelayVariance, heightLog, primeJitter, regularisedLadderSum, jitterConstant, ZETA_MINUS_ONE, sawtooth,
  railRungs, vacuumBalance, ONE_POINT_TABLE, VARIANCE_REFERENCE, LIMITING_THICKNESS } from './rails-model.js';
import { RAILS_TABLE, ZETA_ZEROS_1000 } from './rails-data.js';
import { ENSEMBLES, ENSEMBLE_LABELS, SPACING_DENSITIES, SPACING_LAWS, RATIO_DENSITIES, RATIO_MEANS, NUMBER_VARIANCE, unfoldLinear, unfoldZeros,
  histogram, levelStatistics, widthStatistics, porterThomas } from './spectral-stats.js';
import { NUCLIDES, NUCLIDE_IDS } from './nuclides-data.js';
import { dropEnergies, stiffness } from './nucleus-model.js';
import { blackHoleNumbers, BUCHDAHL, centralPressure, TEMPERATURE_MARKS, gammaDelay, gammaPole, railLevels, transmission, zeroCount, zeroExponent,
  DICTIONARY, SI, localTemperature } from './black-hole-model.js';

const LAW_COLORS={goe:C.direct,gue:C.dual,poisson:C.dim};
const LAW_DASH={goe:[5,3],gue:[5,3],poisson:[2,4]};
const box=(w,h,{left=34,right=10,top=14,bottom=20}={})=>({left,top,right:w-right,bottom:h-bottom});
const windowMid=c=>c.t0+c.span/2;
const zeroTicks=(ctx,plot,c,color='#cfe6b2')=>{for(const z of ZETA_ZEROS_1000){if(z>c.t0+c.span)break;if(z>=c.t0)line(ctx,plot.X(z),plot.box.top,plot.X(z),plot.box.top+5,color,1);}};
const row=cells=>'<tr>'+cells.map((c,i)=>i?`<td>${c}</td>`:`<th scope="row">${c}</th>`).join('')+'</tr>';
const table=(caption,head,rows)=>`<table><caption>${caption}</caption><thead><tr>${head.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`;
const none='<span class="models-na">not available</span>';

// =============================================================================
// Rails and bridge
// =============================================================================
function railsScanCached(panel,steps){
  const input=railsInput(panel.state),key='scan'+steps+JSON.stringify(input);
  if(panel.cache.railsKey!==key){panel.cache.railsKey=key;panel.cache.rails=railScan(input,steps);}
  return panel.cache.rails;
}
function drawRails(panel){
  const {ctx,w,h}=surface(panel.canvas('hero')),scan=railsScanCached(panel,Math.min(900,Math.max(300,Math.round(w)))),c=scan.config;
  const xr=[c.t0,c.t0+c.span],xt=ticks(xr[0],xr[1],8),mid=Math.round(h*.46);
  // upper strip: the two rails, divided by the positive smooth factor
  let amp=1e-9;for(let i=0;i<scan.A.length;i++)amp=Math.max(amp,Math.abs(scan.A[i]),Math.abs(scan.B[i]));
  const top=frame(ctx,{left:44,top:22,right:w-14,bottom:mid-14},{x:xr,y:[-amp*1.08,amp*1.08],yticks:[-amp,0,amp],tick:v=>sig(v,2)});
  line(ctx,top.box.left,top.Y(0),top.box.right,top.Y(0),C.grid);
  curve(ctx,scan.t,scan.A,top,C.direct,1.5);curve(ctx,scan.t,scan.B,top,C.dual,1.5);zeroTicks(ctx,top,c);
  legend(ctx,[['A_a(t) = Re ξ(½+a+it), even rail',C.direct],['B_a(t) = Im ξ(½+a+it), odd rail',C.dual]],top.box.left+8,top.box.top+10,{align:'left',size:9,gap:12});
  label(ctx,w<640?'÷ smooth factor':'both divided by |½s(s−1)π^(−s/2)Γ(s/2)| · ticks: zeros of ζ',top.box.right-4,top.box.bottom-5,{color:C.dim,size:8,align:'right'});
  // lower strip: time delay, prime series, the inequality τ > 0
  let lo=0,hi=1e-9;for(let i=0;i<scan.delay.length;i++){lo=Math.min(lo,scan.delay[i]);hi=Math.max(hi,scan.delay[i]);}
  const cap=Math.min(hi,Math.max(8,4*Math.log(Math.max(windowMid(c),7)/TAU)+6));
  const low=frame(ctx,{left:44,top:mid+10,right:w-14,bottom:h-24},{x:xr,y:[Math.min(lo*1.1,-.12*cap),cap*1.06],xticks:xt,yticks:ticks(0,cap,4),xlabel:'height t'});
  // shade the samples where τ ≤ 0
  ctx.fillStyle='rgba(255,125,138,.28)';
  for(let i=0;i<scan.delay.length;i++)if(!(scan.delay[i]>0)){const x=low.X(scan.t[i]);ctx.fillRect(x-1,low.box.top,2,low.box.bottom-low.box.top);}
  line(ctx,low.box.left,low.Y(0),low.box.right,low.Y(0),C.bad,1,[4,3]);label(ctx,'τ = 0',low.box.right-4,low.Y(0)-4,{color:C.bad,size:8,align:'right'});
  curve(ctx,scan.t,scan.smooth,low,C.dim,1,[2,3]);
  curve(ctx,scan.t,scan.series,low,C.finite,1.2,[5,3]);
  curve(ctx,scan.t,scan.delay,low,C.bridge,1.7);
  legend(ctx,[['τ_a(t) = 2 Re ξ′/ξ(½+a+it), exact',C.bridge],[`prime series, n ≤ ${c.terms}`+(c.a>LIMITING_THICKNESS?'':' (not convergent for a ≤ ½)'),C.finite],['smooth part',C.dim]],
    low.box.left+8,low.box.top+10,{align:'left',size:9,gap:12});

  // ratio
  {const {ctx,w,h}=surface(panel.canvas('a')),p=frame(ctx,box(w,h),{x:xr,y:[-6,6],xticks:ticks(xr[0],xr[1],4),yticks:[-6,0,6],xlabel:'t'});
    line(ctx,p.box.left,p.Y(0),p.box.right,p.Y(0),C.grid);
    const ys=Array.from(scan.ratio,(v,i)=>i&&Math.abs(v-scan.ratio[i-1])>6?NaN:clamp(v,-6.2,6.2));curve(ctx,scan.t,ys,p,C.pink,1.3);}
  // phase
  {const {ctx,w,h}=surface(panel.canvas('b')),ph=Array.from(scan.phase,v=>v/Math.PI),lo=Math.min(...ph),hi=Math.max(...ph);
    const p=frame(ctx,box(w,h),{x:xr,y:[lo-.2,hi+.2],xticks:ticks(xr[0],xr[1],4),yticks:ticks(lo,hi,4),xlabel:'t',ylabel:'φ_a / π'});
    curve(ctx,scan.t,ph,p,C.bridge,1.5);
    for(let k=Math.ceil(lo);k<=hi;k++)line(ctx,p.box.left,p.Y(k),p.box.right,p.Y(k),C.grid,1,[2,4]);}
  // series error
  let worst=0;const err=Array.from(scan.delay,(v,i)=>{const e=v-scan.series[i];worst=Math.max(worst,Math.abs(e));return e;});
  {const {ctx,w,h}=surface(panel.canvas('c')),m=Math.max(worst,1e-9)*1.1,p=frame(ctx,box(w,h),{x:xr,y:[-m,m],xticks:ticks(xr[0],xr[1],4),yticks:[-m,0,m],tick:v=>Math.abs(v)<1e-12?'0':Math.abs(v)<100&&Number.isInteger(v)?String(v):sig(v,2),xlabel:'t'});
    line(ctx,p.box.left,p.Y(0),p.box.right,p.Y(0),C.grid);curve(ctx,scan.t,err,p,C.finite,1.2);
    label(ctx,'exact − prime series',p.box.right,p.box.top+8,{color:C.finite,size:8,align:'right'});}
  // minimum of τ over the window as a function of a
  const profile=panel.defer('railsProfile'+c.t0+','+c.span,()=>{
    const as=linspace(.02,1.5,37),mins=as.map(a=>{let m=Infinity;for(let i=0;i<=240;i++)m=Math.min(m,timeDelay(a,c.t0+c.span*i/240));return m;});
    return {as,mins};
  });
  {const {ctx,w,h}=surface(panel.canvas('d'));
    if(profile){
      const hi=Math.max(...profile.mins,1e-6),lo=Math.min(0,...profile.mins),p=frame(ctx,box(w,h),{x:[0,1.5],y:[lo-.05*hi,hi*1.08],xticks:[0,.5,1,1.5],yticks:ticks(0,hi,3),xlabel:'thickness a'});
      ctx.fillStyle='rgba(141,255,176,.07)';ctx.fillRect(p.X(.5),p.box.top,p.box.right-p.X(.5),p.box.bottom-p.box.top);
      line(ctx,p.X(.5),p.box.top,p.X(.5),p.box.bottom,C.good,1,[3,4]);label(ctx,'a ≥ ½: theorem',p.X(.5)+4,p.box.top+8,{color:C.good,size:8});
      line(ctx,p.box.left,p.Y(0),p.box.right,p.Y(0),C.bad,1,[4,3]);
      curve(ctx,profile.as,profile.mins,p,C.bridge,1.6);line(ctx,p.X(c.a),p.box.top,p.X(c.a),p.box.bottom,C.white,1);
    }else label(ctx,'computing…',w/2,h/2,{color:C.dim,align:'center'});}

  const pos=delayPositivity(scan.delay),tm=windowMid(c);let mean=0;for(const v of scan.delay)mean+=v;mean/=scan.delay.length;
  panel.status(pos.holds?`τ_a > 0 at all ${pos.samples} samples`:`τ_a ≤ 0 at ${pos.negative} samples`,pos.holds?'good':'bad');
  panel.readouts([
    ['Thickness a · line σ = ½ + a',`${fmt(c.a,3)} · ${fmt(.5+c.a,3)}`],['Window',`${fmt(c.t0,0)} ≤ t ≤ ${fmt(c.t0+c.span,0)}`],
    ['min τ_a on the samples',`${sig(pos.min,4)} at t = ${fmt(scan.t[pos.index],2)}`,pos.holds?'good':'bad'],['Samples with τ_a ≤ 0',`${pos.negative} of ${pos.samples}`],
    ['Mean of τ_a · log(t/2π) at centre',`${fmt(mean,3)} · ${fmt(Math.log(Math.max(tm,7)/TAU),3)}`],['Width / spacing κ = (a/π) log(t/2π)',fmt(overlap(c.a,tm),3)],
    ['Largest |exact − prime series|',sig(worst,3),c.a>LIMITING_THICKNESS?'':'bad'],['Status of τ_a > 0 at this a',c.a>=LIMITING_THICKNESS?'theorem (all t)':'open for all t; equivalent to a zero-free half-plane'],
  ]);
  panel.table('');
}

// =============================================================================
// Limiting temperature
// =============================================================================
const MEASURE_GRID=[.02,.03,.05,.075,.1,.15,.2,.25,.3,.4,.5,.75,1];
function drawTemperature(panel){
  const c=railsConfig(railsInput(panel.state)),tm=windowMid(c),L=heightLog(Math.max(tm,10));
  const step=Math.max(.05,c.span/1500);
  const measured=panel.defer('variance'+c.t0+','+c.span,()=>MEASURE_GRID.map(a=>[a,measuredDelayVariance(a,c.t0,c.span,step).variance]));
  const here=measuredDelayVariance(c.a,c.t0,c.span,step),round=roundedVariance(c.a,L);
  const as=RAILS_TABLE.map(r=>r[0]).filter(a=>a>=.01&&a<=1.5);
  {const {ctx,w,h}=surface(panel.canvas('hero')),p=frame(ctx,{left:54,top:26,right:w-16,bottom:h-28},{x:[.01,1.5],y:[.1,2e4],logX:true,logY:true,
      xticks:[.01,.02,.05,.1,.25,.5,1],yticks:[.1,1,10,100,1000,1e4],xlabel:'thickness a (log scale)',tick:v=>v>=1e3?'10^'+Math.round(Math.log10(v)):String(v)});
    // region where the prime series converges absolutely
    ctx.fillStyle='rgba(141,255,176,.06)';ctx.fillRect(p.X(.5),p.box.top,p.box.right-p.X(.5),p.box.bottom-p.box.top);
    line(ctx,p.X(.5),p.box.top,p.X(.5),p.box.bottom,C.good,1.2,[4,4]);
    label(ctx,w<640?'a = ½ · β = 1':'a = ½ · limiting inverse temperature β = 1 of the prime gas',p.X(.5)-6,p.box.top+40,{color:C.good,size:9,align:'right'});
    const cross=round.crossover;if(cross>.01){line(ctx,p.X(cross),p.box.top,p.X(cross),p.box.bottom,C.axis,1,[2,4]);label(ctx,'2aL = 1',p.X(cross)+4,p.box.top+10,{color:C.dim,size:8});}
    curve(ctx,as,as.map(a=>4*varianceSeries(a)),p,C.direct,2);
    const small=as.filter(a=>a<=.25);curve(ctx,small,small.map(a=>4*varianceExpansion(a)),p,C.white,1,[2,3]);
    curve(ctx,as,as.map(a=>roundedVariance(a,L).rounded),p,C.dual,1.6);
    const tiny=as.filter(a=>a*L<.45);curve(ctx,tiny,tiny.map(a=>L/a-L*L),p,C.pink,1.2,[5,3]);
    for(const ref of VARIANCE_REFERENCE)for(const [a,v] of ref.rows){ctx.strokeStyle=C.dim;ctx.lineWidth=1;ctx.strokeRect(p.X(a)-2.5,p.Y(v)-2.5,5,5);}
    if(measured)for(const [a,v] of measured)if(v>0)dot(ctx,p.X(a),p.Y(v),3.2,C.bridge);
    if(here.variance>0){dot(ctx,p.X(c.a),p.clipY(here.variance),5,C.white);line(ctx,p.X(c.a),p.box.top,p.X(c.a),p.box.bottom,C.white,1);}
    legend(ctx,[['4V(a) = 2 Σ Λ(n)² n^(−1−2a) · infinite height',C.direct],['4[1/(8a²) − 0.7866 + 6.024 a] · expansion, |a| < ¼',C.white],
      [`(1 − e^(−2aL))/(2a²) · rounded, L = log(t/2π) = ${fmt(L,2)}`,C.dual],['L/a − L² · isolated resonances, a ≪ 1/L',C.pink],
      [`● measured variance of τ_a on ${fmt(c.t0,0)} ≤ t ≤ ${fmt(c.t0+c.span,0)}`,C.bridge],['□ source paper, windows at t = 10⁴ and 10⁶',C.dim]],
      p.box.left+10,p.box.bottom-(w<640?60:76),{align:'left',size:w<640?7:9,gap:w<640?10:13});
    if(!measured)label(ctx,'measuring the window…',p.box.left+70,p.box.top+12,{color:C.dim,size:9});}
  // 8a²V(a) → 1
  {const {ctx,w,h}=surface(panel.canvas('a')),xs=RAILS_TABLE.map(r=>r[0]).filter(a=>a<=1),p=frame(ctx,box(w,h),{x:[0,1],y:[.6,1.25],xticks:[0,.25,.5,.75,1],yticks:[.6,.8,1,1.2],xlabel:'a'});
    line(ctx,p.box.left,p.Y(1),p.box.right,p.Y(1),C.grid,1,[2,4]);
    curve(ctx,xs,xs.map(a=>8*a*a*varianceSeries(a)),p,C.direct,1.7);curve(ctx,xs,xs.map(a=>8*a*a*varianceExpansion(a)),p,C.white,1,[2,3]);
    line(ctx,p.X(c.a),p.box.top,p.X(c.a),p.box.bottom,C.white,1);legend(ctx,[['8a²V(a)',C.direct],['three-term expansion',C.white]],p.box.right-4,p.box.top+9);}
  // fluctuating part in the window
  {const {ctx,w,h}=surface(panel.canvas('b')),n=Math.min(600,Math.max(200,Math.round(w*1.5))),ts=linspace(c.t0,c.t0+c.span,n),ys=ts.map(t=>delayParts(c.a,t).fluct);
    const m=Math.max(1e-6,...ys.map(Math.abs)),p=frame(ctx,box(w,h),{x:[c.t0,c.t0+c.span],y:[-m*1.05,m*1.05],xticks:ticks(c.t0,c.t0+c.span,4),yticks:[-Math.round(m),0,Math.round(m)],xlabel:'t'});
    line(ctx,p.box.left,p.Y(0),p.box.right,p.Y(0),C.grid);curve(ctx,ts,ys,p,C.bridge,1.2);
    const sd=Math.sqrt(Math.max(here.variance,0));for(const s of [-sd,sd])line(ctx,p.box.left,p.Y(s),p.box.right,p.Y(s),C.dual,1,[3,4]);
    label(ctx,'± one standard deviation',p.box.right,p.box.top+8,{color:C.dual,size:8,align:'right'});}
  // mean energy of the prime gas
  {const {ctx,w,h}=surface(panel.canvas('c')),bs=linspace(1.02,3,160),p=frame(ctx,box(w,h),{x:[1,3],y:[0,12],xticks:[1,1.5,2,2.5,3],yticks:[0,4,8,12],xlabel:'β = ½ + a'});
    const U=bs.map(b=>-evaluatePolar(b,0,'zeta',0,true).q.re);
    curve(ctx,bs,U,p,C.direct,1.7);curve(ctx,bs,bs.map(b=>1/(b-1)-.5772156649),p,C.white,1,[2,3]);
    line(ctx,p.X(1),p.box.top,p.X(1),p.box.bottom,C.good,1.2,[4,4]);
    const b=.5+c.a;if(b>1&&b<=3)line(ctx,p.X(b),p.box.top,p.X(b),p.box.bottom,C.white,1);
    legend(ctx,[['U(β) = −ζ′/ζ(β)',C.direct],['1/(β−1) − γ',C.white]],p.box.right-4,p.box.top+9);}
  const V=varianceSeries(c.a),E=varianceExpansion(c.a);
  panel.status(c.a>LIMITING_THICKNESS?'a > ½ · prime series converges absolutely':c.a===LIMITING_THICKNESS?'a = ½ · the limiting point':'a < ½ · beyond the limiting point','caution');
  panel.readouts([
    ['Thickness a · β = ½ + a',`${fmt(c.a,3)} · ${fmt(.5+c.a,3)}`],['V(a) = ½ Σ Λ(n)² n^(−1−2a)',sig(V,7)],
    ['1/(8a²) − 0.786575… + 6.02404… a',c.a<.25?`${sig(E,7)} (${sig((E-V)/V*100,2)} %)`:'outside |a| < ¼'],['Infinite-height variance 4V(a)',sig(4*V,5)],
    ['Measured variance on the window',`${sig(here.variance,5)} · ${here.samples} samples`],['Rounded (1 − e^(−2aL))/(2a²)',sig(round.rounded,5)],
    ['L/a − L² · L = log(t/2π)',`${c.a*L<.45?sig(round.smallA,5):'needs a ≪ 1/L'} · L = ${fmt(L,3)}`],['Truncated prime sum (heuristic)',sig(truncatedVariance(c.a,Math.max(tm,13)),5)],
  ]);
  panel.table('');
}

// =============================================================================
// Vacuum energy
// =============================================================================
function drawVacuum(panel){
  const s=panel.state,c=railsConfig(railsInput(s)),primes=s.vacuumLadder==='primes',bal=vacuumBalance(c.a,primes),v=primeJitter(c.a);
  const canMeasure=c.a>=LIMITING_THICKNESS;
  const rungs=primes&&canMeasure?panel.defer('rungs'+JSON.stringify([c.a,c.t0,c.span]),()=>railRungs(c.a,Math.max(c.t0,8),c.span,.04)):null;
  {const {ctx,w,h}=surface(panel.canvas('hero')),count=w<640?12:22,list=rungs?.rungs.slice(0,count+1)??[];
    const n0=list.length?list[0].index:1,xr=[n0-.5,n0+count+.5],ladderY=h*.3,p=frame(ctx,{left:44,top:h*.5,right:w-16,bottom:h-28},{x:xr,y:[-.75,.75],yticks:[-.5,0,.5],
      xticks:linspace(n0,n0+count,count/2),xlabel:'unfolded position u'});
    const X=p.X;
    line(ctx,p.box.left,ladderY,p.box.right,ladderY,C.axis,1);
    for(let n=n0;n<=n0+count;n++){line(ctx,X(n),ladderY-30,X(n),ladderY+30,primes?C.axis:C.direct,primes?1:2,primes?[3,3]:null);}
    const positions=[];
    if(primes&&list.length){
      for(const r of list){const x=X(r.u);if(x<p.box.left||x>p.box.right)continue;positions.push(r.u);
        line(ctx,x,ladderY-30,x,ladderY+30,C.dual,2);line(ctx,X(r.index),ladderY+36,x,ladderY+36,C.pink,2);}
      legend(ctx,[['dashed: perfect ladder, spacing 1',C.text],['amber: rungs of the odd rail B_a, displaced by δ_n = −(1/π) arg ζ(½+a+it_n)',C.dual],['pink: displacement δ_n',C.pink]],p.box.left+6,ladderY-58,{align:'left',size:9,gap:12});
    }else{
      for(let n=n0;n<=n0+count;n++)positions.push(n);
      legend(ctx,[[primes?(canMeasure?'locating the rungs of the odd rail…':'rungs are drawn for a ≥ ½ only; the constants below hold for every a > 0'):'perfect ladder: rungs at the integers, spacing 1',primes?C.dual:C.direct]],p.box.left+6,ladderY-46,{align:'left',size:9});
    }
    // counting fluctuation F(u) = N(u) − u − c, with mean zero on the perfect ladder
    line(ctx,p.box.left,p.Y(0),p.box.right,p.Y(0),C.grid);
    const xs=linspace(xr[0],xr[1],Math.round((p.box.right-p.box.left))),ys=xs.map(u=>{
      if(!primes||!list.length)return sawtooth(u);
      let count=0;for(const q of positions)if(q<=u)count++;return count-(u-n0)-.5;});
    curve(ctx,xs,ys.map((y,i)=>i&&Math.abs(y-ys[i-1])>.5?NaN:y),p,C.bridge,1.5);
    label(ctx,'counting fluctuation F(u) = N(u) − u − const · its mean square is the jitter energy',p.box.left+6,p.box.top-6,{color:C.bridge,size:9});}
  // regularised sum
  {const {ctx,w,h}=surface(panel.canvas('a')),es=linspace(.02,2,160),p=frame(ctx,box(w,h,{left:44}),{x:[0,2],y:[-.09,-.06],xticks:[0,.5,1,1.5,2],yticks:[-.0833,-.07],tick:v=>v===-.0833?'−1/12':String(v).replace('-','−'),xlabel:'cutoff ε'});
    line(ctx,p.box.left,p.Y(-1/12),p.box.right,p.Y(-1/12),C.good,1,[3,4]);curve(ctx,es,es.map(regularisedLadderSum),p,C.direct,1.7);dot(ctx,p.X(0),p.Y(-1/12),3.5,C.good);
    label(ctx,'Σ n e^(−εn) − 1/ε²  →  ζ(−1)',p.box.right,p.box.top+8,{color:C.direct,size:8,align:'right'});}
  // balance bars
  {const {ctx,w,h}=surface(panel.canvas('b')),m=.13,p=frame(ctx,box(w,h,{left:44}),{x:[0,3],y:[-m,m],yticks:[-.0833,0,.0833],tick:v=>v===0?'0':v<0?'−1/12':'+1/12'});
    const bar=(x,from,to,color)=>{ctx.fillStyle=color;const y0=p.Y(from),y1=p.Y(to);ctx.fillRect(p.X(x)-22,Math.min(y0,y1),44,Math.abs(y1-y0));};
    line(ctx,p.box.left,p.Y(0),p.box.right,p.Y(0),C.axis);
    bar(.75,0,-1/12,C.direct+'cc');bar(.75,-1/12,bal.twoPoint,C.pink+'cc');bar(2.25,0,1/12,C.dual+'cc');bar(2.25,1/12,bal.jitter,C.pink+'cc');
    label(ctx,'energy from the rungs',p.X(.75),p.box.bottom+13,{color:C.direct,size:8,align:'center'});label(ctx,'jitter energy',p.X(2.25),p.box.bottom+13,{color:C.dual,size:8,align:'center'});
    label(ctx,sig(bal.twoPoint,5),p.X(.75),p.Y(bal.twoPoint)+12,{color:C.white,size:9,align:'center'});label(ctx,'+'+sig(bal.jitter,5),p.X(2.25),p.Y(bal.jitter)-5,{color:C.white,size:9,align:'center'});
    label(ctx,primes?'pink: prime term v_a':'no prime term',p.box.right,p.box.top+8,{color:C.pink,size:8,align:'right'});}
  // v(a)
  {const {ctx,w,h}=surface(panel.canvas('c')),as=RAILS_TABLE.map(r=>r[0]),p=frame(ctx,box(w,h,{left:40}),{x:[0,3],y:[0,.24],xticks:[0,.5,1,2,3],yticks:[0,.1,.2],xlabel:'a'});
    curve(ctx,as,as.map(primeJitter),p,C.pink,1.7);line(ctx,p.X(c.a),p.box.top,p.X(c.a),p.box.bottom,C.white,1);dot(ctx,p.X(c.a),p.Y(v),4,C.pink);
    if(rungs?.rungs.length)dot(ctx,p.X(c.a),p.clipY(rungs.meanSquare),3,C.bridge);
    legend(ctx,[['v_a = (1/2π²) Σ Λ(n)²/(n^(1+2a) log² n)',C.pink],['● mean of δ_n² on the window',C.bridge]],p.box.right-4,p.box.top+9);}
  // one-point values against the value a one-point balance would require
  {const {ctx,w,h}=surface(panel.canvas('d')),p=frame(ctx,box(w,h,{left:40}),{x:[0,4],y:[-.2,.2],yticks:[-.1,0,.1],tick:v=>String(v).replace('-','−')});
    line(ctx,p.box.left,p.Y(0),p.box.right,p.Y(0),C.axis);
    ONE_POINT_TABLE.forEach((r,i)=>{const x=p.X(i+.5);ctx.fillStyle=C.bad+'cc';ctx.fillRect(x-13,Math.min(p.Y(0),p.Y(r.value)),12,Math.abs(p.Y(r.value)-p.Y(0)));
      ctx.fillStyle=C.dim;ctx.fillRect(x+1,Math.min(p.Y(0),p.Y(r.balance)),12,Math.abs(p.Y(r.balance)-p.Y(0)));label(ctx,`${r.rail}, a=${r.a}`,x,p.box.bottom+13,{color:C.dim,size:8,align:'center'});});
    legend(ctx,[['one-point energy (source paper)',C.bad],['value a one-point balance needs',C.dim]],p.box.right-4,p.box.top+9);}
  const jc=jitterConstant();
  panel.status(primes?'prime-corrected ladder':'perfect ladder',primes?'caution':'good');
  panel.readouts([
    ['ζ(−1) = lim [Σ n e^(−εn) − 1/ε²]',`${fmt(ZETA_MINUS_ONE,10)} = −1/12`],['Jitter term ζ(2)/(2π²), summed',`${fmt(jc,10)} = +1/12`],
    ['Prime term v_a at a = '+fmt(c.a,3),primes?sig(v,8):'0 (perfect ladder)'],['Energy seen from the rungs ζ(−1) − v_a',sig(bal.twoPoint,8)],
    ['Jitter energy 1/12 + v_a',sig(bal.jitter,8)],['Sum of the two',sig(bal.twoPoint+bal.jitter,2),'good'],
    ['Mean of δ_n² on the window',rungs?.rungs.length?`${sig(rungs.meanSquare,5)} · ${rungs.rungs.length} rungs`:primes?(canMeasure?'computing…':'not measured for a < ½'):'0'],
    ['One-point balance',primes?'false (see fourth panel)':'holds for the perfect ladder only'],
  ]);
  panel.table('');
}

// =============================================================================
// Level statistics (nucleus workbench)
// =============================================================================
function statisticsData(panel){
  const id=panel.state.nucleus;if(panel.cache.statsId===id)return panel.cache.stats;
  const nuclide=NUCLIDES[id],res=nuclide.resonances,usable=!!(res?.statistics&&res.energies?.length>=20);
  panel.cache.zeroStats??=levelStatistics(unfoldZeros(ZETA_ZEROS_1000));
  panel.cache.railWidths??=widthStatistics(railLevels(.5,10,400,.05).map(l=>l.width));
  const out={nuclide,usable,zeros:panel.cache.zeroStats,rail:panel.cache.railWidths};
  if(usable){
    out.levels=levelStatistics(unfoldLinear(res.energies));
    out.widths=widthStatistics(res.gammaN.map((g,i)=>g/Math.sqrt(res.energies[i])));
  }
  panel.cache.statsId=id;panel.cache.stats=out;return out;
}
function fitRows(name,st){
  return ENSEMBLES.map(law=>{const f=st.fit[law];return row([`${name} against ${ENSEMBLE_LABELS[law]}`,`${fmt(f.spacingKS,3)} (p ≈ ${sig(f.spacingP,2)})`,`${fmt(f.ratioKS,3)} (p ≈ ${sig(f.ratioP,2)})`,`${fmt(f.ratioZ,1)}`,fmt(f.varianceRMS,3)]);});
}
function drawStatistics(panel){
  const data=statisticsData(panel),{nuclide,usable,zeros}=data,name=nuclide.label+' + n';
  const sets=[[usable?data.levels:null,C.bridge,name],[zeros,C.pink,'zeros of ζ, first 1000']];
  {const {ctx,w,h}=surface(panel.canvas('hero')),half=(w-30)/2;
    sets.forEach(([st,color,title],k)=>{
      const left=40+k*(half+10),p=frame(ctx,{left,top:34,right:left+half-34,bottom:h-28},{x:[0,3.2],y:[0,1.3],xticks:[0,1,2,3],yticks:[0,.5,1],xlabel:'spacing / mean spacing'});
      label(ctx,title+(st?` · ${st.spacings.length} spacings`:''),left,20,{color,size:10});
      if(!st){label(ctx,'no single complete-looking s-wave sequence: not analysed',left+10,h/2,{color:C.dim,size:10});return;}
      const hist=histogram(st.spacings,st.spacings.length>300?16:10,3.2);
      ctx.fillStyle=color+'55';hist.density.forEach((d,i)=>{const x0=p.X(i*hist.width),x1=p.X((i+1)*hist.width);ctx.fillRect(x0+1,p.clipY(d),x1-x0-2,p.box.bottom-p.clipY(d));});
      const xs=linspace(0,3.2,120);for(const law of ENSEMBLES)curve(ctx,xs,xs.map(SPACING_DENSITIES[law]),p,LAW_COLORS[law],1.4,LAW_DASH[law]);
      if(k===0)legend(ctx,ENSEMBLES.map(l=>[ENSEMBLE_LABELS[l]+(l==='poisson'?'':' Wigner surmise'),LAW_COLORS[l]]),p.box.right-4,p.box.top+10,{size:9,gap:12});
    });}
  // cumulative spacings
  {const {ctx,w,h}=surface(panel.canvas('a')),p=frame(ctx,box(w,h,{left:26}),{x:[0,3],y:[0,1],xticks:[0,1,2,3],yticks:[0,1],xlabel:'spacing / mean'});
    const xs=linspace(0,3,120);for(const law of ENSEMBLES)curve(ctx,xs,xs.map(SPACING_LAWS[law]),p,LAW_COLORS[law],1,LAW_DASH[law]);
    for(const [st,color] of sets)if(st)staircase(ctx,st.spacings,p,color,1.5,3);}
  // spacing ratio
  {const {ctx,w,h}=surface(panel.canvas('b')),p=frame(ctx,box(w,h,{left:26}),{x:[0,1],y:[0,2.2],xticks:[0,.5,1],yticks:[0,1,2],xlabel:'ratio r'});
    const xs=linspace(0,1,100);for(const law of ENSEMBLES)curve(ctx,xs,xs.map(RATIO_DENSITIES[law]),p,LAW_COLORS[law],1,LAW_DASH[law]);
    for(const [st,color] of sets){if(!st)continue;const hist=histogram(st.ratios,st.ratios.length>300?12:6,1);
      const hx=[],hy=[];hist.density.forEach((d,i)=>{hx.push(i*hist.width,(i+1)*hist.width);hy.push(d,d);});curve(ctx,hx,hy,p,color,1.5);
      line(ctx,p.X(st.ratioMean),p.box.bottom,p.X(st.ratioMean),p.box.bottom-12,color,2);}
    for(const law of ENSEMBLES)line(ctx,p.X(RATIO_MEANS[law]),p.box.top,p.X(RATIO_MEANS[law]),p.box.top+8,LAW_COLORS[law],2);}
  // number variance
  {const {ctx,w,h}=surface(panel.canvas('c')),p=frame(ctx,box(w,h,{left:26}),{x:[0,10.5],y:[0,2],xticks:[0,5,10],yticks:[0,1,2],xlabel:'window length L'});
    const xs=linspace(.5,10.5,80);for(const law of ENSEMBLES)curve(ctx,xs,xs.map(NUMBER_VARIANCE[law]),p,LAW_COLORS[law],1,LAW_DASH[law]);
    for(const [st,color] of sets)if(st){curve(ctx,st.Ls,st.sigma2,p,color,1.6);st.Ls.forEach((L,i)=>dot(ctx,p.X(L),p.clipY(st.sigma2[i]),2,color));}}
  // widths
  {const {ctx,w,h}=surface(panel.canvas('d')),p=frame(ctx,box(w,h,{left:26}),{x:[1e-3,10],y:[0,1],logX:true,xticks:[.001,.01,.1,1,10],yticks:[0,1],xlabel:'width / mean width'});
    const xs=linspace(-3,1,120).map(e=>10**e);curve(ctx,xs,xs.map(porterThomas),p,C.white,1.2,[5,3]);
    if(data.widths)staircase(ctx,data.widths.normalised.map(x=>Math.max(x,1.001e-3)),p,C.bridge,1.5,10);
    staircase(ctx,data.rail.normalised,p,C.pink,1.5,10);
    legend(ctx,[['Porter–Thomas',C.white],[usable?'Γn⁰ of '+nuclide.label:'no widths analysed',C.bridge],['two-rail widths, a = ½',C.pink]],p.box.left+6,p.box.top+10,{align:'left'});}
  const u=data.levels,z=zeros;
  panel.status(usable?`${nuclide.label}: ${u.levels} s-wave resonances`:`${nuclide.label}: no resonance sequence analysed`,usable?'good':'caution');
  panel.readouts([
    ['Levels analysed',usable?`${u.levels} of ${nuclide.resonances.count} in the file`:nuclide.resonances?`0 of ${nuclide.resonances.count} in the file`:'no evaluated resonances'],
    ['Mean spacing ratio ⟨r⟩',usable?`${fmt(u.ratioMean,3)} ± ${fmt(u.ratioError,3)}`:'—'],
    ['⟨r⟩ of the zeros',`${fmt(z.ratioMean,4)} ± ${fmt(z.ratioError,4)}`],['Reference ⟨r⟩: GOE · GUE · Poisson',`${RATIO_MEANS.goe} · ${RATIO_MEANS.gue} · ${fmt(RATIO_MEANS.poisson,4)}`],
    ['Widths against Porter–Thomas: KS',data.widths?`${fmt(data.widths.ks,3)} (p ≈ ${sig(data.widths.p,2)})`:'—'],['Relative variance of widths (law: 2)',data.widths?fmt(data.widths.relativeVariance,2):'—'],
    ['Two-rail widths against Porter–Thomas: KS',fmt(data.rail.ks,3)],['Relative variance of two-rail widths',sig(data.rail.relativeVariance,3)],
  ]);
  const head=['Comparison','Spacings: KS distance','Ratio r: KS distance','⟨r⟩ − reference, in standard errors','Number variance: r.m.s. difference, 1 ≤ L ≤ 10'];
  panel.table(table('Goodness of fit, computed from the data shown. A small distance or a large p means the sample does not separate from that law. The p-values assume independent samples and are indicative only.',head,
    [...(usable?fitRows(name,u):[row([name,'not analysed','not analysed','not analysed','not analysed'])]),...fitRows('ζ zeros',z)])
    +`<p>${nuclide.notes.map(esc).join(' ')}</p>`);
}

// =============================================================================
// Trend with mass (nucleus workbench)
// =============================================================================
const z2a=n=>n.Z*n.Z/n.A;
const decayText=n=>n.decay.map(d=>`${d.mode==='A'?'α':d.mode} ${sig(d.percent,3)} %`).join('; ');
function drawTrend(panel){
  const cfg=nucleusInput(panel.state),A=cfg.Z+cfg.N,current=dropEnergies(cfg.Z,A),crit=current.criticalZ2A,list=NUCLIDE_IDS.map(id=>NUCLIDES[id]);
  const mark=(ctx,p,n,y,color)=>{dot(ctx,p.X(z2a(n)),p.clipY(y),n.id===panel.state.nucleus?5:3.2,color);};
  {const {ctx,w,h}=surface(panel.canvas('hero')),xr=[32,52],p=frame(ctx,{left:50,top:26,right:w-52,bottom:h-30},{x:xr,y:[0,1.1],xticks:[32,36,40,44,48,52],yticks:[0,.25,.5,.75,1],xlabel:'Z² / A',ylabel:'fissility x = E꜀ / 2Eₛ'});
    const cMax=Math.ceil(stiffness(2,Math.sqrt(xr[0]*A),A).C/10)*10,YC=v=>p.box.bottom-v/cMax*(p.box.bottom-p.box.top);
    for(const v of ticks(0,cMax,4)){line(ctx,p.box.right,YC(v),p.box.right+3,YC(v),C.axis);label(ctx,String(v),p.box.right+6,YC(v)+3,{color:C.dim,size:8});}
    line(ctx,p.box.right,p.box.top,p.box.right,p.box.bottom,C.axis);label(ctx,'C₂ (MeV)',p.box.right+46,p.box.bottom+13,{color:C.surface,size:8,align:'right'});
    line(ctx,p.X(crit),p.box.top,p.X(crit),p.box.bottom,C.bad,1.2,[4,4]);label(ctx,`Z²/A = ${fmt(crit,1)} · C₂ = 0`,p.X(crit)-6,p.box.top+44,{color:C.bad,size:9,align:'right'});
    line(ctx,p.box.left,p.Y(1),p.box.right,p.Y(1),C.grid,1,[2,4]);
    const xs=linspace(xr[0],xr[1],100);curve(ctx,xs,xs.map(v=>v/crit),p,C.dual,1.8);
    // C₂ at fixed A, as Z varies
    ctx.strokeStyle=C.surface;ctx.lineWidth=1.8;ctx.beginPath();
    xs.forEach((v,i)=>{const c2=stiffness(2,Math.sqrt(v*A),A).C,x=p.X(v),y=YC(Math.max(c2,0));i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
    list.forEach((n,i)=>{const x=p.X(z2a(n)),e=dropEnergies(n.Z,n.A),c2=stiffness(2,n.Z,n.A).C,sel=n.id===panel.state.nucleus;
      dot(ctx,x,p.Y(e.fissility),sel?5.5:3.5,C.dual);dot(ctx,x,YC(c2),sel?5.5:3.5,C.surface);
      label(ctx,n.label,x,p.Y(e.fissility)-9-(i%3)*11,{color:sel?C.white:C.text,size:sel?10:8,align:'center'});});
    const here=current.z2a;if(here>=xr[0]&&here<=xr[1])line(ctx,p.X(here),p.box.top,p.X(here),p.box.bottom,C.white,1);
    legend(ctx,[['fissility x (left axis)',C.dual],[`quadrupole stiffness C₂ at A = ${A} (right axis)`,C.surface],[`white line: the sliders, Z = ${cfg.Z}, N = ${cfg.N}`,C.white]],p.box.left+8,p.box.bottom-34,{align:'left',size:9,gap:12});}
  const xr=[33,48],xt=[34,38,42,46];
  {const {ctx,w,h}=surface(panel.canvas('a')),p=frame(ctx,box(w,h,{left:26}),{x:xr,y:[0,7.5],xticks:xt,yticks:[0,2,4,6],xlabel:'Z² / A'});
    for(const n of list){if(n.barriers){mark(ctx,p,n,n.barriers.inner,C.direct);mark(ctx,p,n,n.barriers.outer,C.dual);}if(n.liquidDropBarrier!=null)mark(ctx,p,n,n.liquidDropBarrier,C.dim);}
    legend(ctx,[['inner barrier (RIPL-3)',C.direct],['outer barrier (RIPL-3)',C.dual],['liquid-drop barrier (model)',C.dim]],p.box.left+6,p.box.bottom-28,{align:'left'});}
  {const {ctx,w,h}=surface(panel.canvas('b')),p=frame(ctx,box(w,h,{left:30}),{x:xr,y:[-5,19],xticks:xt,yticks:[-4,0,4,8,12,16],xlabel:'Z² / A',ylabel:'log₁₀ half-life / s'});
    for(const n of list)mark(ctx,p,n,Math.log10(n.halfLife.seconds),C.bridge);}
  {const {ctx,w,h}=surface(panel.canvas('c')),p=frame(ctx,box(w,h,{left:30}),{x:xr,y:[-10,2.5],xticks:xt,yticks:[-9,-6,-3,0],xlabel:'Z² / A',ylabel:'log₁₀ SF branch / %'});
    for(const n of list){const sf=n.decay.find(d=>d.mode==='SF');if(sf)mark(ctx,p,n,Math.log10(sf.percent),C.coulomb);}}
  {const {ctx,w,h}=surface(panel.canvas('d')),p=frame(ctx,box(w,h,{left:30}),{x:xr,y:[.24,.32],xticks:xt,yticks:[.24,.28,.32],xlabel:'Z² / A',ylabel:'β₂'});
    for(const n of list)if(n.beta2){mark(ctx,p,n,n.beta2.raman2001[0],C.direct);mark(ctx,p,n,n.beta2.pritychenko2016[0],C.dual);}
    legend(ctx,[['Raman et al. 2001',C.direct],['Pritychenko et al. 2016',C.dual]],p.box.right-4,p.box.bottom-16);}
  panel.status(current.fissility<1?`x = ${fmt(current.fissility,3)} · quadrupole stable in the drop model`:`x = ${fmt(current.fissility,3)} · no liquid-drop barrier`,current.fissility<1?'good':'bad');
  panel.readouts([
    ['Sliders: Z, N, A',`${cfg.Z}, ${cfg.N}, ${A}`],['Surface energy Eₛ',`${fmt(current.Es,0)} MeV`],['Coulomb energy E꜀',`${fmt(current.Ec,0)} MeV`],['Fissility x',fmt(current.fissility,3),current.fissility<1?'good':'bad'],
    ['Z² / A · critical value',`${fmt(current.z2a,2)} · ${fmt(crit,1)}`],['Quadrupole stiffness C₂',`${fmt(stiffness(2,cfg.Z,A).C,1)} MeV`],
    ['Z at which C₂ = 0 for this A',fmt(Math.sqrt(crit*A),1)],['Nuclides listed',String(list.length)],
  ]);
  const b2=n=>n.beta2?`${n.beta2.raman2001[0]} (${n.beta2.pritychenko2016[0]})`:none;
  panel.table(table('Evaluated values with the liquid-drop numbers of this model. Sources are listed in Methods. β₂: Raman et al. 2001, with Pritychenko et al. 2016 in brackets. Barriers: RIPL-3 empirical values, inner / outer.',
    ['Nuclide','Z','A','Eₛ (MeV)','E꜀ (MeV)','x','Z²/A','β₂','Half-life','Decay','Barriers (MeV)','First s-wave resonances (eV)'],
    list.map(n=>{const e=dropEnergies(n.Z,n.A),r=n.resonances;return row([n.label,n.Z,n.A,fmt(e.Es,0),fmt(e.Ec,0),fmt(e.fissility,3),fmt(e.z2a,2),b2(n),esc(n.halfLife.text),esc(decayText(n)),
      n.barriers?`${n.barriers.inner} / ${n.barriers.outer}`:none,r?.energies?r.energies.slice(0,4).map(v=>sig(v,4)).join(', ')+' …':r?'two spin groups; not listed':none]);})));
}

// =============================================================================
// Black hole horizon model
// =============================================================================
const kelvin=T=>`${sig(T,4)} K`;
function drawBlackHole(panel){
  const s=panel.state,c=railsConfig(railsInput(s)),n=blackHoleNumbers(blackHoleInput(s)),a=c.a,xr=[c.t0,c.t0+c.span];
  const scan=railsScanCached(panel,600);
  {const {ctx,w,h}=surface(panel.canvas('hero')),imTop=Math.max(3,0),imBottom=-Math.max(1.2,a*1.6);
    // upper part: time delay; lower part: the complex E plane
    let hi=1e-9;for(const v of scan.delay)hi=Math.max(hi,v);const cap=Math.min(hi,Math.max(8,4*Math.log(Math.max(windowMid(c),7)/TAU)+6));
    const mid=Math.round(h*.52),top=frame(ctx,{left:46,top:24,right:w-14,bottom:mid-12},{x:xr,y:[-.08*cap,cap*1.05],yticks:ticks(0,cap,3),ylabel:'time delay'});
    line(ctx,top.box.left,top.Y(0),top.box.right,top.Y(0),C.grid);
    const gs=linspace(xr[0],xr[1],200);curve(ctx,gs,gs.map(E=>gammaDelay(Math.max(E,.05))),top,C.dual,1.5,[5,3]);
    curve(ctx,scan.t,scan.delay,top,C.bridge,1.7);
    legend(ctx,[['τ_a(E) = 2 Re ξ′/ξ(½+a+iE): two-rail function, put in by hand',C.bridge],['2θ′(E) = Re ψ(¼+iE/2) − log π: gamma factor, the part a horizon supplies',C.dual]],top.box.left+8,top.box.top+22,{align:'left',size:w<640?7:9,gap:12});
    const low=frame(ctx,{left:46,top:mid+8,right:w-14,bottom:h-26},{x:xr,y:[imBottom,imTop],xticks:ticks(xr[0],xr[1],8),yticks:[-a,0,.5,2.5],tick:v=>Number.isInteger(v)?String(v):fmt(v,2),xlabel:'Re E',ylabel:'Im E'});
    ctx.fillStyle='rgba(255,125,138,.05)';ctx.fillRect(low.box.left,low.box.top,low.box.right-low.box.left,low.Y(0)-low.box.top);
    line(ctx,low.box.left,low.Y(0),low.box.right,low.Y(0),C.white,1);line(ctx,low.box.left,low.Y(-a),low.box.right,low.Y(-a),C.bridge,1,[2,4]);
    for(const g of ZETA_ZEROS_1000){if(g>xr[1])break;if(g>=xr[0]){dot(ctx,low.X(g),low.Y(-a),3.2,C.bridge);line(ctx,low.X(g),low.Y(0),low.X(g),low.Y(-a),C.bridge+'55',1);}}
    if(xr[0]<=0)for(let k=0;gammaPole(k)<=imTop;k++){ctx.strokeStyle=C.dual;ctx.lineWidth=1.5;ctx.strokeRect(low.X(0)-3,low.Y(gammaPole(k))-3,6,6);}
    label(ctx,`resonances of S_a at E = g − ia (zeros on the line): width 2a = ${fmt(2*a,2)}`,low.box.right-6,low.box.bottom-6,{color:C.bridge,size:9,align:'right'});
    label(ctx,xr[0]<=0?'□ poles of the gamma factor at E = i(2n+½)':'poles of the gamma factor: E = i(2n+½), on the imaginary axis (left of this window)',low.box.right-6,low.box.top+10,{color:C.dual,size:9,align:'right'});}
  // counting laws
  {const {ctx,w,h}=surface(panel.canvas('a')),Es=linspace(1,6,100).map(e=>10**e),p=frame(ctx,box(w,h,{left:30}),{x:[10,1e6],y:[1,1e7],logX:true,logY:true,xticks:[10,1e2,1e3,1e4,1e5,1e6],yticks:[1,1e2,1e4,1e6],tick:v=>'10^'+Math.round(Math.log10(v)),xlabel:'energy E (own unit)'});
    curve(ctx,Es,Es.map(zeroCount),p,C.bridge,1.7);
    // U-239 at the neutron separation energy: about 2.6e6 levels below 83 single-particle spacings (source paper)
    dot(ctx,p.X(83),p.Y(2.6e6),4,C.proton);dot(ctx,p.X(83),p.Y(22),4,C.bridge);
    legend(ctx,[['zeros: N(E) = (E/2π) log(E/2πe) + 7/8',C.bridge],['● ²³⁹U at Sₙ: about 2.6 × 10⁶ levels (model)',C.proton],[`horizon: 10^(${sig(n.entropy/Math.LN10,3)}) states if e^S counts states`,C.dual]],p.box.left+6,p.box.top+10,{align:'left'});}
  // widths
  const levels=panel.defer('levels'+JSON.stringify([a,c.t0,c.span]),()=>railLevels(a,Math.max(c.t0,1),c.span,.05));
  const widths=levels&&levels.length>2?widthStatistics(levels.map(l=>l.width)):null;
  {const {ctx,w,h}=surface(panel.canvas('b')),p=frame(ctx,box(w,h,{left:26}),{x:[1e-3,10],y:[0,1],logX:true,xticks:[.001,.01,.1,1,10],yticks:[0,1],xlabel:'width / mean width'});
    const xs=linspace(-3,1,120).map(e=>10**e);curve(ctx,xs,xs.map(porterThomas),p,C.white,1.2,[5,3]);
    if(widths)staircase(ctx,widths.normalised,p,C.bridge,1.6,10);
    legend(ctx,[['Porter–Thomas (compound nucleus)',C.white],[widths?`w_n = 1/φ_a′(t_n), ${widths.n} levels`:'computing…',C.bridge]],p.box.left+6,p.box.top+10,{align:'left'});}
  // Buchdahl
  {const {ctx,w,h}=surface(panel.canvas('c')),xs=linspace(BUCHDAHL+.002,6,300),p=frame(ctx,box(w,h,{left:34}),{x:[1,6],y:[.01,100],logY:true,xticks:[1,2,3,4,5,6],yticks:[.01,.1,1,10,100],xlabel:'stellar radius R / r_s',ylabel:'P_c / ρc²'});
    ctx.fillStyle='rgba(255,125,138,.12)';ctx.fillRect(p.X(1),p.box.top,p.X(BUCHDAHL)-p.X(1),p.box.bottom-p.box.top);
    line(ctx,p.X(BUCHDAHL),p.box.top,p.X(BUCHDAHL),p.box.bottom,C.bad,1.3,[4,3]);label(ctx,'R = (9/8) r_s',p.X(BUCHDAHL)+5,p.box.top+20,{color:C.bad,size:9});
    curve(ctx,xs,xs.map(centralPressure),p,C.surface,1.7);line(ctx,p.X(n.config.radius),p.box.top,p.X(n.config.radius),p.box.bottom,C.white,1);
    if(Number.isFinite(n.pressure))dot(ctx,p.X(n.config.radius),p.clipY(n.pressure),4,C.surface);}
  // local temperature against proper distance
  {const {ctx,w,h}=surface(panel.canvas('d')),ls=linspace(-1,20,120),T=e=>localTemperature(SI.fm*10**e),p=frame(ctx,box(w,h,{left:34}),{x:[-1,20],y:[T(20),T(-1)],logY:true,xticks:[0,5,10,15,20],yticks:[1e-6,1,1e6,1e12],tick:v=>Math.abs(v)<=20&&Number.isInteger(v)&&v!==1?String(v):'10^'+Math.round(Math.log10(v)),xlabel:'log₁₀ proper distance ℓ / fm',ylabel:'T (K)'});
    curve(ctx,ls,ls.map(T),p,C.dual,1.7);
    for(const m of TEMPERATURE_MARKS)dot(ctx,p.X(Math.log10(m.fm)),p.Y(localTemperature(m.fm*SI.fm)),3,C.proton);
    if(n.hawking>=T(20)&&n.hawking<=T(-1)){line(ctx,p.box.left,p.Y(n.hawking),p.box.right,p.Y(n.hawking),C.direct,1,[4,3]);}
    line(ctx,p.X(n.config.logDistance),p.box.top,p.X(n.config.logDistance),p.box.bottom,C.white,1);dot(ctx,p.X(n.config.logDistance),p.Y(n.local),4,C.dual);
    legend(ctx,[['T_loc = ħc/(2πk_B ℓ)',C.dual],['Hawking temperature T_H at infinity',C.direct],['● marks: 0.12, 1, 17.9, 156.5 MeV',C.proton]],p.box.right-4,p.box.top+10);}
  const tm=Math.max(windowMid(c),7),tau=`${sig(n.qnm.dampingTime*1e3,3)} ms`;
  panel.status('analogy · establishes nothing about black holes or RH','caution');
  panel.readouts([
    ['Mass M',`${sig(n.solarMasses,3)} M☉ = ${sig(n.kg,4)} kg`],['Schwarzschild radius r_s = 2GM/c²',`${sig(n.rs/1e3,4)} km`],
    ['Hawking temperature T_H = ħc³/8πGMk_B',kelvin(n.hawking)],[`Local temperature at ℓ = ${sig(n.distance/SI.fm,3)} fm`,`${kelvin(n.local)} = ${sig(n.localMeV,3)} MeV`],
    ['Entropy S = 4πGM²/ħc',`${sig(n.entropy,4)} k_B`],['Least-damped l = 2 mode',`${sig(n.qnm.frequency,4)} Hz · decays in ${tau}`],
    [`Star of radius R = ${fmt(n.config.radius,3)} r_s`,`${sig(n.stellarRadius/1e3,4)} km · P_c/ρc² = ${sig(n.pressure,3)}`],['Buchdahl bound R > (9/8) r_s',`${sig(n.buchdahlRadius/1e3,4)} km`,n.config.radius>BUCHDAHL?'good':'bad'],
    ['Thickness a · resonance width 2a',`${fmt(a,3)} · ${fmt(2*a,3)}`],['Width / spacing κ at window centre',fmt(overlap(a,tm),3)],
    ['Transmission 1 − (t/2π)^(−2a)',fmt(transmission(a,tm),4)],['Relative variance of the widths w_n',widths?`${sig(widths.relativeVariance,3)} (Porter–Thomas: 2)`:'computing…'],
    ['d ln N / d ln E of the zeros at window centre',fmt(zeroExponent(tm),3)],['Same exponent for a horizon: 2S',sig(2*n.entropy,3)],
    ['Evaporation time 5120πG²M³/ħc⁴',`${sig(n.evaporationYears,3)} yr`],['Proper time from horizon to r = 0',`${sig(n.infall*1e6,3)} µs`],
  ]);
  const tone={adopted:'good',fails:'bad','no relation':'bad','not adopted':'bad'};
  panel.table(table('Dictionary between the zeta side and a horizon, with the verdict reached for each row. Every row is an ANALOGY. Rows marked “fails”, “no relation” or “not adopted” were tested against the numbers in the third column and rejected; they are listed so that they are not mistaken for results.',
    ['Zeta side','Physical object','Quantities compared','Verdict','Scope'],
    DICTIONARY.map(r=>`<tr data-tone="${tone[r.verdict]}"><th scope="row">${esc(r.zeta)}</th><td>${esc(r.physical)}</td><td>${esc(r.test)}</td><td class="models-verdict">${r.verdict==='adopted'?'adopted as analogy':esc(r.verdict==='fails'?'refuted':r.verdict)}</td><td>${esc(r.scope)}</td></tr>`)));
}

// =============================================================================
// Texts
// =============================================================================
const RAILS_NOTE='THEOREM: for every a ≥ ½ the inequality τ_a(t) > 0 holds at all real t, together with the equivalent passivity properties (the proof uses only that ζ has no zero with real part ≥ 1). EQUIVALENT TO RH: τ_a(t) > 0 for every a > 0 and every t. THEOREM: where all zeros up to height T are on the line, τ_a > 0 follows for |t| ≤ T − ½ and every a > 0; every window this page can draw lies far below the verified height, so a picture of a finite window shows nothing about the Riemann hypothesis in either direction.';
export const SECTIONS=Object.freeze({
  rails:{mode:'ladder',tab:'Rails and bridge',eyebrow:'COMPLETED FUNCTION · TWO RAILS',title:'Two rails and the delay between them.',
    lede:'The completed function ξ on the line Re s = ½ + a is split into its real part A_a (even rail) and imaginary part B_a (odd rail). Their ratio is m_a = B_a/A_a = tan φ_a, and the time delay is τ_a = 2φ_a′, twice the rate at which the phase turns with height. The bridge thickness a sets how far the line is from the critical line.',
    heads:[['RATIO m_a = B_a / A_a','= tan φ_a'],['PHASE φ_a / π','CONTINUOUS IN t'],['PRIME SERIES','EXACT − TRUNCATED'],['PASSIVITY INDICATOR','min τ_a ON THE WINDOW']],
    captions:['IDENTITY. The ratio has a pole at each zero of the even rail and a zero at each zero of the odd rail; where the two sets interlace it rises through every real value between consecutive poles.',
      'IDENTITY. φ_a = arg ξ(½ + a + it), followed continuously along t. Each crossing of an integer is a zero of the odd rail, each half-integer a zero of the even rail.',
      'IDENTITY for a > ½: τ_a = smooth part − 2 Σ Λ(n) n^(−½−a) cos(t log n). The plot is the exact value minus the sum cut at the chosen number of terms. For a ≤ ½ the series does not converge and the difference does not shrink.',
      'The inequality drawn is τ_a(t) > 0, property (T). The curve is its minimum over the sampled window for each a. Right of the dashed line it is a THEOREM at all heights; left of it the statement for all heights and all a > 0 is EQUIVALENT TO RH.'],
    note:RAILS_NOTE,aria:'The two rails of ξ on the line one half plus a, and the time delay with its prime-series approximation',draw:drawRails},
  temperature:{mode:'ladder',tab:'Limiting temperature',eyebrow:'PRIME GAS · VARIANCE OF THE DELAY',title:'How the delay fluctuates as the line approaches ½.',
    lede:'The fluctuating part of the time delay has mean square 4V(a) at infinite height, with V(a) = ½ Σ Λ(n)² n^(−1−2a). The series converges for every a > 0 and grows like 1/(8a²) as a → 0. At a finite height that growth is rounded. The thickness a = ½ is the inverse temperature β = 1 at which the gas of primes, whose states are the integers n with energy log n, reaches infinite energy: no finite energy takes the gas to that temperature.',
    heads:[['8a² V(a)','TENDS TO 1'],['FLUCTUATING PART','2 Re ζ′/ζ IN THE WINDOW'],['ENERGY OF THE PRIME GAS','U(β) = −ζ′/ζ(β)'],['','']],
    captions:['IDENTITY. V(a) = 1/(8a²) − 0.786575535662477614 + 6.02404097319776 a + … for |a| < ¼. The curve is the tabulated series; the dotted line is the three-term expansion.',
      'NUMERICAL OBSERVATION. The fluctuating part of τ_a on the chosen window at the chosen a, with its sample standard deviation.',
      'THEOREM. The mean energy of the prime gas diverges as β → 1⁺ like 1/(β − 1) − γ. Its abscissa β = 1 is the line Re s = 1, that is a = ½, where the prime series of the delay stops converging absolutely.',''],
    note:'THEOREM for a > ½ (mean value of an absolutely convergent Dirichlet series): the variance of τ_a over all heights is 4V(a). For 0 < a ≤ ½ the same limit is a NUMERICAL OBSERVATION in the windows computed. NUMERICAL OBSERVATION: at height t the growth is rounded; for a ≪ 1/L the measured variance follows L/a − L², the leading terms of (1 − e^(−2aL))/(2a²), with L = log(t/2π). ANALOGY: calling a < ½ a temperature is a label, since ζ(β) < 0 for 0 < β < 1. The rounding and the series are the same for functions with zeros off the line; nothing here bears on the Riemann hypothesis.',
    aria:'Variance of the time delay against the bridge thickness, with the infinite-height series, its expansion, the rounded form and measured points',draw:drawTemperature,hideFourth:true},
  vacuum:{mode:'ladder',tab:'Vacuum energy',eyebrow:'PERFECT LADDER · ζ(−1)',title:'A ladder, its vacuum sum and its jitter.',
    lede:'For rungs at 1, 2, 3, … the regularised sum of the positions is ζ(−1) = −1/12, and the mean square of the counting sawtooth is ζ(2)/(2π²) = +1/12. The two cancel. With the primes switched on, the rungs are those of a rail, displaced from the integers, and both numbers shift by the same prime term v_a.',
    heads:[['REGULARISED SUM','Σ n e^(−εn) − 1/ε²'],['THE BALANCE','FROM THE RUNGS · JITTER'],['PRIME TERM v_a','AGAINST THICKNESS'],['ONE-POINT ENERGY','FALSE AS A BALANCE']],
    captions:['IDENTITY. The cutoff sum minus its divergent part tends to ζ(−1) = −1/12 as ε → 0.',
      'IDENTITY for any point set: the energy seen from a rung, averaged over the rungs, equals minus the jitter energy. For a rail both carry the prime term: ζ(−1) − v_a and 1/12 + v_a.',
      'v_a = (1/2π²) Σ Λ(n)²/(n^(1+2a) log² n), the mean square of (1/π) arg ζ(½ + a + it). THEOREM as a mean over heights for a > ½; its use for the rungs is a NUMERICAL OBSERVATION.',
      'FALSE: the energy measured from the origin does not equal −½B₂(α) − v_a. Red: values computed in the source paper for the two rails at a = 2 and a = 3. Grey: what the one-point balance would require.'],
    note:'Result as it stands in the source: the one-point balance (energy measured from the origin) is FALSE; the two-point statement (energy measured from a rung and averaged over the rungs) holds and equals ζ(−1) − v_a. That two-point identity holds for any point set of unit density with bounded counting fluctuation, including sets built from functions with zeros off the line, so it carries no information on zeros. The primes enter only through the size of v_a.',
    aria:'A unit ladder, its displaced rungs, and the counting fluctuation',draw:drawVacuum},
  statistics:{mode:'nucleus',tab:'Level statistics',eyebrow:'MEASURED RESONANCES · ZEROS OF ζ',title:'Spacings, ratios, rigidity and widths.',
    lede:'The s-wave neutron resonances of an even-even target form one level sequence. Its spacing statistics are set beside those of the first 1000 zeros of ζ and beside three reference laws: Poisson (no repulsion), GOE and GUE (the Wigner surmises). Every goodness-of-fit number in the table is computed from the data shown.',
    heads:[['CUMULATIVE SPACINGS','SAMPLES AND LAWS'],['SPACING RATIO r','min / max OF NEIGHBOURS'],['NUMBER VARIANCE Σ²(L)','LEVELS IN A WINDOW'],['REDUCED WIDTHS','PORTER–THOMAS']],
    captions:['Green: the resonances. Pink: the zeros, unfolded with the smooth counting function. Dashed: GOE and GUE. Dotted: Poisson.',
      'r needs no unfolding. Histograms of r with the densities of the three laws; ticks at the top mark the reference means, ticks at the bottom the sample means.',
      'Variance of the number of unfolded levels in a window of length L. A rigid spectrum stays low; Poisson grows as L. The low zeros fall below GUE at large L, a known effect of the primes.',
      'Reduced neutron widths Γn⁰ = Γn/√E divided by their mean, against the χ² law with one degree of freedom. Pink: reduced widths of the two-rail system at a = ½, which are nearly equal and do not follow that law.'],
    note:'NUMERICAL OBSERVATION, with limits. About a hundred levels cannot separate GOE from GUE by the spacing distribution; the ratio and the number variance separate them only weakly. The resonance files are evaluations: for ²³⁸U and ²³²Th the evaluators state that weak levels were added or assigned so that the set conforms to the Wigner and Porter–Thomas laws, so agreement with those laws is partly built in. Established results from the literature: long nuclear sequences follow GOE statistics, and high zeros of ζ follow GUE statistics at short range. Nuclei and zeros are therefore in different classes; the shared feature is level repulsion. None of this is evidence about the Riemann hypothesis, and the nucleus is not a model of ζ.',
    aria:'Nearest-neighbour spacing histograms of neutron resonances and of zeros of zeta with three reference laws',draw:drawStatistics},
  trend:{mode:'nucleus',tab:'Trend with mass',eyebrow:'LIQUID DROP · HEAVY NUCLEI',title:'From thorium to oganesson: where the drop gives way.',
    lede:'Fissility x = E꜀/2Eₛ grows in proportion to Z²/A. The quadrupole stiffness of the charged drop, C₂ = Eₛ(1 − x)/π, falls to zero at Z²/A = 50.1. Measured fission barriers of the actinides stay near 5 to 6.5 MeV while the liquid-drop barrier falls; the difference is the shell correction, which the drop model lacks.',
    heads:[['FISSION BARRIERS','MeV'],['HALF-LIFE','LOG SCALE'],['SPONTANEOUS FISSION','BRANCH, LOG SCALE'],['QUADRUPOLE DEFORMATION β₂','FROM B(E2)']],
    captions:['Cyan and amber: empirical inner and outer barriers (RIPL-3). Grey: barrier of the charged liquid drop, a model number quoted for five of the nuclides.',
      'Evaluated half-lives (ENSDF). They span more than twenty orders of magnitude over this range of Z²/A.',
      'Evaluated spontaneous-fission branch. For ²⁹⁴Og the table gives 20 % without stating whether it is a limit.',
      'Deformation from the measured B(E2; 0⁺ → 2⁺) in two evaluations. None exists for the odd-A ²³⁵U or for ²⁹⁴Og.'],
    note:'Liquid-drop numbers are model values; measured values are quoted with their evaluation and are not fitted. Infinite mass (stated from the source paper, established nuclear physics): a charged nucleus cannot be taken to infinite mass, since the liquid-drop barrier is gone near Z ≈ 120 to 140 and with Z/A fixed the binding energy turns negative above A ≈ 1340. The bulk of a heavy nucleus already is a saturated Fermi liquid (density 0.16 fm⁻³, about 16 MeV per nucleon); the object that realises the limit is a neutron star, bound by gravity, which ends at about 2.0 to 2.3 solar masses. ANALOGY only: the two-rail system has a limit of the same spectral kind, overlapping resonances, reached logarithmically in height; it has no bulk medium and no counterpart of the Coulomb–surface competition.',
    aria:'Fissility and quadrupole stiffness against Z squared over A for nine heavy nuclides',draw:drawTrend},
  blackHole:{mode:'blackHole',tab:'Black hole horizon',eyebrow:'MODEL ANALOGY · SCHWARZSCHILD HORIZON',title:'What a horizon supplies, and what is put in by hand.',
    lede:'Near a Schwarzschild horizon time translation acts as a dilation. On even functions the dilation has the scattering factor Γ_R(½ + iE)/Γ_R(½ − iE), the gamma factor of ζ. That factor is all the geometry supplies. The two-rail function S_a, whose resonances sit at the zeros shifted by −ia, is inserted by hand. This view draws both, with the Schwarzschild numbers for a chosen mass. It is a model analogy and establishes nothing about black holes or about the Riemann hypothesis.',
    heads:[['COUNTING LAWS','ZEROS · NUCLEUS · HORIZON'],['REDUCED WIDTHS','TWO-RAIL SYSTEM'],['BUCHDAHL BOUND','UNIFORM-DENSITY STAR'],['LOCAL TEMPERATURE','STATIC OBSERVER']],
    captions:['THEOREM: N(E) ~ (E/2π) log E for the zeros, a law with logarithmic exponent tending to 1. A nucleus has exponent about 10 to 12 at the neutron separation energy (fitted model); a horizon has 2S if e^S counts states (an assumption). NO COUNTERPART: no many-body system considered has the law E log E.',
      'NUMERICAL OBSERVATION. Reduced widths w_n = 1/φ_a′(t_n) at the zeros t_n of the even rail, divided by their mean. They are nearly equal; a compound nucleus follows the Porter–Thomas law with relative variance 2.',
      'THEOREM (Buchdahl): a static fluid sphere with isotropic pressure and density not increasing outwards has R > (9/8) r_s. For uniform density the central pressure has a simple pole there. Tested as a counterpart of the pole of ζ at σ = 1 and refuted.',
      'THEOREM: a static observer at proper distance ℓ from the horizon sees T_loc = ħc/(2πk_B ℓ), whatever the mass; far away it falls to the Hawking temperature. Freely falling matter sees neither. Marks: temperatures of nuclear and QCD matter, for scale only.'],
    note:'Labels. IDENTITY: the horizon S-matrix on even functions is the gamma factor, which equals ζ(½ − iE)/ζ(½ + iE) identically; in that ratio every nontrivial zero cancels, so it carries no information on the zeros. IDENTITY: the poles of S_a are at g − i(a ∓ b) for a zero pair of displacement ± b. EQUIVALENT TO RH: all resonances of S_a have the same width 2a for every a > 0. THEOREM: for a ≥ ½ the function S_a has no pole in the upper half-plane. ANALOGY: “no growing mode” is the same kind of statement as mode stability of Schwarzschild, where it follows from a positive conserved energy that is proved; for ζ the positive form is the thing to be proved. Not supplied by the geometry: any wave equation whose Jost function is ζ or ξ. No black-hole quantity is computed independently and then found to equal a zero.',
    aria:'Time delay of the two-rail function and of the gamma factor, above the complex energy plane with the resonance poles',draw:drawBlackHole},
});
/** Sections of each workbench, in tab order. The first two are drawn by models-panel.js itself. */
export const MODE_SECTIONS=Object.freeze({
  ladder:[['ladder','Finite ladders'],['rails','Rails and bridge'],['temperature','Limiting temperature'],['vacuum','Vacuum energy']],
  nucleus:[['drop','Liquid drop'],['statistics','Level statistics'],['trend','Trend with mass']],
  blackHole:[['blackHole','Black hole horizon']],
});
