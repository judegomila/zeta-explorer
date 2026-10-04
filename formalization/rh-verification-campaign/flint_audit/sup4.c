#include <stdio.h>
#include <flint/acb.h>
int main(void){ slong prec=64; acb_t z; arb_t x,v,e,mx; acb_init(z); arb_init(x); arb_init(v); arb_init(e); arb_init(mx); arb_zero(mx);
 int ok=1; for(slong i=-20*256;i<60*256;i++){ arb_set_si(x,2*i+1); arb_mul_2exp_si(x,x,-9); mag_set_ui_2exp_si(arb_radref(x),1,-9); /* ball [i/256,(i+1)/256] */
  arb_set_d(acb_realref(z),0.25); arb_mul_2exp_si(acb_imagref(z),x,-1); acb_gamma(z,z,prec); acb_abs(v,z,prec);
  arb_const_pi(e,prec); arb_mul(e,e,x,prec); arb_mul_2exp_si(e,e,-2); arb_exp(e,e,prec); arb_mul(v,v,e,prec);
  arb_t four; arb_init(four); arb_set_ui(four,4); if(!arb_lt(v,four)) {ok=0; printf("fail at %ld\n",i);} arb_max(mx,mx,v,prec); arb_clear(four);}
 printf("interval check |Gamma(1/4+ix/2)|e^{pi x/4} < 4 on [-20,60]: %s ; enclosure of max: ",ok?"PASS":"FAIL"); arb_printd(mx,10); printf("\n"); return 0;}
