const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const COLORS={green:'#c7e8a1',blue:'#83cddd',orange:'#e9b17b',purple:'#c3a3e0',ink:'#d9e5ed',muted:'#8ea7ba',line:'#3c5365',quiet:'#647f94'};
const BRANCHES=[COLORS.blue,COLORS.orange,COLORS.purple],BRIDGES=[COLORS.blue,COLORS.orange,COLORS.purple];
const finite=Number.isFinite,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=(x,d=6)=>!finite(Number(x))?'unresolved':Number(x)===0?'0':Number(Number(x).toPrecision(d)).toString().replace('e-','e−');
const signed=(x,d=6)=>Number(x)>0?`+${fmt(x,d)}`:fmt(x,d).replace(/^-/,'−');
const fixed=(x,d=10)=>Number(x).toFixed(d).replace(/^-/,'−');
const el=(tag,cls,value)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(value!==undefined)node.textContent=value;return node;};
function svgEl(tag,attributes={},value){const node=document.createElementNS(NS,tag);for(const [key,v]of Object.entries(attributes))node.setAttribute(key,String(v));if(value!==undefined)node.textContent=value;return node;}
function svgText(svg,value,x,y,options={}){const text=svgEl('text',{x,y,fill:options.color||COLORS.muted,'font-size':options.size||11,'font-family':'ui-monospace, SFMono-Regular, Consolas, monospace','text-anchor':options.anchor||'middle',...options.attributes},value);svg.append(text);return text;}
function niceTicks(min,max,target=5){const raw=(max-min)/target,p=10**Math.floor(Math.log10(raw||1)),q=raw/p,step=(q<=1?1:q<=2?2:q<=5?5:10)*p,values=[];for(let v=Math.ceil(min/step)*step;v<=max+step*1e-8&&values.length<30;v+=step)values.push(Math.abs(v)<step*1e-6?0:v);return values;}
let chartId=0;
function chart(mount,{title,description,xMin,xMax,yMin,yMax,xLabel,yLabel,height=400,equal=false,xTicks,yTicks}){
 const width=Math.max(300,mount.clientWidth||900),h=width<600?Math.min(height,365):height,svg=svgEl('svg',{viewBox:`0 0 ${width} ${h}`,role:'img','aria-labelledby':`chart-title-${++chartId} chart-desc-${chartId}`});
 svg.append(svgEl('title',{id:`chart-title-${chartId}`},title),svgEl('desc',{id:`chart-desc-${chartId}`},description));
 let x=width<600?59:76,y=23,w=width-x-25,ph=h-y-58;
 if(equal){const ratio=(xMax-xMin)/(yMax-yMin);if(w/ph>ratio){const next=ph*ratio;x+=(w-next)/2;w=next;}else{const next=w/ratio;y+=(ph-next)/2;ph=next;}}
 const X=v=>x+(v-xMin)/(xMax-xMin)*w,Y=v=>y+ph-(v-yMin)/(yMax-yMin)*ph;
 svg.append(svgEl('rect',{x,y,width:w,height:ph,fill:'#0c1825',rx:2}));
 for(const value of xTicks||niceTicks(xMin,xMax,width<600?4:6)){svg.append(svgEl('line',{x1:X(value),x2:X(value),y1:y,y2:y+ph,stroke:value===0?'#718a9d77':'#54728633','stroke-width':1}));svgText(svg,fmt(value,4),X(value),y+ph+21,{size:width<600?10:11});}
 for(const value of yTicks||niceTicks(yMin,yMax,5)){svg.append(svgEl('line',{x1:x,x2:x+w,y1:Y(value),y2:Y(value),stroke:value===0?'#8da6b777':'#54728633','stroke-width':1}));svgText(svg,fmt(value,4),x-10,Y(value)+4,{anchor:'end',size:width<600?10:11});}
 svg.append(svgEl('rect',{x,y,width:w,height:ph,fill:'none',stroke:'#536c7e','stroke-width':1}));
 svgText(svg,xLabel,x+w/2,h-11,{size:width<600?10:11,color:'#bfd0dc'});svgText(svg,yLabel,15,y+ph/2,{size:width<600?10:11,color:'#bfd0dc',attributes:{transform:`rotate(-90 15 ${y+ph/2})`}});
 const defs=svgEl('defs'),clip=svgEl('clipPath',{id:`clip-${chartId}`});clip.append(svgEl('rect',{x,y,width:w,height:ph}));defs.append(clip);svg.append(defs);const marks=svgEl('g',{'clip-path':`url(#clip-${chartId})`});svg.append(marks);mount.replaceChildren(svg);return {svg,marks,width,height:h,x,y,w,h:ph,X,Y,xMin,xMax,yMin,yMax};
}
function line(c,points,color,width=2,dash){let path='',pen=false;for(const point of points){if(!point||!finite(point[0])||!finite(point[1])){pen=false;continue;}path+=`${pen?'L':'M'}${c.X(point[0]).toFixed(3)},${c.Y(point[1]).toFixed(3)} `;pen=true;}c.marks.append(svgEl('path',{d:path,fill:'none',stroke:color,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round',...(dash?{'stroke-dasharray':dash}:{})}));}
function point(c,x,y,color,r=4,title){if(!finite(x)||!finite(y))return;const marker=svgEl('circle',{cx:c.X(x),cy:c.Y(y),r,fill:color,stroke:'#0c1825','stroke-width':1.5});if(title)marker.append(svgEl('title',{},title));c.marks.append(marker);}
function legend(mount,items){mount.replaceChildren();for(const [label,color]of items){const item=el('span'),swatch=el('i');swatch.style.setProperty('--legend-color',color);item.append(swatch,el('span','',label));mount.append(item);}}
function tableRow(values){const row=el('tr');values.forEach((value,i)=>{const cell=el(i===0?'th':'td','',value);if(i===0)cell.scope='row';row.append(cell);});return row;}
function liveURL(view,state,probe){const url=new URL('../',location.href);url.searchParams.set('view',view);url.searchParams.set('state',JSON.stringify(state));if(probe)url.searchParams.set('probe',JSON.stringify(probe));return url.href;}
function metric(label,value,note){const box=el('div');box.append(el('span','',label),el('strong','',value),el('small','',note));return box;}
function dlRow(label,value){const row=el('div');row.append(el('dt','',label),el('dd','',value));return row;}
function setReady(section){$(`${section}-status`).hidden=true;$(`${section}-content`).hidden=false;}
function setError(section,error){const status=$(`${section}-status`);status.dataset.error='true';status.textContent=`The saved ${section} data could not be loaded. The written comparison remains available; the raw-data link is in the footer.`;console.error(`Saved ${section} comparison:`,error);}

let quartet=null,theta=null,shear=null,quartetIndex=1,selectedX=.05;
const quartetLabels={tau_0:'τ = 0 · one isolated zero',tau_minus_0_1:'τ = −0.1 · two zeros, still on the line',collision:'Collision · one double zero',tau_minus_0_15:'τ = −0.15 · pair off the line',tau_minus_0_25:'τ = −0.25 · separated pair'};
const selectionDefaults={quartet:'tau_minus_0_1',x:.05},allowedOffsets=[-.15,-.05,.05,.15];
function readReportSelection(){
 const params=new URL(location.href).searchParams,checkpoint=params.getAll('quartet'),offset=params.getAll('x'),x=Number(offset[0]);
 return {quartet:checkpoint.length===1&&Object.hasOwn(quartetLabels,checkpoint[0])?checkpoint[0]:selectionDefaults.quartet,x:offset.length===1&&allowedOffsets.includes(x)?x:selectionDefaults.x};
}
let reportSelection=readReportSelection();selectedX=reportSelection.x;
function persistReportSelection(patch){
 reportSelection={...reportSelection,...patch};const url=new URL(location.href);
 for(const [key,value]of Object.entries(reportSelection)){url.searchParams.delete(key);if(value!==selectionDefaults[key])url.searchParams.set(key,String(value));}
 if(url.href!==location.href)window.history.pushState(null,'',url.href);
}
function restoreReportSelection(){
 reportSelection=readReportSelection();selectedX=reportSelection.x;
 if(quartet){quartetIndex=Math.max(0,quartet.frames.findIndex(frame=>frame.id===reportSelection.quartet));$('quartet-select').value=quartetIndex;drawQuartet();}
 if(shear){$('shear-select').value=selectedX;updateShearSelection();}
}
function drawQuartet(){
 if(!quartet)return;const data=quartet,c=data.constants,frame=data.frames[quartetIndex]||data.frames[0],center=data.conventions.center,radius=data.conventions.radius;
 const map=chart($('quartet-plot'),{title:`Exact quartet at τ=${fmt(frame.tau)}`,description:`The fixed disk is centered at ${center.sigma}+${center.t}i with radius ${radius}. It contains ${frame.insideCount} zeros counting multiplicity. ${frame.offCriticalLine?'The displayed positive pair lies off the critical line.':'The displayed positive roots lie on the critical line.'}`,xMin:.02,xMax:.98,yMin:.04,yMax:1.08,xLabel:'Real part σ',yLabel:'Height t',height:440,equal:true,xTicks:[.25,.5,.75],yTicks:[.25,.5,.75,1]});
 line(map,[[.5,map.yMin],[.5,map.yMax]],'#90a99f',1,'4 5');
 map.marks.append(svgEl('circle',{cx:map.X(center.sigma),cy:map.Y(center.t),r:radius*map.w/(map.xMax-map.xMin),fill:'#83cddd0c',stroke:COLORS.blue,'stroke-width':1.5,'stroke-dasharray':'6 5'}));
 point(map,center.sigma,center.t,'#698292',2.6,'Fixed contour center');
 for(const root of frame.roots.filter(root=>root.t>0)){const color=root.multiplicity>1?COLORS.purple:root.inside?COLORS.green:COLORS.orange;point(map,root.sigma,root.t,color,root.multiplicity>1?7:5.5,`${fixed(root.sigma,6)} + ${fixed(root.t,8)}i; multiplicity ${root.multiplicity}`);if(root.multiplicity>1)map.marks.append(svgEl('circle',{cx:map.X(root.sigma),cy:map.Y(root.t),r:11,fill:'none',stroke:color,'stroke-width':1.5}));}
 svgText(map.svg,'σ = ½',map.X(.5)+10,map.y+16,{anchor:'start',size:10,color:'#a5bcac'});
 $('quartet-tau').textContent=`τ = ${fmt(frame.tau,8)}`;$('quartet-count').textContent=frame.collision?'2 · one double zero':String(frame.insideCount);$('quartet-offline').textContent=frame.offCriticalLine?'Yes · symmetric pairs':'None';
 $('quartet-description').textContent=frame.collision?'The pair has collided inside the disk. The root is still on the line and has multiplicity two. Simple-root velocity is undefined at this point.':frame.offCriticalLine?'The positive pair lies off the critical line and remains inside the same disk. The contour count of two survives the departure.':frame.insideCount===1?'At the starting point, this reflection-symmetric disk contains one simple zero. Its reflected partner must be that same zero.':'Both positive-height zeros are already inside the disk. They remain distinct and on the line; the one-zero premise has already failed.';
 $('quartet-caption').textContent=`${frame.exactRoots}. Only the positive-height pair is drawn. Equal axis scales preserve the circular contour.`;
 const target=frame.roots.find(root=>root.t>0);$('quartet-live').href=liveURL('heatZeros',{researchMode:'heat',researchHeatModel:'quartic',researchHeatEnd:frame.tau===0?-.25:frame.tau,researchFrame:frame.tau===0?0:240,researchContourRadius:radius,researchShowContours:true,researchShowVectors:false},{sigma:target.sigma,t:target.t});
 const mount=$('quartet-timeline'),width=Math.max(300,mount.clientWidth||900),height=width<600?170:155,svg=svgEl('svg',{viewBox:`0 0 ${width} ${height}`,role:'img','aria-label':`Contour entry at tau ${c.entryTau} precedes collision at tau ${c.collisionTau}. Off-line roots occur strictly after the collision in backward time.`}),left=width<600?25:48,right=width-25,X=u=>left+(right-left)*u/.25,y=83;
 svg.append(svgEl('line',{x1:left,x2:right,y1:y,y2:y,stroke:'#4b6474','stroke-width':4,'stroke-linecap':'round'}));
 for(const [a,b,color]of [[0,c.entryU,COLORS.green],[c.entryU,c.collisionU,COLORS.blue],[c.collisionU,.25,COLORS.orange]])svg.append(svgEl('line',{x1:X(a),x2:X(b),y1:y,y2:y,stroke:color,'stroke-width':4}));
 const entryX=X(c.entryU),collisionX=X(c.collisionU);for(const [x,color]of [[entryX,COLORS.blue],[collisionX,COLORS.orange]])svg.append(svgEl('circle',{cx:x,cy:y,r:5,fill:color,stroke:'#10202b','stroke-width':2}));
 svg.append(svgEl('line',{x1:entryX,x2:entryX,y1:y-8,y2:41,stroke:COLORS.blue,'stroke-width':1}),svgEl('line',{x1:collisionX,x2:collisionX,y1:y+8,y2:112,stroke:COLORS.orange,'stroke-width':1}));
 svgText(svg,'Second zero enters',entryX,20,{size:width<600?10:12,color:COLORS.blue});svgText(svg,`τ ≈ ${fmt(c.entryTau,6)}`,entryX,37,{size:10,color:'#aac7d3'});svgText(svg,'Collision; departure follows',collisionX,130,{size:width<600?10:12,color:COLORS.orange});svgText(svg,`τ ≈ ${fmt(c.collisionTau,6)}`,collisionX,147,{size:10,color:'#d9c2aa'});svgText(svg,'τ = 0',left,110,{anchor:'start',size:10});svgText(svg,'τ = −0.25',right,65,{anchor:'end',size:10});
 svg.append(svgEl('circle',{cx:X(frame.u),cy:y,r:8.5,fill:'none',stroke:'#f1f4e8','stroke-width':2}));mount.replaceChildren(svg);
}
function initQuartet(data){
 quartet=data;quartetIndex=Math.max(0,data.frames.findIndex(frame=>frame.id===reportSelection.quartet));$('hero-isolation').textContent=`τ ≈ ${fmt(data.constants.entryTau,6)}`;const select=$('quartet-select');select.replaceChildren();data.frames.forEach((frame,i)=>{const option=el('option','',quartetLabels[frame.id]||`τ = ${fmt(frame.tau)}`);option.value=i;select.append(option);});select.value=quartetIndex;select.onchange=()=>{quartetIndex=Number(select.value);persistReportSelection({quartet:quartet.frames[quartetIndex].id});drawQuartet();};
 $('quartet-finding').textContent=`The exact one-zero guarantee holds on −0.08 ≤ τ ≤ 0, with a whole-circle Rouché margin of at least ${fmt(data.constants.roucheIntervalMargin)}. A second zero reaches the contour at τ ≈ ${fmt(data.constants.entryTau,8)}, before the collision at τ ≈ ${fmt(data.constants.collisionTau,8)}.`;
 const proof=$('quartet-proof');proof.replaceChildren();for(const section of data.proofs){proof.append(el('h4','',section.title));for(const paragraph of section.paragraphs)proof.append(el('p','',paragraph));proof.append(el('div','proof-formula',section.formulas.join('\n')));}const link=el('a','text-link','Download the complete exact proof ↓');link.href='./zero-confinement-quartic-proof.txt';link.download='';proof.append(link);setReady('quartet');drawQuartet();
}

function thetaRuns(){return {negative:theta.runs.find(run=>Math.abs(run.tauEnd+.2)<1e-12),positive:theta.runs.find(run=>Math.abs(run.tauEnd-.2)<1e-12)};}
function thetaTrack(run,branch){const initial=run.summary.initialHeights[branch];return run.frames.map(frame=>{const root=frame.roots.find(root=>root.branch===branch);return root?[frame.tau,root.t-initial]:null;});}
function drawTheta(){
 if(!theta)return;const {negative,positive}=thetaRuns(),all=[negative,positive].flatMap(run=>run.frames.flatMap(frame=>frame.roots.map(root=>root.t-run.summary.initialHeights[root.branch]))),limit=Math.max(...all.map(Math.abs))*1.17;
 const height=chart($('theta-height-plot'),{title:'Height displacement of the first three actual theta-heat roots',description:'The first three numerical branches are continued from zero to tau minus 0.2 and plus 0.2. Their height changes are displayed relative to each initial zero.',xMin:-.2,xMax:.2,yMin:-limit,yMax:limit,xLabel:'Heat parameter τ',yLabel:'Height displacement Δt',height:420,xTicks:[-.2,-.1,0,.1,.2]});
 for(let branch=0;branch<3;branch++){const points=[...thetaTrack(negative,branch).reverse(),...thetaTrack(positive,branch).slice(1)];line(height,points,BRANCHES[branch],2.3);point(height,points[0][0],points[0][1],BRANCHES[branch],4);point(height,points.at(-1)[0],points.at(-1)[1],BRANCHES[branch],4);}
 const margin=chart($('theta-margin-plot'),{title:'Sampled contour Rouché margin around the first theta zero',description:'The normalized sampled margin remains positive along both saved runs. This samples a fixed circle and does not certify values between contour nodes or time frames.',xMin:-.2,xMax:.2,yMin:0,yMax:.75,xLabel:'Heat parameter τ',yLabel:'Sampled normalized margin',height:310,xTicks:[-.2,-.1,0,.1,.2],yTicks:[0,.2,.4,.6]});
 line(margin,[...negative.frames].reverse().map(frame=>[frame.tau,frame.contour.roucheMargin]).concat(positive.frames.slice(1).map(frame=>[frame.tau,frame.contour.roucheMargin])),COLORS.blue,2.4);svgText(margin.svg,'zero margin',margin.x+8,margin.Y(0)-10,{anchor:'start',size:10,color:'#91a8b7'});
}
function initTheta(data){
 theta=data;const {negative,positive}=thetaRuns();if(!negative||!positive)throw Error('Both tau endpoint runs are required.');const table=$('theta-endpoints');table.replaceChildren();for(let branch=0;branch<3;branch++)table.append(tableRow([`Root ${branch+1}`,fixed(negative.summary.initialHeights[branch]),fixed(negative.summary.finalHeights[branch]),fixed(positive.summary.finalHeights[branch]),signed(negative.summary.heightChanges[branch],8)]));
 legend($('theta-legend'),negative.summary.initialHeights.map((t,i)=>[`Root ${i+1} · t₀ = ${fmt(t,7)}`,BRANCHES[i]]));const allRuns=data.runs,maxResidual=Math.max(...allRuns.map(run=>run.summary.maxRefinedResidual)),maxOffset=Math.max(...allRuns.map(run=>run.summary.maxTransverseDisplacement)),minMargin=Math.min(...allRuns.map(run=>run.summary.minSampledRoucheMargin));
 $('theta-metrics').replaceChildren(metric('MAX SAMPLED |σ − ½|',fmt(maxOffset),'Symmetry-compatible numerical paths'),metric('MAX REFINED |F/F′|',fmt(maxResidual,3),'Positional Newton correction · all saved frames'),metric('MIN SAMPLED MARGIN',fmt(minMargin,5),'First fixed circle · not certified'));
 $('theta-margin-note').textContent=`For the fixed circle centered at ½ + ${fmt(data.scope.contourCenter.t,9)}i, radius ${data.scope.contourRadius}, the smallest sampled margin is ${fmt(minMargin,6)}. The sampled winding remains approximately one. Neither observation proves a uniform one-zero bound on every arc and every intermediate time.`;
 $('theta-margin-caption').textContent=`${data.scope.contourSamples} nodes on the fixed radius-${data.scope.contourRadius} circle; ${data.scope.frameCount} frames per run. The margin uses the common reference scale in the saved experiment.`;
 for(const [run,id]of [[negative,'theta-negative-live'],[positive,'theta-positive-live']]){const root=run.frames.at(-1).roots[0];$(id).href=liveURL('heatZeros',{researchMode:'heat',researchHeatModel:'theta',researchT:run.summary.initialHeights[0],researchHeatCount:3,researchHeatEnd:run.tauEnd,researchFrame:240,researchContourRadius:data.scope.contourRadius,researchShowContours:true,researchShowVectors:false},{sigma:root.sigma,t:root.t});}
 const verification=$('theta-verification');verification.replaceChildren();const independent=data.independentVerification;
 if(independent){verification.append(el('h4','','An independent endpoint calculation'),el('p','',`${independent.decimalDigits}-digit arithmetic evaluates the theta integral independently at the endpoints. The largest reported height difference across all saved endpoints is ${fmt(independent.maxAbsoluteHeightDiscrepancy,4)}; the −0.1 run includes earlier Newton stopping. This checks the located real-line roots, not the absence of other roots.`),el('p','',independent.scope));}
 const bound=data.analyticContourEstimate;if(bound){verification.append(el('h4','','An analytic inequality still needs certified numerical inputs'),el('p','','The recorded derivative and perturbation inequalities control whole boundary arcs in principle. Their numerical integrals and starting boundary values here are high-precision estimates, with finite theta truncation and no interval arithmetic. Positive nominal gaps are candidates for certification.'));
 const list=bound.intervals.map(item=>`|τ| ≤ ${item.deltaTau}: estimated gap ${fmt(Number(item.roucheGapEstimate),6)} (${item.nominalStrictInequality?'positive nominal gap':'this bound does not establish a barrier'})`).join('\n');verification.append(el('div','proof-formula',list),el('p','',bound.limitation));}
 verification.append(el('h4','','What the saved runs resolve'),el('p','',`The evaluator uses ${data.scope.thetaIntervals} theta intervals, checked against ${data.scope.refinedThetaIntervals}; each continuation records ${data.scope.frameCount} frames. The contour has ${data.scope.contourSamples} sampled nodes. No interval certificate for the entire contour or time interval is supplied.`));setReady('theta');drawTheta();
}

function drawShear(){
 if(!shear)return;const dense=shear.horizontalCurve||shear.horizontal,hasDense=!!shear.horizontalCurve,extent=hasDense?.3:.17,c=chart($('shear-plot'),{title:'Logarithmic shear compared with three finite bridges',description:'At the first theta zero height and tau minus 0.2, the analytic log slope has a pole at transverse offset zero. Finite bridges of shifts 0.02, 0.05 and 0.25 are bounded and approximate it only when their shift is small relative to the offset.',xMin:-extent,xMax:extent,yMin:-30,yMax:30,xLabel:'Transverse offset x = σ − ½',yLabel:'Logarithmic slope / finite bridge',height:430,xTicks:hasDense?[-.3,-.15,0,.15,.3]:[-.15,-.05,0,.05,.15],yTicks:[-30,-15,0,15,30]});
 line(c,[[0,-30],[0,30]],'#9facb566',1,'4 5');
 if(hasDense){line(c,dense.map(row=>finite(row.logShear)?[row.x,row.logShear]:null),COLORS.green,2.8);[.02,.05,.25].forEach((a,i)=>line(c,dense.map(row=>{const bridge=row.bridge.find(b=>Math.abs(b.a-a)<1e-10);return finite(bridge?.Bover2a)?[row.x,bridge.Bover2a]:null;}),BRIDGES[i],2));}
 for(const row of shear.horizontal){if(finite(row.logShear))point(c,row.x,row.logShear,COLORS.green,4,`x=${row.x}; analytic ${fmt(row.logShear,9)}`);row.bridge.forEach((bridge,i)=>point(c,row.x,bridge.Bover2a,BRIDGES[i],3.5,`x=${row.x}; a=${bridge.a}; finite bridge ${fmt(bridge.Bover2a,9)}`));}
 line(c,[[selectedX,-30],[selectedX,30]],'#e1e8dc88',1,'2 5');svgText(c.svg,`selected x = ${signed(selectedX,3)}`,c.X(selectedX)+(selectedX>0?8:-8),c.y+18,{anchor:selectedX>0?'start':'end',size:10,color:'#dbe6ce'});
 $('shear-plot-caption').textContent=`${hasDense?'The lines use 401 saved samples; dots mark the table values.':'Only saved sample points are plotted.'} The vertical view is clipped to ±30. The logarithmic derivative is undefined at the zero; its branches are separated there. The finite bridge is approximately zero at the symmetric center.`;
}
function updateShearSelection(){
 const row=shear.horizontal.find(row=>Math.abs(row.x-selectedX)<1e-12)||shear.horizontal.find(row=>row.x>.001),wide=row.bridge.find(b=>b.a===.25),loss=100*(1-Math.abs(wide.Bover2a/row.logShear));$('shear-analytic').textContent=fmt(row.logShear,7);$('shear-finite').textContent=fmt(wide.Bover2a,7);$('shear-attenuation').textContent=`The wide bridge is ${fixed(loss,1)}% smaller in magnitude here. It keeps the local sign.`;
 for(const tr of $('shear-values').children)tr.dataset.selected=String(Number(tr.dataset.x)===selectedX);
 const state={researchMode:'shear',researchSource:'heat',researchTau:shear.tau,researchLayer:'logShear',researchSigma:.5+row.x,researchT:shear.root768.t,researchSpan:.5,researchA:.02,researchShowContours:true,researchShowVectors:true},probe={sigma:state.researchSigma,t:state.researchT};$('shear-live').href=liveURL('bridgeShear',state,probe);$('shear-wide-live').href=liveURL('bridgeShear',{...state,researchA:.25},probe);drawShear();
}
function initShear(data){
 shear=data;const root=data.root768;$('shear-root-caption').textContent=`t = ${fixed(root.t,10)} · τ = ${data.tau}`;legend($('shear-legend'),[['analytic Re(F′/F)',COLORS.green],['bridge a = 0.02',BRIDGES[0]],['bridge a = 0.05',BRIDGES[1]],['bridge a = 0.25',BRIDGES[2]]]);
 const table=$('shear-values');table.replaceChildren();for(const row of data.horizontal){const tr=tableRow([signed(row.x,3),fmt(row.W,7),finite(row.logShear)?fmt(row.logShear,7):'undefined at zero',...row.bridge.map(b=>Math.abs(b.Bover2a)<1e-10?'≈ 0':fmt(b.Bover2a,7))]);tr.dataset.x=row.x;table.append(tr);}
 const row=data.horizontal.find(row=>row.x===.05),wide=row.bridge.find(b=>b.a===.25),loss=100*(1-Math.abs(wide.Bover2a/row.logShear));$('hero-bridge').textContent=`${fixed(loss,1)}% smaller at a = .25`;
 const energy=data.energy.find(e=>e.h===0)||data.energy[0];$('energy-metrics').replaceChildren(dlRow('Even boundary form E+',fmt(energy.even,9)),dlRow('Odd boundary form E−',fmt(energy.odd,9)),dlRow('Difference E+ − E−',fmt(energy.difference,9)),dlRow('Direct transverse coefficient',fmt(energy.direct,9)));
 $('energy-note').textContent=`At the root height with boundary a = ${energy.a}, the normalized difference agrees with the direct continuous W/x value. The finite quadrature residual is ${fmt(energy.residual,3)}. This local check is not a global positivity statement.`;
 $('energy-live').href=liveURL('bridgeEnergy',{researchMode:'energy',researchSource:'heat',researchTau:data.tau,researchT:root.t,researchA:.5,researchShift:0},{sigma:.5,t:root.t});selectedX=reportSelection.x;$('shear-select').value=selectedX;$('shear-select').onchange=event=>{selectedX=Number(event.target.value);persistReportSelection({x:selectedX});updateShearSelection();};setReady('shear');updateShearSelection();
}

async function load(section,filename,render){try{const response=await fetch(new URL(filename,import.meta.url));if(!response.ok)throw Error(`HTTP ${response.status}`);render(await response.json());}catch(error){setError(section,error);}}
window.addEventListener('popstate',restoreReportSelection);
await Promise.allSettled([load('quartet','./zero-confinement-quartic.json',initQuartet),load('theta','./zero-confinement-theta.json',initTheta),load('shear','./zero-confinement-shear.json',initShear)]);
let resizeFrame=null;const redraw=()=>{if(resizeFrame!==null)return;resizeFrame=requestAnimationFrame(()=>{resizeFrame=null;drawQuartet();drawTheta();drawShear();});};
window.addEventListener('resize',redraw,{passive:true});
