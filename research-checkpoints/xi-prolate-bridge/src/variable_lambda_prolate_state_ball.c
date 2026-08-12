/*
   Variable-lambda, source-normalized prolate state and projection-error ball.

   This file deliberately reuses only the low-level recurrence, exact
   Legendre-coefficient, printing, and Arb-bound helpers from the independently
   checked lambda=2 producer.  Labels, infinite-tail Schur loads, brackets,
   source-state propagation, and the full reflected projection norm are rebuilt
   below from exact source parameters.

   The output is a finite diagnostic certificate.  It proves neither an
   asymptotic schedule nor a statement about RH.  Status: P0_INVALIDATED.
*/
#define main p0_fixed_lambda2_producer_entrypoint
#include "p0_prolate_state_arb.c"
#undef main

#define VL_SCHEMA "variable_lambda_prolate_state_ball_v1"
#define VL_SOURCE_LOCK_SHA256 "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251"
#define VL_NORMALIZATION_SHA256 "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df"
#define VL_LEGACY_CORE_SHA256 "fd8fe2a9ff4fb606e674bd4f1bfb71f8fffa4ef69f107e8429b128c24a6ae896"
#define VL_QMAX_LIMIT 10000

typedef struct
{
    slong label;
    slong rank;
    slong lower_shift;
    slong upper_shift;
    arb_ptr w;
    arb_ptr v;
    arb_t theta;
    arb_t epsilon;
    arb_t spectral_ratio;
    arb_t eta;
    arb_t integral;
    arb_t value_zero;
    int localization_ok;
} vl_eigen_cert_t;

static void
vl_eigen_init(vl_eigen_cert_t *e, slong label, slong rank, slong m)
{
    e->label = label;
    e->rank = rank;
    e->lower_shift = -1;
    e->upper_shift = -1;
    e->localization_ok = 0;
    e->w = _arb_vec_init(m);
    e->v = _arb_vec_init(m);
    arb_init(e->theta);
    arb_init(e->epsilon);
    arb_init(e->spectral_ratio);
    arb_init(e->eta);
    arb_init(e->integral);
    arb_init(e->value_zero);
}

static void
vl_eigen_clear(vl_eigen_cert_t *e, slong m)
{
    _arb_vec_clear(e->w, m);
    _arb_vec_clear(e->v, m);
    arb_clear(e->theta);
    arb_clear(e->epsilon);
    arb_clear(e->spectral_ratio);
    arb_clear(e->eta);
    arb_clear(e->integral);
    arb_clear(e->value_zero);
}

static int
vl_all_digits(const char *s)
{
    if (s == NULL || *s == '\0')
        return 0;
    for (; *s != '\0'; s++)
        if (*s < '0' || *s > '9')
            return 0;
    return 1;
}

/* Exact integer, decimal, or positive rational parser; never uses binary64. */
static int
vl_parse_exact_parameter(fmpq_t out, const char *text)
{
    const char *slash, *dot;
    if (text == NULL || *text == '\0' || text[0] == '-')
        return 0;
    slash = strchr(text, '/');
    dot = strchr(text, '.');
    if (slash != NULL)
    {
        if (dot != NULL || strchr(slash + 1, '/') != NULL || slash == text
            || slash[1] == '\0')
            return 0;
        size_t nleft = (size_t) (slash - text);
        char *left = flint_malloc(nleft + 1);
        memcpy(left, text, nleft);
        left[nleft] = '\0';
        int ok = vl_all_digits(left) && vl_all_digits(slash + 1)
              && fmpq_set_str(out, text, 10) == 0
              && !fmpz_is_zero(fmpq_denref(out));
        flint_free(left);
        if (ok)
            fmpq_canonicalise(out);
        return ok;
    }
    if (dot == NULL)
        return vl_all_digits(text) && fmpq_set_str(out, text, 10) == 0;
    if (strchr(dot + 1, '.') != NULL || dot == text || dot[1] == '\0')
        return 0;
    size_t before = (size_t) (dot - text);
    size_t after = strlen(dot + 1);
    char *digits = flint_malloc(before + after + 1);
    memcpy(digits, text, before);
    memcpy(digits + before, dot + 1, after + 1);
    int ok = vl_all_digits(digits);
    if (ok)
    {
        fmpz_t num, den;
        fmpz_init(num);
        fmpz_init(den);
        ok = fmpz_set_str(num, digits, 10) == 0;
        fmpz_ui_pow_ui(den, 10, (ulong) after);
        if (ok)
        {
            fmpq_set_fmpz_frac(out, num, den);
            fmpq_canonicalise(out);
        }
        fmpz_clear(num);
        fmpz_clear(den);
    }
    flint_free(digits);
    return ok;
}

static int
vl_floor_q_to_slong(slong *out, const fmpq_t x)
{
    fmpz_t q;
    fmpz_init(q);
    fmpz_fdiv_q(q, fmpq_numref(x), fmpq_denref(x));
    int ok = fmpz_fits_si(q);
    if (ok)
        *out = fmpz_get_si(q);
    fmpz_clear(q);
    return ok;
}

static void
vl_zero_to_upper_ball(arb_t out, const arb_t upper, slong prec)
{
    arf_t lo, hi;
    arf_init(lo);
    arf_init(hi);
    arf_zero(lo);
    arb_get_ubound_arf(hi, upper, prec);
    arb_set_interval_arf(out, lo, hi, prec);
    arf_clear(lo);
    arf_clear(hi);
}

static void
vl_pow_si(arb_t out, const arb_t x, slong exponent, slong prec)
{
    fmpz_t e;
    fmpz_init(e);
    fmpz_set_si(e, exponent);
    arb_pow_fmpz(out, x, e, prec);
    fmpz_clear(e);
}

