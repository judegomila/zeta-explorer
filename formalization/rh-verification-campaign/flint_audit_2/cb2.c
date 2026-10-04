/* print FLINT 3.6.0 acb_dirichlet_platt_c_bound(sigma, t0, h, k) */
#include <stdio.h>
#include <stdlib.h>
#include <flint/arb.h>
#include <flint/acb_dirichlet.h>
int main(int argc, char **argv)
{
    slong sigma = atol(argv[1]); slong k = atol(argv[4]); slong prec = 256;
    arb_t t0, h, r; arb_init(t0); arb_init(h); arb_init(r);
    arb_set_str(t0, argv[2], prec); arb_set_str(h, argv[3], prec);
    acb_dirichlet_platt_c_bound(r, sigma, t0, h, k, prec);
    arb_printn(r, 20, ARB_STR_NO_RADIUS); printf("\n");
    arb_clear(t0); arb_clear(h); arb_clear(r); flint_cleanup();
    return 0;
}
