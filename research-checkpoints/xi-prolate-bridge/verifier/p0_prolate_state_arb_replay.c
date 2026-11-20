/*
   Independent replay for src/p0_prolate_state_arb.c.

   The producer's exact-dyadic witness vectors are treated only as trial
   vectors.  This verifier reconstructs the differential-form matrix using
   exact Legendre polynomials, redoes the infinite-tail residual and inertia
   proof, and evaluates projection coefficients with a complex-power
   antiderivative instead of the producer's real sine/cosine formula.

   Both paths use FLINT/Arb transcendental functions.  That shared-library
   limitation is explicit in every output.
*/
#include <flint/flint.h>
#include <flint/arb.h>
#include <flint/arb_mat.h>
#include <flint/acb.h>
#include <flint/fmpq.h>
#include <flint/fmpq_poly.h>
#include <flint/fmpz.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SOURCE_SHA256 "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
#define SCHEMA "p0_prolate_state_ball_v1"

typedef struct
{
    arb_ptr w0;
    arb_ptr w4;
    int *w0_seen;
    int *w4_seen;
    arb_ptr coeff;
    arb_ptr kappa;
    int *coeff_seen;
    int *kappa_seen;
    int lambda_ok;
    int n_ok;
    int m_ok;
    int precision_ok;
    int source_ok;
    int normalization_ok;
    int fourier_ok;
    int reflection_ok;
    int cutoff_ok;
    int tail_ok;
    int sum_seen[5];
    int sum_endpoint_ok;
    slong producer_precision;
} producer_data_t;

typedef struct
{
    slong label;
    arb_ptr v;
    arb_t theta;
    arb_t epsilon;
    arb_t spectral_ratio;
    arb_t eta;
    arb_t integral;
    arb_t value_zero;
    int localization_ok;
} eigen_cert_t;

static void
set_upper_exact(arb_t out, const arb_t x, slong prec)
{
    arf_t u;
    arf_init(u);
    arb_get_ubound_arf(u, x, prec);
    arb_set_arf(out, u);
    arf_clear(u);
}

static void
set_lower_exact(arb_t out, const arb_t x, slong prec)
{
    arf_t l;
    arf_init(l);
    arb_get_lbound_arf(l, x, prec);
    arb_set_arf(out, l);
    arf_clear(l);
}

static void
print_dump(const char *kind, slong index, const arb_t x)
{
    char *s = arb_dump_str(x);
    printf("DUMP%s %ld %s\n", kind, index, s);
    flint_free(s);
}

static void
producer_data_init(producer_data_t *d, slong m, slong nmax)
{
    slong count = 2 * nmax + 1;
    memset(d, 0, sizeof(*d));
    d->w0 = _arb_vec_init(m);
    d->w4 = _arb_vec_init(m);
    d->coeff = _arb_vec_init(count);
    d->kappa = _arb_vec_init(count);
    d->w0_seen = flint_calloc((size_t) m, sizeof(int));
    d->w4_seen = flint_calloc((size_t) m, sizeof(int));
    d->coeff_seen = flint_calloc((size_t) count, sizeof(int));
    d->kappa_seen = flint_calloc((size_t) count, sizeof(int));
}

static void
producer_data_clear(producer_data_t *d, slong m, slong nmax)
{
    slong count = 2 * nmax + 1;
    _arb_vec_clear(d->w0, m);
    _arb_vec_clear(d->w4, m);
    _arb_vec_clear(d->coeff, count);
    _arb_vec_clear(d->kappa, count);
    flint_free(d->w0_seen);
    flint_free(d->w4_seen);
    flint_free(d->coeff_seen);
    flint_free(d->kappa_seen);
}

