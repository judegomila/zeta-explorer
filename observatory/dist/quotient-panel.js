import { evaluatePolar, ZERO_HEIGHTS } from './math.js';
import { domainFor, withinDomain } from './domain.js';
import { torusInverse } from './elliptic.js';
import { isQuotientGeometry, quotientInvolution } from './quotient.js';

const colors={mint:'#d4f1aa',cyan:'#80dfe9',orange:'#f4b875',purple:'#c3a4ed',muted:'#8198af',line:'#34485c'};
const fmt=n=>n===Infinity?'∞':n===-Infinity?'−∞':!Number.isFinite(n)?'—':n===0?'0':Math.abs(n)>=1e4||Math.abs(n)<.001?n.toExponential(2):Number(n.toPrecision(5)).toString();
const complex=(sigma,t)=>`${fmt(sigma)} ${t<0?'−':'+'} ${fmt(Math.abs(t))}i`;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wrapAngle=a=>Math.atan2(Math.sin(a),Math.cos(a));
const polarUsable=p=>p?.valid&&p.reliable!==false&&(Number.isFinite(p.logAbs)||p.logAbs===-Infinity)&&(p.logAbs===-Infinity||Number.isFinite(p.arg));
const isActive=state=>isQuotientGeometry(state?.geometry)&&(!state.dynamicsMode||state.dynamicsMode==='off')&&(!state.researchMode||state.researchMode==='off');

/** Relative conjugacy error in a shared logarithmic scale. Raw re/im can
 * underflow to zero; they must never be used to manufacture a zero or phase.
 * A phase is undefined at an evaluated zero, even when the pair agrees.
 */
export function comparePolarConjugates(source,partner){
 if(!polarUsable(source)||!polarUsable(partner))return {valid:false,status:'unresolved',residual:null,logModulusGap:null,phaseError:null};
 const sourceZero=source.logAbs===-Infinity,partnerZero=partner.logAbs===-Infinity;
 if(sourceZero||partnerZero)return {
  valid:true,status:sourceZero&&partnerZero?'both-zero':'one-zero',sourceZero,partnerZero,
  residual:sourceZero&&partnerZero?0:1,logModulusGap:sourceZero&&partnerZero?0:Infinity,phaseError:null,
 };
 const scale=Math.max(source.logAbs,partner.logAbs),a=Math.exp(source.logAbs-scale),b=Math.exp(partner.logAbs-scale);
 const phaseError=Math.abs(wrapAngle(source.arg+partner.arg));
 // This expression avoids subtracting almost equal Cartesian components.
 const residual=Math.hypot(a-b,2*Math.sqrt(a*b)*Math.sin(phaseError/2));
 return {valid:true,status:'nonzero',sourceZero:false,partnerZero:false,residual,logModulusGap:Math.abs(source.logAbs-partner.logAbs),phaseError};
}

/** A small raw magnitude alone says nothing about phase resolution. Compare
 * F with its analytic derivative instead: |F/F′| estimates a local spectral
 * distance. At coordinate-roundoff scale, the displayed phase is unreliable.
 * This is a conditioning heuristic, never a declaration that F is zero.
 */
export function quotientPhaseResolution(sample,point){
 if(!polarUsable(sample))return 'unresolved';
 if(sample.logAbs===-Infinity)return 'zero';
 const derivative=sample.derivativeLogAbs;
 const scale=8*Number.EPSILON*Math.max(1,Math.hypot(point.sigma,point.t));
 return Number.isFinite(derivative)&&sample.logAbs-derivative<=Math.log(scale)?'near-zero':'resolved';
}

/** Two actual field evaluations plus one inverse of the selected spectral
 * point. This is a pointwise floating-point consistency diagnostic, not an
 * independent verification of symmetries already used by the evaluator.
 */
