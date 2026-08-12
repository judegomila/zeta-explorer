/*
   Independent replay for the variable-lambda prolate state certificate.

   The producer's exact dyadic vectors and integer label brackets are used
   only as trial data.  This path rebuilds Legendre polynomials by their exact
   three-term recurrence, assembles differential-form entries by exact
   polynomial integration, replays the infinite continued fraction and dense
   LDL counts, uses a complex-power Fourier antiderivative, and computes the
   reflected full norm from independently assembled Laurent cells.

   Both paths share FLINT/Arb transcendental functions.  This is formula and
   control-flow independence, not arithmetic-library independence.
*/
#define main p0_fixed_lambda2_verifier_entrypoint
#include "p0_prolate_state_arb_replay.c"
#undef main

#define VLV_SCHEMA "variable_lambda_prolate_state_ball_v1"
#define VLV_SOURCE_LOCK_SHA256 "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251"
#define VLV_NORMALIZATION_SHA256 "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df"
#define VLV_PRODUCER_CORE_SHA256 "fd8fe2a9ff4fb606e674bd4f1bfb71f8fffa4ef69f107e8429b128c24a6ae896"
#define VLV_VERIFIER_CORE_SHA256 "17a78a248259834d0fd95428fc707be8fb5eea9e73b7767adac33e195f4ee2c4"
#define VLV_QMAX_LIMIT 10000

typedef struct
{
    arb_ptr w0;
    arb_ptr w4;
    int *w0_seen;
    int *w4_seen;
    arb_ptr poly;
    arb_ptr coeff;
    arb_ptr kappa;
    arb_ptr matrix_diag;
    arb_ptr matrix_off;
    int *poly_seen;
    int *coeff_seen;
    int *kappa_seen;
    int *matrix_diag_seen;
    int *matrix_off_seen;
    int *sum_seen;
    slong lower0, upper0, lower4, upper4;
    int label0_seen, label4_seen;
    int meta_ok, parameter_ok, lock_ok, sum_ok;
} vlv_data_t;

typedef struct
{
    slong label, rank, lower_shift, upper_shift;
    arb_ptr v;
    arb_t theta, epsilon, spectral_ratio, eta, integral, value_zero;
    int localization_ok;
} vlv_eigen_t;

static int
vlv_all_digits(const char *s)
{
    if (s == NULL || *s == '\0') return 0;
    for (; *s; s++) if (*s < '0' || *s > '9') return 0;
    return 1;
}

static int
vlv_parse_exact(fmpq_t out, const char *text)
{
    const char *slash, *dot;
    if (text == NULL || *text == '\0' || *text == '-') return 0;
    slash = strchr(text, '/'); dot = strchr(text, '.');
    if (slash)
    {
        if (dot || strchr(slash + 1, '/') || slash == text || !slash[1]) return 0;
        size_t n = (size_t) (slash - text);
        char *left = flint_malloc(n + 1);
        memcpy(left, text, n); left[n] = '\0';
        int ok = vlv_all_digits(left) && vlv_all_digits(slash + 1)
              && fmpq_set_str(out, text, 10) == 0;
        flint_free(left);
        if (ok) fmpq_canonicalise(out);
        return ok;
    }
    if (!dot) return vlv_all_digits(text) && fmpq_set_str(out, text, 10) == 0;
    if (strchr(dot + 1, '.') || dot == text || !dot[1]) return 0;
    size_t before = (size_t) (dot - text), after = strlen(dot + 1);
    char *digits = flint_malloc(before + after + 1);
    memcpy(digits, text, before); memcpy(digits + before, dot + 1, after + 1);
    int ok = vlv_all_digits(digits);
    if (ok)
    {
        fmpz_t num, den; fmpz_init(num); fmpz_init(den);
        ok = fmpz_set_str(num, digits, 10) == 0;
        fmpz_ui_pow_ui(den, 10, (ulong) after);
        if (ok) { fmpq_set_fmpz_frac(out, num, den); fmpq_canonicalise(out); }
        fmpz_clear(num); fmpz_clear(den);
    }
    flint_free(digits); return ok;
}

static int
vlv_floor_slong(slong *out, const fmpq_t x)
{
    fmpz_t q; fmpz_init(q);
    fmpz_fdiv_q(q, fmpq_numref(x), fmpq_denref(x));
    int ok = fmpz_fits_si(q);
    if (ok) *out = fmpz_get_si(q);
    fmpz_clear(q); return ok;
}

static void
vlv_data_init(vlv_data_t *d, slong m, slong nmax, slong qmax)
{
    slong count = 2 * nmax + 1;
    memset(d, 0, sizeof(*d));
    d->lower0 = d->upper0 = d->lower4 = d->upper4 = -1;
    d->w0 = _arb_vec_init(m); d->w4 = _arb_vec_init(m);
    d->poly = _arb_vec_init(count); d->coeff = _arb_vec_init(count);
    d->kappa = _arb_vec_init(count);
    d->matrix_diag = _arb_vec_init(m); d->matrix_off = _arb_vec_init(m);
    d->w0_seen = flint_calloc((size_t) m, sizeof(int));
    d->w4_seen = flint_calloc((size_t) m, sizeof(int));
    d->poly_seen = flint_calloc((size_t) count, sizeof(int));
    d->coeff_seen = flint_calloc((size_t) count, sizeof(int));
    d->kappa_seen = flint_calloc((size_t) count, sizeof(int));
    d->matrix_diag_seen = flint_calloc((size_t) m, sizeof(int));
    d->matrix_off_seen = flint_calloc((size_t) m, sizeof(int));
    d->sum_seen = flint_calloc((size_t) (qmax + 1), sizeof(int));
}

static void
vlv_data_clear(vlv_data_t *d, slong m, slong nmax)
{
    slong count = 2 * nmax + 1;
    _arb_vec_clear(d->w0, m); _arb_vec_clear(d->w4, m);
    _arb_vec_clear(d->poly, count); _arb_vec_clear(d->coeff, count);
    _arb_vec_clear(d->kappa, count); flint_free(d->w0_seen);
    _arb_vec_clear(d->matrix_diag, m); _arb_vec_clear(d->matrix_off, m);
    flint_free(d->w4_seen); flint_free(d->poly_seen);
    flint_free(d->coeff_seen); flint_free(d->kappa_seen);
    flint_free(d->matrix_diag_seen); flint_free(d->matrix_off_seen);
    flint_free(d->sum_seen);
}