static int
load_producer(producer_data_t *d, const char *path, slong m, slong nmax,
              slong requested_prec)
{
    FILE *f = fopen(path, "r");
    if (f == NULL)
        return 0;
    char line[16384], dump[15000], text[512];
    slong a, b, included, degenerate;
    while (fgets(line, sizeof(line), f) != NULL)
    {
        if (sscanf(line, "PARAM lambda %511s", text) == 1)
            d->lambda_ok = strcmp(text, "2") == 0;
        else if (sscanf(line, "PARAM N %ld", &a) == 1)
            d->n_ok = a == nmax;
        else if (sscanf(line, "PARAM basis_size %ld", &a) == 1)
            d->m_ok = a == m;
        else if (sscanf(line, "PARAM precision %ld", &a) == 1)
        {
            d->producer_precision = a;
            d->precision_ok = a == requested_prec;
        }
        else if (sscanf(line, "META source_pdf_sha256=%511s", text) == 1)
            d->source_ok = strcmp(text, SOURCE_SHA256) == 0;
        else if (!strcmp(line, "LOCK normalization source_limit_h\n"))
            d->normalization_ok = 1;
        else if (!strcmp(line, "LOCK fourier_basis exp_plus_2pi_i_n_t_over_L\n"))
            d->fourier_ok = 1;
        else if (!strcmp(line, "LOCK inversion_reflection explicit\n"))
            d->reflection_ok = 1;
        else if (!strcmp(line, "LOCK arithmetic_cutoff floor_lambda_squared_inclusive\n"))
            d->cutoff_ok = 1;
        else if (!strcmp(line, "LOCK eigen_tail infinite_residual_and_schur\n"))
            d->tail_ok = 1;
        else if (sscanf(line, "SUMINDEX %ld included=%ld degenerate_endpoint=%ld",
                        &a, &included, &degenerate) == 3)
        {
            if (a < 1 || a > 4 || included != 1 || d->sum_seen[a])
            {
                fclose(f);
                return 0;
            }
            d->sum_seen[a] = 1;
            if (a == 4 && degenerate == 1)
                d->sum_endpoint_ok = 1;
            if (a != 4 && degenerate != 0)
            {
                fclose(f);
                return 0;
            }
        }
        else if (sscanf(line, "DUMPW %ld %ld %14999[^\n]", &a, &b, dump) == 3)
        {
            if (b < 0 || b >= m)
            {
                fclose(f);
                return 0;
            }
            arb_ptr target;
            int *seen;
            if (a == 0)
            {
                target = d->w0 + b;
                seen = d->w0_seen + b;
            }
            else if (a == 4)
            {
                target = d->w4 + b;
                seen = d->w4_seen + b;
            }
            else
            {
                fclose(f);
                return 0;
            }
            if (*seen || arb_load_str(target, dump) != 0 || !arb_is_exact(target))
            {
                fclose(f);
                return 0;
            }
            *seen = 1;
        }
        else if (sscanf(line, "DUMPC %ld %14999[^\n]", &a, dump) == 2)
        {
            if (a < -nmax || a > nmax || d->coeff_seen[a + nmax]
                || arb_load_str(d->coeff + a + nmax, dump) != 0)
            {
                fclose(f);
                return 0;
            }
            d->coeff_seen[a + nmax] = 1;
        }
        else if (sscanf(line, "DUMPK %ld %14999[^\n]", &a, dump) == 2)
        {
            if (a < -nmax || a > nmax || d->kappa_seen[a + nmax]
                || arb_load_str(d->kappa + a + nmax, dump) != 0)
            {
                fclose(f);
                return 0;
            }
            d->kappa_seen[a + nmax] = 1;
        }
    }
    fclose(f);

    int ok = d->lambda_ok && d->n_ok && d->m_ok && d->precision_ok
          && d->source_ok && d->normalization_ok && d->fourier_ok
          && d->reflection_ok && d->cutoff_ok && d->tail_ok
          && d->sum_endpoint_ok;
    for (slong r = 1; r <= 4; r++) ok = ok && d->sum_seen[r];
    for (slong i = 0; i < m; i++)
        ok = ok && d->w0_seen[i] && d->w4_seen[i];
    for (slong i = 0; i < 2 * nmax + 1; i++)
        ok = ok && d->coeff_seen[i] && d->kappa_seen[i];
    for (slong n = 1; n <= nmax; n++)
    {
        ok = ok && arb_equal(d->coeff + nmax - n, d->coeff + nmax + n)
                && arb_equal(d->kappa + nmax - n, d->kappa + nmax + n);
    }
    return ok;
}

/* Build P_0,...,P_max exactly from the three-term recurrence. */
static fmpq_poly_struct *
build_legendre_polynomials(slong max_degree)
{
    fmpq_poly_struct *p = flint_malloc((size_t) (max_degree + 1)
                                      * sizeof(fmpq_poly_struct));
    for (slong i = 0; i <= max_degree; i++)
        fmpq_poly_init(p + i);
    fmpq_poly_one(p + 0);
    if (max_degree >= 1)
        fmpq_poly_set_coeff_ui(p + 1, 1, 1);

    fmpq_poly_t t1, t2;
    fmpq_t scale;
    fmpq_poly_init(t1);
    fmpq_poly_init(t2);
    fmpq_init(scale);
    for (slong l = 1; l < max_degree; l++)
    {
        fmpq_poly_shift_left(t1, p + l, 1);
        fmpq_poly_scalar_mul_si(t1, t1, 2 * l + 1);
        fmpq_poly_scalar_mul_si(t2, p + l - 1, l);
        fmpq_poly_sub(t1, t1, t2);
        fmpq_set_si(scale, 1, (ulong) (l + 1));
        fmpq_poly_scalar_mul_fmpq(p + l + 1, t1, scale);
    }
    fmpq_poly_clear(t1);
    fmpq_poly_clear(t2);
    fmpq_clear(scale);
    return p;
}