export function quotientDiagnostics(state,probe,{evaluate=evaluatePolar,inverse=torusInverse}={}){
 const kind=state.function==='heat'?'heat':'xi',tau=state.tau??0;
 const p={sigma:probe?.sigma,t:probe?.t},partner={sigma:1-p.sigma,t:p.t};
 const domain=domainFor({...state,function:kind,tau});
 const inDomain=q=>withinDomain(q.sigma,q.t,domain)&&(kind!=='heat'||Number.isFinite(tau)&&Math.abs(tau)<=domain.heatTauMax);
 const sourceValue=inDomain(p)?evaluate(p.sigma,p.t,kind,tau,true):null;
 const partnerValue=inDomain(partner)?evaluate(partner.sigma,partner.t,kind,tau,true):null;
 const comparison=comparePolarConjugates(sourceValue,partnerValue);
 const sourcePhase=quotientPhaseResolution(sourceValue,p),partnerPhase=quotientPhaseResolution(partnerValue,partner);
 const roots=Number.isFinite(p.sigma)&&Number.isFinite(p.t)?inverse(p.sigma,p.t,{r:state.torusR??1.6,scale:state.chartScale??24}):[];
 const lift=roots[0]??null,pairedLift=lift?quotientInvolution(lift.u,lift.v,state.geometry):null;
 const dl=sourceValue?.derivativeLogAbs;
 const logDensity=Number.isFinite(dl)||dl===-Infinity?2*dl/Math.LN10:null;
 return {kind,tau,source:p,partner,sourceValue,partnerValue,comparison,sourcePhase,partnerPhase,lift,pairedLift,logDensity,domain};
}