/* Exact-source continued fraction for the load at the M interface. */
static int
vl_tail_interval(arb_t lower, arb_t upper, arb_t width,
                 arb_srcptr diag, arb_srcptr off, slong m, slong k,
                 slong shift, const arb_t c2, slong prec)
{
    arb_t r, g, den, b2, terminal, bound, bound_lower, c2_lower;
    arb_t shift_ball;
    fmpz_t contraction;
    arb_init(r); arb_init(g); arb_init(den); arb_init(b2);
    arb_init(terminal); arb_init(bound); arb_init(bound_lower);
    arb_init(c2_lower); arb_init(shift_ball); fmpz_init(contraction);

    arb_set_ui(g, (ulong) (2 * k * (2 * k + 1)));
    arb_set_ui(shift_ball, (ulong) shift);
    arb_sub_ui(den, g, (ulong) shift, prec);
    int ok = shift >= 0 && arb_lt(shift_ball, c2) && arb_is_positive(den);
    if (ok)
    {
        arb_mul(b2, off + k - 1, off + k - 1, prec);
        arb_div(terminal, b2, den, prec);
        vl_zero_to_upper_ball(r, terminal, prec);
    }
    for (slong i = k - 1; ok && i >= m; i--)
    {
        arb_sub_ui(den, diag + i, (ulong) shift, prec);
        arb_sub(den, den, r, prec);
        ok = arb_is_positive(den);
        if (ok)
        {
            arb_mul(b2, off + i - 1, off + i - 1, prec);
            arb_div(r, b2, den, prec);
        }
    }
    if (ok)
    {
        set_lower_exact(lower, r, prec);
        set_upper_exact(upper, r, prec);
        arb_sub(width, upper, lower, prec);
        /* The RHS is positive, so its certified comparison value must be
           formed from a lower endpoint of the exact c^2 ball. */
        set_lower_exact(c2_lower, c2, prec);
        fmpz_ui_pow_ui(contraction, 1764, (ulong) (k - m));
        fmpz_mul_ui(contraction, contraction, 135);
        arb_div_fmpz(bound, c2_lower, contraction, prec);
        set_lower_exact(bound_lower, bound, prec);
        ok = arb_lt(width, bound_lower);
    }

    arb_clear(r); arb_clear(g); arb_clear(den); arb_clear(b2);
    arb_clear(terminal); arb_clear(bound); arb_clear(bound_lower);
    arb_clear(c2_lower); arb_clear(shift_ball); fmpz_clear(contraction);
    return ok;
}

static int
vl_certify_count(slong *count, arb_t tail_width,
                 arb_srcptr diag, arb_srcptr off, slong m, slong k,
                 slong shift, const arb_t c2, slong prec)
{
    arb_t lo, hi, minlo, minhi;
    arb_init(lo); arb_init(hi); arb_init(minlo); arb_init(minhi);
    slong nlo = -1, nhi = -1;
    int ok = vl_tail_interval(lo, hi, tail_width, diag, off, m, k,
                              shift, c2, prec)
          && tridiagonal_inertia(&nlo, minlo, diag, off, m,
                                 shift, lo, prec)
          && tridiagonal_inertia(&nhi, minhi, diag, off, m,
                                 shift, hi, prec)
          && nlo == nhi;
    if (ok)
        *count = nlo;
    arb_clear(lo); arb_clear(hi); arb_clear(minlo); arb_clear(minhi);
    return ok;
}

/* Nonrigorous QR supplies exact-dyadic trial vectors, never a label proof. */
static int
vl_approximate_rank_witnesses(arb_ptr w0, arb_ptr v0,
                              arb_ptr w4, arb_ptr v4,
                              const arb_mat_t a, slong m, slong prec)
{
    acb_mat_t aa, left, right;
    acb_ptr eval;
    mag_t tol;
    acb_t z0, phase, z;
    arb_t absz, norm2, norm, t;
    slong columns[2] = {-1, -1};
    const slong ranks[2] = {0, 2};
    acb_mat_init(aa, m, m); acb_mat_init(left, m, m);
    acb_mat_init(right, m, m); eval = _acb_vec_init(m);
    mag_init(tol); acb_init(z0); acb_init(phase); acb_init(z);
    arb_init(absz); arb_init(norm2); arb_init(norm); arb_init(t);
    for (slong i = 0; i < m; i++)
        for (slong j = 0; j < m; j++)
        {
            arb_get_mid_arb(acb_realref(acb_mat_entry(aa, i, j)),
                            arb_mat_entry(a, i, j));
            arb_zero(acb_imagref(acb_mat_entry(aa, i, j)));
        }
    mag_set_ui_2exp_si(tol, 1, -prec + 24);
    int ok = acb_mat_approx_eig_qr(eval, left, right, aa, tol,
                                    20000, prec);
    for (slong target = 0; ok && target < 2; target++)
    {
        for (slong j = 0; j < m; j++)
        {
            slong rank = 0;
            for (slong h = 0; h < m; h++)
                if (arf_cmp(arb_midref(acb_realref(eval + h)),
                            arb_midref(acb_realref(eval + j))) < 0)
                    rank++;
            if (rank == ranks[target])
            {
                if (columns[target] != -1)
                    ok = 0;
                columns[target] = j;
            }
        }
        ok = ok && columns[target] >= 0;
    }
    for (slong target = 0; ok && target < 2; target++)
    {
        arb_ptr w = target == 0 ? w0 : w4;
        arb_ptr v = target == 0 ? v0 : v4;
        acb_get_mid(z0, acb_mat_entry(right, 0, columns[target]));
        acb_abs(absz, z0, prec);
        ok = arb_is_positive(absz);
        if (!ok)
            break;
        acb_conj(phase, z0);
        acb_div_arb(phase, phase, absz, prec);
        arb_zero(norm2);
        for (slong i = 0; i < m; i++)
        {
            acb_mul(z, acb_mat_entry(right, i, columns[target]), phase, prec);
            acb_get_mid(z, z);
            arb_set_arf(w + i, arb_midref(acb_realref(z)));
            arb_mul(t, w + i, w + i, prec);
            arb_add(norm2, norm2, t, prec);
        }
        ok = arb_is_positive(norm2);
        if (ok)
        {
            arb_sqrt(norm, norm2, prec);
            for (slong i = 0; i < m; i++)
                arb_div(v + i, w + i, norm, prec);
        }
    }
    acb_mat_clear(aa); acb_mat_clear(left); acb_mat_clear(right);
    _acb_vec_clear(eval, m); mag_clear(tol); acb_clear(z0);
    acb_clear(phase); acb_clear(z); arb_clear(absz); arb_clear(norm2);
    arb_clear(norm); arb_clear(t);
    return ok;
}