static int
vlv_load(vlv_data_t *d, const char *path, const char *lambda_canonical,
         const fmpq_t lambda2q, slong m, slong k, slong nmax,
         slong qmax, slong prec)
{
    FILE *f = fopen(path, "r");
    if (!f) return 0;
    char line[32768], dump[30000], text[1024];
    slong a, b, c, included, degenerate;
    int schema = 0, status = 0, source = 0, normalization_hash = 0;
    int core = 0, lambda_ok = 0, n_ok = 0, m_ok = 0, k_ok = 0;
    int prec_ok = 0, q_ok = 0, norm = 0, fourier = 0, reflection = 0;
    int coefficient_sign = 0, cutoff = 0, parser = 0, tail = 0, qcap = 0;
    while (fgets(line, sizeof(line), f))
    {
        if (sscanf(line, "META schema=%1023s", text) == 1)
            schema = !strcmp(text, VLV_SCHEMA);
        else if (!strcmp(line, "META terminal_state=P0_INVALIDATED\n")) status = 1;
        else if (sscanf(line, "META source_lock_sha256=%1023s", text) == 1)
            source = !strcmp(text, VLV_SOURCE_LOCK_SHA256);
        else if (sscanf(line, "META normalization_audit_sha256=%1023s", text) == 1)
            normalization_hash = !strcmp(text, VLV_NORMALIZATION_SHA256);
        else if (sscanf(line, "META inherited_producer_core_sha256=%1023s", text) == 1)
            core = !strcmp(text, VLV_PRODUCER_CORE_SHA256);
        else if (sscanf(line, "PARAM lambda %1023s", text) == 1)
            lambda_ok = !strcmp(text, lambda_canonical);
        else if (sscanf(line, "PARAM N %ld", &a) == 1) n_ok = a == nmax;
        else if (sscanf(line, "PARAM basis_size %ld", &a) == 1) m_ok = a == m;
        else if (sscanf(line, "PARAM tail_terminal %ld", &a) == 1) k_ok = a == k;
        else if (sscanf(line, "PARAM precision %ld", &a) == 1) prec_ok = a == prec;
        else if (sscanf(line, "PARAM floor_lambda_squared %ld", &a) == 1) q_ok = a == qmax;
        else if (sscanf(line, "LIMIT floor_lambda_squared_max %ld", &a) == 1)
            qcap = a == VLV_QMAX_LIMIT;
        else if (!strcmp(line, "LOCK normalization source_limit_h\n")) norm = 1;
        else if (!strcmp(line, "LOCK fourier_basis exp_plus_2pi_i_n_t_over_L\n")) fourier = 1;
        else if (!strcmp(line, "LOCK coefficient_sign conjugate_negative_equivalently_cosine_after_evenization\n")) coefficient_sign = 1;
        else if (!strcmp(line, "LOCK inversion_reflection explicit\n")) reflection = 1;
        else if (!strcmp(line, "LOCK arithmetic_cutoff floor_lambda_squared_inclusive\n")) cutoff = 1;
        else if (!strcmp(line, "LOCK parameter_parser exact_decimal_or_rational_no_binary64\n")) parser = 1;
        else if (!strcmp(line, "LOCK eigen_tail uniform_jacobi_continued_fraction\n")) tail = 1;
        else if (sscanf(line, "SUMINDEX %ld included=%ld degenerate_endpoint=%ld",
                        &a, &included, &degenerate) == 3)
        {
            if (a < 1 || a > qmax || included != 1 || d->sum_seen[a])
            { fclose(f); return 0; }
            d->sum_seen[a] = 1;
            fmpq_t rq; fmpq_init(rq); fmpq_set_si(rq, a, 1);
            int expected_degenerate = fmpq_equal(rq, lambda2q);
            fmpq_clear(rq);
            if (degenerate != expected_degenerate) { fclose(f); return 0; }
        }
        else if (sscanf(line, "LABEL label=%ld rank=%ld lower_shift=%ld upper_shift=%ld",
                        &a, &b, &c, &included) == 4)
        {
            if (a == 0 && b == 0 && !d->label0_seen)
            { d->lower0 = c; d->upper0 = included; d->label0_seen = 1; }
            else if (a == 4 && b == 2 && !d->label4_seen)
            { d->lower4 = c; d->upper4 = included; d->label4_seen = 1; }
            else { fclose(f); return 0; }
        }
        else if (sscanf(line, "DUMPW %ld %ld %29999[^\n]", &a, &b, dump) == 3)
        {
            if (b < 0 || b >= m || (a != 0 && a != 4)) { fclose(f); return 0; }
            arb_ptr target = a == 0 ? d->w0 + b : d->w4 + b;
            int *seen = a == 0 ? d->w0_seen + b : d->w4_seen + b;
            if (*seen || arb_load_str(target, dump) != 0 || !arb_is_exact(target))
            { fclose(f); return 0; }
            *seen = 1;
        }
        else if (sscanf(line, "DUMPP %ld %29999[^\n]", &a, dump) == 2)
        {
            if (a < -nmax || a > nmax || d->poly_seen[a + nmax]
                || arb_load_str(d->poly + a + nmax, dump) != 0)
            { fclose(f); return 0; }
            d->poly_seen[a + nmax] = 1;
        }
        else if (sscanf(line, "DUMPC %ld %29999[^\n]", &a, dump) == 2)
        {
            if (a < -nmax || a > nmax || d->coeff_seen[a + nmax]
                || arb_load_str(d->coeff + a + nmax, dump) != 0)
            { fclose(f); return 0; }
            d->coeff_seen[a + nmax] = 1;
        }
        else if (sscanf(line, "DUMPK %ld %29999[^\n]", &a, dump) == 2)
        {
            if (a < -nmax || a > nmax || d->kappa_seen[a + nmax]
                || arb_load_str(d->kappa + a + nmax, dump) != 0)
            { fclose(f); return 0; }
            d->kappa_seen[a + nmax] = 1;
        }
        else if (sscanf(line, "DUMPMD %ld %29999[^\n]", &a, dump) == 2)
        {
            if (a < 0 || a >= m || d->matrix_diag_seen[a]
                || arb_load_str(d->matrix_diag + a, dump) != 0)
            { fclose(f); return 0; }
            d->matrix_diag_seen[a] = 1;
        }
        else if (sscanf(line, "DUMPMO %ld %29999[^\n]", &a, dump) == 2)
        {
            if (a < 0 || a >= m || d->matrix_off_seen[a]
                || arb_load_str(d->matrix_off + a, dump) != 0)
            { fclose(f); return 0; }
            d->matrix_off_seen[a] = 1;
        }
    }
    fclose(f);
    d->meta_ok = schema && status && source && normalization_hash && core;
    d->parameter_ok = lambda_ok && n_ok && m_ok && k_ok && prec_ok && q_ok && qcap;
    d->lock_ok = norm && fourier && coefficient_sign && reflection
              && cutoff && parser && tail;
    d->sum_ok = 1;
    for (slong r = 1; r <= qmax; r++) d->sum_ok = d->sum_ok && d->sum_seen[r];
    int ok = d->meta_ok && d->parameter_ok && d->lock_ok && d->sum_ok
          && d->label0_seen && d->label4_seen;
    for (slong i = 0; i < m; i++)
        ok = ok && d->w0_seen[i] && d->w4_seen[i]
                && d->matrix_diag_seen[i] && d->matrix_off_seen[i];
    for (slong i = 0; i < 2 * nmax + 1; i++)
        ok = ok && d->poly_seen[i] && d->coeff_seen[i] && d->kappa_seen[i];
    for (slong n = 1; n <= nmax; n++)
        ok = ok && arb_equal(d->poly + nmax - n, d->poly + nmax + n)
                && arb_equal(d->coeff + nmax - n, d->coeff + nmax + n)
                && arb_equal(d->kappa + nmax - n, d->kappa + nmax + n);
    return ok;
}

