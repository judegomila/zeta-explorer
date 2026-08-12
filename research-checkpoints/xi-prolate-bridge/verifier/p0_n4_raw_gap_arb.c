/*
   Finite lambda=2, N=4 consequence of the prolate-state balls.

   Intersect four independently emitted Weil-matrix ball files and four
   source-state ball files.  Enclose q=<kappa,Q kappa>, prove the inversion-
   odd block exceeds the exact rational alpha=3/10^7 by interval LDL, and
   report the rigorous positive lower bound alpha-sup(q).

   This is only a finite odd-sector diagnostic.  It is not the complementary
   minimum, an asymptotic estimate, or an RH proof.
*/
#include <flint/flint.h>
#include <flint/arb.h>
#include <flint/arb_mat.h>
#include <flint/fmpq.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define NMAX 4
#define DIM 9
#define INPUT_COUNT 4
#define SOURCE_SHA256 "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"

static int
load_weil(arb_mat_t q, const char *path, slong prec,
          slong *input_prec, int *role)
{
    FILE *f = fopen(path, "r");
    if (f == NULL) return 0;
    char line[16384], ball[15000], lambda[128];
    int seen[DIM][DIM] = {{0}};
    int meta = 0;
    *input_prec = -1; *role = -1;
    slong n, m, p, cutoff, file_n;
    while (fgets(line, sizeof(line), f) != NULL)
    {
        if (sscanf(line, "META lambda=%127s N=%ld prec=%ld cutoff=%ld",
                   lambda, &file_n, &p, &cutoff) == 4)
        {
            meta = !strcmp(lambda, "2") && file_n == NMAX
                && (p == 256 || p == 512) && cutoff == 4;
            *input_prec = p;
            if (strstr(line, "status=BALL_OUTPUT") != NULL) *role = 0;
            if (strstr(line, "path=direct_distribution_plus_corrected_4_14") != NULL) *role = 1;
        }
        else if (sscanf(line, "ENTRY %ld %ld Q %14999[^\n]", &n, &m, ball) == 3)
        {
            if (n < -NMAX || n > NMAX || m < -NMAX || m > NMAX
                || seen[n + NMAX][m + NMAX]
                || arb_set_str(arb_mat_entry(q, n + NMAX, m + NMAX), ball, prec) != 0)
            {
                fclose(f); return 0;
            }
            seen[n + NMAX][m + NMAX] = 1;
        }
    }
    fclose(f);
    int ok = meta;
    for (slong i = 0; i < DIM; i++)
        for (slong j = 0; j < DIM; j++) ok = ok && seen[i][j];
    return ok && *role >= 0;
}

static int
load_state(arb_ptr kappa, const char *path, slong *input_prec, int *role)
{
    FILE *f = fopen(path, "r");
    if (f == NULL) return 0;
    char line[16384], dump[15000], text[256];
    int seen[DIM] = {0};
    int lambda_ok = 0, n_ok = 0, source_ok = 0, precision_ok = 0;
    *input_prec = -1; *role = 0;
    slong n, value;
    while (fgets(line, sizeof(line), f) != NULL)
    {
        if (sscanf(line, "PARAM lambda %255s", text) == 1)
            lambda_ok = !strcmp(text, "2");
        else if (sscanf(line, "PARAM N %ld", &value) == 1)
            n_ok = value == NMAX;
        else if (sscanf(line, "PARAM precision %ld", &value) == 1)
        {
            *input_prec = value;
            precision_ok = value == 256 || value == 512;
        }
        else if (sscanf(line, "META source_pdf_sha256=%255s", text) == 1)
            source_ok = !strcmp(text, SOURCE_SHA256);
        else if (!strncmp(line, "META verifier_matrix_path=", 26))
            *role = 1;
        else if (sscanf(line, "DUMPK %ld %14999[^\n]", &n, dump) == 2)
        {
            if (n < -NMAX || n > NMAX || seen[n + NMAX]
                || arb_load_str(kappa + n + NMAX, dump) != 0)
            {
                fclose(f); return 0;
            }
            seen[n + NMAX] = 1;
        }
    }
    fclose(f);
    int ok = lambda_ok && n_ok && source_ok && precision_ok;
    for (slong i = 0; i < DIM; i++) ok = ok && seen[i];
    for (slong n1 = 1; n1 <= NMAX; n1++)
        ok = ok && arb_equal(kappa + NMAX - n1, kappa + NMAX + n1);
    return ok;
}

