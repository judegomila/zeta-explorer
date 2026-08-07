/* Independent Arb enclosure for the constant C_K in
   notes/PROJECTION_RATE_THEOREM.md equation (4.5). */
#include <flint/arb.h>
#include <flint/arb_hypgeom.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void usage(const char *name)
{
    fprintf(stderr, "usage: %s [--prec bits]\n", name);
}

int main(int argc, char **argv)
{
    slong prec = 256;
    if (argc == 3 && strcmp(argv[1], "--prec") == 0)
    {
        prec = strtol(argv[2], NULL, 10);
        if (prec < 64)
        {
            fprintf(stderr, "precision must be at least 64 bits\n");
            return 2;
        }
    }
    else if (argc != 1)
    {
        usage(argv[0]);
        return 2;
    }

    arb_t pi, B, S, g7, g13, x, y, den, C, six006;
    arb_init(pi); arb_init(B); arb_init(S); arb_init(g7); arb_init(g13);
    arb_init(x); arb_init(y); arb_init(den); arb_init(C); arb_init(six006);
    arb_const_pi(pi, prec);

    /* B = 2*pi^3 + (15/2)*pi^2 + (15/4)*pi. */
    arb_mul(x, pi, pi, prec);
    arb_mul(y, x, pi, prec);
    arb_mul_ui(B, y, 2, prec);
    arb_mul_ui(y, x, 15, prec);
    arb_div_ui(y, y, 2, prec);
    arb_add(B, B, y, prec);
    arb_mul_ui(y, pi, 15, prec);
    arb_div_ui(y, y, 4, prec);
    arb_add(B, B, y, prec);

    /* S = 1 + exp(pi) Gamma(7/2,pi)/(2*pi^(7/2)). */
    arb_set_ui(x, 7);
    arb_div_ui(x, x, 2, prec);
    arb_hypgeom_gamma_upper(g7, x, pi, 0, prec);
    arb_exp(y, pi, prec);
    arb_mul(y, y, g7, prec);
    arb_pow(x, pi, x, prec);
    arb_mul_ui(x, x, 2, prec);
    arb_div(y, y, x, prec);
    arb_add_ui(S, y, 1, prec);

    /* C = B*S*sqrt(Gamma(13/2,2*pi)/(2*pi)^(13/2)). */
    arb_set_ui(x, 13);
    arb_div_ui(x, x, 2, prec);
    arb_mul_ui(y, pi, 2, prec);
    arb_hypgeom_gamma_upper(g13, x, y, 0, prec);
    arb_pow(den, y, x, prec);
    arb_div(x, g13, den, prec);
    arb_sqrt(x, x, prec);
    arb_mul(C, B, S, prec);
    arb_mul(C, C, x, prec);

    /* Compare the ball with the exact rational 6006/1000. */
    arb_set_si(six006, 6006);
    arb_div_ui(six006, six006, 1000, prec);
    const int pass = arb_lt(C, six006);

    printf("claim_class=ANALYTIC_CONSTANT_BALL_ONLY\n");
    printf("precision_bits=%ld\n", prec);
    printf("formula=B*S*sqrt(Gamma(13/2,2*pi)/(2*pi)^(13/2))\n");
    printf("C_K_ball=");
    arb_printn(C, 70, 0);
    printf("\nC_K_lt_6006_over_1000=%d\n", pass);
    printf("terminal_state=P0_INVALIDATED\n");

    arb_clear(pi); arb_clear(B); arb_clear(S); arb_clear(g7); arb_clear(g13);
    arb_clear(x); arb_clear(y); arb_clear(den); arb_clear(C); arb_clear(six006);
    flint_cleanup();
    return pass ? 0 : 1;
}