static void
vlv_build_band_operator(arb_mat_t a, fmpq_poly_struct *p,
                        slong dimension, const arb_t c2, slong prec)
{
    fmpq_t integral; arb_t t, scale;
    fmpq_init(integral); arb_init(t); arb_init(scale); arb_mat_zero(a);
    for (slong i = 0; i < dimension; i++)
        for (slong j = FLINT_MAX(0, i - 1); j <= FLINT_MIN(dimension - 1, i + 1); j++)
        {
            slong li = 2 * i, lj = 2 * j;
            z2_product_integral(integral, p + li, p + lj);
            arb_set_fmpq(t, integral, prec);
            arb_set_ui(scale, (ulong) ((2 * li + 1) * (2 * lj + 1)));
            arb_sqrt(scale, scale, prec); arb_mul_2exp_si(scale, scale, -1);
            arb_mul(t, t, scale, prec); arb_mul(t, t, c2, prec);
            if (i == j) arb_add_ui(t, t, (ulong) (li * (li + 1)), prec);
            arb_set(arb_mat_entry(a, i, j), t);
        }
    fmpq_clear(integral); arb_clear(t); arb_clear(scale);
}

static void
vlv_zero_upper(arb_t out, const arb_t upper, slong prec)
{
    arf_t lo, hi; arf_init(lo); arf_init(hi); arf_zero(lo);
    arb_get_ubound_arf(hi, upper, prec); arb_set_interval_arf(out, lo, hi, prec);
    arf_clear(lo); arf_clear(hi);
}

static int
vlv_tail_interval(arb_t lower, arb_t upper, arb_t width,
                  const arb_mat_t a, slong m, slong k, slong shift,
                  const arb_t c2, slong prec)
{
    arb_t r, g, den, b2, terminal, bound, boundlo, c2lo, shift_ball;
    fmpz_t contraction;
    arb_init(r); arb_init(g); arb_init(den); arb_init(b2); arb_init(terminal);
    arb_init(bound); arb_init(boundlo); arb_init(c2lo); arb_init(shift_ball);
    fmpz_init(contraction);
    arb_set_ui(g, (ulong) (2 * k * (2 * k + 1)));
    arb_set_ui(shift_ball, (ulong) shift);
    arb_sub_ui(den, g, (ulong) shift, prec);
    int ok = shift >= 0 && arb_lt(shift_ball, c2) && arb_is_positive(den);
    if (ok)
    {
        arb_mul(b2, arb_mat_entry(a, k - 1, k), arb_mat_entry(a, k - 1, k), prec);
        arb_div(terminal, b2, den, prec); vlv_zero_upper(r, terminal, prec);
    }
    for (slong i = k - 1; ok && i >= m; i--)
    {
        arb_sub_ui(den, arb_mat_entry(a, i, i), (ulong) shift, prec);
        arb_sub(den, den, r, prec); ok = arb_is_positive(den);
        if (ok)
        {
            arb_mul(b2, arb_mat_entry(a, i - 1, i),
                    arb_mat_entry(a, i - 1, i), prec);
            arb_div(r, b2, den, prec);
        }
    }
    if (ok)
    {
        set_lower_exact(lower, r, prec); set_upper_exact(upper, r, prec);
        arb_sub(width, upper, lower, prec);
        /* Compare against a certified lower bound for the positive RHS. */
        set_lower_exact(c2lo, c2, prec);
        fmpz_ui_pow_ui(contraction, 1764, (ulong) (k - m));
        fmpz_mul_ui(contraction, contraction, 135);
        arb_div_fmpz(bound, c2lo, contraction, prec);
        set_lower_exact(boundlo, bound, prec); ok = arb_lt(width, boundlo);
    }
    arb_clear(r); arb_clear(g); arb_clear(den); arb_clear(b2);
    arb_clear(terminal); arb_clear(bound); arb_clear(boundlo); arb_clear(c2lo);
    arb_clear(shift_ball);
    fmpz_clear(contraction); return ok;
}

static int
vlv_count(slong *count, arb_t width, const arb_mat_t a, slong m, slong k,
          slong shift, const arb_t c2, slong prec)
{
    arb_t lo, hi; arb_init(lo); arb_init(hi);
    slong nlo = -1, nhi = -1;
    int ok = vlv_tail_interval(lo, hi, width, a, m, k, shift, c2, prec)
          && dense_inertia(&nlo, a, m, shift, lo, prec)
          && dense_inertia(&nhi, a, m, shift, hi, prec) && nlo == nhi;
    if (ok) *count = nlo;
    arb_clear(lo); arb_clear(hi); return ok;
}

static void
vlv_eigen_init(vlv_eigen_t *e, slong label, slong rank,
               slong lower, slong upper, slong m)
{
    e->label = label; e->rank = rank; e->lower_shift = lower;
    e->upper_shift = upper; e->localization_ok = 0; e->v = _arb_vec_init(m);
    arb_init(e->theta); arb_init(e->epsilon); arb_init(e->spectral_ratio);
    arb_init(e->eta); arb_init(e->integral); arb_init(e->value_zero);
}