static void
clear_legendre_polynomials(fmpq_poly_struct *p, slong max_degree)
{
    for (slong i = 0; i <= max_degree; i++)
        fmpq_poly_clear(p + i);
    flint_free(p);
}

/* Exact integral of z^2 P_l(z)P_k(z) over [-1,1]. */
static void
z2_product_integral(fmpq_t out, const fmpq_poly_t pl,
                    const fmpq_poly_t pk)
{
    fmpq_poly_t product;
    fmpq_t coeff, term, factor;
    fmpq_poly_init(product);
    fmpq_init(coeff); fmpq_init(term); fmpq_init(factor);
    fmpq_poly_mul(product, pl, pk);
    fmpq_zero(out);
    for (slong power = 0; power < fmpq_poly_length(product); power++)
    {
        if (power & 1)
            continue;
        fmpq_poly_get_coeff_fmpq(coeff, product, power);
        fmpq_set_ui(factor, 2, (ulong) (power + 3));
        fmpq_mul(term, coeff, factor);
        fmpq_add(out, out, term);
    }
    fmpq_poly_clear(product);
    fmpq_clear(coeff); fmpq_clear(term); fmpq_clear(factor);
}

static void
prolate_c_squared(arb_t c2, const arb_t lambda, slong prec)
{
    arb_t pi, t;
    arb_init(pi); arb_init(t);
    arb_const_pi(pi, prec);
    arb_mul(t, lambda, lambda, prec);
    arb_mul(t, t, pi, prec);
    arb_mul_2exp_si(t, t, 1);
    arb_mul(c2, t, t, prec);
    arb_clear(pi); arb_clear(t);
}

/* Differential-form assembly, including one omitted basis vector. */
static void
build_differential_operator(arb_mat_t a, fmpq_poly_struct *p,
                            slong dimension, const arb_t c2, slong prec)
{
    fmpq_t integral;
    arb_t t, scale;
    fmpq_init(integral);
    arb_init(t); arb_init(scale);
    for (slong i = 0; i < dimension; i++)
    {
        slong li = 2 * i;
        for (slong j = 0; j < dimension; j++)
        {
            slong lj = 2 * j;
            z2_product_integral(integral, p + li, p + lj);
            arb_set_fmpq(t, integral, prec);
            arb_set_ui(scale, (ulong) ((2 * li + 1) * (2 * lj + 1)));
            arb_sqrt(scale, scale, prec);
            arb_mul_2exp_si(scale, scale, -1);
            arb_mul(t, t, scale, prec);
            arb_mul(t, t, c2, prec);
            if (i == j)
                arb_add_ui(t, t, (ulong) (li * (li + 1)), prec);
            arb_set(arb_mat_entry(a, i, j), t);
        }
    }
    fmpq_clear(integral);
    arb_clear(t); arb_clear(scale);
}

/* Dense interval LDL inertia, independent of the producer recurrence. */
static int
dense_inertia(slong *negative, const arb_mat_t a, slong m,
              slong shift, const arb_t rho, slong prec)
{
    arb_mat_t ell;
    arb_ptr d = _arb_vec_init(m);
    arb_t x, t, num;
    arb_mat_init(ell, m, m);
    arb_mat_zero(ell);
    arb_init(x); arb_init(t); arb_init(num);
    *negative = 0;
    int ok = 1;
    for (slong k = 0; ok && k < m; k++)
    {
        arb_sub_ui(d + k, arb_mat_entry(a, k, k), (ulong) shift, prec);
        if (k == m - 1)
            arb_sub(d + k, d + k, rho, prec);
        for (slong j = 0; j < k; j++)
        {
            arb_mul(t, arb_mat_entry(ell, k, j),
                    arb_mat_entry(ell, k, j), prec);
            arb_mul(t, t, d + j, prec);
            arb_sub(d + k, d + k, t, prec);
        }
        if (arb_is_positive(d + k))
        {
            /* no change */
        }
        else if (arb_is_negative(d + k))
            (*negative)++;
        else
        {
            ok = 0;
            break;
        }
        arb_one(arb_mat_entry(ell, k, k));
        for (slong i = k + 1; i < m; i++)
        {
            arb_set(num, arb_mat_entry(a, i, k));
            for (slong j = 0; j < k; j++)
            {
                arb_mul(t, arb_mat_entry(ell, i, j),
                        arb_mat_entry(ell, k, j), prec);
                arb_mul(t, t, d + j, prec);
                arb_sub(num, num, t, prec);
            }
            arb_div(arb_mat_entry(ell, i, k), num, d + k, prec);
        }
    }
    arb_mat_clear(ell);
    _arb_vec_clear(d, m);
    arb_clear(x); arb_clear(t); arb_clear(num);
    return ok;
}

