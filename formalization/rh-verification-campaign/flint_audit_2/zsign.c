/* sign of Hardy Z at exact dyadic points m*2^e via acb_dirichlet_hardy_z (FLINT RS code path, independent of Platt grid) */
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <flint/acb.h>
#include <flint/acb_dirichlet.h>
int main(int argc, char **argv)
{
    /* reads lines "label m e" from stdin, prints "label sign lo hi cpu" */
    char label[256], ms[512], es[64];
    slong prec = atol(argv[1]);
    acb_t t, z; acb_init(t); acb_init(z);
    fmpz_t m, e; fmpz_init(m); fmpz_init(e);
    while (scanf("%255s %511s %63s", label, ms, es) == 3)
    {
        clock_t c0 = clock();
        fmpz_set_str(m, ms, 10); fmpz_set_str(e, es, 10);
        arb_set_fmpz_2exp(acb_realref(t), m, e); arb_zero(acb_imagref(t));
        acb_dirichlet_hardy_z(z, t, NULL, NULL, 1, prec);
        int s = arb_is_positive(acb_realref(z)) ? 1 : (arb_is_negative(acb_realref(z)) ? -1 : 0);
        printf("%s %d ", label, s); arb_printn(acb_realref(z), 8, 0); printf(" %.2f\n", (double)(clock() - c0) / CLOCKS_PER_SEC);
        fflush(stdout);
    }
    acb_clear(t); acb_clear(z); fmpz_clear(m); fmpz_clear(e); flint_cleanup();
    return 0;
}
