#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <flint/arb.h>
#include <flint/acb_dirichlet.h>
int main(int argc, char **argv)
{
    fmpz_t T, J; fmpz_init(T); fmpz_init(J);
    fmpz_set_str(T, argv[1], 10);
    double x = log(fmpz_get_d(T)), x2 = x*x, x3 = x2*x, x4 = x2*x2;
    slong A = 8, B = 4096, N = A*B;
    double dlogJ = -0.4035 + 0.49086*x + 0.00016299*x2 + -3.6139e-06*x3 + 2.9323e-08*x4;
    double dK = 79.032 + -1.781*x + 0.039243*x2 + -0.00094859*x3 + 7.3149e-06*x4;
    double dgrid = 1186.9 + 130.17*x + -7.4059*x2 + 0.17895*x3 + -0.001602*x4;
    double dh = 178.66 + -15.127*x + 0.93132*x2 + -0.02311*x3 + 0.00022146*x4;
    slong K = (slong) dK, sg = ((slong)(dgrid/2))*2 + 1;
    fmpz_set_si(J, (slong) exp(dlogJ));
    arb_t h; arb_init(h); arb_set_d(h, dh);
    arb_ptr out = _arb_vec_init(N);
    a2_acb_dirichlet_platt_multieval(out, T, A, B, h, J, K, sg, atol(argv[2]));
    FILE *f = fopen(argv[3], "w");
    for (slong i = 0; i < N; i++) { fmpz_t m, e; fmpz_init(m); fmpz_init(e);
        arf_get_fmpz_2exp(m, e, arb_midref(out + i)); fmpz_fprint(f, m); fprintf(f, " "); fmpz_fprint(f, e);
        fprintf(f, " %.17g\n", mag_get_d(arb_radref(out + i))); fmpz_clear(m); fmpz_clear(e); }
    fclose(f);
    _arb_vec_clear(out, N); arb_clear(h); fmpz_clear(T); fmpz_clear(J); flint_cleanup();
    return 0;
}