static int
intersect_matrix(arb_mat_t out, arb_mat_struct *inputs, slong prec)
{
    for (slong i = 0; i < DIM; i++)
        for (slong j = 0; j < DIM; j++)
        {
            arb_set(arb_mat_entry(out, i, j), arb_mat_entry(inputs + 0, i, j));
            for (slong k = 1; k < INPUT_COUNT; k++)
                if (!arb_intersection(arb_mat_entry(out, i, j),
                                      arb_mat_entry(out, i, j),
                                      arb_mat_entry(inputs + k, i, j), prec))
                    return 0;
        }
    return 1;
}

static int
intersect_vector(arb_ptr out, arb_ptr *inputs, slong prec)
{
    for (slong i = 0; i < DIM; i++)
    {
        arb_set(out + i, inputs[0] + i);
        for (slong k = 1; k < INPUT_COUNT; k++)
            if (!arb_intersection(out + i, out + i, inputs[k] + i, prec))
                return 0;
    }
    return 1;
}

static int
positive_definite_ldl(arb_ptr pivots, const arb_mat_t a, slong d,
                      slong prec)
{
    arb_mat_t ell;
    arb_t t, num;
    arb_mat_init(ell, d, d); arb_mat_zero(ell);
    arb_init(t); arb_init(num);
    int ok = 1;
    for (slong k = 0; ok && k < d; k++)
    {
        arb_set(pivots + k, arb_mat_entry(a, k, k));
        for (slong j = 0; j < k; j++)
        {
            arb_mul(t, arb_mat_entry(ell, k, j),
                    arb_mat_entry(ell, k, j), prec);
            arb_mul(t, t, pivots + j, prec);
            arb_sub(pivots + k, pivots + k, t, prec);
        }
        ok = arb_is_positive(pivots + k);
        arb_one(arb_mat_entry(ell, k, k));
        for (slong i = k + 1; ok && i < d; i++)
        {
            arb_set(num, arb_mat_entry(a, i, k));
            for (slong j = 0; j < k; j++)
            {
                arb_mul(t, arb_mat_entry(ell, i, j),
                        arb_mat_entry(ell, k, j), prec);
                arb_mul(t, t, pivots + j, prec);
                arb_sub(num, num, t, prec);
            }
            arb_div(arb_mat_entry(ell, i, k), num, pivots + k, prec);
        }
    }
    arb_mat_clear(ell); arb_clear(t); arb_clear(num);
    return ok;
}

static void
print_dump(const char *name, const arb_t x)
{
    char *s = arb_dump_str(x);
    printf("DUMP %s %s\n", name, s);
    flint_free(s);
}

