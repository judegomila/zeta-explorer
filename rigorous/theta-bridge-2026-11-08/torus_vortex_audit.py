"""Computed xi currents on E_2, using exact Jacobi uniformization.

This is a finite numerical visualization, not a proof of RH.
The code writes a PNG, an SVG, and a numerical audit JSON.
Dependencies: mpmath, numpy, matplotlib.
"""
from pathlib import Path
import json
import mpmath as mp
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

OUT = Path(__file__).resolve().parent
mp.mp.dps = 32
r = mp.mpf(2)
mod = r**-4
K = mp.ellipk(mod)
Kp = mp.ellipk(1-mod)
gamma = mp.im(mp.zetazero(1))
srho = mp.mpf('.5') + 1j*gamma
wrho = (srho-1)/srho
zrho = mp.ellipf(mp.asin(-1j*r*wrho), mod)

def geometry(z):
    sn = mp.ellipfun('sn', z, mod)
    cn = mp.ellipfun('cn', z, mod)
    dn = mp.ellipfun('dn', z, mod)
    w = 1j*sn/r
    eta = cn*dn
    s = 1/(1-w)
    sp = 1j*eta/(r*(1-w)**2)
    return w, eta, s, sp

def xi_and_logderivative(s):
    if abs(s) < mp.mpf('1e-15') or abs(s-1) < mp.mpf('1e-15'):
        f = lambda a: mp.mpf('.5') if a == 0 or a == 1 else (a-1)*mp.power(mp.pi,-a/2)*mp.gamma(1+a/2)*mp.zeta(a)
        val = f(s)
        return val, mp.diff(f,s)/val
    ze = mp.zeta(s)
    val = (s-1)*mp.power(mp.pi,-s/2)*mp.gamma(1+s/2)*ze
    ld = 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s,derivative=1)/ze
    return val,ld

def sample(xs,ys,cutoff=50):
    phase_x=np.full((len(ys),len(xs)),np.nan)
    phase_y=phase_x.copy()
    potential=phase_x.copy()
    for iy,y in enumerate(ys):
        for ix,x in enumerate(xs):
            z=mp.mpc(float(x),float(y))
            try:
                _,_,s,sp=geometry(z)
                if abs(s)>cutoff:
                    continue
                X,ld=xi_and_logderivative(s)
                h=ld*sp
                # Im(h dz) = Im(h) dx + Re(h) dy.
                phase_x[iy,ix]=float(mp.im(h))
                phase_y[iy,ix]=float(mp.re(h))
                potential[iy,ix]=float(mp.log(abs(X)))
            except (ValueError,ZeroDivisionError,OverflowError):
                pass
        if iy%15==0:
            print(f'sampled row {iy+1}/{len(ys)}',flush=True)
    return phase_x,phase_y,potential

gx=np.linspace(float(-K/2),float(7*K/2),77)
gy=np.linspace(float(-3*Kp/4),float(5*Kp/4),57)
vx,vy,U=sample(gx,gy)

# Exact local uniformizing chart, close to the first positive-height zero.
dx=np.linspace(-.0032,.0032,57)
dy=np.linspace(-.0016,.0016,39)
lx=float(mp.re(zrho))+dx
ly=float(mp.im(zrho))+dy
lvx,lvy,lU=sample(lx,ly)
center=(np.abs(dy[:,None])<1e-12)&(np.abs(dx[None,:])<1e-12)
lvx[center]=np.nan
lvy[center]=np.nan
lU[center]=np.nan

plt.rcParams.update({'font.family':'DejaVu Sans','font.size':11,'axes.spines.top':False,'axes.spines.right':False,'axes.titleweight':'bold'})
fig=plt.figure(figsize=(13,10.5),facecolor='white')
gs=fig.add_gridspec(2,2,height_ratios=[1.15,1],hspace=.47,wspace=.23)
ax=fig.add_subplot(gs[0,:])
sp=np.hypot(vx,vy)
ax.streamplot(gx/float(K),gy/float(Kp),vx/float(K),vy/float(Kp),density=1.55,color='#606d7a',linewidth=.65,arrowsize=.85,broken_streamlines=True)
for yy in [-.5,.5]:
    ax.axhline(yy,color='#008d78',lw=2.2,zorder=3)
branch_x=np.array([1,3,1,3])
branch_y=np.array([0,0,1,1])
ax.scatter(branch_x,branch_y,marker='x',s=70,c='#8c44a6',linewidths=2,zorder=5)
ax.scatter([0,2],[-.5,.5],s=160,facecolors='white',edgecolors='#152435',linewidths=2,zorder=7)
ax.annotate(r'$p_+$',(0,-.5),xytext=(.075,-.69),fontsize=13)
ax.annotate(r'$p_-$',(2,.5),xytext=(2.08,.60),fontsize=13)
ax.scatter([float(mp.re(zrho)/K)],[-.5],s=24,c='#d49a00',zorder=8)
ax.annotate('First positive-height zero\n(enlarged below)',(float(mp.re(zrho)/K),-.5),xytext=(.36,-.33),arrowprops={'arrowstyle':'-','color':'#8d6e16'},fontsize=10,color='#674f00')
ax.set(xlim=(-.5,3.5),ylim=(-.75,1.25),xlabel=r'Flat torus coordinate $\mathrm{Re}\,z / K$',ylabel=r'$\mathrm{Im}\,z / K^\prime$')
ax.set_title('Computed phase-vortex flow on the torus — opposite edges identified',loc='left',pad=14)
ax.legend(handles=[Line2D([0],[0],color='#008d78',lw=2,label='Critical ovals'),Line2D([0],[0],marker='x',color='#8c44a6',ls='',markersize=8,label='Projection stagnations'),Line2D([0],[0],marker='o',mfc='white',mec='#152435',color='none',markersize=8,label='Essential punctures')],loc='upper center',bbox_to_anchor=(.5,-.16),ncol=3,frameon=False)