function svgText(x,y,text,{fill=colors.muted,anchor='middle',size=9}={}){
 return `<text x="${x}" y="${y}" fill="${fill}" text-anchor="${anchor}" font-size="${size}">${escape(text)}</text>`;
}
function dot(x,y,color,label,{hollow=false,dx=8,dy=-8,large=false}={}){
 return `<circle cx="${x}" cy="${y}" r="${large?4.5:3.5}" fill="${hollow?'#101b2a':color}" stroke="${color}" stroke-width="${hollow?1.8:1}"/>${label?svgText(x+dx,y+dy,label,{fill:color,anchor:dx<0?'end':'start'}):''}`;
}
function arrow(x1,y1,x2,y2,color){
 const a=Math.atan2(y2-y1,x2-x1),n=5;
 return `<path d="M${x1} ${y1}L${x2} ${y2}M${x2-n*Math.cos(a-.5)} ${y2-n*Math.sin(a-.5)}L${x2} ${y2}L${x2-n*Math.cos(a+.5)} ${y2-n*Math.sin(a+.5)}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
}

/** Exact coordinates, independent of the decorative R³ immersion. The
 * dashed segment denotes identification; it is not a vortex trajectory.
 */
function coverDiagram(state,snapshot,message){
 const klein=state.geometry==='klein',x=u=>42+396*u,y=v=>194-160*v;
 let svg=`<svg viewBox="0 0 480 242" role="img" aria-label="${klein?'Orientation cover of the Klein bottle':'Reflection double of the annulus'}, with paired infinity and anti-bridge points" xmlns="http://www.w3.org/2000/svg"><g font-family="ui-monospace, monospace"><rect x="42" y="34" width="396" height="160" rx="3" fill="#0c1624" stroke="${colors.line}"/><rect x="42" y="74" width="396" height="80" fill="#203629" fill-opacity=".65"/><path d="M42 74H438M42 154H438" stroke="${colors.mint}" stroke-opacity=".72"/><path d="M240 34V194" stroke="${colors.line}" stroke-dasharray="3 5"/>`;
 svg+=svgText(240,20,'TORUS COORDINATES · ONE PERIOD RECTANGLE',{size:8});
 svg+=svgText(29,37,'1',{anchor:'end',size:8})+svgText(29,77,'¾',{anchor:'end',size:9})+svgText(29,157,'¼',{anchor:'end',size:9})+svgText(29,197,'0',{anchor:'end',size:8})+svgText(14,117,'v',{size:10});
 svg+=svgText(42,209,'0',{size:8})+svgText(240,209,'½',{size:9})+svgText(438,209,'1',{size:8})+svgText(454,209,'u',{size:10});
 svg+=svgText(240,112,'SELECTED QUOTIENT BAND',{fill:'#a7c69d',size:8})+svgText(240,126,'¼ ≤ v ≤ ¾',{fill:'#7e9a7e',size:8});
 svg+=dot(x(0),y(.25),colors.orange,'p+ · ∞',{hollow:true,dy:17})+dot(x(.5),y(.75),colors.orange,'p− · ∞',{hollow:true,dy:-10});
 svg+=dot(x(.5),y(.25),colors.purple,'q− · ½',{dy:17})+dot(x(0),y(.75),colors.purple,'q+ · ½',{dy:-10});
 // u=0 and u=1 are already identified on the torus; repeat endpoint marks.
 svg+=dot(x(1),y(.25),colors.orange,'',{hollow:true})+dot(x(1),y(.75),colors.purple,'');
 if(klein){svg+=arrow(305,74,350,74,colors.mint)+arrow(350,154,305,154,colors.mint);}
 else{svg+=svgText(362,66,'real boundary',{fill:colors.mint,size:8})+svgText(362,173,'real boundary',{fill:colors.mint,size:8});}
 if(snapshot?.lift&&snapshot.pairedLift&&!message){
  const a=snapshot.lift,b=snapshot.pairedLift,xa=x(a.u),ya=y(a.v),xb=x(b.u),yb=y(b.v);
  const separation=Math.hypot(xa-xb,ya-yb);
  if(separation>1){
   svg+=`<path d="M${xa} ${ya}Q${(xa+xb)/2+20} ${(ya+yb)/2-18} ${xb} ${yb}" fill="none" stroke="${colors.cyan}" stroke-opacity=".65" stroke-dasharray="3 4"/>`;
   svg+=dot(xa,ya,colors.mint,'P',{large:true,dx:xa>410?-8:8,dy:ya<50?16:-8});
   svg+=dot(xb,yb,colors.cyan,klein?'A(P)':'R(P)',{hollow:true,large:true,dx:xb>385?-8:8,dy:yb<50?16:-8});
  }else{
   svg+=`<circle cx="${xa}" cy="${ya}" r="7" fill="none" stroke="${colors.cyan}"/>`+dot(xa,ya,colors.mint,'P = R(P)',{large:true,dx:xa>350?-10:10,dy:ya<50?16:-10});
  }
 }
 svg+=svgText(240,232,klein?'Twist: (u, ¼) ∼ (½ − u, ¾)':'Two separate boundaries; periodic in u',{fill:klein?colors.cyan:colors.mint,size:9});
 return svg+'</g></svg>';
}

function phaseDiagram(snapshot,message){
 const pairs=[{x:130,p:snapshot?.sourceValue,resolution:snapshot?.sourcePhase,label:'F(s)',color:colors.mint},{x:350,p:snapshot?.partnerValue,resolution:snapshot?.partnerPhase,label:'F(1 − s̄)',color:colors.cyan}];
 let svg='<svg viewBox="0 0 480 242" role="img" aria-label="Unit phase directions of the selected field and its reflected partner" xmlns="http://www.w3.org/2000/svg"><g font-family="ui-monospace, monospace">';
 for(const {x,p,resolution,label,color} of pairs){
  svg+=svgText(x,28,label,{fill:color,size:13});
  svg+=`<circle cx="${x}" cy="113" r="57" fill="#10202b" stroke="#3b5365"/><path d="M${x-66} 113H${x+66}M${x} 47V179" stroke="#2b4153"/>`;
  svg+=svgText(x+65,127,'Re',{size:8})+svgText(x+11,51,'Im',{size:8,anchor:'start'});
  if(polarUsable(p)&&!message){
   if(p.logAbs===-Infinity){svg+=dot(x,113,color,'')+svgText(x,201,'zero · phase undefined',{fill:color,size:8});}
   else if(resolution==='near-zero'){
    svg+=svgText(x,101,'unresolved',{fill:colors.orange,size:8})+svgText(x,201,'near zero · phase unresolved',{fill:colors.orange,size:8});
   }else{
    const xx=x+57*Math.cos(p.arg),yy=113-57*Math.sin(p.arg);
    svg+=arrow(x,113,xx,yy,color)+dot(xx,yy,color,'');
    svg+=svgText(x,201,`φ = ${fmt(p.arg/Math.PI)}π`,{fill:color,size:9});
   }
   svg+=svgText(x,219,`log |F| = ${fmt(p.logAbs)}`,{size:8});
  }else svg+=svgText(x,201,message?'pause / inspect':'outside coverage',{size:8});
 }
 svg+=svgText(240,98,'conj',{fill:colors.muted,size:8})+arrow(206,113,274,113,colors.muted)+svgText(240,135,'φ → −φ',{fill:colors.cyan,size:8});
 return svg+'</g></svg>';
}

/** Mounts its own compact inspector. update() evaluates only a new paused
 * probe. hold()/redraw() never perform analytic work or retain stale values.
 */
export class QuotientPanel {
 constructor(container,{onProbe=()=>{},onAction=()=>{}}={}){
  if(!container)throw new Error('QuotientPanel requires a mount element.');
  this.container=container;this.onProbe=onProbe;this.onAction=onAction;this.state=null;this.probe=null;this.snapshot=null;this.message='';this.key=null;
  container.classList.add('quotient-workbench');container.hidden=true;
  container.innerHTML=`
   <header class="quotient-heading"><div><span class="quotient-eyebrow">EXACT QUOTIENT · LINKED INSPECTOR</span><h3 data-quotient="title"></h3><p data-quotient="subtitle"></p></div><span class="quotient-pill" data-quotient="tag"></span></header>
   <div class="quotient-grid">
    <article><div class="quotient-mini-heading"><span data-quotient="coverTitle"></span><span>PAIRED POINTS</span></div><div class="quotient-diagram" data-quotient="cover"></div><p class="quotient-caption" data-quotient="coverCaption"></p></article>
    <article><div class="quotient-mini-heading"><span>CONJUGATING FIELD</span><span data-quotient="fieldLabel"></span></div><div class="quotient-diagram" data-quotient="phase"></div><p class="quotient-caption">Each circle shows a unit phase, with amplitude retained separately in log scale. A reversing chart conjugates the phase; zeros have no phase direction.</p></article>
   </div>
   <div class="quotient-status" data-quotient="status" role="status"></div>
   <div class="quotient-metrics" aria-label="Pointwise numerical diagnostics">
    <div><span>RELATIVE CONJUGACY ERROR</span><strong data-quotient="residual">—</strong></div>
    <div><span>ABSOLUTE Δ LOG MODULUS</span><strong data-quotient="modulus">—</strong></div>
    <div><span>WRAPPED PHASE SUM</span><strong data-quotient="phaseError">—</strong></div>
    <div><span>LOCAL LOG₁₀ |F′(s)|²</span><strong data-quotient="density">—</strong></div>
   </div>
   <div class="quotient-coordinates"><span>LINKED SPECTRAL POINTS</span><strong data-quotient="coordinates"></strong><small data-quotient="liftCoordinates"></small></div>
   <div class="quotient-energy">
    <div><span>LOCAL DIRICHLET IDENTITY</span><strong>|∇ Re F|² = |∇ Im F|² = |F′(s)|²</strong><p>In a spectral conformal chart, Cauchy–Riemann gives equal real and imaginary energy densities.</p></div>
    <div><span>MATCHED TRUNCATED REGIONS</span><strong>E<sub>cover</sub> = 2 E<sub>quotient</sub></strong><p>Use the induced conformal metric and matching cutoffs around the essential puncture. No finite whole-surface energy is assumed.</p></div>
    <div><span data-quotient="boundaryTitle"></span><strong data-quotient="boundaryFormula"></strong><p data-quotient="boundaryCaption"></p></div>
   </div>
   <div class="quotient-actions"><span>FOLLOW THE GEOMETRY</span><button type="button" data-quotient-action="antiBridge">Anti-bridge · ½</button><button type="button" data-quotient-action="zero">First ξ zero</button><button type="button" data-quotient-action="companion"></button><button type="button" data-quotient-action="bridgeEnergy">Boundary energy</button><button type="button" data-quotient-action="gramSchur">Gram &amp; Schur</button></div>
   <details class="quotient-details"><summary>What the identities establish</summary><p data-quotient="topologyNote"></p><p>The equality above concerns the real and imaginary Dirichlet energies of a holomorphic field on matched regular regions. They are different objects from the nonlocal boundary convolution energies E₊ and E₋ in Boundary energy. This quotient does not supply the missing sign of E₊ − E₋ or a global barrier preventing zeros from leaving the critical line.</p><p>Readouts are floating-point consistency checks, with no interval certificate. The ξ evaluator itself uses the functional equation; a tiny conjugacy residual is not an independent proof of that symmetry. Phase is masked when |F/F′| ≤ 8ε max(1, |s|), where ε is machine precision: this flags conditioning at coordinate-roundoff scale and does not certify a zero. The raw sample remains unchanged.</p><a href="methods.html#klein-annulus">Read the quotient construction and energy scope ↗</a></details>`;
  this.el=Object.fromEntries([...container.querySelectorAll('[data-quotient]')].map(el=>[el.dataset.quotient,el]));
  this.actions=Object.fromEntries([...container.querySelectorAll('[data-quotient-action]')].map(el=>[el.dataset.quotientAction,el]));
  this.actions.antiBridge.onclick=()=>this.onProbe({sigma:.5,t:0});
  this.actions.zero.onclick=()=>this.onProbe({sigma:.5,t:ZERO_HEIGHTS[0]});
  this.actions.companion.onclick=()=>this.onAction({type:'open-view',view:this.state?.geometry==='klein'?'annulus':'klein'});
  this.actions.bridgeEnergy.onclick=()=>this.onAction({type:'open-research',view:'bridgeEnergy'});
  this.actions.gramSchur.onclick=()=>this.onAction({type:'open-research',view:'gramSchur'});
 }
 update(state,probe){
  this.state={...state};this.probe={...probe};this.container.hidden=!isActive(state);
  if(this.container.hidden){this.snapshot=null;this.key=null;return;}
  if(state.playing){this.hold(state,probe,'Buffered playback · pause to inspect a quotient point.');return;}
  const key=JSON.stringify([state.geometry,state.function,state.tau,state.chartScale,state.torusR,state.extent,probe?.sigma,probe?.t]);
  this.message='';
  if(this.key!==key||!this.snapshot){this.snapshot=quotientDiagnostics(state,probe);this.key=key;}
  this.redraw();
 }
 hold(state,probe,message='Pause and inspect to update the quotient state.'){
  this.state={...state};this.probe={...probe};this.snapshot=null;this.key=null;this.message=message;
  this.container.hidden=!isActive(state);if(!this.container.hidden)this.redraw();
 }
 redraw(){
  if(!isActive(this.state))return;
  const klein=this.state.geometry==='klein',s=this.snapshot,c=s?.comparison,held=!!this.message;
  this.el.title.textContent=klein?'A Klein surface, with a conjugating seam':'An annulus, with two real boundaries';
  this.el.subtitle.textContent=klein?'The free involution joins p+ with p− and q+ with q−. Modulus and zeros descend; local complex phase changes by conjugation.':'The reflection quotient keeps two critical ovals as separate boundaries. Its torus double recovers both sides of the completed field.';
  this.el.tag.textContent=klein?'ONE PUNCTURE\nTWISTED PHASE':'TWO BOUNDARIES\nREAL TRACES';
  this.el.coverTitle.textContent=klein?'ORIENTATION COVER · TORUS':'REFLECTION DOUBLE · TORUS';
  this.el.coverCaption.textContent=klein?'Hollow orange points are the paired infinity punctures; purple points are the anti-bridge. The dashed link identifies P and A(P), and is not a dynamical trajectory.':'Reflection pairs the two sides of each boundary, while p+ and p− remain distinct boundary punctures. The anti-bridge has one marked point on each boundary.';
  this.el.fieldLabel.textContent=(s?.kind??this.state.function)==='heat'?`Fτ · τ = ${fmt(this.state.tau??0)}`:'COMPLETED ξ';
  this.el.cover.innerHTML=coverDiagram(this.state,s,this.message);
  this.el.phase.innerHTML=phaseDiagram(s,this.message);
  this.el.residual.textContent=!held&&c?.valid?fmt(c.residual):'—';
  this.el.modulus.textContent=!held&&c?.valid?fmt(c.logModulusGap):'—';
  const nearZero=s?.sourcePhase==='near-zero'||s?.partnerPhase==='near-zero';
  this.el.phaseError.textContent=!held&&c?.valid?(c.phaseError===null?'undefined at zero':nearZero?'unresolved near zero':`${fmt(c.phaseError)} rad`):'—';
  this.el.density.textContent=!held&&s?.logDensity!==null&&s?.logDensity!==undefined?fmt(s.logDensity):'—';
  this.el.coordinates.textContent=held?'Pause / Inspect to evaluate the linked pair.':s?`s = ${complex(s.source.sigma,s.source.t)}  ↔  1 − s̄ = ${complex(s.partner.sigma,s.partner.t)}`:'—';
  this.el.liftCoordinates.textContent=!held&&s?.lift?`P = (${fmt(s.lift.u)}, ${fmt(s.lift.v)}) · ${klein?'A':'R'}(P) = (${fmt(s.pairedLift.u)}, ${fmt(s.pairedLift.v)}) in torus (u, v) coordinates`:'The marked punctures have no finite spectral value or phase.';
  let status=this.message;
  if(!status&&!c?.valid)status='The selected pair is outside numerical coverage or unresolved. The geometric identifications and local energy identities still apply on their regular domains.';
  if(!status&&c.status==='both-zero')status='Both samples evaluate to zero. Their moduli agree; phase and logarithmic derivative are undefined at a zero.';
  if(!status&&c.status==='one-zero')status='Only one sample evaluates to zero at this precision. The paired phase is unresolved; inspect nearby points or use a higher precision calculation.';
  if(!status&&nearZero)status='Near a zero at working precision. Phase directions and the relative conjugacy error are ill conditioned; log amplitudes and the local derivative density remain visible.';
  if(!status)status=`${s.kind==='heat'?'Heat field':'Completed ξ'} · two finite point evaluations · ${c.residual<1e-8?'conjugation agrees at displayed precision':'a conjugacy discrepancy is visible; this sample is unresolved'}${this.state.function==='zeta'?' · symmetry diagnostics use ξ, not raw ζ':''}.`;
  this.el.status.textContent=status;
  this.el.boundaryTitle.textContent=klein?'TWISTED CHART TRANSITION':'SCHWARZ REFLECTION BOUNDARY';
  this.el.boundaryFormula.textContent=klein?'F(½ − u, ¾) = conj F(u, ¼)':'Im F = 0 · ∂ₙ Re F = 0';
  this.el.boundaryCaption.textContent=klein?'The seam sends φ to −φ. The phase current is orientation twisted; its sign change does not annihilate the zeros.':'On each regular boundary arc, the imaginary part is Dirichlet and the real part is Neumann. Infinity remains excluded.';
  this.el.topologyNote.textContent=klein?'The Klein bottle is nonorientable, so it is a Klein surface rather than a Riemann surface. The field uses holomorphic and antiholomorphic local charts; it is not an ordinary global holomorphic complex function on the quotient. The image of the critical ovals is a two-sided nonseparating loop. Cutting that loop gives the annulus.':'The annulus is the quotient by an involution with fixed ovals. It is also obtained by cutting the Klein quotient along its critical loop. Keeping its two boundary components separate retains both reflection conditions; it does not fuse the two infinity punctures.';
  this.actions.companion.textContent=klein?'Cut to annulus':'Glue Klein seam';
  // This ordinate is a reference zero of ξ, not a zero of Fτ for τ ≠ 0.
  this.actions.zero.hidden=this.state.function==='heat'&&(this.state.tau??0)!==0;
 }
 dispose(){
  for(const button of Object.values(this.actions))button.onclick=null;
  this.snapshot=null;this.key=null;this.container.hidden=true;
 }
}
