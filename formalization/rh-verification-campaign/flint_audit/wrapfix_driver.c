#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <flint/fmpz.h>
#include <flint/arb.h>
#include <flint/arf.h>
#include <flint/arb_calc.h>
#include <flint/acb_dirichlet.h>
slong aud_isolate(arf_interval_ptr res, const fmpz_t n, slong len, const fmpz_t T, slong A, slong B, const arb_t h, const fmpz_t J, slong K, slong sigma_grid, slong Ns_max, const arb_t H, slong sigma_interp, slong prec);
int main(int argc,char**argv){
  fmpz_t T,n,J; fmpz_init(T); fmpz_init(n); fmpz_init(J); fmpz_set_str(T,argv[1],10); fmpz_set_str(n,argv[2],10);
  double x=log(fmpz_get_d(T)),x2=x*x,x3=x2*x,x4=x2*x2;
  double dlogJ=-0.4035+0.49086*x+0.00016299*x2-3.6139e-06*x3+2.9323e-08*x4;
  double dK=79.032-1.781*x+0.039243*x2-0.00094859*x3+7.3149e-06*x4;
  double dgrid=1186.9+130.17*x-7.4059*x2+0.17895*x3-0.001602*x4;
  double dinterp=-24.252+7.3231*x-0.38971*x2+0.0088745*x3-7.4331e-05*x4;
  double dh=178.66-15.127*x+0.93132*x2-0.02311*x3+0.00022146*x4;
  double dH=2.5499-0.24402*x+0.014953*x2-0.00037347*x3+3.5596e-06*x4;
  arb_t h,H; arb_init(h); arb_init(H); arb_set_d(h,dh); arb_set_d(H,dH); fmpz_set_si(J,(slong)exp(dlogJ));
  slong K=(slong)dK, sg=((slong)(dgrid/2))*2+1, si=((slong)(dinterp/2))*2+1;
  arf_interval_ptr iv=_arf_interval_vec_init(16000);
  slong f=aud_isolate(iv,n,16000,T,8,4096,h,J,K,sg,200,H,si,128);
  printf("found %ld\n",f);
  for(slong i=0;i<f;i++){ char*a=arf_get_str(&iv[i].a,25),*b=arf_get_str(&iv[i].b,25); printf("%s %s\n",a,b); flint_free(a); flint_free(b);}
  return 0;}