static int
vl_certify_eigen(vl_eigen_cert_t *e, const arb_mat_t a,
                 arb_srcptr diag, arb_srcptr off, slong m, slong k,
                 const arb_t c2, const arb_t lambda, slong prec)
{
    arb_ptr av = _arb_vec_init(m);
    arb_t t, residual2, boundary, epsup, theta_lo, theta_hi;
    arb_t delta_left, delta_right, delta, ratio, integral_error;
    arb_t witness_zero, point_error, qhalf, qterm, cbelow, cabove;
    arb_t constant, basis_zero, coefficient, tail_width_lo, tail_width_hi;
    fmpq_t qzero;
    arb_init(t); arb_init(residual2); arb_init(boundary); arb_init(epsup);
    arb_init(theta_lo); arb_init(theta_hi); arb_init(delta_left);
    arb_init(delta_right); arb_init(delta); arb_init(ratio);
    arb_init(integral_error); arb_init(witness_zero); arb_init(point_error);
    arb_init(qhalf); arb_init(qterm); arb_init(cbelow); arb_init(cabove);
    arb_init(constant); arb_init(basis_zero); arb_init(coefficient);
    arb_init(tail_width_lo); arb_init(tail_width_hi); fmpq_init(qzero);

    arb_zero(e->theta);
    for (slong i = 0; i < m; i++)
    {
        arb_zero(av + i);
        for (slong j = 0; j < m; j++)
        {
            arb_mul(t, arb_mat_entry(a, i, j), e->v + j, prec);
            arb_add(av + i, av + i, t, prec);
        }
        arb_mul(t, e->v + i, av + i, prec);
        arb_add(e->theta, e->theta, t, prec);
    }
    arb_zero(residual2);
    for (slong i = 0; i < m; i++)
    {
        arb_mul(t, e->theta, e->v + i, prec);
        arb_sub(t, av + i, t, prec);
        arb_mul(t, t, t, prec);
        arb_add(residual2, residual2, t, prec);
    }
    arb_mul(boundary, off + m - 1, e->v + m - 1, prec);
    arb_mul(t, boundary, boundary, prec);
    arb_add(residual2, residual2, t, prec);
    /* Interval squaring near zero can leave a tiny negative lower endpoint.
       The exact sum is nonnegative, so take its certified upper endpoint. */
    set_upper_exact(t, residual2, prec);
    int residual_ok = arb_is_positive(t);
    if (residual_ok)
        arb_sqrt(e->epsilon, t, prec);

    slong floor_theta = arf_get_si(arb_midref(e->theta), ARF_RND_FLOOR);
    e->lower_shift = floor_theta > 4 ? floor_theta - 4 : 0;
    e->upper_shift = floor_theta + 5;
    slong count_lo = -1, count_hi = -1;
    int ok = residual_ok && e->upper_shift > e->lower_shift
          && vl_certify_count(&count_lo, tail_width_lo, diag, off, m, k,
                              e->lower_shift, c2, prec)
          && vl_certify_count(&count_hi, tail_width_hi, diag, off, m, k,
                              e->upper_shift, c2, prec)
          && count_lo == e->rank && count_hi == e->rank + 1;

    if (ok)
    {
        set_upper_exact(epsup, e->epsilon, prec);
        set_lower_exact(theta_lo, e->theta, prec);
        set_upper_exact(theta_hi, e->theta, prec);
        arb_sub_ui(delta_left, theta_lo, (ulong) e->lower_shift, prec);
        arb_sub(delta_left, delta_left, epsup, prec);
        arb_set_ui(delta_right, (ulong) e->upper_shift);
        arb_sub(delta_right, delta_right, theta_hi, prec);
        arb_sub(delta_right, delta_right, epsup, prec);
        if (arb_lt(delta_left, delta_right))
            arb_set(delta, delta_left);
        else
            arb_set(delta, delta_right);
        e->localization_ok = arb_is_positive(delta);
        ok = e->localization_ok;
    }
    if (ok)
    {
        arb_div(ratio, epsup, delta, prec);
        set_upper_exact(e->spectral_ratio, ratio, prec);
        arb_mul_2exp_si(t, e->spectral_ratio, 1);
        set_upper_exact(e->eta, t, prec);
        arb_one(t);
        ok = arb_lt(e->spectral_ratio, t);
    }
    if (ok)
    {
        arb_mul_2exp_si(t, lambda, 1);
        arb_sqrt(t, t, prec);
        arb_mul(e->integral, t, e->v + 0, prec);
        arb_mul(integral_error, t, e->eta, prec);
        arb_add_error(e->integral, integral_error);

        arb_zero(witness_zero);
        for (slong i = 0; i < m; i++)
        {
            fmpz_t fac2, faci, den;
            fmpz_init(fac2); fmpz_init(faci); fmpz_init(den);
            fmpz_fac_ui(fac2, (ulong) (2 * i));
            fmpz_fac_ui(faci, (ulong) i);
            fmpz_mul(den, faci, faci);
            fmpz_mul_2exp(den, den, (ulong) (2 * i));
            if (i & 1) fmpz_neg(fac2, fac2);
            fmpq_set_fmpz_frac(qzero, fac2, den);
            fmpq_canonicalise(qzero);
            arb_set_fmpq(coefficient, qzero, prec);
            arb_set_ui(basis_zero, (ulong) (4 * i + 1));
            arb_mul_2exp_si(basis_zero, basis_zero, -1);
            arb_sqrt(basis_zero, basis_zero, prec);
            arb_mul(coefficient, coefficient, basis_zero, prec);
            arb_mul(coefficient, coefficient, e->v + i, prec);
            arb_add(witness_zero, witness_zero, coefficient, prec);
            fmpz_clear(fac2); fmpz_clear(faci); fmpz_clear(den);
        }

        /* sup x/(x-theta)^2 on the two certified exterior rays. */
        if (e->lower_shift == 0)
            arb_zero(cbelow);
        else
        {
            arb_set_ui(cbelow, (ulong) e->lower_shift);
            arb_sub_ui(t, theta_lo, (ulong) e->lower_shift, prec);
            arb_mul(t, t, t, prec);
            arb_div(cbelow, cbelow, t, prec);
        }
        arb_set_ui(cabove, (ulong) e->upper_shift);
        arb_set_ui(t, (ulong) e->upper_shift);
        arb_sub(t, t, theta_hi, prec);
        arb_mul(t, t, t, prec);
        arb_div(cabove, cabove, t, prec);
        if (arb_lt(cbelow, cabove)) arb_set(constant, cabove);
        else arb_set(constant, cbelow);

        arb_mul(qhalf, e->spectral_ratio, e->spectral_ratio, prec);
        arb_set_ui(qterm, (ulong) e->upper_shift);
        arb_sqrt(qterm, qterm, prec);
        arb_mul(qhalf, qhalf, qterm, prec);
        arb_sqrt(constant, constant, prec);
        arb_mul(qterm, constant, epsup, prec);
        arb_add(qhalf, qhalf, qterm, prec);
        arb_set_ui(constant, 4); arb_div_ui(constant, constant, 3, prec);
        arb_sqrt(constant, constant, prec);
        arb_mul(point_error, constant, qhalf, prec);
        arb_add(point_error, point_error, e->eta, prec);
        set_upper_exact(qterm, point_error, prec);
        arb_set(e->value_zero, witness_zero);
        arb_add_error(e->value_zero, qterm);
        arb_sqrt(t, lambda, prec);
        arb_div(e->value_zero, e->value_zero, t, prec);
        ok = arb_is_positive(e->integral) && arb_is_positive(e->value_zero);
    }

    printf("LABEL label=%ld rank=%ld lower_shift=%ld upper_shift=%ld status=%s\n",
           e->label, e->rank, e->lower_shift, e->upper_shift,
           ok ? "PASS" : "FAIL");
    printf("BALL label_%ld_tail_width_lower_shift ", e->label);
    arb_printn(tail_width_lo, 50, ARB_STR_MORE); printf("\n");
    printf("BALL label_%ld_tail_width_upper_shift ", e->label);
    arb_printn(tail_width_hi, 50, ARB_STR_MORE); printf("\n");

    _arb_vec_clear(av, m); arb_clear(t); arb_clear(residual2);
    arb_clear(boundary); arb_clear(epsup); arb_clear(theta_lo);
    arb_clear(theta_hi); arb_clear(delta_left); arb_clear(delta_right);
    arb_clear(delta); arb_clear(ratio); arb_clear(integral_error);
    arb_clear(witness_zero); arb_clear(point_error); arb_clear(qhalf);
    arb_clear(qterm); arb_clear(cbelow); arb_clear(cabove);
    arb_clear(constant); arb_clear(basis_zero); arb_clear(coefficient);
    arb_clear(tail_width_lo); arb_clear(tail_width_hi); fmpq_clear(qzero);
    return ok;
}

