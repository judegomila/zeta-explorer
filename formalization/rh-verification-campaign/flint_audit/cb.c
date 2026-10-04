#include <stdio.h>
#include <stdlib.h>
#include <flint/arb.h>
#include <flint/acb_dirichlet.h>
int main(int argc,char**argv){ slong sigma=atol(argv[1]); double t0d=atof(argv[2]), hd=atof(argv[3]); slong k=atol(argv[4]);
 arb_t t0,h,r; arb_init(t0);arb_init(h);arb_init(r); arb_set_d(t0,t0d); arb_set_d(h,hd);
 acb_dirichlet_platt_c_bound(r,sigma,t0,h,k,128); printf("%s\n",arb_get_str(r,20,0)); return 0;}