int
main(int argc, char **argv)
{
    const char *weil_paths[INPUT_COUNT], *state_paths[INPUT_COUNT], *output = NULL;
    slong nw = 0, ns = 0, prec = 512;
    for (int i = 1; i < argc; i++)
    {
        if (!strcmp(argv[i], "--weil") && i + 1 < argc && nw < INPUT_COUNT)
            weil_paths[nw++] = argv[++i];
        else if (!strcmp(argv[i], "--state") && i + 1 < argc && ns < INPUT_COUNT)
            state_paths[ns++] = argv[++i];
        else if (!strcmp(argv[i], "--prec") && i + 1 < argc)
            prec = strtol(argv[++i], NULL, 10);
        else if (!strcmp(argv[i], "--output") && i + 1 < argc)
            output = argv[++i];
        else return 2;
    }
    if (nw != INPUT_COUNT || ns != INPUT_COUNT || prec < 256) return 2;
    if (output != NULL && freopen(output, "w", stdout) == NULL) return 2;

    arb_mat_struct matrices[INPUT_COUNT];
    arb_ptr states[INPUT_COUNT];
    slong weil_prec[INPUT_COUNT], state_prec[INPUT_COUNT];
    int weil_role[INPUT_COUNT], state_role[INPUT_COUNT];
    int ok = 1;
    for (slong i = 0; i < INPUT_COUNT; i++)
        for (slong j = i + 1; j < INPUT_COUNT; j++)
            ok = ok && strcmp(weil_paths[i], weil_paths[j]) != 0
                    && strcmp(state_paths[i], state_paths[j]) != 0;
    for (slong k = 0; k < INPUT_COUNT; k++)
    {
        arb_mat_init(matrices + k, DIM, DIM);
        states[k] = _arb_vec_init(DIM);
        ok = ok && load_weil(matrices + k, weil_paths[k], prec,
                             weil_prec + k, weil_role + k);
        ok = ok && load_state(states[k], state_paths[k],
                              state_prec + k, state_role + k);
    }
    for (slong bits_index = 0; bits_index < 2; bits_index++)
    {
        slong bits = bits_index == 0 ? 256 : 512;
        for (int role = 0; role <= 1; role++)
        {
            slong wc = 0, sc = 0;
            for (slong k = 0; k < INPUT_COUNT; k++)
            {
                wc += weil_prec[k] == bits && weil_role[k] == role;
                sc += state_prec[k] == bits && state_role[k] == role;
            }
            ok = ok && wc == 1 && sc == 1;
        }
    }
    arb_mat_t q;
    arb_mat_init(q, DIM, DIM);
    arb_ptr kappa = _arb_vec_init(DIM);
    ok = ok && intersect_matrix(q, matrices, prec)
            && intersect_vector(kappa, states, prec);

    for (slong i = 0; ok && i < DIM; i++)
        for (slong j = 0; j < DIM; j++)
            ok = ok && arb_overlaps(arb_mat_entry(q, i, j),
                                    arb_mat_entry(q, j, i))
                    && arb_overlaps(arb_mat_entry(q, i, j),
                                    arb_mat_entry(q, DIM - 1 - i, DIM - 1 - j));

    printf("META schema=p0_n4_raw_odd_gap_ball_v1\n");
    printf("META claim_class=FINITE_ODD_FLOOR_MINUS_RAW_RAYLEIGH_DIAGNOSTIC_ONLY\n");
    printf("META terminal_state=P0_INVALIDATED\n");
    printf("META lambda=2 N=4 precision=%ld\n", prec);
    printf("META matrix_inputs=4 state_inputs=4\n");
    printf("META provenance=distinct_producer_and_verifier_at_256_and_512_bits\n");
    printf("META arithmetic_library=FLINT_ARB\n");
    printf("CHECK four_way_intersections_and_symmetries=%s\n", ok ? "PASS" : "FAIL");
    if (!ok)
    {
        for (slong k = 0; k < INPUT_COUNT; k++)
        { arb_mat_clear(matrices + k); _arb_vec_clear(states[k], DIM); }
        arb_mat_clear(q); _arb_vec_clear(kappa, DIM); flint_cleanup();
        return 1;
    }

    arb_t rayleigh, term, inner, q_upper, alpha, gap_lower, residual2, residual;
    arb_init(rayleigh); arb_init(term); arb_init(inner); arb_init(q_upper);
    arb_init(alpha); arb_init(gap_lower); arb_init(residual2); arb_init(residual);
    arb_zero(rayleigh);
    for (slong i = 0; i < DIM; i++)
    {
        arb_zero(inner);
        for (slong j = 0; j < DIM; j++)
        {
            arb_mul(term, arb_mat_entry(q, i, j), kappa + j, prec);
            arb_add(inner, inner, term, prec);
        }
        arb_mul(term, kappa + i, inner, prec);
        arb_add(rayleigh, rayleigh, term, prec);
    }
    arf_t upper;
    arf_init(upper); arb_get_ubound_arf(upper, rayleigh, prec); arb_set_arf(q_upper, upper);

    fmpq_t alpha_q;
    fmpq_init(alpha_q); fmpq_set_ui(alpha_q, 3, 10000000UL);
    arb_set_fmpq(alpha, alpha_q, prec);
    arb_sub(gap_lower, alpha, q_upper, prec);

    arb_mat_t odd_shifted;
    arb_mat_init(odd_shifted, NMAX, NMAX);
    for (slong i = 1; i <= NMAX; i++)
        for (slong j = 1; j <= NMAX; j++)
        {
            arb_sub(arb_mat_entry(odd_shifted, i - 1, j - 1),
                    arb_mat_entry(q, NMAX + i, NMAX + j),
                    arb_mat_entry(q, NMAX + i, NMAX - j), prec);
            if (i == j)
                arb_sub(arb_mat_entry(odd_shifted, i - 1, j - 1),
                        arb_mat_entry(odd_shifted, i - 1, j - 1), alpha, prec);
        }
    arb_ptr pivots = _arb_vec_init(NMAX);
    int odd_spd = positive_definite_ldl(pivots, odd_shifted, NMAX, prec);
    int gap_positive = arb_is_positive(gap_lower);
    ok = odd_spd && gap_positive;

    /* Fully enclosed raw residual; no claim that this is a complementary gap. */
    arb_zero(residual2);
    for (slong i = 0; i < DIM; i++)
    {
        arb_zero(inner);
        for (slong j = 0; j < DIM; j++)
        {
            arb_mul(term, arb_mat_entry(q, i, j), kappa + j, prec);
            arb_add(inner, inner, term, prec);
        }
        arb_mul(term, rayleigh, kappa + i, prec);
        arb_sub(inner, inner, term, prec);
        arb_mul(term, inner, inner, prec);
        arb_add(residual2, residual2, term, prec);
    }
    arb_sqrt(residual, residual2, prec);

    printf("BALL raw_rayleigh_q "); arb_printn(rayleigh, 70, ARB_STR_MORE); printf("\n");
    printf("BALL raw_rayleigh_q_upper "); arb_printn(q_upper, 70, ARB_STR_MORE); printf("\n");
    printf("BALL certified_odd_floor_lower_alpha "); arb_printn(alpha, 70, ARB_STR_MORE); printf("\n");
    printf("BALL certified_odd_floor_minus_q_lower "); arb_printn(gap_lower, 70, ARB_STR_MORE); printf("\n");
    printf("BALL raw_residual_norm "); arb_printn(residual, 70, ARB_STR_MORE); printf("\n");
    print_dump("raw_rayleigh_q", rayleigh);
    print_dump("odd_floor_minus_q_lower", gap_lower);
    print_dump("raw_residual_norm", residual);
    for (slong i = 0; i < NMAX; i++)
    {
        printf("BALL odd_shifted_LDL_pivot_%ld ", i);
        arb_printn(pivots + i, 70, ARB_STR_MORE); printf("\n");
    }
    printf("CHECK odd_block_minus_3e_minus_7_positive_definite=%s\n", odd_spd ? "PASS" : "FAIL");
    printf("CHECK odd_floor_minus_raw_q_strictly_positive=%s\n", gap_positive ? "PASS" : "FAIL");
    printf("CHECK overall=%s\n", ok ? "PASS" : "FAIL");

    for (slong k = 0; k < INPUT_COUNT; k++)
    { arb_mat_clear(matrices + k); _arb_vec_clear(states[k], DIM); }
    arb_mat_clear(q); _arb_vec_clear(kappa, DIM);
    arb_clear(rayleigh); arb_clear(term); arb_clear(inner); arb_clear(q_upper);
    arb_clear(alpha); arb_clear(gap_lower); arb_clear(residual2); arb_clear(residual);
    arf_clear(upper); fmpq_clear(alpha_q); arb_mat_clear(odd_shifted);
    _arb_vec_clear(pivots, NMAX); flint_cleanup();
    return ok ? 0 : 1;
}
