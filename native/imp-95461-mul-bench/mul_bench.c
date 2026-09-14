/* imp-95461: micro-benchmark GMP mpn_mul_n (the Arb/FLINT mantissa multiply
 * primitive) across 2-20 limbs to empirically validate the imp-95277 L^2
 * schoolbook replay factors and the imp-95380 Karatsuba crossover anchor
 * L_c = 10 limbs. Measurement only; NO QED. */
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <gmp.h>

static double now_ns(void) {
  struct timespec ts;
  clock_gettime(CLOCK_MONOTONIC, &ts);
  return (double)ts.tv_sec * 1e9 + (double)ts.tv_nsec;
}

int main(void) {
  const int limbs_list[] = {2,3,4,5,6,8,10,12,14,16,18,20};
  const int nl = sizeof(limbs_list)/sizeof(limbs_list[0]);
  const int MAXN = 20;
  mp_limb_t *a = malloc(sizeof(mp_limb_t)*MAXN);
  mp_limb_t *b = malloc(sizeof(mp_limb_t)*MAXN);
  mp_limb_t *r = malloc(sizeof(mp_limb_t)*2*MAXN);
  gmp_randstate_t st; gmp_randinit_default(st);
  for (int i=0;i<MAXN;i++){ a[i]=gmp_urandomb_ui(st,64)|1; b[i]=gmp_urandomb_ui(st,64)|1; }

  printf("limbs,ns_per_mul,iters\n");
  for (int k=0;k<nl;k++){
    int n = limbs_list[k];
    /* calibrate iteration count so each measurement runs >~50ms */
    long iters = 200000;
    double t0, t1, dt;
    for(;;){
      t0 = now_ns();
      for(long i=0;i<iters;i++){ mpn_mul_n(r, a, b, n); r[0]^=(mp_limb_t)i; }
      t1 = now_ns();
      dt = t1 - t0;
      if (dt > 5e7) break;   /* 50 ms */
      iters *= 2;
    }
    /* best of 5 */
    double best = 1e300;
    for (int rep=0; rep<5; rep++){
      t0 = now_ns();
      for(long i=0;i<iters;i++){ mpn_mul_n(r, a, b, n); r[0]^=(mp_limb_t)i; }
      t1 = now_ns();
      dt = (t1 - t0)/(double)iters;
      if (dt < best) best = dt;
    }
    printf("%d,%.4f,%ld\n", n, best, iters);
    fflush(stdout);
  }
  gmp_randclear(st); free(a); free(b); free(r);
  return 0;
}
