/*
 * b145-D pilot: rigorous isolation + Turing-method count of the zeros of
 * Hardy's Z(t) in a window near height t, using FLINT 3's interval
 * implementation of Platt's method (acb_dirichlet_platt_*).
 *
 * Usage: ./pilot <t_target> <len> <threads> <prec> [check]
 *   t_target : height (decimal integer, e.g. 3000000000000)
 *   len      : number of consecutive zeros requested, starting at index n,
 *              where n is the smooth N(t) estimate at t_target
 *   threads  : flint_set_num_threads (multieval is threaded when > 1)
 *   prec     : working precision in bits
 *   check    : if present, independently re-check sign changes of Z at the
 *              endpoints of a few isolating intervals with acb_dirichlet_hardy_z
 *              (Arb Riemann-Siegel / Euler-Maclaurin; independent code path)
 *
 * What is certified (given FLINT's implementation is correct):
 *   _isolate_zeros anchors at good Gram points that are centres of
 *   2*bound consecutive good Gram blocks (bound = Trudgian-constant Turing
 *   bound, acb_dirichlet_turing_method_bound). Between consecutive anchors
 *   g(x) < g(y) the number of zeros of zeta(1/2+it) with ordinates in
 *   (g(x), g(y)] is exactly y - x (Turing), and y - x sign changes of Z are
 *   exhibited with interval arithmetic. Hence every zero of zeta with
 *   ordinate in [g(x), g(y)] is simple and on the critical line, and the
 *   returned zero indices are exact values of N.
 *
 * Output: one JSON line on stdout.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>
#include <sys/resource.h>
#include <flint/flint.h>
#include <flint/fmpz.h>
#include <flint/arb.h>
#include <flint/arf.h>
#include <flint/acb.h>
#include <flint/acb_dirichlet.h>
#include <flint/arb_calc.h>

static double now(void)
{
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return ts.tv_sec + 1e-9 * ts.tv_nsec;
}

static double cpu_now(void)
{
    struct rusage ru;
    getrusage(RUSAGE_SELF, &ru);
    return ru.ru_utime.tv_sec + 1e-6 * ru.ru_utime.tv_usec
         + ru.ru_stime.tv_sec + 1e-6 * ru.ru_stime.tv_usec;
}

static long maxrss_kb(void)
{
    struct rusage ru;
    getrusage(RUSAGE_SELF, &ru);
#ifdef __APPLE__
    return ru.ru_maxrss / 1024; /* bytes on macOS */
#else
    return ru.ru_maxrss;
#endif
}

/* smooth zero count N0(t) = theta(t)/pi + 1 with theta from Stirling (3 terms) */
static void smooth_n(fmpz_t n, const char *tstr, slong prec)
{
    arb_t t, x, pi, tmp, r;
    arb_init(t); arb_init(x); arb_init(pi); arb_init(tmp); arb_init(r);
    arb_set_str(t, tstr, prec);
    arb_const_pi(pi, prec);
    /* theta(t) ~ t/2 log(t/(2 pi)) - t/2 - pi/8 + 1/(48 t) */
    arb_mul_2exp_si(x, pi, 1);
    arb_div(x, t, x, prec);
    arb_log(x, x, prec);
    arb_mul(x, x, t, prec);
    arb_mul_2exp_si(x, x, -1);
    arb_mul_2exp_si(tmp, t, -1);
    arb_sub(x, x, tmp, prec);
    arb_mul_2exp_si(tmp, pi, -3);
    arb_sub(x, x, tmp, prec);
    arb_div(r, x, pi, prec);
    arb_add_ui(r, r, 1, prec);
    arf_get_fmpz(n, arb_midref(r), ARF_RND_FLOOR);
    arb_clear(t); arb_clear(x); arb_clear(pi); arb_clear(tmp); arb_clear(r);
}