for a,kind in [(fig.add_subplot(gs[1,0]),'vortex'),(fig.add_subplot(gs[1,1]),'gradient')]:
    Xg,Yg=np.meshgrid(dx*1000,dy*1000)
    finite=lU[np.isfinite(lU)]
    levels=np.linspace(np.percentile(finite,6),np.percentile(finite,96),9)
    a.contour(Xg,Yg,lU,levels=levels,colors='#c4cbd1',linewidths=.6)
    if kind=='vortex':
        fx,fy=lvx,lvy
        color='#087aa6'
        title='Phase vortices: circulation, no attraction'
        explanation=r'$V_\phi=(\nabla\arg X)$;  $d\log|X|/d\tau=0$'
    else:
        fx,fy=-lvy,lvx
        color='#c48200'
        title='Amplitude descent: the flow needing a sign bound'
        explanation=r'$V_-=-\nabla\log|X|$;  $d\log|X|/d\tau=-|\nabla\log|X||^2$'
    # Positive normalization changes speed only, preserving streamlines.
    norm=np.hypot(fx,fy)
    fx=fx/np.maximum(norm,1e-100)
    fy=fy/np.maximum(norm,1e-100)
    a.streamplot(dx*1000,dy*1000,fx,fy,density=1.2,color=color,linewidth=1,arrowsize=1.05)
    a.axhline(0,color='#008d78',lw=1.8,zorder=5)
    a.scatter([0],[0],s=45,c='#152435',zorder=6)
    a.set(xlabel=r'$10^3\,\mathrm{Re}(z-z_\rho)$',ylabel=r'$10^3\,\mathrm{Im}(z-z_\rho)$',xlim=(-3.2,3.2),ylim=(-1.6,1.6),aspect='equal')
    a.set_title(title,loc='left',fontsize=11,pad=12)
    a.text(.0,-.28,explanation,transform=a.transAxes,fontsize=10,va='top')

fig.suptitle('Zeta vortices on the punctured elliptic model',x=.06,y=.98,ha='left',fontsize=19,fontweight='bold')
fig.text(.06,.943,r'$r=2,\quad w=(i/2)\,\mathrm{sn}(z\mid 1/16),\quad X(z)=\xi(1/(1-w))$',fontsize=12)
fig.text(.06,.035,'Numerical illustration only. The global sample omits |s| > 50 near the punctures; the unresolved infinite tail is retained analytically.',fontsize=10,color='#465261')
fig.text(.06,.015,f'Local zero: s = 1/2 + {float(gamma):.12f}i. The green oval is crossed normally by phase flow; amplitude descent is tangent on it.',fontsize=10,color='#465261')
fig.subplots_adjust(top=.88,bottom=.12,left=.075,right=.97)
fig.savefig(OUT/'torus_vortex_fields.png',dpi=200)
fig.savefig(OUT/'torus_vortex_fields.svg')

# Reproducible numerical audit on a regular critical-oval point.
ztest=zrho+mp.mpf('.001')
w,eta,s,sp=geometry(ztest)
X,ld=xi_and_logderivative(s)
h=ld*sp
ztest2=mp.mpc('.7','.2')
w2,eta2,s2,sp2=geometry(ztest2)
tauw=-1/mp.conj(w2)
taueta=-mp.conj(eta2)/mp.conj(w2)**2
P=lambda a:(a*a+r*r)*(a*a+r**-2)
audit={'r':'2','mpmath_dps':mp.mp.dps,'jacobi_parameter':str(mod),'K':str(K),'Kprime':str(Kp),'first_zeta_zero':str(srho),'first_zero_uniformizing_coordinate':str(zrho),'critical_oval_phase_tangential_component_residual':str(abs(mp.im(h))),'critical_oval_phase_normal_component':str(mp.re(h)),'curve_equation_residual':str(abs(eta2**2-P(w2))),'minitwistor_reality_curve_residual':str(abs(taueta**2-P(tauw))),'global_grid':[len(gx),len(gy)],'local_grid':[len(dx),len(dy)],'global_cutoff_abs_s':50,'mathematical_status':'Illustrative finite numerical sampling; no global sign certification or RH proof.'}
km=(r-1/r)/(r+1/r)
kmp=2/(r+1/r)
Lm=mp.ellipk(km*km)
cm=Lm/(r+1/r)
zetam=1j*(w2-1)/(w2+1)
vm=2j*cm*eta2/(w2+1)**2
monopole_residual=vm**2+Lm**2/4*(zetam**4+2*(km**2-kmp**2)*zetam**2+1)
audit.update(monopole_k=str(km),monopole_complementary_modulus=str(kmp),monopole_fiber_scale=str(cm),monopole_spectral_curve_numeric_residual=str(abs(monopole_residual)),monopole_identity_symbolically_verified=True,minitwistor_status='The bare curve matches the standard charge-two monopole spectral curve after the stated normalization. No Ward reconstruction of the zeta decoration or positivity theorem is claimed.')
(OUT/'torus_vortex_audit.json').write_text(json.dumps(audit,indent=2))
print(json.dumps(audit,indent=2),flush=True)