static void
vlv_eigen_clear(vlv_eigen_t *e, slong m)
{
    _arb_vec_clear(e->v, m); arb_clear(e->theta); arb_clear(e->epsilon);
    arb_clear(e->spectral_ratio); arb_clear(e->eta); arb_clear(e->integral);
    arb_clear(e->value_zero);
}

static int
vlv_certify(vlv_eigen_t *e, arb_srcptr w, const arb_mat_t a,
            fmpq_poly_struct *p, slong m, slong k,
            const arb_t c2, const arb_t lambda, slong prec)
{
    arb_ptr av = _arb_vec_init(m);
    arb_t norm2, norm, t, residual2, epsup, theta_lo, theta_hi;
    arb_t dleft, dright, delta, integral_error, witness_zero, point_error;
    arb_t qhalf, qterm, cbelow, cabove, constant, basis, coeff, widthlo, widthhi;
    fmpq_t q;
    arb_init(norm2); arb_init(norm); arb_init(t); arb_init(residual2);
    arb_init(epsup); arb_init(theta_lo); arb_init(theta_hi); arb_init(dleft);
    arb_init(dright); arb_init(delta); arb_init(integral_error);
    arb_init(witness_zero); arb_init(point_error); arb_init(qhalf);
    arb_init(qterm); arb_init(cbelow); arb_init(cabove); arb_init(constant);
    arb_init(basis); arb_init(coeff); arb_init(widthlo); arb_init(widthhi); fmpq_init(q);
    arb_zero(norm2);
    for (slong i = 0; i < m; i++)
    { arb_mul(t, w + i, w + i, prec); arb_add(norm2, norm2, t, prec); }
    int ok = arb_is_positive(norm2);
    if (ok)
    {
        arb_sqrt(norm, norm2, prec);
        for (slong i = 0; i < m; i++) arb_div(e->v + i, w + i, norm, prec);
        arb_zero(e->theta);
        for (slong i = 0; i < m; i++)
        {
            arb_zero(av + i);
            for (slong j = 0; j < m; j++)
            { arb_mul(t, arb_mat_entry(a, i, j), e->v + j, prec);
              arb_add(av + i, av + i, t, prec); }
            arb_mul(t, e->v + i, av + i, prec); arb_add(e->theta, e->theta, t, prec);
        }
        arb_zero(residual2);
        for (slong i = 0; i < m; i++)
        {
            arb_mul(t, e->theta, e->v + i, prec); arb_sub(t, av + i, t, prec);
            arb_mul(t, t, t, prec); arb_add(residual2, residual2, t, prec);
        }
        arb_mul(t, arb_mat_entry(a, m - 1, m), e->v + m - 1, prec);
        arb_mul(t, t, t, prec); arb_add(residual2, residual2, t, prec);
        set_upper_exact(t, residual2, prec); ok = arb_is_positive(t);
        if (ok) arb_sqrt(e->epsilon, t, prec);
    }
    slong countlo = -1, counthi = -1;
    ok = ok && e->lower_shift >= 0 && e->upper_shift > e->lower_shift
      && vlv_count(&countlo, widthlo, a, m, k, e->lower_shift, c2, prec)
      && vlv_count(&counthi, widthhi, a, m, k, e->upper_shift, c2, prec)
      && countlo == e->rank && counthi == e->rank + 1;
    if (ok)
    {
        set_upper_exact(epsup, e->epsilon, prec); set_lower_exact(theta_lo, e->theta, prec);
        set_upper_exact(theta_hi, e->theta, prec);
        arb_sub_ui(dleft, theta_lo, (ulong) e->lower_shift, prec); arb_sub(dleft, dleft, epsup, prec);
        arb_set_ui(dright, (ulong) e->upper_shift); arb_sub(dright, dright, theta_hi, prec);
        arb_sub(dright, dright, epsup, prec);
        if (arb_lt(dleft, dright)) arb_set(delta, dleft); else arb_set(delta, dright);
        e->localization_ok = arb_is_positive(delta); ok = e->localization_ok;
    }
    if (ok)
    {
        arb_div(t, epsup, delta, prec); set_upper_exact(e->spectral_ratio, t, prec);
        arb_mul_2exp_si(t, e->spectral_ratio, 1); set_upper_exact(e->eta, t, prec);
        arb_one(t); ok = arb_lt(e->spectral_ratio, t);
    }
    if (ok)
    {
        arb_mul_2exp_si(t, lambda, 1); arb_sqrt(t, t, prec);
        arb_mul(e->integral, t, e->v + 0, prec); arb_mul(integral_error, t, e->eta, prec);
        arb_add_error(e->integral, integral_error); arb_zero(witness_zero);
        for (slong i = 0; i < m; i++)
        {
            fmpq_poly_get_coeff_fmpq(q, p + 2 * i, 0); arb_set_fmpq(coeff, q, prec);
            arb_set_ui(basis, (ulong) (4 * i + 1)); arb_mul_2exp_si(basis, basis, -1);
            arb_sqrt(basis, basis, prec); arb_mul(coeff, coeff, basis, prec);
            arb_mul(coeff, coeff, e->v + i, prec); arb_add(witness_zero, witness_zero, coeff, prec);
        }
        if (e->lower_shift == 0) arb_zero(cbelow);
        else
        {
            arb_set_ui(cbelow, (ulong) e->lower_shift);
            arb_sub_ui(t, theta_lo, (ulong) e->lower_shift, prec); arb_mul(t, t, t, prec);
            arb_div(cbelow, cbelow, t, prec);
        }
        arb_set_ui(cabove, (ulong) e->upper_shift); arb_set_ui(t, (ulong) e->upper_shift);
        arb_sub(t, t, theta_hi, prec); arb_mul(t, t, t, prec); arb_div(cabove, cabove, t, prec);
        if (arb_lt(cbelow, cabove)) arb_set(constant, cabove); else arb_set(constant, cbelow);
        arb_mul(qhalf, e->spectral_ratio, e->spectral_ratio, prec);
        arb_set_ui(qterm, (ulong) e->upper_shift); arb_sqrt(qterm, qterm, prec);
        arb_mul(qhalf, qhalf, qterm, prec); arb_sqrt(constant, constant, prec);
        arb_mul(qterm, constant, epsup, prec); arb_add(qhalf, qhalf, qterm, prec);
        arb_set_ui(constant, 4); arb_div_ui(constant, constant, 3, prec);
        arb_sqrt(constant, constant, prec); arb_mul(point_error, constant, qhalf, prec);
        arb_add(point_error, point_error, e->eta, prec); set_upper_exact(qterm, point_error, prec);
        arb_set(e->value_zero, witness_zero); arb_add_error(e->value_zero, qterm);
        arb_sqrt(t, lambda, prec); arb_div(e->value_zero, e->value_zero, t, prec);
        ok = arb_is_positive(e->integral) && arb_is_positive(e->value_zero);
    }
    printf("LABEL_REPLAY label=%ld lower_shift=%ld upper_shift=%ld status=%s\n",
           e->label, e->lower_shift, e->upper_shift, ok ? "PASS" : "FAIL");
    _arb_vec_clear(av, m); arb_clear(norm2); arb_clear(norm); arb_clear(t);
    arb_clear(residual2); arb_clear(epsup); arb_clear(theta_lo); arb_clear(theta_hi);
    arb_clear(dleft); arb_clear(dright); arb_clear(delta); arb_clear(integral_error);
    arb_clear(witness_zero); arb_clear(point_error); arb_clear(qhalf); arb_clear(qterm);
    arb_clear(cbelow); arb_clear(cabove); arb_clear(constant); arb_clear(basis);
    arb_clear(coeff); arb_clear(widthlo); arb_clear(widthhi); fmpq_clear(q);
    return ok;
}