static int
certify_infinite_counts(const arb_mat_t a, slong m, const arb_t c2,
                        slong prec)
{
    const slong shifts[4] = {0, 70, 170, 260};
    const slong expected[4] = {0, 1, 2, 3};
    arb_t g, glow, denominator, coupling2, rho, rhoup, zero, s260;
    arb_init(g); arb_init(glow); arb_init(denominator); arb_init(coupling2);
    arb_init(rho); arb_init(rhoup); arb_init(zero); arb_init(s260);
    arb_zero(zero);
    arb_mul_2exp_si(g, c2, 1);
    arb_neg(g, g);
    arb_add_ui(g, g, (ulong) (2 * m * (2 * m + 1)), prec);
    set_lower_exact(glow, g, prec);
    arb_set_ui(s260, 260);
    int ok = arb_gt(glow, s260);
    arb_mul(coupling2, arb_mat_entry(a, m - 1, m),
            arb_mat_entry(a, m - 1, m), prec);
    for (slong k = 0; ok && k < 4; k++)
    {
        slong n0 = -1, n1 = -1;
        arb_sub_ui(denominator, glow, (ulong) shifts[k], prec);
        arb_div(rho, coupling2, denominator, prec);
        set_upper_exact(rhoup, rho, prec);
        ok = dense_inertia(&n0, a, m, shifts[k], zero, prec)
          && dense_inertia(&n1, a, m, shifts[k], rhoup, prec)
          && n0 == expected[k] && n1 == expected[k];
        printf("INERTIA_REPLAY shift=%ld count_rho0=%ld count_rhomax=%ld expected=%ld status=%s\n",
               shifts[k], n0, n1, expected[k], ok ? "PASS" : "FAIL");
    }
    printf("BALL replay_omitted_tail_floor_lower ");
    arb_printn(glow, 50, ARB_STR_MORE); printf("\n");
    arb_clear(g); arb_clear(glow); arb_clear(denominator); arb_clear(coupling2);
    arb_clear(rho); arb_clear(rhoup); arb_clear(zero); arb_clear(s260);
    return ok;
}

static void
eigen_cert_init(eigen_cert_t *c, slong label, slong m)
{
    c->label = label;
    c->localization_ok = 0;
    c->v = _arb_vec_init(m);
    arb_init(c->theta); arb_init(c->epsilon); arb_init(c->spectral_ratio);
    arb_init(c->eta);
    arb_init(c->integral); arb_init(c->value_zero);
}

static void
eigen_cert_clear(eigen_cert_t *c, slong m)
{
    _arb_vec_clear(c->v, m);
    arb_clear(c->theta); arb_clear(c->epsilon); arb_clear(c->spectral_ratio);
    arb_clear(c->eta);
    arb_clear(c->integral); arb_clear(c->value_zero);
}

