#include <stdio.h>
#include <math.h>
#include <flint/flint.h>
#include <flint/fmpz.h>
#include <flint/arb.h>
#include <flint/acb_dirichlet.h>
static double l10(const arb_t x){ arb_t y; arb_init(y); arb_abs(y,x); arb_log_base_ui(y,y,10,64); double d=arf_get_d(arb_midref(y),ARF_RND_NEAR); arb_clear(y); return d;}
int main(void){
  double Ts[3]={3.0001753e12,5.1e12,7.8e12};
  slong prec=128;
  for(int q=0;q<3;q++){
    double x=log(Ts[q]),x2=x*x,x3=x2*x,x4=x2*x2;
    slong A=8,B=4096,Ns=200;
    double dlogJ=-0.4035+0.49086*x+0.00016299*x2-3.6139e-06*x3+2.9323e-08*x4;
    double dK=79.032-1.781*x+0.039243*x2-0.00094859*x3+7.3149e-06*x4;
    double dgrid=1186.9+130.17*x-7.4059*x2+0.17895*x3-0.001602*x4;
    double dinterp=-24.252+7.3231*x-0.38971*x2+0.0088745*x3-7.4331e-05*x4;
    double dh=178.66-15.127*x+0.93132*x2-0.02311*x3+0.00022146*x4;
    double dH=2.5499-0.24402*x+0.014953*x2-0.00037347*x3+3.5596e-06*x4;
    slong J=(slong)exp(dlogJ), K=(slong)dK, sg=((slong)(dgrid/2))*2+1, si=((slong)(dinterp/2))*2+1;
    arb_t t0,h,H,out,xi,xx,c; fmpz_t Jz; arb_init(t0);arb_init(h);arb_init(H);arb_init(out);arb_init(xi);arb_init(xx);arb_init(c); fmpz_init(Jz);
    arb_set_d(t0,floor(Ts[q])); arb_set_d(h,dh); arb_set_d(H,dH); fmpz_set_si(Jz,J);
    double lJ=log(J*sqrt(M_PI))/(2*M_PI);
    printf("T=%.4e logT=%.3f A=%ld B=%ld J=%ld K=%ld sigma_grid=%ld sigma_interp=%ld h=%.4f H=%.5f Ns=%ld\n",Ts[q],x,A,B,J,K,sg,si,dh,dH,Ns);
    printf("  ell_J=log(J sqrt pi)/2pi=%.4f  A/2=%.1f  max bin index m_J=%.0f  u-range of wrapped table entries: (%.3f, %.3f]\n",lJ,A/2.0,B*lJ,-A/2.0,lJ-A/2.0);
    printf("  A5 needs B>h sqrt(k) [code] ; proof needs B/2>=h sqrt(k): max k=%ld: h sqrt(K-1)=%.1f 2h sqrt(K-1)=%.1f B=%ld\n",K-1,dh*sqrt(K-1),2*dh*sqrt(K-1),B);
    double mx=-1e300; for(slong k=0;k<K;k++){acb_dirichlet_platt_lemma_A5(out,B,h,k,prec); double v=l10(out); if(v>mx)mx=v;} printf("  log10 max_k A5 = %.1f\n",mx);
    mx=-1e300; for(slong k=0;k<K;k++){acb_dirichlet_platt_lemma_A7(out,sg,t0,h,k,A,prec); double v=l10(out); if(v>mx)mx=v;} printf("  log10 max_k A7 = %.1f\n",mx);
    arb_zero(xx); acb_dirichlet_platt_lemma_32(out,h,t0,xx,prec); printf("  log10 L3.2(x=0) = %.1f\n",l10(out));
    acb_dirichlet_platt_lemma_B1(out,sg,t0,h,Jz,prec); printf("  log10 B1 = %.1f\n",l10(out));
    arb_set_si(xi,B); arb_inv(xi,xi,prec); arb_mul_2exp_si(xi,xi,-1);
    acb_dirichlet_platt_lemma_B2(out,K,h,xi,prec); arb_sqrt_fmpz(c,Jz,prec); arb_mul_2exp_si(c,c,1); arb_sub_ui(c,c,1,prec); arb_mul(out,out,c,prec); printf("  log10 (2sqrtJ-1)*B2 = %.1f\n",l10(out));
    acb_dirichlet_platt_lemma_A9(out,sg,t0,h,A,prec); printf("  log10 A9 = %.1f\n",l10(out));
    acb_dirichlet_platt_lemma_A11(out,t0,h,B,prec); printf("  log10 A11 = %.1f\n",l10(out));
    acb_dirichlet_platt_c_bound(out,sg,t0,h,0,prec); printf("  log10 C(sigma_grid,t0,h,0) = %.1f\n",l10(out));
    acb_dirichlet_platt_c_bound(out,si,t0,H,0,prec); printf("  log10 C(sigma_interp,t0,H,0) = %.1f\n",l10(out));
    acb_dirichlet_platt_i_bound(out,t0,A,H,si,prec); printf("  log10 I-bound (C.1) = %.1f\n",l10(out));
    acb_dirichlet_platt_bound_C3(out,t0,A,H,Ns,prec); printf("  log10 C3 (FLINT, /A) = %.1f\n",l10(out));
    /* edge amplification of grid error by exp(t^2/2h^2) at t=840, 2048 */
    printf("  window amplification log10 exp(t^2/2h^2): t=840 -> %.1f, t=2048 -> %.1f\n",840.0*840/(2*dh*dh)/log(10),2048.0*2048/(2*dh*dh)/log(10));
    printf("  A.3 pi-slip slack 2^((sigma-1)/4)/pi: grid log10=%.1f interp log10=%.3f\n",(sg-1)/4.0*log10(2)-log10(M_PI),(si-1)/4.0*log10(2)-log10(M_PI));
    fmpz_t g; fmpz_init(g); fmpz_set_d(g, Ts[q]*log(Ts[q]/(2*M_PI*M_E))/(2*M_PI)); printf("  turing_method_bound(gram index ~%.4e) = %lu ; exact Brent-form with (2.067,0.059): %.3f ; Lehman form %.3f\n",fmpz_get_d(g),acb_dirichlet_turing_method_bound(g),0.059/(6*M_PI)*x*x+(2.067-0.059*log(2*M_PI))/(6*M_PI)*x,0.114/(6*M_PI)*x*x+(1.7-0.114*log(2*M_PI))/(6*M_PI)*x); fmpz_clear(g);
  }
  return 0;
}