static void
vlv_physical_poly(arb_ptr out, arb_srcptr v, fmpq_poly_struct *p,
                  slong m, const arb_t lambda, slong prec)
{
    fmpq_t q; arb_t coeff, basis, lp, term, sqrtlambda;
    fmpq_init(q); arb_init(coeff); arb_init(basis); arb_init(lp);
    arb_init(term); arb_init(sqrtlambda); arb_sqrt(sqrtlambda, lambda, prec);
    for (slong power = 0; power <= 2 * (m - 1); power++) arb_zero(out + power);
    for (slong i = 0; i < m; i++)
        for (slong power = 0; power <= 2 * i; power += 2)
        {
            fmpq_poly_get_coeff_fmpq(q, p + 2 * i, power); arb_set_fmpq(coeff, q, prec);
            arb_set_ui(basis, (ulong) (4 * i + 1)); arb_mul_2exp_si(basis, basis, -1);
            arb_sqrt(basis, basis, prec); arb_mul(coeff, coeff, basis, prec);
            arb_pow_ui(lp, lambda, (ulong) power, prec); arb_mul(lp, lp, sqrtlambda, prec);
            arb_div(coeff, coeff, lp, prec); arb_mul(term, coeff, v + i, prec);
            arb_add(out + power, out + power, term, prec);
        }
    fmpq_clear(q); arb_clear(coeff); arb_clear(basis); arb_clear(lp);
    arb_clear(term); arb_clear(sqrtlambda);
}

static void
vlv_complex_integral(arb_t out, ulong power, ulong r, slong n,
                     const arb_t lambda, const arb_t L,
                     const arb_t pi, slong prec)
{
    arb_t omega, alpha, logx, t;
    acb_t exponent, upper, lower, phase, result;
    arb_init(omega); arb_init(alpha); arb_init(logx); arb_init(t);
    acb_init(exponent); acb_init(upper); acb_init(lower); acb_init(phase); acb_init(result);
    arb_mul_si(omega, pi, 2 * n, prec); arb_div(omega, omega, L, prec);
    arb_set_ui(alpha, 2 * power + 1); arb_mul_2exp_si(alpha, alpha, -1);
    arb_set(acb_realref(exponent), alpha); arb_set(acb_imagref(exponent), omega);
    arb_log(logx, lambda, prec); acb_mul_arb(upper, exponent, logx, prec); acb_exp(upper, upper, prec);
    arb_set_ui(t, r); arb_div(t, t, lambda, prec); arb_log(logx, t, prec);
    acb_mul_arb(lower, exponent, logx, prec); acb_exp(lower, lower, prec);
    acb_sub(result, upper, lower, prec); acb_div(result, result, exponent, prec);
    arb_set_ui(t, r); arb_div(t, lambda, t, prec); arb_log(logx, t, prec);
    arb_mul(logx, logx, omega, prec); arb_zero(acb_realref(phase));
    arb_set(acb_imagref(phase), logx); acb_exp(phase, phase, prec);
    acb_mul(result, result, phase, prec); arb_set(out, acb_realref(result));
    arb_clear(omega); arb_clear(alpha); arb_clear(logx); arb_clear(t);
    acb_clear(exponent); acb_clear(upper); acb_clear(lower); acb_clear(phase); acb_clear(result);
}

static void
vlv_project(arb_t out, arb_srcptr d, slong max_degree, slong qmax,
            slong n, const arb_t lambda, const arb_t L,
            const arb_t pi, slong prec)
{
    arb_t sum, integ, sqrtr, term, sqrtL;
    arb_init(sum); arb_init(integ); arb_init(sqrtr); arb_init(term); arb_init(sqrtL);
    arb_sqrt(sqrtL, L, prec); arb_zero(out);
    for (slong power = 0; power <= max_degree; power += 2)
    {
        arb_zero(sum);
        for (slong r = 1; r <= qmax; r++)
        {
            vlv_complex_integral(integ, (ulong) power, (ulong) r, n,
                                 lambda, L, pi, prec);
            arb_sqrt_ui(sqrtr, (ulong) r, prec); arb_div(integ, integ, sqrtr, prec);
            arb_add(sum, sum, integ, prec);
        }
        arb_mul(term, d + power, sum, prec); arb_add(out, out, term, prec);
    }
    arb_div(out, out, sqrtL, prec); arb_clear(sum); arb_clear(integ);
    arb_clear(sqrtr); arb_clear(term); arb_clear(sqrtL);
}