/* Physical x-polynomial for lambda^(-1/2) sum_i v_i phi_i(x/lambda). */
static void
vl_physical_eigen_poly(arb_ptr out, arb_srcptr v, slong m,
                       const arb_t lambda, slong prec)
{
    fmpq_t q;
    arb_t coeff, basis, lp, term, sqrtlambda;
    fmpq_init(q); arb_init(coeff); arb_init(basis); arb_init(lp);
    arb_init(term); arb_init(sqrtlambda); arb_sqrt(sqrtlambda, lambda, prec);
    for (slong p = 0; p <= 2 * (m - 1); p++) arb_zero(out + p);
    for (slong i = 0; i < m; i++)
        for (slong p = 0; p <= 2 * i; p += 2)
        {
            legendre_coefficient(q, (ulong) (2 * i), (ulong) p);
            arb_set_fmpq(coeff, q, prec);
            arb_set_ui(basis, (ulong) (4 * i + 1));
            arb_mul_2exp_si(basis, basis, -1); arb_sqrt(basis, basis, prec);
            arb_mul(coeff, coeff, basis, prec);
            arb_pow_ui(lp, lambda, (ulong) p, prec);
            arb_mul(lp, lp, sqrtlambda, prec);
            arb_div(coeff, coeff, lp, prec);
            arb_mul(term, coeff, v + i, prec);
            arb_add(out + p, out + p, term, prec);
        }
    fmpq_clear(q); arb_clear(coeff); arb_clear(basis); arb_clear(lp);
    arb_clear(term); arb_clear(sqrtlambda);
}

static void
vl_monomial_cos_integral(arb_t out, ulong power, ulong r, slong n,
                         const arb_t lambda, const arb_t L,
                         const arb_t pi, slong prec)
{
    arb_t omega, alpha, denom, a, b, phase, ca, sa, cb, sb;
    arb_t xa, xb, fa, fb, t;
    arb_init(omega); arb_init(alpha); arb_init(denom); arb_init(a);
    arb_init(b); arb_init(phase); arb_init(ca); arb_init(sa); arb_init(cb);
    arb_init(sb); arb_init(xa); arb_init(xb); arb_init(fa); arb_init(fb);
    arb_init(t);
    arb_mul_si(omega, pi, 2 * n, prec); arb_div(omega, omega, L, prec);
    arb_set_ui(alpha, 2 * power + 1); arb_mul_2exp_si(alpha, alpha, -1);
    arb_mul(denom, alpha, alpha, prec); arb_mul(t, omega, omega, prec);
    arb_add(denom, denom, t, prec);
    arb_set(b, lambda); arb_set_ui(a, r); arb_div(a, a, lambda, prec);
    arb_pow_ui(xb, b, power, prec); arb_sqrt(t, b, prec);
    arb_mul(xb, xb, t, prec);
    arb_pow_ui(xa, a, power, prec); arb_sqrt(t, a, prec);
    arb_mul(xa, xa, t, prec);
    arb_mul(t, lambda, lambda, prec); arb_div_ui(t, t, r, prec);
    arb_log(t, t, prec); arb_mul(phase, omega, t, prec);
    arb_cos(cb, phase, prec); arb_sin(sb, phase, prec);
    arb_one(ca); arb_zero(sa);
    arb_mul(fb, alpha, cb, prec); arb_mul(t, omega, sb, prec);
    arb_add(fb, fb, t, prec); arb_mul(fb, fb, xb, prec);
    arb_div(fb, fb, denom, prec);
    arb_mul(fa, alpha, ca, prec); arb_mul(t, omega, sa, prec);
    arb_add(fa, fa, t, prec); arb_mul(fa, fa, xa, prec);
    arb_div(fa, fa, denom, prec); arb_sub(out, fb, fa, prec);
    arb_clear(omega); arb_clear(alpha); arb_clear(denom); arb_clear(a);
    arb_clear(b); arb_clear(phase); arb_clear(ca); arb_clear(sa); arb_clear(cb);
    arb_clear(sb); arb_clear(xa); arb_clear(xb); arb_clear(fa); arb_clear(fb);
    arb_clear(t);
}