static int
certify_from_witness(eigen_cert_t *cert, arb_srcptr w,
                     const arb_mat_t a, fmpq_poly_struct *p,
                     slong m, const arb_t lambda, slong prec)
{
    arb_ptr av = _arb_vec_init(m);
    arb_t norm2, norm, t, residual2, boundary, epsup, delta, narrow_lo;
    arb_t narrow_hi, eta_tmp, integral_error, witness_zero, point_error;
    arb_t s, qhalf, qterm, constant, target_upper, basis, coeff;
    arb_t bracket_lo, bracket_hi, theta_minus, theta_plus;
    fmpq_t q;
    arb_init(norm2); arb_init(norm); arb_init(t); arb_init(residual2);
    arb_init(boundary); arb_init(epsup); arb_init(delta); arb_init(narrow_lo);
    arb_init(narrow_hi); arb_init(eta_tmp); arb_init(integral_error);
    arb_init(witness_zero); arb_init(point_error); arb_init(s);
    arb_init(qhalf); arb_init(qterm); arb_init(constant);
    arb_init(target_upper); arb_init(basis); arb_init(coeff); fmpq_init(q);
    arb_init(bracket_lo); arb_init(bracket_hi);
    arb_init(theta_minus); arb_init(theta_plus);

    arb_zero(norm2);
    for (slong i = 0; i < m; i++)
    {
        arb_mul(t, w + i, w + i, prec);
        arb_add(norm2, norm2, t, prec);
    }
    int ok = arb_is_positive(norm2);
    if (ok)
    {
        arb_sqrt(norm, norm2, prec);
        for (slong i = 0; i < m; i++)
            arb_div(cert->v + i, w + i, norm, prec);

        arb_zero(cert->theta);
        for (slong i = 0; i < m; i++)
        {
            arb_zero(av + i);
            for (slong j = 0; j < m; j++)
            {
                arb_mul(t, arb_mat_entry(a, i, j), cert->v + j, prec);
                arb_add(av + i, av + i, t, prec);
            }
            arb_mul(t, cert->v + i, av + i, prec);
            arb_add(cert->theta, cert->theta, t, prec);
        }
        arb_zero(residual2);
        for (slong i = 0; i < m; i++)
        {
            arb_mul(t, cert->theta, cert->v + i, prec);
            arb_sub(t, av + i, t, prec);
            arb_mul(t, t, t, prec);
            arb_add(residual2, residual2, t, prec);
        }
        arb_mul(boundary, arb_mat_entry(a, m - 1, m), cert->v + m - 1, prec);
        arb_mul(t, boundary, boundary, prec);
        arb_add(residual2, residual2, t, prec);
        arb_sqrt(cert->epsilon, residual2, prec);

        if (cert->label == 0)
        {
            arb_set_ui(narrow_lo, 20); arb_set_ui(narrow_hi, 30);
            arb_set_ui(delta, 20); arb_set_ui(target_upper, 70);
            arb_zero(bracket_lo); arb_set_ui(bracket_hi, 70);
        }
        else
        {
            arb_set_ui(narrow_lo, 210); arb_set_ui(narrow_hi, 220);
            arb_set_ui(delta, 40); arb_set_ui(target_upper, 260);
            arb_set_ui(bracket_lo, 170); arb_set_ui(bracket_hi, 260);
        }
        ok = arb_gt(cert->theta, narrow_lo) && arb_lt(cert->theta, narrow_hi);
    }
    if (ok)
    {
        set_upper_exact(epsup, cert->epsilon, prec);
        arb_sub(theta_minus, cert->theta, epsup, prec);
        arb_add(theta_plus, cert->theta, epsup, prec);
        cert->localization_ok = arb_lt(epsup, delta)
            && arb_gt(theta_minus, bracket_lo) && arb_lt(theta_plus, bracket_hi);
        ok = ok && cert->localization_ok;
        arb_div(eta_tmp, epsup, delta, prec);
        set_upper_exact(cert->spectral_ratio, eta_tmp, prec);
        arb_mul_2exp_si(eta_tmp, cert->spectral_ratio, 1);
        set_upper_exact(cert->eta, eta_tmp, prec);
        arb_one(t);
        ok = arb_lt(cert->spectral_ratio, t);

        arb_mul_2exp_si(t, lambda, 1);
        arb_sqrt(t, t, prec);
        arb_mul(cert->integral, t, cert->v + 0, prec);
        arb_mul(integral_error, t, cert->eta, prec);
        arb_add_error(cert->integral, integral_error);

        arb_zero(witness_zero);
        for (slong i = 0; i < m; i++)
        {
            fmpq_poly_get_coeff_fmpq(q, p + 2 * i, 0);
            arb_set_fmpq(coeff, q, prec);
            arb_set_ui(basis, (ulong) (4 * i + 1));
            arb_mul_2exp_si(basis, basis, -1);
            arb_sqrt(basis, basis, prec);
            arb_mul(coeff, coeff, basis, prec);
            arb_mul(coeff, coeff, cert->v + i, prec);
            arb_add(witness_zero, witness_zero, coeff, prec);
        }
        arb_div(s, epsup, delta, prec);
        arb_mul(qhalf, s, s, prec);
        arb_sqrt(qterm, target_upper, prec);
        arb_mul(qhalf, qhalf, qterm, prec);
        arb_set_ui(constant, cert->label == 0 ? 70 : 260);
        arb_div_ui(constant, constant, 1600, prec);
        arb_sqrt(constant, constant, prec);
        arb_mul(qterm, constant, epsup, prec);
        arb_add(qhalf, qhalf, qterm, prec);
        arb_set_ui(constant, 4); arb_div_ui(constant, constant, 3, prec);
        arb_sqrt(constant, constant, prec);
        arb_mul(point_error, constant, qhalf, prec);
        arb_add(point_error, point_error, cert->eta, prec);
        set_upper_exact(qterm, point_error, prec);
        arb_set(cert->value_zero, witness_zero);
        arb_add_error(cert->value_zero, qterm);
        arb_sqrt(t, lambda, prec);
        arb_div(cert->value_zero, cert->value_zero, t, prec);
        ok = ok && arb_is_positive(cert->integral)
                && arb_is_positive(cert->value_zero);
    }

    _arb_vec_clear(av, m);
    arb_clear(norm2); arb_clear(norm); arb_clear(t); arb_clear(residual2);
    arb_clear(boundary); arb_clear(epsup); arb_clear(delta); arb_clear(narrow_lo);
    arb_clear(narrow_hi); arb_clear(eta_tmp); arb_clear(integral_error);
    arb_clear(witness_zero); arb_clear(point_error); arb_clear(s);
    arb_clear(qhalf); arb_clear(qterm); arb_clear(constant);
    arb_clear(target_upper); arb_clear(basis); arb_clear(coeff); fmpq_clear(q);
    arb_clear(bracket_lo); arb_clear(bracket_hi);
    arb_clear(theta_minus); arb_clear(theta_plus);
    return ok;
}