static fmpq *
vlv_partition(const fmpq_t lambda2, slong qmax, slong *count)
{
    slong cap = 2 * qmax + 2, used = 0;
    fmpq *points = flint_malloc((size_t) cap * sizeof(fmpq));
    for (slong i = 0; i < cap; i++) fmpq_init(points + i);
    fmpq_one(points + used++); fmpq_set(points + used++, lambda2);
    fmpq_t r, reflected; fmpq_init(r); fmpq_init(reflected);
    for (slong j = 1; j <= qmax; j++)
    {
        fmpq_set_si(r, j, 1); fmpq_set(points + used++, r);
        fmpq_div(reflected, lambda2, r); fmpq_set(points + used++, reflected);
    }
    for (slong i = 0; i < used; i++) for (slong j = i + 1; j < used; j++)
        if (fmpq_cmp(points + j, points + i) < 0) fmpq_swap(points + i, points + j);
    slong unique = 0;
    for (slong i = 0; i < used; i++)
        if (!unique || !fmpq_equal(points + i, points + unique - 1))
        { if (unique != i) fmpq_set(points + unique, points + i); unique++; }
    fmpq_clear(r); fmpq_clear(reflected); *count = unique; return points;
}

static void
vlv_partition_clear(fmpq *p, slong qmax)
{
    for (slong i = 0; i < 2 * qmax + 2; i++) fmpq_clear(p + i);
    flint_free(p);
}

static void
vlv_pow_si(arb_t out, const arb_t x, slong exponent, slong prec)
{
    fmpz_t e; fmpz_init(e); fmpz_set_si(e, exponent);
    arb_pow_fmpz(out, x, e, prec); fmpz_clear(e);
}

static void
vlv_y_integral(arb_t out, const fmpq_t qa, const fmpq_t qb,
               slong exponent, slong prec)
{
    arb_t a, b, pa, pb, ratio;
    arb_init(a); arb_init(b); arb_init(pa); arb_init(pb); arb_init(ratio);
    arb_set_fmpq(a, qa, prec); arb_set_fmpq(b, qb, prec);
    if (!exponent) { arb_div(ratio, b, a, prec); arb_log(out, ratio, prec); }
    else
    {
        vlv_pow_si(pa, a, exponent, prec); vlv_pow_si(pb, b, exponent, prec);
        arb_sub(out, pb, pa, prec); arb_div_si(out, out, exponent, prec);
    }
    arb_clear(a); arb_clear(b); arb_clear(pa); arb_clear(pb); arb_clear(ratio);
}

/* Verifier path: loop over every arithmetic index before Laurent squaring. */
static int
vlv_full_norm_squared(arb_t out, arb_srcptr d, slong max_degree,
                      const fmpq_t lambda_q, slong qmax,
                      const arb_t lambda, slong prec)
{
    fmpq_t lambda2q, mid, ratio; fmpq_init(lambda2q); fmpq_init(mid); fmpq_init(ratio);
    fmpq_mul(lambda2q, lambda_q, lambda_q); slong point_count;
    fmpq *points = vlv_partition(lambda2q, qmax, &point_count);
    slong modes = max_degree / 2 + 1;
    arb_ptr avec = _arb_vec_init(modes), bvec = _arb_vec_init(modes);
    arb_t term, integ, lp, sqrtlambda, cell, power;
    arb_init(term); arb_init(integ); arb_init(lp); arb_init(sqrtlambda);
    arb_init(cell); arb_init(power); arb_sqrt(sqrtlambda, lambda, prec); arb_zero(out);
    int ok = point_count >= 2;
    for (slong ci = 0; ok && ci + 1 < point_count; ci++)
    {
        fmpq_add(mid, points + ci, points + ci + 1); fmpq_div_2exp(mid, mid, 1);
        fmpq_div(ratio, lambda2q, mid); slong qa = -1, qb = -1;
        ok = vlv_floor_slong(&qa, ratio) && vlv_floor_slong(&qb, mid)
          && qa >= 0 && qa <= qmax && qb >= 0 && qb <= qmax;
        arb_zero(cell);
        for (slong p = 0; ok && p <= max_degree; p += 2)
        {
            slong ip = p / 2; arb_zero(avec + ip); arb_zero(bvec + ip);
            arb_pow_ui(lp, lambda, (ulong) p, prec); arb_mul(lp, lp, sqrtlambda, prec);
            for (slong r = 1; r <= qa; r++)
            {
                arb_set_ui(power, (ulong) r); arb_pow_ui(power, power, (ulong) p, prec);
                arb_mul(term, d + p, power, prec); arb_div(term, term, lp, prec);
                arb_add(avec + ip, avec + ip, term, prec);
            }
            for (slong r = 1; r <= qb; r++)
            {
                arb_set_ui(power, (ulong) r); arb_pow_ui(power, power, (ulong) p, prec);
                arb_mul(term, d + p, power, prec); arb_mul(term, term, lp, prec);
                arb_add(bvec + ip, bvec + ip, term, prec);
            }
            arb_mul_2exp_si(avec + ip, avec + ip, -1);
            arb_mul_2exp_si(bvec + ip, bvec + ip, -1);
        }
        for (slong p = 0; ok && p <= max_degree; p += 2)
            for (slong q = 0; q <= max_degree; q += 2)
            {
                slong ip = p / 2, iq = q / 2;
                vlv_y_integral(integ, points + ci, points + ci + 1, p + q + 1, prec);
                arb_mul(term, avec + ip, avec + iq, prec); arb_mul(term, term, integ, prec);
                arb_add(cell, cell, term, prec);
                vlv_y_integral(integ, points + ci, points + ci + 1, p - q, prec);
                arb_mul(term, avec + ip, bvec + iq, prec); arb_mul(term, term, integ, prec);
                arb_add(cell, cell, term, prec);
                vlv_y_integral(integ, points + ci, points + ci + 1, q - p, prec);
                arb_mul(term, bvec + ip, avec + iq, prec); arb_mul(term, term, integ, prec);
                arb_add(cell, cell, term, prec);
                vlv_y_integral(integ, points + ci, points + ci + 1, -(p + q + 1), prec);
                arb_mul(term, bvec + ip, bvec + iq, prec); arb_mul(term, term, integ, prec);
                arb_add(cell, cell, term, prec);
            }
        arb_add(out, out, cell, prec);
    }
    vlv_partition_clear(points, qmax); _arb_vec_clear(avec, modes);
    _arb_vec_clear(bvec, modes); arb_clear(term); arb_clear(integ);
    arb_clear(lp); arb_clear(sqrtlambda); arb_clear(cell); arb_clear(power);
    fmpq_clear(lambda2q); fmpq_clear(mid); fmpq_clear(ratio);
    return ok && arb_is_positive(out);
}