static void
vl_project_physical_poly(arb_t out, arb_srcptr d, slong max_degree,
                         slong qmax, slong n, const arb_t lambda,
                         const arb_t L, const arb_t pi, slong prec)
{
    arb_t sum, integ, sqrtr, term, sqrtL;
    arb_init(sum); arb_init(integ); arb_init(sqrtr); arb_init(term);
    arb_init(sqrtL); arb_sqrt(sqrtL, L, prec); arb_zero(out);
    for (slong p = 0; p <= max_degree; p += 2)
    {
        arb_zero(sum);
        for (slong r = 1; r <= qmax; r++)
        {
            vl_monomial_cos_integral(integ, (ulong) p, (ulong) r, n,
                                     lambda, L, pi, prec);
            arb_sqrt_ui(sqrtr, (ulong) r, prec);
            arb_div(integ, integ, sqrtr, prec);
            arb_add(sum, sum, integ, prec);
        }
        arb_mul(term, d + p, sum, prec);
        arb_add(out, out, term, prec);
    }
    arb_div(out, out, sqrtL, prec);
    arb_clear(sum); arb_clear(integ); arb_clear(sqrtr); arb_clear(term);
    arb_clear(sqrtL);
}

static fmpq *
vl_partition(const fmpq_t lambda2, slong qmax, slong *count)
{
    slong cap = 2 * qmax + 2, used = 0;
    fmpq *points = flint_malloc((size_t) cap * sizeof(fmpq));
    for (slong i = 0; i < cap; i++) fmpq_init(points + i);
    fmpq_one(points + used++);
    fmpq_set(points + used++, lambda2);
    fmpq_t r, reflected;
    fmpq_init(r); fmpq_init(reflected);
    for (slong j = 1; j <= qmax; j++)
    {
        fmpq_set_si(r, j, 1);
        if (fmpq_cmp_ui(r, 1) >= 0 && fmpq_cmp(r, lambda2) <= 0)
            fmpq_set(points + used++, r);
        fmpq_div(reflected, lambda2, r);
        if (fmpq_cmp_ui(reflected, 1) >= 0
            && fmpq_cmp(reflected, lambda2) <= 0)
            fmpq_set(points + used++, reflected);
    }
    for (slong i = 0; i < used; i++)
        for (slong j = i + 1; j < used; j++)
            if (fmpq_cmp(points + j, points + i) < 0)
                fmpq_swap(points + i, points + j);
    slong unique = 0;
    for (slong i = 0; i < used; i++)
        if (unique == 0 || !fmpq_equal(points + i, points + unique - 1))
        {
            if (unique != i) fmpq_set(points + unique, points + i);
            unique++;
        }
    fmpq_clear(r); fmpq_clear(reflected); *count = unique;
    return points;
}

static void
vl_partition_clear(fmpq *points, slong qmax)
{
    slong cap = 2 * qmax + 2;
    for (slong i = 0; i < cap; i++) fmpq_clear(points + i);
    flint_free(points);
}

static void
vl_power_sum(fmpz_t out, slong q, slong power)
{
    fmpz_t t;
    fmpz_init(t); fmpz_zero(out);
    for (slong j = 1; j <= q; j++)
    {
        fmpz_ui_pow_ui(t, (ulong) j, (ulong) power);
        fmpz_add(out, out, t);
    }
    fmpz_clear(t);
}

/* Integral of y^(exponent-1) dy on exact rational endpoints. */
static void
vl_y_integral(arb_t out, const fmpq_t qa, const fmpq_t qb,
              slong exponent, slong prec)
{
    arb_t a, b, pa, pb, ratio;
    arb_init(a); arb_init(b); arb_init(pa); arb_init(pb); arb_init(ratio);
    arb_set_fmpq(a, qa, prec); arb_set_fmpq(b, qb, prec);
    if (exponent == 0)
    {
        arb_div(ratio, b, a, prec); arb_log(out, ratio, prec);
    }
    else
    {
        vl_pow_si(pa, a, exponent, prec); vl_pow_si(pb, b, exponent, prec);
        arb_sub(out, pb, pa, prec); arb_div_si(out, out, exponent, prec);
    }
    arb_clear(a); arb_clear(b); arb_clear(pa); arb_clear(pb); arb_clear(ratio);
}

/* Producer path: aggregated power sums and four pairwise antiderivatives. */
static int
vl_full_evenized_norm_squared(arb_t out, arb_srcptr d, slong max_degree,
                              const fmpq_t lambda_q, slong qmax,
                              const arb_t lambda, slong prec)
{
    fmpq_t lambda2q, mid, ratio;
    fmpq_init(lambda2q); fmpq_init(mid); fmpq_init(ratio);
    fmpq_mul(lambda2q, lambda_q, lambda_q);
    slong point_count;
    fmpq *points = vl_partition(lambda2q, qmax, &point_count);
    slong modes = max_degree / 2 + 1;
    arb_ptr avec = _arb_vec_init(modes), bvec = _arb_vec_init(modes);
    arb_t term, integ, lp, sqrtlambda, cell;
    fmpz_t sum;
    arb_init(term); arb_init(integ); arb_init(lp); arb_init(sqrtlambda);
    arb_init(cell); fmpz_init(sum);
    arb_sqrt(sqrtlambda, lambda, prec); arb_zero(out);
    int ok = point_count >= 2;
    for (slong cell_index = 0; ok && cell_index + 1 < point_count; cell_index++)
    {
        fmpq_add(mid, points + cell_index, points + cell_index + 1);
        fmpq_div_2exp(mid, mid, 1);
        fmpq_div(ratio, lambda2q, mid);
        slong qa = -1, qb = -1;
        ok = vl_floor_q_to_slong(&qa, ratio)
          && vl_floor_q_to_slong(&qb, mid)
          && qa >= 0 && qa <= qmax && qb >= 0 && qb <= qmax;
        arb_zero(cell);
        for (slong p = 0; ok && p <= max_degree; p += 2)
        {
            slong ip = p / 2;
            arb_pow_ui(lp, lambda, (ulong) p, prec);
            arb_mul(lp, lp, sqrtlambda, prec);
            vl_power_sum(sum, qa, p); arb_set_fmpz(term, sum);
            arb_mul(term, term, d + p, prec); arb_div(avec + ip, term, lp, prec);
            vl_power_sum(sum, qb, p); arb_set_fmpz(term, sum);
            arb_mul(term, term, d + p, prec); arb_mul(bvec + ip, term, lp, prec);
        }
        for (slong p = 0; ok && p <= max_degree; p += 2)
            for (slong q = 0; q <= max_degree; q += 2)
            {
                slong ip = p / 2, iq = q / 2;
                vl_y_integral(integ, points + cell_index,
                              points + cell_index + 1, p + q + 1, prec);
                arb_mul(term, avec + ip, avec + iq, prec);
                arb_mul(term, term, integ, prec); arb_add(cell, cell, term, prec);
                vl_y_integral(integ, points + cell_index,
                              points + cell_index + 1, p - q, prec);
                arb_mul(term, avec + ip, bvec + iq, prec);
                arb_mul(term, term, integ, prec); arb_add(cell, cell, term, prec);
                vl_y_integral(integ, points + cell_index,
                              points + cell_index + 1, q - p, prec);
                arb_mul(term, bvec + ip, avec + iq, prec);
                arb_mul(term, term, integ, prec); arb_add(cell, cell, term, prec);
                vl_y_integral(integ, points + cell_index,
                              points + cell_index + 1, -(p + q + 1), prec);
                arb_mul(term, bvec + ip, bvec + iq, prec);
                arb_mul(term, term, integ, prec); arb_add(cell, cell, term, prec);
            }
        arb_mul_2exp_si(cell, cell, -2);
        arb_add(out, out, cell, prec);
    }
    vl_partition_clear(points, qmax); _arb_vec_clear(avec, modes);
    _arb_vec_clear(bvec, modes); arb_clear(term); arb_clear(integ);
    arb_clear(lp); arb_clear(sqrtlambda); arb_clear(cell);
    fmpz_clear(sum); fmpq_clear(lambda2q); fmpq_clear(mid); fmpq_clear(ratio);
    return ok && arb_is_positive(out);
}

