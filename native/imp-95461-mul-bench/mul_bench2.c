/* imp-95461 extended: locate the GMP mpn_mul_n schoolbook->Karatsuba crossover
 * by scanning 2-40 limbs, best-of-9. Measurement only; NO QED. */
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <gmp.h>
static double now_ns(void){struct timespec ts;clock_gettime(CLOCK_MONOTONIC,&ts);return (double)ts.tv_sec*1e9+(double)ts.tv_nsec;}
int main(void){
  const int MAXN=40;
  mp_limb_t *a=malloc(sizeof(mp_limb_t)*MAXN),*b=malloc(sizeof(mp_limb_t)*MAXN),*r=malloc(sizeof(mp_limb_t)*2*MAXN);
  gmp_randstate_t st;gmp_randinit_default(st);
  for(int i=0;i<MAXN;i++){a[i]=gmp_urandomb_ui(st,64)|1;b[i]=gmp_urandomb_ui(st,64)|1;}
  printf("limbs,ns_per_mul\n");
  for(int n=2;n<=MAXN;n++){
    long iters=200000;double t0,t1,dt;
    for(;;){t0=now_ns();for(long i=0;i<iters;i++){mpn_mul_n(r,a,b,n);r[0]^=(mp_limb_t)i;}t1=now_ns();dt=t1-t0;if(dt>8e7)break;iters*=2;}
    double best=1e300;
    for(int rep=0;rep<9;rep++){t0=now_ns();for(long i=0;i<iters;i++){mpn_mul_n(r,a,b,n);r[0]^=(mp_limb_t)i;}t1=now_ns();dt=(t1-t0)/(double)iters;if(dt<best)best=dt;}
    printf("%d,%.4f\n",n,best);fflush(stdout);
  }
  gmp_randclear(st);free(a);free(b);free(r);return 0;
}