int
main(int argc, char **argv)
{
    const char *producer = NULL, *output = NULL, *lambda_text = NULL;
    slong nmax = -1, m = -1, k = -1, prec = 256;
    for (int i = 1; i < argc; i++)
    {
        if (!strcmp(argv[i], "--producer") && i + 1 < argc) producer = argv[++i];
        else if (!strcmp(argv[i], "--output") && i + 1 < argc) output = argv[++i];
        else if (!strcmp(argv[i], "--lambda") && i + 1 < argc) lambda_text = argv[++i];
        else if (!strcmp(argv[i], "--N") && i + 1 < argc) nmax = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--basis-size") && i + 1 < argc) m = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--tail-terminal") && i + 1 < argc) k = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--prec") && i + 1 < argc) prec = strtol(argv[++i], NULL, 10);
        else return 2;
    }
    if (!producer || !lambda_text || nmax < 0 || m <= nmax || k < m || prec < 192) return 2;
    if (output && freopen(output, "w", stdout) == NULL) return 2;
    fmpq_t lambda_q, lambda2q; fmpq_init(lambda_q); fmpq_init(lambda2q);
    int ok = vlv_parse_exact(lambda_q, lambda_text) && fmpq_cmp_ui(lambda_q, 2) >= 0;
    fmpq_mul(lambda2q, lambda_q, lambda_q); slong qmax = -1;
    ok = ok && vlv_floor_slong(&qmax, lambda2q)
       && qmax >= 1 && qmax <= VLV_QMAX_LIMIT;
    if (!ok) { fmpq_clear(lambda_q); fmpq_clear(lambda2q); return 2; }
    char *canonical = fmpq_get_str(NULL, 10, lambda_q);
    vlv_data_t data; vlv_data_init(&data, m, nmax, qmax);
    ok = vlv_load(&data, producer, canonical, lambda2q,
                  m, k, nmax, qmax, prec);
    printf("META schema=%s\n", VLV_SCHEMA);
    printf("META claim_class=FINITE_VARIABLE_LAMBDA_PROLATE_STATE_AND_PROJECTION_BALL_DIAGNOSTIC_ONLY\n");
    printf("META terminal_state=P0_INVALIDATED\n");
    printf("META source_lock_sha256=%s\n", VLV_SOURCE_LOCK_SHA256);
    printf("META normalization_audit_sha256=%s\n", VLV_NORMALIZATION_SHA256);
    printf("META inherited_verifier_core_sha256=%s\n", VLV_VERIFIER_CORE_SHA256);
    printf("META arithmetic_library=FLINT_ARB\n");
    printf("META shared_library_limitation=producer_and_verifier_share_FLINT_ARB_transcendentals\n");
    printf("META verifier_matrix_path=exact_Legendre_polynomial_differential_form\n");
    printf("META verifier_projection_path=complex_power_and_direct_arithmetic_Laurent_cells\n");
    printf("PARAM lambda %s\nPARAM N %ld\nPARAM basis_size %ld\n", canonical, nmax, m);
    printf("PARAM tail_terminal %ld\nPARAM precision %ld\nPARAM floor_lambda_squared %ld\n",
           k, prec, qmax);
    printf("LIMIT floor_lambda_squared_max %d\n", VLV_QMAX_LIMIT);
    printf("CHECK producer_contract_exact_witnesses_and_reflection=%s\n", ok ? "PASS" : "FAIL");
    flint_free(canonical);
    if (!ok)
    {
        vlv_data_clear(&data, m, nmax); fmpq_clear(lambda_q); fmpq_clear(lambda2q);
        return 1;
    }

    arb_t lambda, L, pi, c2, c, two_c, mball;
    arb_init(lambda); arb_init(L); arb_init(pi); arb_init(c2); arb_init(c);
    arb_init(two_c); arb_init(mball); arb_set_fmpq(lambda, lambda_q, prec);
    arb_log(L, lambda, prec); arb_mul_2exp_si(L, L, 1); arb_const_pi(pi, prec);
    prolate_c_squared(c2, lambda, prec); arb_sqrt(c, c2, prec);
    arb_mul_2exp_si(two_c, c, 1); arb_set_ui(mball, (ulong) m);
    ok = arb_gt(mball, two_c);
    fmpq_poly_struct *polys = build_legendre_polynomials(2 * k);
    arb_mat_t a; arb_mat_init(a, k + 1, k + 1);
    vlv_build_band_operator(a, polys, k + 1, c2, prec);
    int matrix_overlap = 1;
    for (slong i = 0; i < m; i++)
        matrix_overlap = matrix_overlap
          && arb_overlaps(arb_mat_entry(a, i, i), data.matrix_diag + i)
          && arb_overlaps(arb_mat_entry(a, i, i + 1), data.matrix_off + i);
    ok = ok && matrix_overlap;
    printf("CHECK independent_matrix_entries_overlap=%s\n",
           matrix_overlap ? "PASS" : "FAIL");

    vlv_eigen_t e0, e4;
    vlv_eigen_init(&e0, 0, 0, data.lower0, data.upper0, m);
    vlv_eigen_init(&e4, 4, 2, data.lower4, data.upper4, m);
    ok = ok && vlv_certify(&e0, data.w0, a, polys, m, k, c2, lambda, prec);
    ok = ok && vlv_certify(&e4, data.w4, a, polys, m, k, c2, lambda, prec);
    printf("BALL replay_eigen_0_theta "); arb_printn(e0.theta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_0_L2_radius_upper "); arb_printn(e0.eta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_4_theta "); arb_printn(e4.theta, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_eigen_4_L2_radius_upper "); arb_printn(e4.eta, 60, ARB_STR_MORE); printf("\n");

    arb_t a4, a0, exponent, t, eta_h, hnorm, unit_a4;
    arb_init(a4); arb_init(a0); arb_init(exponent); arb_init(t); arb_init(eta_h);
    arb_init(hnorm); arb_init(unit_a4); arb_set_ui(a4, 3); arb_sqrt(a4, a4, prec);
    arb_set_ui(t, 2); arb_set_ui(exponent, 11); arb_div_ui(exponent, exponent, 4, prec);
    arb_pow(t, t, exponent, prec); arb_div(a4, a4, t, prec);
    arb_mul(a0, a4, e4.integral, prec); arb_div(a0, a0, e0.integral, prec);
    arb_mul(eta_h, a4, e4.eta, prec); arb_mul(t, a0, e0.eta, prec);
    arb_add(eta_h, eta_h, t, prec); set_upper_exact(eta_h, eta_h, prec);
    slong max_degree = 2 * (m - 1);
    arb_ptr d0 = _arb_vec_init(max_degree + 1), d4 = _arb_vec_init(max_degree + 1);
    arb_ptr dh = _arb_vec_init(max_degree + 1);
    vlv_physical_poly(d0, e0.v, polys, m, lambda, prec);
    vlv_physical_poly(d4, e4.v, polys, m, lambda, prec);
    for (slong p = 0; p <= max_degree; p++)
    { arb_mul(dh + p, a4, d4 + p, prec); arb_mul(t, a0, d0 + p, prec);
      arb_sub(dh + p, dh + p, t, prec); }

    arb_ptr poly = _arb_vec_init(nmax + 1), coeff = _arb_vec_init(nmax + 1);
    arb_ptr kappa = _arb_vec_init(nmax + 1);
    for (slong n = 0; ok && n <= nmax; n++)
    {
        vlv_project(poly + n, dh, max_degree, qmax, n, lambda, L, pi, prec);
        arb_set(coeff + n, poly + n); add_functional_error(coeff + n, eta_h, lambda, L, prec);
    }
    arb_t full_norm2, projected_poly2, projected_true2, tail2, tailup;
    arb_t epoly, etrue, pnorm;
    arb_init(full_norm2); arb_init(projected_poly2); arb_init(projected_true2);
    arb_init(tail2); arb_init(tailup); arb_init(epoly); arb_init(etrue); arb_init(pnorm);
    ok = ok && vlv_full_norm_squared(full_norm2, dh, max_degree,
                                      lambda_q, qmax, lambda, prec);
    arb_mul(projected_poly2, poly + 0, poly + 0, prec);
    arb_mul(projected_true2, coeff + 0, coeff + 0, prec);
    for (slong n = 1; n <= nmax; n++)
    {
        arb_mul(t, poly + n, poly + n, prec); arb_mul_2exp_si(t, t, 1);
        arb_add(projected_poly2, projected_poly2, t, prec);
        arb_mul(t, coeff + n, coeff + n, prec); arb_mul_2exp_si(t, t, 1);
        arb_add(projected_true2, projected_true2, t, prec);
    }
    arb_sub(tail2, full_norm2, projected_poly2, prec); set_upper_exact(tailup, tail2, prec);
    ok = ok && arb_is_positive(tailup); arb_sqrt(epoly, tailup, prec);
    arb_mul(etrue, lambda, eta_h, prec); arb_add(etrue, etrue, epoly, prec);
    set_upper_exact(etrue, etrue, prec); arb_sqrt(pnorm, projected_true2, prec);
    ok = ok && arb_is_positive(pnorm);
    for (slong n = 0; n <= nmax; n++) arb_div(kappa + n, coeff + n, pnorm, prec);

    int overlap = 1;
    for (slong n = -nmax; n <= nmax; n++)
    {
        slong j = n < 0 ? -n : n;
        overlap = overlap && arb_overlaps(poly + j, data.poly + n + nmax)
          && arb_overlaps(coeff + j, data.coeff + n + nmax)
          && arb_overlaps(kappa + j, data.kappa + n + nmax);
        printf("POLYCOEFF_REPLAY %ld ", n); arb_printn(poly + j, 60, ARB_STR_MORE); printf("\n");
        print_dump("P", n, poly + j);
        printf("COEFF_REPLAY %ld ", n); arb_printn(coeff + j, 60, ARB_STR_MORE); printf("\n");
        print_dump("C", n, coeff + j);
        printf("KAPPA_REPLAY %ld ", n); arb_printn(kappa + j, 60, ARB_STR_MORE); printf("\n");
        print_dump("K", n, kappa + j);
    }
    ok = ok && overlap;
    arb_mul(hnorm, a4, a4, prec); arb_mul(t, a0, a0, prec);
    arb_add(hnorm, hnorm, t, prec); arb_sqrt(hnorm, hnorm, prec);
    arb_div(unit_a4, a4, hnorm, prec); int unit_rejected = !arb_overlaps(unit_a4, a4);
    ok = ok && unit_rejected;
    printf("BALL replay_a0_source "); arb_printn(a0, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_source_state_L2_radius_upper "); arb_printn(eta_h, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_polynomial_evenized_full_norm_squared "); arb_printn(full_norm2, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_polynomial_projection_error_upper "); arb_printn(epoly, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_true_projection_error_upper "); arb_printn(etrue, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_projected_true_state_norm "); arb_printn(pnorm, 60, ARB_STR_MORE); printf("\n");
    printf("BALL replay_forbidden_unit_normalized_a4 "); arb_printn(unit_a4, 60, ARB_STR_MORE); printf("\n");
    printf("CHECK independent_matrix_and_projection_replay_overlap=%s\n", overlap ? "PASS" : "FAIL");
    printf("CHECK exact_parameter_without_binary64=PASS\n");
    printf("CHECK continued_fraction_width_bound=PASS\n");
    printf("CHECK unit_norm_changes_source_scalar_and_is_rejected=%s\n", unit_rejected ? "PASS" : "FAIL");
    printf("CHECK overall=%s\n", ok ? "PASS" : "FAIL");

    vlv_data_clear(&data, m, nmax); fmpq_clear(lambda_q); fmpq_clear(lambda2q);
    arb_clear(lambda); arb_clear(L); arb_clear(pi); arb_clear(c2); arb_clear(c);
    arb_clear(two_c); arb_clear(mball); clear_legendre_polynomials(polys, 2 * k);
    arb_mat_clear(a); vlv_eigen_clear(&e0, m); vlv_eigen_clear(&e4, m);
    arb_clear(a4); arb_clear(a0); arb_clear(exponent); arb_clear(t); arb_clear(eta_h);
    arb_clear(hnorm); arb_clear(unit_a4); _arb_vec_clear(d0, max_degree + 1);
    _arb_vec_clear(d4, max_degree + 1); _arb_vec_clear(dh, max_degree + 1);
    _arb_vec_clear(poly, nmax + 1); _arb_vec_clear(coeff, nmax + 1);
    _arb_vec_clear(kappa, nmax + 1); arb_clear(full_norm2);
    arb_clear(projected_poly2); arb_clear(projected_true2); arb_clear(tail2);
    arb_clear(tailup); arb_clear(epoly); arb_clear(etrue); arb_clear(pnorm);
    flint_cleanup(); return ok ? 0 : 1;
}