int main(int argc, char **argv)
{
    if (argc < 5)
    {
        fprintf(stderr, "usage: %s t_target len threads prec [check]\n", argv[0]);
        return 1;
    }
    const char *tstr = argv[1];
    slong len = atol(argv[2]);
    int threads = atoi(argv[3]);
    slong prec = atol(argv[4]);
    int check = (argc > 5);

    flint_set_num_threads(threads);

    fmpz_t n;
    fmpz_init(n);
    smooth_n(n, tstr, 256);

    arf_interval_ptr iv = _arf_interval_vec_init(len);

    double w0 = now(), c0 = cpu_now();
    slong found = acb_dirichlet_platt_isolate_local_hardy_z_zeros(iv, n, len, prec);
    double w1 = now(), c1 = cpu_now();

    /* sanity: ordered, disjoint intervals */
    int ordered = 1;
    double maxw = 0.0;
    for (slong i = 0; i < found; i++)
    {
        if (arf_cmp(&iv[i].a, &iv[i].b) >= 0) ordered = 0;
        if (i > 0 && arf_cmp(&iv[i - 1].b, &iv[i].a) > 0) ordered = 0;
        double wd = arf_get_d(&iv[i].b, ARF_RND_UP) - arf_get_d(&iv[i].a, ARF_RND_DOWN);
        if (wd > maxw) maxw = wd;
    }

    char *nstr = fmpz_get_str(NULL, 10, n);
    char t_lo[64] = "null", t_hi[64] = "null";
    double span = 0.0;
    if (found > 0)
    {
        arb_t a, b, d;
        arb_init(a); arb_init(b); arb_init(d);
        arb_set_arf(a, &iv[0].a);
        arb_set_arf(b, &iv[found - 1].b);
        arb_sub(d, b, a, 2 * prec);
        span = arf_get_d(arb_midref(d), ARF_RND_NEAR);
        char *sa = arf_get_str(&iv[0].a, 20);
        char *sb = arf_get_str(&iv[found - 1].b, 20);
        snprintf(t_lo, sizeof t_lo, "\"%s\"", sa);
        snprintf(t_hi, sizeof t_hi, "\"%s\"", sb);
        flint_free(sa); flint_free(sb);
        arb_clear(a); arb_clear(b); arb_clear(d);
    }

    /* independent spot check: sign of Z at both endpoints of the first,
       middle and last isolating interval via acb_dirichlet_hardy_z */
    int checks_done = 0, checks_ok = 0;
    double wcheck = 0.0;
    if (check && found > 0)
    {
        slong idx[3] = {0, found / 2, found - 1};
        double wc0 = now();
        for (int j = 0; j < 3; j++)
        {
            int sg[2];
            for (int e = 0; e < 2; e++)
            {
                acb_t s, z;
                acb_init(s); acb_init(z);
                arb_set_arf(acb_realref(s), e == 0 ? &iv[idx[j]].a : &iv[idx[j]].b);
                acb_dirichlet_hardy_z(z, s, NULL, NULL, 1, prec + 64);
                sg[e] = arb_is_positive(acb_realref(z)) ? 1 : (arb_is_negative(acb_realref(z)) ? -1 : 0);
                acb_clear(s); acb_clear(z);
            }
            checks_done++;
            if (sg[0] != 0 && sg[1] != 0 && sg[0] != sg[1]) checks_ok++;
        }
        wcheck = now() - wc0;
    }

    printf("{\"t_target\":\"%s\",\"n_start\":\"%s\",\"len\":%ld,\"found\":%ld,"
           "\"threads\":%d,\"prec\":%ld,\"wall_s\":%.3f,\"cpu_s\":%.3f,"
           "\"t_first_lo\":%s,\"t_last_hi\":%s,\"span\":%.6f,"
           "\"ordered_disjoint\":%s,\"max_interval_width\":%.3e,"
           "\"maxrss_MB\":%.1f,\"spot_checks\":%d,\"spot_checks_ok\":%d,\"spot_check_wall_s\":%.3f,"
           "\"flint\":\"%s\"}\n",
           tstr, nstr, len, found, threads, prec, w1 - w0, c1 - c0,
           t_lo, t_hi, span, ordered ? "true" : "false", maxw,
           maxrss_kb() / 1024.0, checks_done, checks_ok, wcheck, FLINT_VERSION);

    flint_free(nstr);
    _arf_interval_vec_clear(iv, len);
    fmpz_clear(n);
    flint_cleanup_master();
    return 0;
}
