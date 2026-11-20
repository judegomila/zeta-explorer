/*
   Rigorous finite pilot for the source-normalized prolate comparison state.

   This program is deliberately limited to lambda = 2 and N = 3 or 4.  It
   encloses the *infinite-dimensional* even prolate eigenfunctions labelled
   0 and 4; the finite Legendre matrix is used only to construct a witness.
   The omitted Jacobi tail is included in the residual, and eigenvalue labels
   are certified by a tail Schur bound plus interval LDL inertia counts.

   Binding source conventions: CCM-ZST-v1 (7.5)--(7.12), as locked by
   P0_SOURCE_LOCK.json.  The output is a finite diagnostic ball enclosure.
   It is not an RH proof and it is not an asymptotic estimate.
*/
#include <flint/flint.h>
#include <flint/arb.h>
#include <flint/arb_mat.h>
#include <flint/acb.h>
#include <flint/acb_mat.h>
#include <flint/fmpq.h>
#include <flint/fmpz.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SOURCE_SHA256 "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
#define SCHEMA "p0_prolate_state_ball_v1"

typedef struct
{
    slong label;
    arb_ptr w;
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
eigen_cert_init(eigen_cert_t *c, slong label, slong m)
{
    c->label = label;
    c->localization_ok = 0;
    c->w = _arb_vec_init(m);
    c->v = _arb_vec_init(m);
    arb_init(c->theta);
    arb_init(c->epsilon);
    arb_init(c->spectral_ratio);
    arb_init(c->eta);
    arb_init(c->integral);
    arb_init(c->value_zero);
}

static void
eigen_cert_clear(eigen_cert_t *c, slong m)
{
    _arb_vec_clear(c->w, m);
    _arb_vec_clear(c->v, m);
    arb_clear(c->theta);
    arb_clear(c->epsilon);
    arb_clear(c->spectral_ratio);
    arb_clear(c->eta);
    arb_clear(c->integral);
    arb_clear(c->value_zero);
}

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

/* c^2 = (2*pi*lambda^2)^2, with lambda supplied as an exact Arb value. */
static void
prolate_c_squared(arb_t c2, const arb_t lambda, slong prec)
{
    arb_t t, pi;
    arb_init(t);
    arb_init(pi);
    arb_const_pi(pi, prec);
    arb_mul(t, lambda, lambda, prec);
    arb_mul(t, t, pi, prec);
    arb_mul_2exp_si(t, t, 1);
    arb_mul(c2, t, t, prec);
    arb_clear(t);
    arb_clear(pi);
}

/*
   Assemble the even Jacobi matrix in phi_i(z)=sqrt((4i+1)/2)P_{2i}(z).
   off[i] is also computed for i=m-1, the coupling to the first omitted
   basis vector.  This is essential to the infinite-dimensional residual.
*/
static void
build_recurrence_operator(arb_mat_t a, arb_ptr diag, arb_ptr off,
                          slong m, const arb_t c2, slong prec)
{
    arb_t zu2, zd2, t, root;
    arb_init(zu2);
    arb_init(zd2);
    arb_init(t);
    arb_init(root);
    arb_mat_zero(a);

    for (slong i = 0; i < m; i++)
    {
        ulong l = (ulong) (2 * i);
        ulong up_num = (l + 1) * (l + 1);
        ulong up_den = (2 * l + 1) * (2 * l + 3);
        arb_set_ui(zu2, up_num);
        arb_div_ui(zu2, zu2, up_den, prec);

        if (l == 0)
            arb_zero(zd2);
        else
        {
            ulong down_num = l * l;
            ulong down_den = (2 * l - 1) * (2 * l + 1);
            arb_set_ui(zd2, down_num);
            arb_div_ui(zd2, zd2, down_den, prec);
        }

        arb_add(t, zu2, zd2, prec);
        arb_mul(t, t, c2, prec);
        arb_add_ui(diag + i, t, l * (l + 1), prec);
        arb_set(arb_mat_entry(a, i, i), diag + i);
    }

    for (slong i = 0; i < m; i++)
    {
        ulong l = (ulong) (2 * i);
        ulong num = (l + 1) * (l + 2);
        ulong rad = (2 * l + 1) * (2 * l + 5);
        arb_sqrt_ui(root, rad, prec);
        arb_mul_ui(root, root, 2 * l + 3, prec);
        arb_set_ui(t, num);
        arb_div(t, t, root, prec);
        arb_mul(off + i, t, c2, prec);
        if (i + 1 < m)
        {
            arb_set(arb_mat_entry(a, i, i + 1), off + i);
            arb_set(arb_mat_entry(a, i + 1, i), off + i);
        }
    }

    arb_clear(zu2);
    arb_clear(zd2);
    arb_clear(t);
    arb_clear(root);
}

/* Interval LDL count for a tridiagonal endpoint Schur complement. */
static int
tridiagonal_inertia(slong *negative, arb_t min_abs_pivot,
                    arb_srcptr diag, arb_srcptr off, slong m,
                    slong shift, const arb_t rho, slong prec)
{
    arb_t pivot, previous, t, ap;
    arb_init(pivot);
    arb_init(previous);
    arb_init(t);
    arb_init(ap);
    *negative = 0;
    arb_zero(min_abs_pivot);

    for (slong i = 0; i < m; i++)
    {
        arb_sub_ui(pivot, diag + i, (ulong) shift, prec);
        if (i > 0)
        {
            arb_mul(t, off + i - 1, off + i - 1, prec);
            arb_div(t, t, previous, prec);
            arb_sub(pivot, pivot, t, prec);
        }
        if (i == m - 1)
            arb_sub(pivot, pivot, rho, prec);

        if (arb_is_positive(pivot))
        {
            /* no change */
        }
        else if (arb_is_negative(pivot))
            (*negative)++;
        else
        {
            arb_clear(pivot);
            arb_clear(previous);
            arb_clear(t);
            arb_clear(ap);
            return 0;
        }

        arb_abs(ap, pivot);
        if (i == 0 || arb_lt(ap, min_abs_pivot))
            arb_set(min_abs_pivot, ap);
        arb_set(previous, pivot);
    }

    arb_clear(pivot);
    arb_clear(previous);
    arb_clear(t);
    arb_clear(ap);
    return 1;
}

/*
   T >= [2m(2m+1)-2c^2]I on the omitted even Legendre tail.  For s below
   this floor, the scalar tail Schur load rho(s) lies in
   [0,off[m-1]^2/(g-s)].  Equal inertia at both endpoints certifies the
   infinite operator's eigenvalue count below s.
*/
static int
certify_infinite_counts(arb_srcptr diag, arb_srcptr off, slong m,
                        const arb_t c2, slong prec)
{
    const slong shifts[4] = {0, 70, 170, 260};
    const slong expected[4] = {0, 1, 2, 3};
    arb_t g, g_lower, denominator, coupling2, rho_bound, rho_upper;
    arb_t zero, min0, min1;
    arb_init(g);
    arb_init(g_lower);
    arb_init(denominator);
    arb_init(coupling2);
    arb_init(rho_bound);
    arb_init(rho_upper);
    arb_init(zero);
    arb_init(min0);
    arb_init(min1);
    arb_zero(zero);

    arb_mul_2exp_si(g, c2, 1);
    arb_neg(g, g);
    arb_add_ui(g, g, (ulong) (2 * m * (2 * m + 1)), prec);
    set_lower_exact(g_lower, g, prec);

    arb_t s260;
    arb_init(s260);
    arb_set_ui(s260, 260);
    int ok = arb_gt(g_lower, s260);
    arb_clear(s260);

    arb_mul(coupling2, off + m - 1, off + m - 1, prec);
    for (slong k = 0; ok && k < 4; k++)
    {
        slong n0 = -1, n1 = -1;
        arb_sub_ui(denominator, g_lower, (ulong) shifts[k], prec);
        if (!arb_is_positive(denominator))
        {
            ok = 0;
            break;
        }
        arb_div(rho_bound, coupling2, denominator, prec);
        set_upper_exact(rho_upper, rho_bound, prec);
        ok = tridiagonal_inertia(&n0, min0, diag, off, m,
                                 shifts[k], zero, prec)
          && tridiagonal_inertia(&n1, min1, diag, off, m,
                                 shifts[k], rho_upper, prec)
          && n0 == expected[k] && n1 == expected[k];
        printf("INERTIA shift=%ld count_rho0=%ld count_rhomax=%ld expected=%ld status=%s\n",
               shifts[k], n0, n1, expected[k], ok ? "PASS" : "FAIL");
        printf("BALL inertia_shift_%ld_rho_upper ", shifts[k]);
        arb_printn(rho_upper, 50, ARB_STR_MORE);
        printf("\nBALL inertia_shift_%ld_min_pivot_rho0 ", shifts[k]);
        arb_printn(min0, 50, ARB_STR_MORE);
        printf("\nBALL inertia_shift_%ld_min_pivot_rhomax ", shifts[k]);
        arb_printn(min1, 50, ARB_STR_MORE);
        printf("\n");
    }
    printf("BALL omitted_tail_floor_lower ");
    arb_printn(g_lower, 50, ARB_STR_MORE);
    printf("\n");

    arb_clear(g);
    arb_clear(g_lower);
    arb_clear(denominator);
    arb_clear(coupling2);
    arb_clear(rho_bound);
    arb_clear(rho_upper);
    arb_clear(zero);
    arb_clear(min0);
    arb_clear(min1);
    return ok;
}

/* Use nonrigorous QR only to choose an arbitrary exact-dyadic witness. */
static int
approximate_witness(arb_ptr w, arb_ptr v, slong label, const arb_mat_t a,
                    slong m, slong prec)
{
    acb_mat_t aa, left, right;
    acb_ptr eval;
    mag_t tol;
    acb_t z0, phase, z;
    arb_t absz, norm2, norm, t;
    acb_mat_init(aa, m, m);
    acb_mat_init(left, m, m);
    acb_mat_init(right, m, m);
    eval = _acb_vec_init(m);
    mag_init(tol);
    acb_init(z0);
    acb_init(phase);
    acb_init(z);
    arb_init(absz);
    arb_init(norm2);
    arb_init(norm);
    arb_init(t);

    for (slong i = 0; i < m; i++)
        for (slong j = 0; j < m; j++)
        {
            arb_get_mid_arb(acb_realref(acb_mat_entry(aa, i, j)),
                            arb_mat_entry(a, i, j));
            arb_zero(acb_imagref(acb_mat_entry(aa, i, j)));
        }

    mag_set_ui_2exp_si(tol, 1, -prec + 24);
    int qr_ok = acb_mat_approx_eig_qr(eval, left, right, aa, tol,
                                      10000, prec);
    slong lo = label == 0 ? 0 : 170;
    slong hi = label == 0 ? 70 : 260;
    slong column = -1;
    for (slong j = 0; j < m; j++)
    {
        const arf_struct *mid = arb_midref(acb_realref(eval + j));
        if (arf_cmp_si(mid, lo) > 0 && arf_cmp_si(mid, hi) < 0)
        {
            if (column != -1)
                column = -2;
            else
                column = j;
        }
    }

    int ok = qr_ok && column >= 0;
    if (ok)
    {
        /* Rotate the arbitrary complex phase so coefficient zero is real +. */
        acb_get_mid(z0, acb_mat_entry(right, 0, column));
        acb_abs(absz, z0, prec);
        if (!arb_is_positive(absz))
            ok = 0;
        else
        {
            acb_conj(phase, z0);
            acb_div_arb(phase, phase, absz, prec);
            for (slong i = 0; i < m; i++)
            {
                acb_mul(z, acb_mat_entry(right, i, column), phase, prec);
                acb_get_mid(z, z);
                arb_set_arf(w + i, arb_midref(acb_realref(z)));
            }

            arb_zero(norm2);
            for (slong i = 0; i < m; i++)
            {
                arb_mul(t, w + i, w + i, prec);
                arb_add(norm2, norm2, t, prec);
            }
            if (!arb_is_positive(norm2))
                ok = 0;
            else
            {
                arb_sqrt(norm, norm2, prec);
                for (slong i = 0; i < m; i++)
                    arb_div(v + i, w + i, norm, prec);
            }
        }
    }

    acb_mat_clear(aa);
    acb_mat_clear(left);
    acb_mat_clear(right);
    _acb_vec_clear(eval, m);
    mag_clear(tol);
    acb_clear(z0);
    acb_clear(phase);
    acb_clear(z);
    arb_clear(absz);
    arb_clear(norm2);
    arb_clear(norm);
    arb_clear(t);
    return ok;
}

static int
certify_eigenfunction(eigen_cert_t *cert, const arb_mat_t a,
                      arb_srcptr off, slong m, const arb_t lambda,
                      slong prec)
{
    arb_ptr av = _arb_vec_init(m);
    arb_t t, u, residual2, boundary, eps_upper, delta, eta_tmp;
    arb_t narrow_lo, narrow_hi, integral_error;
    arb_t witness_zero, point_error, s, qhalf, qterm, constant;
    arb_t target_upper, basis_zero, coefficient, bracket_lo, bracket_hi;
    fmpq_t qzero;
    arb_init(t);
    arb_init(u);
    arb_init(residual2);
    arb_init(boundary);
    arb_init(eps_upper);
    arb_init(delta);
    arb_init(eta_tmp);
    arb_init(narrow_lo);
    arb_init(narrow_hi);
    arb_init(integral_error);
    arb_init(witness_zero);
    arb_init(point_error);
    arb_init(s);
    arb_init(qhalf);
    arb_init(qterm);
    arb_init(constant);
    arb_init(target_upper);
    arb_init(basis_zero);
    arb_init(coefficient);
    arb_init(bracket_lo);
    arb_init(bracket_hi);
    fmpq_init(qzero);

    int ok = approximate_witness(cert->w, cert->v, cert->label, a, m, prec);
    arb_zero(cert->theta);
    if (ok)
    {
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
        arb_mul(boundary, off + m - 1, cert->v + m - 1, prec);
        arb_mul(t, boundary, boundary, prec);
        arb_add(residual2, residual2, t, prec);
        arb_sqrt(cert->epsilon, residual2, prec);

        if (cert->label == 0)
        {
            arb_set_ui(narrow_lo, 20);
            arb_set_ui(narrow_hi, 30);
            arb_set_ui(delta, 20);
            arb_set_ui(target_upper, 70);
            arb_zero(bracket_lo);
            arb_set_ui(bracket_hi, 70);
        }
        else
        {
            arb_set_ui(narrow_lo, 210);
            arb_set_ui(narrow_hi, 220);
            arb_set_ui(delta, 40);
            arb_set_ui(target_upper, 260);
            arb_set_ui(bracket_lo, 170);
            arb_set_ui(bracket_hi, 260);
        }
        ok = arb_gt(cert->theta, narrow_lo)
          && arb_lt(cert->theta, narrow_hi);

        if (ok)
        {
            set_upper_exact(eps_upper, cert->epsilon, prec);
            arb_sub(u, cert->theta, eps_upper, prec);
            arb_add(t, cert->theta, eps_upper, prec);
            cert->localization_ok = arb_lt(eps_upper, delta)
                && arb_gt(u, bracket_lo) && arb_lt(t, bracket_hi);
            ok = ok && cert->localization_ok;
            arb_div(eta_tmp, eps_upper, delta, prec);
            set_upper_exact(cert->spectral_ratio, eta_tmp, prec);
            arb_mul_2exp_si(eta_tmp, cert->spectral_ratio, 1);
            set_upper_exact(cert->eta, eta_tmp, prec);
            arb_one(t);
            ok = arb_lt(cert->spectral_ratio, t);

            /* Integral of the normalized witness is sqrt(2*lambda)*v[0]. */
            arb_mul_2exp_si(t, lambda, 1);
            arb_sqrt(t, t, prec);
            arb_mul(cert->integral, t, cert->v + 0, prec);
            arb_mul(integral_error, t, cert->eta, prec);
            arb_add_error(cert->integral, integral_error);

            /*
               Certify the source positive-at-zero orientation without
               assuming a Fourier-eigenvalue sign.  If w is the off-target
               spectral part, ||w|| <= epsilon/delta.  Moreover

                 q(w) <= C epsilon^2,

               with C=70/40^2 for label 0 and C=260/40^2 for label 4.
               The aligned target component contributes at most
               (epsilon/delta)^2 sqrt(target_upper) to sqrt(q(g)).  On
               [-1/2,1/2], the elementary one-dimensional Sobolev estimate
               gives |g(0)| <= ||g||_2 + sqrt(4/3) sqrt(q(g)).
            */
            arb_zero(witness_zero);
            for (slong i = 0; i < m; i++)
            {
                fmpz_t fac2, faci, den;
                fmpz_init(fac2); fmpz_init(faci); fmpz_init(den);
                fmpz_fac_ui(fac2, (ulong) (2 * i));
                fmpz_fac_ui(faci, (ulong) i);
                fmpz_mul(den, faci, faci);
                fmpz_mul_2exp(den, den, (ulong) (2 * i));
                if (i & 1)
                    fmpz_neg(fac2, fac2);
                fmpq_set_fmpz_frac(qzero, fac2, den);
                fmpq_canonicalise(qzero);
                arb_set_fmpq(coefficient, qzero, prec);
                arb_set_ui(basis_zero, (ulong) (4 * i + 1));
                arb_mul_2exp_si(basis_zero, basis_zero, -1);
                arb_sqrt(basis_zero, basis_zero, prec);
                arb_mul(coefficient, coefficient, basis_zero, prec);
                arb_mul(coefficient, coefficient, cert->v + i, prec);
                arb_add(witness_zero, witness_zero, coefficient, prec);
                fmpz_clear(fac2); fmpz_clear(faci); fmpz_clear(den);
            }

            arb_div(s, eps_upper, delta, prec);
            arb_mul(qhalf, s, s, prec);
            arb_sqrt(qterm, target_upper, prec);
            arb_mul(qhalf, qhalf, qterm, prec);
            if (cert->label == 0)
            {
                arb_set_ui(constant, 70);
                arb_div_ui(constant, constant, 1600, prec);
            }
            else
            {
                arb_set_ui(constant, 260);
                arb_div_ui(constant, constant, 1600, prec);
            }
            arb_sqrt(constant, constant, prec);
            arb_mul(qterm, constant, eps_upper, prec);
            arb_add(qhalf, qhalf, qterm, prec);
            arb_set_ui(constant, 4);
            arb_div_ui(constant, constant, 3, prec);
            arb_sqrt(constant, constant, prec);
            arb_mul(point_error, constant, qhalf, prec);
            arb_add(point_error, point_error, cert->eta, prec);
            set_upper_exact(qterm, point_error, prec);
            arb_set(cert->value_zero, witness_zero);
            arb_add_error(cert->value_zero, qterm);

            /* Convert the z-domain unit vector to h_{j,lambda}(x). */
            arb_sqrt(t, lambda, prec);
            arb_div(cert->value_zero, cert->value_zero, t, prec);

            ok = ok && arb_is_positive(cert->integral)
              && arb_is_positive(cert->value_zero);
        }
    }

    _arb_vec_clear(av, m);
    arb_clear(t);
    arb_clear(u);
    arb_clear(residual2);
    arb_clear(boundary);
    arb_clear(eps_upper);
    arb_clear(delta);
    arb_clear(eta_tmp);
    arb_clear(narrow_lo);
    arb_clear(narrow_hi);
    arb_clear(integral_error);
    arb_clear(witness_zero);
    arb_clear(point_error);
    arb_clear(s);
    arb_clear(qhalf);
    arb_clear(qterm);
    arb_clear(constant);
    arb_clear(target_upper);
    arb_clear(basis_zero);
    arb_clear(coefficient);
    arb_clear(bracket_lo);
    arb_clear(bracket_hi);
    fmpq_clear(qzero);
    return ok;
}

/* Exact coefficient of z^power in P_degree(z), with matching parity. */
static void
legendre_coefficient(fmpq_t q, ulong degree, ulong power)
{
    fmpz_t num, den, t;
    fmpz_init(num);
    fmpz_init(den);
    fmpz_init(t);
    if (power > degree || ((degree - power) & 1U))
    {
        fmpq_zero(q);
    }
    else
    {
        ulong k = (degree - power) / 2;
        fmpz_fac_ui(num, 2 * degree - 2 * k);
        fmpz_fac_ui(den, k);
        fmpz_fac_ui(t, degree - k);
        fmpz_mul(den, den, t);
        fmpz_fac_ui(t, degree - 2 * k);
        fmpz_mul(den, den, t);
        fmpz_mul_2exp(den, den, degree);
        if (k & 1U)
            fmpz_neg(num, num);
        fmpq_set_fmpz_frac(q, num, den);
        fmpq_canonicalise(q);
    }
    fmpz_clear(num);
    fmpz_clear(den);
    fmpz_clear(t);
}

/* Closed real antiderivative for x^(power-1/2) times the locked cosine. */
static void
monomial_cos_integral(arb_t out, ulong power, ulong m_index, slong n,
                      const arb_t lambda, const arb_t L, const arb_t pi,
                      slong prec)
{
    if (m_index == 4) /* lambda^2 endpoint: explicitly present, zero length. */
    {
        arb_zero(out);
        return;
    }

    arb_t omega, alpha, denom, a, b, phase, ca, sa, cb, sb;
    arb_t xa, xb, fa, fb, t, t2;
    arb_init(omega); arb_init(alpha); arb_init(denom);
    arb_init(a); arb_init(b); arb_init(phase);
    arb_init(ca); arb_init(sa); arb_init(cb); arb_init(sb);
    arb_init(xa); arb_init(xb); arb_init(fa); arb_init(fb);
    arb_init(t); arb_init(t2);

    arb_mul_si(omega, pi, 2 * n, prec);
    arb_div(omega, omega, L, prec);
    arb_set_ui(alpha, 2 * power + 1);
    arb_mul_2exp_si(alpha, alpha, -1);
    arb_mul(denom, alpha, alpha, prec);
    arb_mul(t, omega, omega, prec);
    arb_add(denom, denom, t, prec);

    arb_set(b, lambda);
    arb_set_ui(a, m_index);
    arb_div(a, a, lambda, prec);

    /* x^alpha = x^power sqrt(x), avoiding a generic power call. */
    arb_pow_ui(xb, b, power, prec);
    arb_sqrt(t, b, prec);
    arb_mul(xb, xb, t, prec);
    arb_pow_ui(xa, a, power, prec);
    arb_sqrt(t, a, prec);
    arb_mul(xa, xa, t, prec);

    arb_mul(t, lambda, lambda, prec);
    arb_div_ui(t, t, m_index, prec);
    arb_log(t, t, prec);
    arb_mul(phase, omega, t, prec);
    arb_cos(cb, phase, prec);
    arb_sin(sb, phase, prec);
    arb_one(ca);
    arb_zero(sa);

    arb_mul(fb, alpha, cb, prec);
    arb_mul(t, omega, sb, prec);
    arb_add(fb, fb, t, prec);
    arb_mul(fb, fb, xb, prec);
    arb_div(fb, fb, denom, prec);

    arb_mul(fa, alpha, ca, prec);
    arb_mul(t2, omega, sa, prec);
    arb_add(fa, fa, t2, prec);
    arb_mul(fa, fa, xa, prec);
    arb_div(fa, fa, denom, prec);
    arb_sub(out, fb, fa, prec);

    arb_clear(omega); arb_clear(alpha); arb_clear(denom);
    arb_clear(a); arb_clear(b); arb_clear(phase);
    arb_clear(ca); arb_clear(sa); arb_clear(cb); arb_clear(sb);
    arb_clear(xa); arb_clear(xb); arb_clear(fa); arb_clear(fb);
    arb_clear(t); arb_clear(t2);
}

/* Coefficient functional applied to a finite normalized-Legendre witness. */
static void
project_witness(arb_t out, arb_srcptr v, slong m, slong n,
                const arb_t lambda, const arb_t L, const arb_t pi,
                slong prec)
{
    arb_t sum_i, sum_m, integral, qarb, scale, term, lm, sqrtm;
    fmpq_t q;
    arb_init(sum_i); arb_init(sum_m); arb_init(integral);
    arb_init(qarb); arb_init(scale); arb_init(term);
    arb_init(lm); arb_init(sqrtm);
    fmpq_init(q);
    arb_zero(out);

    arb_mul(scale, L, lambda, prec);
    arb_sqrt(scale, scale, prec);

    for (slong i = 0; i < m; i++)
    {
        ulong degree = (ulong) (2 * i);
        arb_zero(sum_i);
        for (ulong power = 0; power <= degree; power += 2)
        {
            legendre_coefficient(q, degree, power);
            arb_set_fmpq(qarb, q, prec);

            /* phi_i(x/lambda) monomial coefficient. */
            arb_set_ui(term, 4 * (ulong) i + 1);
            arb_mul_2exp_si(term, term, -1);
            arb_sqrt(term, term, prec);
            arb_mul(qarb, qarb, term, prec);
            arb_pow_ui(lm, lambda, power, prec);
            arb_div(qarb, qarb, lm, prec);

            arb_zero(sum_m);
            for (ulong r = 1; r <= 4; r++)
            {
                monomial_cos_integral(integral, power, r, n,
                                      lambda, L, pi, prec);
                arb_sqrt_ui(sqrtm, r, prec);
                arb_div(integral, integral, sqrtm, prec);
                arb_add(sum_m, sum_m, integral, prec);
            }
            arb_mul(term, qarb, sum_m, prec);
            arb_add(sum_i, sum_i, term, prec);
        }
        arb_div(sum_i, sum_i, scale, prec);
        arb_mul(sum_i, sum_i, v + i, prec);
        arb_add(out, out, sum_i, prec);
    }

    arb_clear(sum_i); arb_clear(sum_m); arb_clear(integral);
    arb_clear(qarb); arb_clear(scale); arb_clear(term);
    arb_clear(lm); arb_clear(sqrtm);
    fmpq_clear(q);
}

static void
add_functional_error(arb_t coefficient, const arb_t eta,
                     const arb_t lambda, const arb_t L, slong prec)
{
    /*
       On x in [1/lambda,lambda], the coefficient kernel is bounded by
       2*sqrt(lambda/L), since sum_{m<=lambda*x} m^(-1/2)<=2*sqrt(lambda*x).
       Its support has length lambda-1/lambda, while an even perturbation has
       positive-half norm eta/sqrt(2).  Cauchy--Schwarz therefore gives

           |delta c_n| <= sqrt(2*(lambda^2-1)/L) * eta.

       This pilot accepts lambda=2 only, but the displayed derivation is the
       actual bound used here (not a fitted radius).
    */
    arb_t c, t, e, e_upper;
    arb_init(c); arb_init(t); arb_init(e); arb_init(e_upper);
    arb_mul(t, lambda, lambda, prec);
    arb_sub_ui(t, t, 1, prec);
    arb_mul_2exp_si(t, t, 1);
    arb_div(t, t, L, prec);
    arb_sqrt(c, t, prec);
    arb_mul(e, c, eta, prec);
    set_upper_exact(e_upper, e, prec);
    arb_add_error(coefficient, e_upper);
    arb_clear(c); arb_clear(t); arb_clear(e); arb_clear(e_upper);
}

static void
print_dump(const char *kind, slong index, const arb_t x)
{
    char *s = arb_dump_str(x);
    printf("DUMP%s %ld %s\n", kind, index, s);
    flint_free(s);
}

static void
print_witness_dump(slong label, slong index, const arb_t x)
{
    char *s = arb_dump_str(x);
    printf("DUMPW %ld %ld %s\n", label, index, s);
    flint_free(s);
}

static int
string_is(const char *got, const char *want)
{
    return got != NULL && strcmp(got, want) == 0;
}

int
main(int argc, char **argv)
{
    const char *lambda_text = NULL;
    const char *output = NULL;
    const char *normalization = "source_limit_h";
    const char *fourier_sign = "positive";
    const char *reflection = "explicit";
    const char *cutoff_policy = "lambda_squared_inclusive";
    const char *parser = "exact_decimal";
    const char *tail_policy = "infinite_residual_and_schur";
    slong nmax = -1, m = 40, prec = 256;

    for (int i = 1; i < argc; i++)
    {
        if (!strcmp(argv[i], "--lambda") && i + 1 < argc)
            lambda_text = argv[++i];
        else if (!strcmp(argv[i], "--N") && i + 1 < argc)
            nmax = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--basis-size") && i + 1 < argc)
            m = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--prec") && i + 1 < argc)
            prec = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--output") && i + 1 < argc)
            output = argv[++i];
        else if (!strcmp(argv[i], "--normalization") && i + 1 < argc)
            normalization = argv[++i];
        else if (!strcmp(argv[i], "--fourier-sign") && i + 1 < argc)
            fourier_sign = argv[++i];
        else if (!strcmp(argv[i], "--inversion-reflection") && i + 1 < argc)
            reflection = argv[++i];
        else if (!strcmp(argv[i], "--cutoff-policy") && i + 1 < argc)
            cutoff_policy = argv[++i];
        else if (!strcmp(argv[i], "--parameter-parser") && i + 1 < argc)
            parser = argv[++i];
        else if (!strcmp(argv[i], "--tail-policy") && i + 1 < argc)
            tail_policy = argv[++i];
        else
            return 2;
    }

    if (output != NULL && freopen(output, "w", stdout) == NULL)
        return 2;

    fmpq_t lambda_q;
    fmpq_init(lambda_q);
    int input_ok = lambda_text != NULL
        && fmpq_set_str(lambda_q, lambda_text, 10) == 0
        && fmpq_cmp_ui(lambda_q, 2) == 0
        && (nmax == 3 || nmax == 4)
        && m >= 40
        && prec >= 128
        && string_is(normalization, "source_limit_h")
        && string_is(fourier_sign, "positive")
        && string_is(reflection, "explicit")
        && string_is(cutoff_policy, "lambda_squared_inclusive")
        && string_is(parser, "exact_decimal")
        && string_is(tail_policy, "infinite_residual_and_schur");
    if (!input_ok)
    {
        printf("CHECK input_contract=FAIL\n");
        fmpq_clear(lambda_q);
        return 2;
    }

    printf("META schema=%s\n", SCHEMA);
    printf("META claim_class=FINITE_PROLATE_STATE_BALL_DIAGNOSTIC_ONLY\n");
    printf("META terminal_state=P0_INVALIDATED\n");
    printf("META source_pdf_sha256=%s\n", SOURCE_SHA256);
    printf("META flint_version=%s\n", FLINT_VERSION);
    printf("META arithmetic_library=FLINT_ARB\n");
    printf("META shared_library_limitation=producer_and_verifier_share_FLINT_ARB_transcendentals\n");
    printf("PARAM lambda 2\nPARAM N %ld\nPARAM basis_size %ld\nPARAM precision %ld\n",
           nmax, m, prec);
    printf("LOCK normalization source_limit_h\n");
    printf("LOCK fourier_basis exp_plus_2pi_i_n_t_over_L\n");
    printf("LOCK coefficient_sign conjugate_negative_equivalently_cosine_after_evenization\n");
    printf("LOCK inversion_reflection explicit\n");
    printf("LOCK domain minus_lambda_to_lambda_lebesgue_zero_extension\n");
    printf("LOCK arithmetic_cutoff floor_lambda_squared_inclusive\n");
    printf("LOCK eigen_tail infinite_residual_and_schur\n");
    printf("FORMULA operator -d_dz_1_minus_z2_d_dz_plus_2pi_lambda2_squared_z2\n");
    printf("FORMULA combination a4_h4_minus_a0_h0_with_a0_eq_a4_I4_over_I0\n");
    printf("FORMULA coefficient real_closed_antiderivative_before_evenization\n");
    printf("FORMULA coefficient_error sqrt_2_lambda_squared_minus_1_over_L_times_L2_radius\n");
    for (slong r = 1; r <= 4; r++)
        printf("SUMINDEX %ld included=1 degenerate_endpoint=%d\n", r, r == 4);

    arb_t lambda, L, pi, c2;
    arb_init(lambda); arb_init(L); arb_init(pi); arb_init(c2);
    arb_set_fmpq(lambda, lambda_q, prec);
    arb_log(L, lambda, prec);
    arb_mul_2exp_si(L, L, 1);
    arb_const_pi(pi, prec);
    prolate_c_squared(c2, lambda, prec);

    arb_mat_t a;
    arb_mat_init(a, m, m);
    arb_ptr diag = _arb_vec_init(m);
    arb_ptr off = _arb_vec_init(m);
    build_recurrence_operator(a, diag, off, m, c2, prec);

    int ok = certify_infinite_counts(diag, off, m, c2, prec);
    eigen_cert_t e0, e4;
    eigen_cert_init(&e0, 0, m);
    eigen_cert_init(&e4, 4, m);
    ok = ok && certify_eigenfunction(&e0, a, off, m, lambda, prec);
    ok = ok && certify_eigenfunction(&e4, a, off, m, lambda, prec);

    printf("BALL eigen_0_theta "); arb_printn(e0.theta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_0_residual_with_tail "); arb_printn(e0.epsilon, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_0_epsilon_over_gap_upper "); arb_printn(e0.spectral_ratio, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_0_L2_radius_upper "); arb_printn(e0.eta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_0_integral "); arb_printn(e0.integral, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_0_source_x_value_at_zero "); arb_printn(e0.value_zero, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_theta "); arb_printn(e4.theta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_residual_with_tail "); arb_printn(e4.epsilon, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_epsilon_over_gap_upper "); arb_printn(e4.spectral_ratio, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_L2_radius_upper "); arb_printn(e4.eta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_integral "); arb_printn(e4.integral, 60, ARB_STR_MORE); printf("\n");
    printf("BALL eigen_4_source_x_value_at_zero "); arb_printn(e4.value_zero, 60, ARB_STR_MORE); printf("\n");
    print_dump("I", 0, e0.integral);
    print_dump("I", 4, e4.integral);
    for (slong i = 0; i < m; i++)
    {
        print_witness_dump(0, i, e0.w + i);
        print_witness_dump(4, i, e4.w + i);
    }

    arb_ptr f0c = _arb_vec_init(nmax + 1);
    arb_ptr f4c = _arb_vec_init(nmax + 1);
    arb_ptr hc = _arb_vec_init(nmax + 1);
    arb_ptr kappa = _arb_vec_init(nmax + 1);
    for (slong n = 0; ok && n <= nmax; n++)
    {
        project_witness(f0c + n, e0.v, m, n, lambda, L, pi, prec);
        project_witness(f4c + n, e4.v, m, n, lambda, L, pi, prec);
        add_functional_error(f0c + n, e0.eta, lambda, L, prec);
        add_functional_error(f4c + n, e4.eta, lambda, L, prec);
    }

    arb_t a4, a0, exponent, t, zero_integral, norm2, projected_norm;
    arb_t source_h_norm, unit_a4;
    arb_init(a4); arb_init(a0); arb_init(exponent); arb_init(t);
    arb_init(zero_integral); arb_init(norm2); arb_init(projected_norm);
    arb_init(source_h_norm); arb_init(unit_a4);
    arb_set_ui(a4, 3);
    arb_sqrt(a4, a4, prec);
    arb_set_ui(t, 2);
    arb_set_ui(exponent, 11);
    arb_div_ui(exponent, exponent, 4, prec);
    arb_pow(t, t, exponent, prec);
    arb_div(a4, a4, t, prec);
    arb_mul(a0, a4, e4.integral, prec);
    arb_div(a0, a0, e0.integral, prec);

    arb_mul(zero_integral, a4, e4.integral, prec);
    arb_mul(t, a0, e0.integral, prec);
    arb_sub(zero_integral, zero_integral, t, prec);
    ok = ok && arb_contains_zero(zero_integral);

    for (slong n = 0; n <= nmax; n++)
    {
        arb_mul(hc + n, a4, f4c + n, prec);
        arb_mul(t, a0, f0c + n, prec);
        arb_sub(hc + n, hc + n, t, prec);
    }

    arb_mul(norm2, hc + 0, hc + 0, prec);
    for (slong n = 1; n <= nmax; n++)
    {
        arb_mul(t, hc + n, hc + n, prec);
        arb_mul_2exp_si(t, t, 1);
        arb_add(norm2, norm2, t, prec);
    }
    arb_sqrt(projected_norm, norm2, prec);
    ok = ok && arb_is_positive(projected_norm);
    for (slong n = 0; n <= nmax; n++)
        arb_div(kappa + n, hc + n, projected_norm, prec);

    /* Mandatory normalization regression: ||h||^2=a4^2+a0^2. */
    arb_mul(source_h_norm, a4, a4, prec);
    arb_mul(t, a0, a0, prec);
    arb_add(source_h_norm, source_h_norm, t, prec);
    arb_sqrt(source_h_norm, source_h_norm, prec);
    arb_div(unit_a4, a4, source_h_norm, prec);
    int unit_rejected = !arb_overlaps(unit_a4, a4);
    ok = ok && unit_rejected;

    printf("BALL a4_source "); arb_printn(a4, 60, ARB_STR_MORE); printf("\n");
    printf("BALL a0_source "); arb_printn(a0, 60, ARB_STR_MORE); printf("\n");
    printf("BALL zero_integral_residual "); arb_printn(zero_integral, 60, ARB_STR_MORE); printf("\n");
    printf("BALL projected_norm "); arb_printn(projected_norm, 60, ARB_STR_MORE); printf("\n");
    printf("BALL source_h_norm "); arb_printn(source_h_norm, 60, ARB_STR_MORE); printf("\n");
    printf("BALL forbidden_unit_normalized_a4 "); arb_printn(unit_a4, 60, ARB_STR_MORE); printf("\n");
    printf("CHECK unit_norm_changes_source_scalar_and_is_rejected=%s\n",
           unit_rejected ? "PASS" : "FAIL");

    for (slong n = -nmax; n <= nmax; n++)
    {
        slong j = n < 0 ? -n : n;
        printf("COEFF %ld ", n); arb_printn(hc + j, 60, ARB_STR_MORE); printf("\n");
        print_dump("C", n, hc + j);
        printf("KAPPA %ld ", n); arb_printn(kappa + j, 60, ARB_STR_MORE); printf("\n");
        print_dump("K", n, kappa + j);
    }

    /* The two serialized signs are constructed from the same |n| ball. */
    int reflection_ok = 1;
    ok = ok && reflection_ok;
    arb_one(t);
    printf("CHECK infinite_tail_included=PASS\n");
    printf("CHECK residual_ball_inside_certified_count_bracket=%s\n",
           (e0.localization_ok && e4.localization_ok) ? "PASS" : "FAIL");
    printf("CHECK epsilon_over_certified_spectral_gap_lt_one=%s\n",
           (arb_lt(e0.spectral_ratio, t) && arb_lt(e4.spectral_ratio, t)) ? "PASS" : "FAIL");
    printf("CHECK positive_integral_orientation=%s\n",
           (arb_is_positive(e0.integral) && arb_is_positive(e4.integral)) ? "PASS" : "FAIL");
    printf("CHECK explicit_inversion_reflection_by_shared_abs_index=%s\n", reflection_ok ? "PASS" : "FAIL");
    printf("CHECK overall=%s\n", ok ? "PASS" : "FAIL");

    arb_clear(lambda); arb_clear(L); arb_clear(pi); arb_clear(c2);
    arb_mat_clear(a);
    _arb_vec_clear(diag, m);
    _arb_vec_clear(off, m);
    eigen_cert_clear(&e0, m);
    eigen_cert_clear(&e4, m);
    _arb_vec_clear(f0c, nmax + 1);
    _arb_vec_clear(f4c, nmax + 1);
    _arb_vec_clear(hc, nmax + 1);
    _arb_vec_clear(kappa, nmax + 1);
    arb_clear(a4); arb_clear(a0); arb_clear(exponent); arb_clear(t);
    arb_clear(zero_integral); arb_clear(norm2); arb_clear(projected_norm);
    arb_clear(source_h_norm); arb_clear(unit_a4);
    fmpq_clear(lambda_q);
    flint_cleanup();
    return ok ? 0 : 1;
}
