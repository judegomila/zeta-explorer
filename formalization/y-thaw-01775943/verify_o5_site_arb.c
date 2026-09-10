/* O5 Arb confirmation (y-thaw 0.17759432 package): at 400 bits,
   with y^2 = 12769/390625 exactly (y = 0.1808 = 113/625),

       x_{690988} < x_* < x_{690989},
       x_* = 6000000185827 + sqrt(1 - y^2),
       x_N = 4*pi*(N^2 - (129/800)/16),

   confirming the two strict site-coverage inequalities and the
   > 5.377e6 / > 1.198e7 interior margins of verify_o5_site_coverage.py.

   Build (macOS/Homebrew FLINT with merged Arb):
     clang -O2 -I/opt/homebrew/include -L/opt/homebrew/lib \
           verify_o5_site_arb.c -lflint -o verify_o5_site_arb            */

#include <stdio.h>
#include "flint/arb.h"

static int
strict(const char *name, int ok)
{
    printf("[%s] %s\n", ok ? "PASS" : "FAIL", name);
    return ok;
}

static void
x_window(arb_t out, ulong n, const arb_t t0_over16, slong prec)
{
    arb_t pi;
    arb_init(pi);
    arb_const_pi(pi, prec);
    arb_set_ui(out, n);
    arb_mul(out, out, out, prec);
    arb_sub(out, out, t0_over16, prec);
    arb_mul(out, out, pi, prec);
    arb_mul_2exp_si(out, out, 2);
    arb_clear(pi);
}

int
main(void)
{
    const slong prec = 400;
    int ok = 1;

    arb_t t16, r, xstar, x0, x1, left, right, m;
    arb_init(t16); arb_init(r); arb_init(xstar); arb_init(x0);
    arb_init(x1); arb_init(left); arb_init(right); arb_init(m);

    arb_set_ui(t16, 129);
    arb_div_ui(t16, t16, 800 * 16, prec);       /* t0/16 = 129/12800 */

    arb_set_ui(r, 377856);                       /* 1 - y^2 = 377856/390625 */
    arb_div_ui(r, r, 390625, prec);
    arb_sqrt(r, r, prec);
    arb_set_ui(xstar, 0);
    arb_add_si(xstar, xstar, 6000000185827L, prec);
    arb_add(xstar, xstar, r, prec);

    x_window(x0, 690988, t16, prec);
    x_window(x1, 690989, t16, prec);

    arb_sub(left, xstar, x0, prec);
    arb_sub(right, x1, xstar, prec);

    ok &= strict("x_{690988} < x_*(0.1808)", arb_is_positive(left));
    ok &= strict("x_*(0.1808) < x_{690989}", arb_is_positive(right));

    arb_set_ui(m, 5377393);
    ok &= strict("left margin > 5377393", arb_gt(left, m));
    arb_set_ui(m, 11989041);
    ok &= strict("right margin > 11989041", arb_gt(right, m));

    printf("left  = "); arb_printn(left, 25, ARB_STR_MORE); printf("\n");
    printf("right = "); arb_printn(right, 25, ARB_STR_MORE); printf("\n");
    printf("RESULT %s\n", ok ? "PASS" : "FAIL");

    arb_clear(t16); arb_clear(r); arb_clear(xstar); arb_clear(x0);
    arb_clear(x1); arb_clear(left); arb_clear(right); arb_clear(m);
    flint_cleanup();
    return ok ? 0 : 1;
}