/* Independent complex-power antiderivative. */
static void
monomial_complex_integral(arb_t out, ulong power, ulong r, slong n,
                          const arb_t lambda, const arb_t L,
                          const arb_t pi, slong prec)
{
    if (r == 4)
    {
        arb_zero(out);
        return;
    }
    arb_t omega, alpha, logx, t;
    acb_t exponent, upper, lower, phase, result;
    arb_init(omega); arb_init(alpha); arb_init(logx); arb_init(t);
    acb_init(exponent); acb_init(upper); acb_init(lower);
    acb_init(phase); acb_init(result);
    arb_mul_si(omega, pi, 2 * n, prec);
    arb_div(omega, omega, L, prec);
    arb_set_ui(alpha, 2 * power + 1);
    arb_mul_2exp_si(alpha, alpha, -1);
    arb_set(acb_realref(exponent), alpha);
    arb_set(acb_imagref(exponent), omega);

    arb_log(logx, lambda, prec);
    acb_mul_arb(upper, exponent, logx, prec);
    acb_exp(upper, upper, prec);
    arb_set_ui(t, r); arb_div(t, t, lambda, prec); arb_log(logx, t, prec);
    acb_mul_arb(lower, exponent, logx, prec);
    acb_exp(lower, lower, prec);
    acb_sub(result, upper, lower, prec);
    acb_div(result, result, exponent, prec);

    arb_set_ui(t, r); arb_div(t, lambda, t, prec); arb_log(logx, t, prec);
    arb_mul(logx, logx, omega, prec);
    arb_zero(acb_realref(phase)); arb_set(acb_imagref(phase), logx);
    acb_exp(phase, phase, prec);
    acb_mul(result, result, phase, prec);
    arb_set(out, acb_realref(result));

    arb_clear(omega); arb_clear(alpha); arb_clear(logx); arb_clear(t);
    acb_clear(exponent); acb_clear(upper); acb_clear(lower);
    acb_clear(phase); acb_clear(result);
}

static void
project_witness_complex(arb_t out, arb_srcptr v, fmpq_poly_struct *p,
                        slong m, slong n, const arb_t lambda,
                        const arb_t L, const arb_t pi, slong prec)
{
    arb_t sum_i, sum_r, integral, coeff, scale, term, lp, sqrtr;
    fmpq_t q;
    arb_init(sum_i); arb_init(sum_r); arb_init(integral); arb_init(coeff);
    arb_init(scale); arb_init(term); arb_init(lp); arb_init(sqrtr);
    fmpq_init(q); arb_zero(out);
    arb_mul(scale, L, lambda, prec); arb_sqrt(scale, scale, prec);
    for (slong i = 0; i < m; i++)
    {
        arb_zero(sum_i);
        for (slong power = 0; power <= 2 * i; power += 2)
        {
            fmpq_poly_get_coeff_fmpq(q, p + 2 * i, power);
            arb_set_fmpq(coeff, q, prec);
            arb_set_ui(term, (ulong) (4 * i + 1));
            arb_mul_2exp_si(term, term, -1); arb_sqrt(term, term, prec);
            arb_mul(coeff, coeff, term, prec);
            arb_pow_ui(lp, lambda, (ulong) power, prec);
            arb_div(coeff, coeff, lp, prec);
            arb_zero(sum_r);
            for (ulong r = 1; r <= 4; r++)
            {
                monomial_complex_integral(integral, (ulong) power, r, n,
                                          lambda, L, pi, prec);
                arb_sqrt_ui(sqrtr, r, prec);
                arb_div(integral, integral, sqrtr, prec);
                arb_add(sum_r, sum_r, integral, prec);
            }
            arb_mul(term, coeff, sum_r, prec);
            arb_add(sum_i, sum_i, term, prec);
        }
        arb_div(sum_i, sum_i, scale, prec);
        arb_mul(sum_i, sum_i, v + i, prec);
        arb_add(out, out, sum_i, prec);
    }
    arb_clear(sum_i); arb_clear(sum_r); arb_clear(integral); arb_clear(coeff);
    arb_clear(scale); arb_clear(term); arb_clear(lp); arb_clear(sqrtr);
    fmpq_clear(q);
}

static void
add_functional_error(arb_t coefficient, const arb_t eta,
                     const arb_t lambda, const arb_t L, slong prec)
{
    /* Independent use of |K_n|<=2*sqrt(lambda/L), support length
       lambda-1/lambda, and positive-half norm eta/sqrt(2). */
    arb_t c, t, e, eup;
    arb_init(c); arb_init(t); arb_init(e); arb_init(eup);
    arb_mul(t, lambda, lambda, prec); arb_sub_ui(t, t, 1, prec);
    arb_mul_2exp_si(t, t, 1); arb_div(t, t, L, prec); arb_sqrt(c, t, prec);
    arb_mul(e, c, eta, prec); set_upper_exact(eup, e, prec);
    arb_add_error(coefficient, eup);
    arb_clear(c); arb_clear(t); arb_clear(e); arb_clear(eup);
}

