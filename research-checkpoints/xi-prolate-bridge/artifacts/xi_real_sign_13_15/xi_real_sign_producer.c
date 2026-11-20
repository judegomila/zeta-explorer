#include <stdio.h>

#include <flint/acb.h>
#include <flint/acb_dirichlet.h>
#include <flint/acb_hypgeom.h>
#include <flint/arb.h>
#include <flint/flint.h>

#define PRECISION_BITS 256

static void
completed_xi(arb_t out, slong t_value, slong prec)
{
    acb_t s, one, half_s, exponent, pi_acb;
    acb_t zeta, gamma, pi_power, value, tmp;

    acb_init(s);
    acb_init(one);
    acb_init(half_s);
    acb_init(exponent);
    acb_init(pi_acb);
    acb_init(zeta);
    acb_init(gamma);
    acb_init(pi_power);
    acb_init(value);
    acb_init(tmp);

    acb_zero(s);
    arb_one(acb_realref(s));
    arb_mul_2exp_si(acb_realref(s), acb_realref(s), -1);
    arb_set_si(acb_imagref(s), t_value);
    acb_one(one);

    acb_dirichlet_zeta(zeta, s, prec);
    acb_mul_2exp_si(half_s, s, -1);
    acb_hypgeom_gamma(gamma, half_s, prec);

    acb_zero(pi_acb);
    arb_const_pi(acb_realref(pi_acb), prec);
    acb_neg(exponent, half_s);
    acb_pow(pi_power, pi_acb, exponent, prec);

    acb_sub(tmp, s, one, prec);
    acb_mul(value, s, tmp, prec);
    acb_mul(value, value, pi_power, prec);
    acb_mul(value, value, gamma, prec);
    acb_mul(value, value, zeta, prec);
    acb_mul_2exp_si(value, value, -1);

    if (!arb_contains_zero(acb_imagref(value)))
    {
        flint_fprintf(stderr, "imaginary enclosure excludes zero at t=%wd\n",
                      t_value);
        flint_abort();
    }
    arb_set(out, acb_realref(value));

    acb_clear(s);
    acb_clear(one);
    acb_clear(half_s);
    acb_clear(exponent);
    acb_clear(pi_acb);
    acb_clear(zeta);
    acb_clear(gamma);
    acb_clear(pi_power);
    acb_clear(value);
    acb_clear(tmp);
}

static int
inside_open_rational_interval(const arb_t value, slong lower_numerator,
                              slong upper_numerator, ulong denominator)
{
    arb_t lower, upper;
    int result;

    arb_init(lower);
    arb_init(upper);
    arb_set_si(lower, lower_numerator);
    arb_div_ui(lower, lower, denominator, PRECISION_BITS);
    arb_set_si(upper, upper_numerator);
    arb_div_ui(upper, upper, denominator, PRECISION_BITS);
    result = arb_gt(value, lower) && arb_lt(value, upper);
    arb_clear(lower);
    arb_clear(upper);
    return result;
}

static void
print_ball(const char *label, const arb_t value)
{
    printf("BALL %s ", label);
    arb_printn(value, 70, ARB_STR_MORE);
    printf("\n");
}

int
main(void)
{
    arb_t xi13, xi15;
    int pass13, pass15;

    arb_init(xi13);
    arb_init(xi15);
    completed_xi(xi13, 13, PRECISION_BITS);
    completed_xi(xi15, 15, PRECISION_BITS);

    pass13 = arb_is_positive(xi13)
        && inside_open_rational_interval(xi13, 2905, 2906, 1000000UL);
    pass15 = arb_is_negative(xi15)
        && inside_open_rational_interval(xi15, -706, -705, 1000000UL);

    printf("META schema=xi-real-sign-13-15-direct-v1\n");
    printf("META flint_version=%s\n", FLINT_VERSION);
    printf("META arithmetic_library=FLINT_ARB\n");
    printf("META precision_bits=%d\n", PRECISION_BITS);
    printf("FORMULA Xi(t)=one_half*s*(s-1)*pi^(-s/2)*Gamma(s/2)*zeta(s)\n");
    printf("FORMULA s=one_half+i*t\n");
    print_ball("Xi(13)", xi13);
    printf("ENCLOSURE Xi(13) (2905/1000000,2906/1000000)\n");
    printf("CHECK Xi(13)>0=%s\n", pass13 ? "PASS" : "FAIL");
    print_ball("Xi(15)", xi15);
    printf("ENCLOSURE Xi(15) (-706/1000000,-705/1000000)\n");
    printf("CHECK Xi(15)<0=%s\n", pass15 ? "PASS" : "FAIL");
    printf("CHECK all=%s\n", pass13 && pass15 ? "PASS" : "FAIL");

    arb_clear(xi13);
    arb_clear(xi15);
    flint_cleanup();
    return pass13 && pass15 ? 0 : 1;
}
