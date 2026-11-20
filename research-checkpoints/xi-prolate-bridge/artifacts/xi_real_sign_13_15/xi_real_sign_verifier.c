#include <stdio.h>

#include <flint/acb.h>
#include <flint/acb_dirichlet.h>
#include <flint/acb_hypgeom.h>
#include <flint/arb.h>
#include <flint/flint.h>

#define PRECISION_BITS 512

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
hardy_xi(arb_t hardy_z, arb_t positive_factor, arb_t xi,
         slong t_value, slong prec)
{
    acb_t t, z, gamma_argument, gamma_value;
    arb_t pi, pi_quarter, quarter, t_squared_plus_quarter;

    acb_init(t);
    acb_init(z);
    acb_init(gamma_argument);
    acb_init(gamma_value);
    arb_init(pi);
    arb_init(pi_quarter);
    arb_init(quarter);
    arb_init(t_squared_plus_quarter);

    acb_zero(t);
    arb_set_si(acb_realref(t), t_value);
    acb_dirichlet_hardy_z(z, t, NULL, NULL, 1, prec);
    if (!arb_contains_zero(acb_imagref(z)))
    {
        flint_fprintf(stderr, "Hardy-Z imaginary enclosure excludes zero at t=%wd\n",
                      t_value);
        flint_abort();
    }
    arb_set(hardy_z, acb_realref(z));

    acb_zero(gamma_argument);
    arb_one(acb_realref(gamma_argument));
    arb_mul_2exp_si(acb_realref(gamma_argument),
                    acb_realref(gamma_argument), -2);
    arb_set_si(acb_imagref(gamma_argument), t_value);
    arb_mul_2exp_si(acb_imagref(gamma_argument),
                    acb_imagref(gamma_argument), -1);
    acb_hypgeom_gamma(gamma_value, gamma_argument, prec);
    acb_abs(positive_factor, gamma_value, prec);

    arb_const_pi(pi, prec);
    arb_sqrt(pi_quarter, pi, prec);
    arb_sqrt(pi_quarter, pi_quarter, prec);
    arb_div(positive_factor, positive_factor, pi_quarter, prec);

    arb_set_si(t_squared_plus_quarter, t_value);
    arb_mul_si(t_squared_plus_quarter, t_squared_plus_quarter,
               t_value, prec);
    arb_one(quarter);
    arb_mul_2exp_si(quarter, quarter, -2);
    arb_add(t_squared_plus_quarter, t_squared_plus_quarter, quarter, prec);
    arb_mul(positive_factor, positive_factor,
            t_squared_plus_quarter, prec);
    arb_mul_2exp_si(positive_factor, positive_factor, -1);

    arb_mul(xi, positive_factor, hardy_z, prec);
    arb_neg(xi, xi);

    acb_clear(t);
    acb_clear(z);
    acb_clear(gamma_argument);
    acb_clear(gamma_value);
    arb_clear(pi);
    arb_clear(pi_quarter);
    arb_clear(quarter);
    arb_clear(t_squared_plus_quarter);
}

static void
print_ball(const char *label, const arb_t value)
{
    printf("BALL %s ", label);
    arb_printn(value, 80, ARB_STR_MORE);
    printf("\n");
}

int
main(void)
{
    arb_t z13, z15, factor13, factor15, xi13, xi15;
    int pass13, pass15;

    arb_init(z13);
    arb_init(z15);
    arb_init(factor13);
    arb_init(factor15);
    arb_init(xi13);
    arb_init(xi15);

    hardy_xi(z13, factor13, xi13, 13, PRECISION_BITS);
    hardy_xi(z15, factor15, xi15, 15, PRECISION_BITS);

    pass13 = arb_is_negative(z13) && arb_is_positive(factor13)
        && arb_is_positive(xi13)
        && inside_open_rational_interval(z13, -792, -791, 1000UL)
        && inside_open_rational_interval(xi13, 2905, 2906, 1000000UL);
    pass15 = arb_is_positive(z15) && arb_is_positive(factor15)
        && arb_is_negative(xi15)
        && inside_open_rational_interval(z15, 719, 721, 1000UL)
        && inside_open_rational_interval(xi15, -706, -705, 1000000UL);

    printf("META schema=xi-real-sign-13-15-hardy-z-v1\n");
    printf("META flint_version=%s\n", FLINT_VERSION);
    printf("META arithmetic_library=FLINT_ARB\n");
    printf("META precision_bits=%d\n", PRECISION_BITS);
    printf("FORMULA Xi(t)=-positive_factor(t)*HardyZ(t)\n");
    printf("FORMULA positive_factor(t)=one_half*(t^2+one_quarter)*pi^(-one_quarter)*abs(Gamma(one_quarter+i*t/2))\n");
    print_ball("HardyZ(13)", z13);
    print_ball("positive_factor(13)", factor13);
    print_ball("Xi_from_HardyZ(13)", xi13);
    printf("ENCLOSURE HardyZ(13) (-792/1000,-791/1000)\n");
    printf("ENCLOSURE Xi_from_HardyZ(13) (2905/1000000,2906/1000000)\n");
    printf("CHECK Xi_from_HardyZ(13)>0=%s\n", pass13 ? "PASS" : "FAIL");
    print_ball("HardyZ(15)", z15);
    print_ball("positive_factor(15)", factor15);
    print_ball("Xi_from_HardyZ(15)", xi15);
    printf("ENCLOSURE HardyZ(15) (719/1000,721/1000)\n");
    printf("ENCLOSURE Xi_from_HardyZ(15) (-706/1000000,-705/1000000)\n");
    printf("CHECK Xi_from_HardyZ(15)<0=%s\n", pass15 ? "PASS" : "FAIL");
    printf("CHECK all=%s\n", pass13 && pass15 ? "PASS" : "FAIL");

    arb_clear(z13);
    arb_clear(z15);
    arb_clear(factor13);
    arb_clear(factor15);
    arb_clear(xi13);
    arb_clear(xi15);
    flint_cleanup();
    return pass13 && pass15 ? 0 : 1;
}