int
main(int argc, char **argv)
{
    const char *producer = NULL, *output = NULL, *lambda_text = NULL;
    slong nmax = -1, m = 40, prec = 256;
    for (int i = 1; i < argc; i++)
    {
        if (!strcmp(argv[i], "--producer") && i + 1 < argc) producer = argv[++i];
        else if (!strcmp(argv[i], "--output") && i + 1 < argc) output = argv[++i];
        else if (!strcmp(argv[i], "--lambda") && i + 1 < argc) lambda_text = argv[++i];
        else if (!strcmp(argv[i], "--N") && i + 1 < argc) nmax = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--basis-size") && i + 1 < argc) m = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--prec") && i + 1 < argc) prec = strtol(argv[++i], NULL, 10);
        else return 2;
    }
    if (producer == NULL || lambda_text == NULL || strcmp(lambda_text, "2")
        || (nmax != 3 && nmax != 4) || m < 40 || prec < 128)
        return 2;
    if (output != NULL && freopen(output, "w", stdout) == NULL)
        return 2;

    producer_data_t data;
    producer_data_init(&data, m, nmax);
    int ok = load_producer(&data, producer, m, nmax, prec);
    printf("META schema=%s\n", SCHEMA);
    printf("META claim_class=FINITE_PROLATE_STATE_BALL_DIAGNOSTIC_ONLY\n");
    printf("META terminal_state=P0_INVALIDATED\n");
    printf("META source_pdf_sha256=%s\n", SOURCE_SHA256);
    printf("META flint_version=%s\n", FLINT_VERSION);
    printf("META arithmetic_library=FLINT_ARB\n");
    printf("META shared_library_limitation=producer_and_verifier_share_FLINT_ARB_transcendentals\n");
    printf("META verifier_matrix_path=exact_Legendre_differential_form\n");
    printf("META verifier_projection_path=complex_power_antiderivative\n");
    printf("PARAM lambda 2\nPARAM N %ld\nPARAM basis_size %ld\nPARAM precision %ld\n",
           nmax, m, prec);
    printf("CHECK producer_contract_and_exact_witnesses=%s\n", ok ? "PASS" : "FAIL");
    if (!ok)
    {
        producer_data_clear(&data, m, nmax);
        return 1;
    }

    arb_t lambda, L, pi, c2;
    arb_init(lambda); arb_init(L); arb_init(pi); arb_init(c2);
    arb_set_ui(lambda, 2); arb_log(L, lambda, prec); arb_mul_2exp_si(L, L, 1);
    arb_const_pi(pi, prec); prolate_c_squared(c2, lambda, prec);
    fmpq_poly_struct *polys = build_legendre_polynomials(2 * m);
    arb_mat_t a;
    arb_mat_init(a, m + 1, m + 1);
    build_differential_operator(a, polys, m + 1, c2, prec);
    ok = certify_infinite_counts(a, m, c2, prec);

    eigen_cert_t e0, e4;
    eigen_cert_init(&e0, 0, m); eigen_cert_init(&e4, 4, m);
    ok = ok && certify_from_witness(&e0, data.w0, a, polys, m, lambda, prec);
    ok = ok && certify_from_witness(&e4, data.w4, a, polys, m, lambda, prec);
    printf("BALL replay_eigen_0_theta "); arb_printn(e0.theta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_0_residual_with_tail "); arb_printn(e0.epsilon, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_0_epsilon_over_gap_upper "); arb_printn(e0.spectral_ratio, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_0_L2_radius_upper "); arb_printn(e0.eta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_0_integral "); arb_printn(e0.integral, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_0_source_x_value_at_zero "); arb_printn(e0.value_zero, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_4_theta "); arb_printn(e4.theta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_4_residual_with_tail "); arb_printn(e4.epsilon, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_4_epsilon_over_gap_upper "); arb_printn(e4.spectral_ratio, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_4_L2_radius_upper "); arb_printn(e4.eta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_4_integral "); arb_printn(e4.integral, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_4_source_x_value_at_zero "); arb_printn(e4.value_zero, 60, ARB_STR_MORE); printf("\n");

    arb_ptr c0 = _arb_vec_init(nmax + 1), c4 = _arb_vec_init(nmax + 1);
    arb_ptr hc = _arb_vec_init(nmax + 1), kappa = _arb_vec_init(nmax + 1);
    for (slong n = 0; ok && n <= nmax; n++)
    {
        project_witness_complex(c0 + n, e0.v, polys, m, n, lambda, L, pi, prec);
        project_witness_complex(c4 + n, e4.v, polys, m, n, lambda, L, pi, prec);
        add_functional_error(c0 + n, e0.eta, lambda, L, prec);
        add_functional_error(c4 + n, e4.eta, lambda, L, prec);
    }

    arb_t a4, a0, exponent, t, norm2, pnorm, hnorm, unit_a4, zero_int;
    arb_init(a4); arb_init(a0); arb_init(exponent); arb_init(t);
    arb_init(norm2); arb_init(pnorm); arb_init(hnorm); arb_init(unit_a4);
    arb_init(zero_int);
    arb_set_ui(a4, 3); arb_sqrt(a4, a4, prec);
    arb_set_ui(t, 2); arb_set_ui(exponent, 11); arb_div_ui(exponent, exponent, 4, prec);
    arb_pow(t, t, exponent, prec); arb_div(a4, a4, t, prec);
    arb_mul(a0, a4, e4.integral, prec); arb_div(a0, a0, e0.integral, prec);
    arb_mul(zero_int, a4, e4.integral, prec);
    arb_mul(t, a0, e0.integral, prec); arb_sub(zero_int, zero_int, t, prec);
    ok = ok && arb_contains_zero(zero_int);
    for (slong n = 0; n <= nmax; n++)
    {
        arb_mul(hc + n, a4, c4 + n, prec);
        arb_mul(t, a0, c0 + n, prec); arb_sub(hc + n, hc + n, t, prec);
    }
    arb_mul(norm2, hc + 0, hc + 0, prec);
    for (slong n = 1; n <= nmax; n++)
    {
        arb_mul(t, hc + n, hc + n, prec); arb_mul_2exp_si(t, t, 1);
        arb_add(norm2, norm2, t, prec);
    }
    arb_sqrt(pnorm, norm2, prec);
    ok = ok && arb_is_positive(pnorm);
    for (slong n = 0; n <= nmax; n++) arb_div(kappa + n, hc + n, pnorm, prec);

    arb_mul(hnorm, a4, a4, prec); arb_mul(t, a0, a0, prec); arb_add(hnorm, hnorm, t, prec);
    arb_sqrt(hnorm, hnorm, prec); arb_div(unit_a4, a4, hnorm, prec);
    int unit_rejected = !arb_overlaps(unit_a4, a4);
    ok = ok && unit_rejected;

    int overlap_ok = 1;
    for (slong n = -nmax; n <= nmax; n++)
    {
        slong j = n < 0 ? -n : n;
        overlap_ok = overlap_ok
          && arb_overlaps(hc + j, data.coeff + n + nmax)
          && arb_overlaps(kappa + j, data.kappa + n + nmax);
        printf("COEFF_REPLAY %ld ", n); arb_printn(hc + j, 60, ARB_STR_MORE); printf("\n");
        print_dump("C", n, hc + j);
        printf("KAPPA_REPLAY %ld ", n); arb_printn(kappa + j, 60, ARB_STR_MORE); printf("\n");
        print_dump("K", n, kappa + j);
    }
    ok = ok && overlap_ok;
    printf("BALL replay_projected_norm "); arb_printn(pnorm, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_a0_source "); arb_printn(a0, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_forbidden_unit_normalized_a4 "); arb_printn(unit_a4, 60, ARB_STR_MORE); printf("\n");
    printf("CHECK producer_replay_coefficient_and_kappa_overlap=%s\n", overlap_ok ? "PASS" : "FAIL");
    printf("CHECK source_positive_at_zero_orientation=%s\n",
           (arb_is_positive(e0.value_zero) && arb_is_positive(e4.value_zero)) ? "PASS" : "FAIL");
    printf("CHECK residual_ball_inside_certified_count_bracket=%s\n",
           (e0.localization_ok && e4.localization_ok) ? "PASS" : "FAIL");
    arb_one(t);
    printf("CHECK epsilon_over_certified_spectral_gap_lt_one=%s\n",
           (arb_lt(e0.spectral_ratio, t) && arb_lt(e4.spectral_ratio, t)) ? "PASS" : "FAIL");
    printf("CHECK unit_norm_changes_source_scalar_and_is_rejected=%s\n", unit_rejected ? "PASS" : "FAIL");
    printf("CHECK overall=%s\n", ok ? "PASS" : "FAIL");

    producer_data_clear(&data, m, nmax);
    arb_clear(lambda); arb_clear(L); arb_clear(pi); arb_clear(c2);
    clear_legendre_polynomials(polys, 2 * m); arb_mat_clear(a);
    eigen_cert_clear(&e0, m); eigen_cert_clear(&e4, m);
    _arb_vec_clear(c0, nmax + 1); _arb_vec_clear(c4, nmax + 1);
    _arb_vec_clear(hc, nmax + 1); _arb_vec_clear(kappa, nmax + 1);
    arb_clear(a4); arb_clear(a0); arb_clear(exponent); arb_clear(t);
    arb_clear(norm2); arb_clear(pnorm); arb_clear(hnorm); arb_clear(unit_a4);
    arb_clear(zero_int); flint_cleanup();
    return ok ? 0 : 1;
}