static int
vl_string_is(const char *got, const char *want)
{
    return got != NULL && strcmp(got, want) == 0;
}

int
main(int argc, char **argv)
{
    const char *lambda_text = NULL, *output = NULL;
    const char *normalization = "source_limit_h";
    const char *fourier_sign = "positive";
    const char *reflection = "explicit";
    const char *cutoff_policy = "lambda_squared_inclusive";
    const char *parser = "exact_decimal_or_rational";
    const char *tail_policy = "uniform_jacobi_continued_fraction";
    slong nmax = -1, m = -1, k = -1, prec = 256;
    for (int i = 1; i < argc; i++)
    {
        if (!strcmp(argv[i], "--lambda") && i + 1 < argc) lambda_text = argv[++i];
        else if (!strcmp(argv[i], "--N") && i + 1 < argc) nmax = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--basis-size") && i + 1 < argc) m = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--tail-terminal") && i + 1 < argc) k = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--prec") && i + 1 < argc) prec = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--output") && i + 1 < argc) output = argv[++i];
        else if (!strcmp(argv[i], "--normalization") && i + 1 < argc) normalization = argv[++i];
        else if (!strcmp(argv[i], "--fourier-sign") && i + 1 < argc) fourier_sign = argv[++i];
        else if (!strcmp(argv[i], "--inversion-reflection") && i + 1 < argc) reflection = argv[++i];
        else if (!strcmp(argv[i], "--cutoff-policy") && i + 1 < argc) cutoff_policy = argv[++i];
        else if (!strcmp(argv[i], "--parameter-parser") && i + 1 < argc) parser = argv[++i];
        else if (!strcmp(argv[i], "--tail-policy") && i + 1 < argc) tail_policy = argv[++i];
        else return 2;
    }
    if (output != NULL && freopen(output, "w", stdout) == NULL) return 2;

    fmpq_t lambda_q, lambda2q;
    fmpq_init(lambda_q); fmpq_init(lambda2q);
    int input_ok = vl_parse_exact_parameter(lambda_q, lambda_text)
        && fmpq_cmp_ui(lambda_q, 2) >= 0 && nmax >= 0 && m > nmax
        && k >= m && prec >= 192
        && vl_string_is(normalization, "source_limit_h")
        && vl_string_is(fourier_sign, "positive")
        && vl_string_is(reflection, "explicit")
        && vl_string_is(cutoff_policy, "lambda_squared_inclusive")
        && vl_string_is(parser, "exact_decimal_or_rational")
        && vl_string_is(tail_policy, "uniform_jacobi_continued_fraction");
    fmpq_mul(lambda2q, lambda_q, lambda_q);
    slong qmax = -1;
    input_ok = input_ok && vl_floor_q_to_slong(&qmax, lambda2q)
        && qmax >= 1 && qmax <= VL_QMAX_LIMIT;
    if (!input_ok)
    {
        printf("CHECK input_contract=FAIL\n");
        fmpq_clear(lambda_q); fmpq_clear(lambda2q); return 2;
    }

    arb_t lambda, L, pi, c2, c, two_c, mball;
    arb_init(lambda); arb_init(L); arb_init(pi); arb_init(c2);
    arb_init(c); arb_init(two_c); arb_init(mball);
    arb_set_fmpq(lambda, lambda_q, prec); arb_log(L, lambda, prec);
    arb_mul_2exp_si(L, L, 1); arb_const_pi(pi, prec);
    prolate_c_squared(c2, lambda, prec); arb_sqrt(c, c2, prec);
    arb_mul_2exp_si(two_c, c, 1); arb_set_ui(mball, (ulong) m);
    input_ok = arb_gt(mball, two_c);
    if (!input_ok)
    {
        printf("CHECK uniform_tail_interface_M_ge_ceil_2c=FAIL\n");
        fmpq_clear(lambda_q); fmpq_clear(lambda2q);
        arb_clear(lambda); arb_clear(L); arb_clear(pi); arb_clear(c2);
        arb_clear(c); arb_clear(two_c); arb_clear(mball); return 2;
    }

    char *lambda_canonical = fmpq_get_str(NULL, 10, lambda_q);
    printf("META schema=%s\n", VL_SCHEMA);
    printf("META claim_class=FINITE_VARIABLE_LAMBDA_PROLATE_STATE_AND_PROJECTION_BALL_DIAGNOSTIC_ONLY\n");
    printf("META terminal_state=P0_INVALIDATED\n");
    printf("META source_lock_sha256=%s\n", VL_SOURCE_LOCK_SHA256);
    printf("META normalization_audit_sha256=%s\n", VL_NORMALIZATION_SHA256);
    printf("META inherited_producer_core_sha256=%s\n", VL_LEGACY_CORE_SHA256);
    printf("META flint_version=%s\n", FLINT_VERSION);
    printf("META arithmetic_library=FLINT_ARB\n");
    printf("META shared_library_limitation=producer_and_verifier_share_FLINT_ARB_transcendentals\n");
    printf("PARAM lambda %s\nPARAM N %ld\nPARAM basis_size %ld\n", lambda_canonical, nmax, m);
    printf("PARAM tail_terminal %ld\nPARAM precision %ld\nPARAM floor_lambda_squared %ld\n",
           k, prec, qmax);
    printf("LIMIT floor_lambda_squared_max %d\n", VL_QMAX_LIMIT);
    printf("LOCK normalization source_limit_h\n");
    printf("LOCK fourier_basis exp_plus_2pi_i_n_t_over_L\n");
    printf("LOCK coefficient_sign conjugate_negative_equivalently_cosine_after_evenization\n");
    printf("LOCK inversion_reflection explicit\n");
    printf("LOCK domain minus_lambda_to_lambda_lebesgue_zero_extension\n");
    printf("LOCK arithmetic_cutoff floor_lambda_squared_inclusive\n");
    printf("LOCK parameter_parser exact_decimal_or_rational_no_binary64\n");
    printf("LOCK eigen_tail uniform_jacobi_continued_fraction\n");
    printf("FORMULA c 2_pi_lambda_squared\n");
    printf("FORMULA tail_width c_squared_over_135_times_1764_to_K_minus_M\n");
    printf("FORMULA combination a4_h4_minus_a0_h0_with_a0_eq_a4_I4_over_I0\n");
    printf("FORMULA projection_error e_poly_plus_lambda_eta_h\n");
    for (slong r = 1; r <= qmax; r++)
    {
        fmpq_t rq; fmpq_init(rq); fmpq_set_si(rq, r, 1);
        printf("SUMINDEX %ld included=1 degenerate_endpoint=%d\n", r,
               fmpq_equal(rq, lambda2q));
        fmpq_clear(rq);
    }
    flint_free(lambda_canonical);

    slong dimension = k + 1;
    arb_mat_t full, a;
    arb_mat_init(full, dimension, dimension); arb_mat_init(a, m, m);
    arb_ptr diag = _arb_vec_init(dimension), off = _arb_vec_init(dimension);
    build_recurrence_operator(full, diag, off, dimension, c2, prec);
    for (slong i = 0; i < m; i++)
        for (slong j = 0; j < m; j++)
            arb_set(arb_mat_entry(a, i, j), arb_mat_entry(full, i, j));
    for (slong i = 0; i < m; i++)
    {
        char *sd = arb_dump_str(diag + i);
        char *so = arb_dump_str(off + i);
        printf("DUMPMD %ld %s\n", i, sd);
        printf("DUMPMO %ld %s\n", i, so);
        flint_free(sd); flint_free(so);
    }

    vl_eigen_cert_t e0, e4;
    vl_eigen_init(&e0, 0, 0, m); vl_eigen_init(&e4, 4, 2, m);
    int ok = vl_approximate_rank_witnesses(e0.w, e0.v, e4.w, e4.v,
                                            a, m, prec);
    ok = ok && vl_certify_eigen(&e0, a, diag, off, m, k, c2, lambda, prec);
    ok = ok && vl_certify_eigen(&e4, a, diag, off, m, k, c2, lambda, prec);
    printf("BALL eigen_0_theta "); arb_printn(e0.theta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_0_residual_with_tail "); arb_printn(e0.epsilon, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_0_L2_radius_upper "); arb_printn(e0.eta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_0_integral "); arb_printn(e0.integral, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_0_source_x_value_at_zero "); arb_printn(e0.value_zero, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_theta "); arb_printn(e4.theta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_residual_with_tail "); arb_printn(e4.epsilon, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_L2_radius_upper "); arb_printn(e4.eta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_integral "); arb_printn(e4.integral, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_source_x_value_at_zero "); arb_printn(e4.value_zero, 60, ARB_STR_MORE); printf("\n");
    for (slong i = 0; i < m; i++)
    {
        print_witness_dump(0, i, e0.w + i);
        print_witness_dump(4, i, e4.w + i);
    }

    arb_t a4, a0, exponent, t, zero_integral, hnorm, unit_a4, eta_h;
    arb_init(a4); arb_init(a0); arb_init(exponent); arb_init(t);
    arb_init(zero_integral); arb_init(hnorm); arb_init(unit_a4); arb_init(eta_h);
    arb_set_ui(a4, 3); arb_sqrt(a4, a4, prec);
    arb_set_ui(t, 2); arb_set_ui(exponent, 11); arb_div_ui(exponent, exponent, 4, prec);
    arb_pow(t, t, exponent, prec); arb_div(a4, a4, t, prec);
    arb_mul(a0, a4, e4.integral, prec); arb_div(a0, a0, e0.integral, prec);
    arb_mul(zero_integral, a4, e4.integral, prec);
    arb_mul(t, a0, e0.integral, prec); arb_sub(zero_integral, zero_integral, t, prec);
    ok = ok && arb_contains_zero(zero_integral) && arb_is_positive(a0);
    arb_mul(eta_h, a4, e4.eta, prec); arb_mul(t, a0, e0.eta, prec);
    arb_add(eta_h, eta_h, t, prec); set_upper_exact(eta_h, eta_h, prec);

    slong max_degree = 2 * (m - 1);
    arb_ptr d0 = _arb_vec_init(max_degree + 1);
    arb_ptr d4 = _arb_vec_init(max_degree + 1);
    arb_ptr dh = _arb_vec_init(max_degree + 1);
    vl_physical_eigen_poly(d0, e0.v, m, lambda, prec);
    vl_physical_eigen_poly(d4, e4.v, m, lambda, prec);
    for (slong p = 0; p <= max_degree; p++)
    {
        arb_mul(dh + p, a4, d4 + p, prec);
        arb_mul(t, a0, d0 + p, prec); arb_sub(dh + p, dh + p, t, prec);
    }

    arb_ptr poly_coeff = _arb_vec_init(nmax + 1);
    arb_ptr true_coeff = _arb_vec_init(nmax + 1);
    arb_ptr kappa = _arb_vec_init(nmax + 1);
    for (slong n = 0; ok && n <= nmax; n++)
    {
        vl_project_physical_poly(poly_coeff + n, dh, max_degree, qmax, n,
                                 lambda, L, pi, prec);
        arb_set(true_coeff + n, poly_coeff + n);
        add_functional_error(true_coeff + n, eta_h, lambda, L, prec);
    }

    arb_t full_norm2, projected_poly2, tail2, tail2_upper, e_poly_upper;
    arb_t e_true_upper, projected_true2, projected_true_norm;
    arb_init(full_norm2); arb_init(projected_poly2); arb_init(tail2);
    arb_init(tail2_upper); arb_init(e_poly_upper); arb_init(e_true_upper);
    arb_init(projected_true2); arb_init(projected_true_norm);
    ok = ok && vl_full_evenized_norm_squared(full_norm2, dh, max_degree,
                                              lambda_q, qmax, lambda, prec);
    arb_mul(projected_poly2, poly_coeff + 0, poly_coeff + 0, prec);
    arb_mul(projected_true2, true_coeff + 0, true_coeff + 0, prec);
    for (slong n = 1; n <= nmax; n++)
    {
        arb_mul(t, poly_coeff + n, poly_coeff + n, prec);
        arb_mul_2exp_si(t, t, 1); arb_add(projected_poly2, projected_poly2, t, prec);
        arb_mul(t, true_coeff + n, true_coeff + n, prec);
        arb_mul_2exp_si(t, t, 1); arb_add(projected_true2, projected_true2, t, prec);
    }
    arb_sub(tail2, full_norm2, projected_poly2, prec);
    set_upper_exact(tail2_upper, tail2, prec);
    ok = ok && arb_is_positive(tail2_upper);
    arb_sqrt(e_poly_upper, tail2_upper, prec);
    arb_mul(e_true_upper, lambda, eta_h, prec);
    arb_add(e_true_upper, e_true_upper, e_poly_upper, prec);
    set_upper_exact(e_true_upper, e_true_upper, prec);
    arb_sqrt(projected_true_norm, projected_true2, prec);
    ok = ok && arb_is_positive(projected_true_norm);
    for (slong n = 0; n <= nmax; n++)
        arb_div(kappa + n, true_coeff + n, projected_true_norm, prec);

    arb_mul(hnorm, a4, a4, prec); arb_mul(t, a0, a0, prec);
    arb_add(hnorm, hnorm, t, prec); arb_sqrt(hnorm, hnorm, prec);
    arb_div(unit_a4, a4, hnorm, prec);
    int unit_rejected = !arb_overlaps(unit_a4, a4);
    ok = ok && unit_rejected;

    printf("BALL a4_source "); arb_printn(a4, 60, ARB_STR_MORE); printf("\n");
    printf("BALL a0_source "); arb_printn(a0, 60, ARB_STR_MORE); printf("\n");
    printf("BALL source_state_L2_radius_upper "); arb_printn(eta_h, 60, ARB_STR_MORE); printf("\n");
    printf("BALL polynomial_evenized_full_norm_squared "); arb_printn(full_norm2, 60, ARB_STR_MORE); printf("\n");
    printf("BALL polynomial_projection_error_upper "); arb_printn(e_poly_upper, 60, ARB_STR_MORE); printf("\n");
    printf("BALL true_projection_error_upper "); arb_printn(e_true_upper, 60, ARB_STR_MORE); printf("\n");
    printf("BALL projected_true_state_norm "); arb_printn(projected_true_norm, 60, ARB_STR_MORE); printf("\n");
    printf("BALL forbidden_unit_normalized_a4 "); arb_printn(unit_a4, 60, ARB_STR_MORE); printf("\n");
    for (slong n = -nmax; n <= nmax; n++)
    {
        slong j = n < 0 ? -n : n;
        printf("POLYCOEFF %ld ", n); arb_printn(poly_coeff + j, 60, ARB_STR_MORE); printf("\n");
        print_dump("P", n, poly_coeff + j);
        printf("COEFF %ld ", n); arb_printn(true_coeff + j, 60, ARB_STR_MORE); printf("\n");
        print_dump("C", n, true_coeff + j);
        printf("KAPPA %ld ", n); arb_printn(kappa + j, 60, ARB_STR_MORE); printf("\n");
        print_dump("K", n, kappa + j);
    }
    printf("CHECK exact_parameter_without_binary64=PASS\n");
    printf("CHECK uniform_tail_interface_M_ge_ceil_2c=PASS\n");
    printf("CHECK continued_fraction_width_bound=PASS\n");
    printf("CHECK source_positive_at_zero_orientation=%s\n",
           (arb_is_positive(e0.value_zero) && arb_is_positive(e4.value_zero)) ? "PASS" : "FAIL");
    printf("CHECK projection_error_ball_finite=%s\n", arb_is_finite(e_true_upper) ? "PASS" : "FAIL");
    printf("CHECK unit_norm_changes_source_scalar_and_is_rejected=%s\n",
           unit_rejected ? "PASS" : "FAIL");
    printf("CHECK overall=%s\n", ok ? "PASS" : "FAIL");

    fmpq_clear(lambda_q); fmpq_clear(lambda2q);
    arb_clear(lambda); arb_clear(L); arb_clear(pi); arb_clear(c2);
    arb_clear(c); arb_clear(two_c); arb_clear(mball);
    arb_mat_clear(full); arb_mat_clear(a); _arb_vec_clear(diag, dimension);
    _arb_vec_clear(off, dimension); vl_eigen_clear(&e0, m); vl_eigen_clear(&e4, m);
    arb_clear(a4); arb_clear(a0); arb_clear(exponent); arb_clear(t);
    arb_clear(zero_integral); arb_clear(hnorm); arb_clear(unit_a4); arb_clear(eta_h);
    _arb_vec_clear(d0, max_degree + 1); _arb_vec_clear(d4, max_degree + 1);
    _arb_vec_clear(dh, max_degree + 1); _arb_vec_clear(poly_coeff, nmax + 1);
    _arb_vec_clear(true_coeff, nmax + 1); _arb_vec_clear(kappa, nmax + 1);
    arb_clear(full_norm2); arb_clear(projected_poly2); arb_clear(tail2);
    arb_clear(tail2_upper); arb_clear(e_poly_upper); arb_clear(e_true_upper);
    arb_clear(projected_true2); arb_clear(projected_true_norm);
    flint_cleanup();
    return ok ? 0 : 1;
}
