/*
 * b145-D pilot2: explicit-parameter Platt grid driver.
 *
 * Same certification logic as pilot.c (FLINT _isolate_zeros: Turing-method
 * anchors at good Gram points, interval sign changes), but the grid centre T
 * and the starting zero index are decoupled so the whole usable grid width is
 * consumed (the library "local" entry point centres the grid at the first
 * requested zero, so at most half of the grid can be used).
 *
 * Parameters (A, B, J, K, sigma_grid, h, Ns_max, H, sigma_interp) replicate
 * FLINT 3.6.0 _create_heuristic_context for n in [1e7, 2e17)
 * (A = 8, B = 4096, Ns_max = 200, quartic fits in x = log T).
 *
 * Usage: ./pilot2 <T_centre> <W> <len> <threads> <prec> [time_multieval] [ztrace] [B] [h] [K]
 *   T_centre : integer grid centre
 *   W        : first requested zero index = N0(T_centre - W)
 *   len      : max zeros
 *   time_multieval : if nonzero, time one standalone multieval call first
 *   ztrace   : if nonzero, print every isolating interval to stderr
 *
 * Output: JSON line with wall/cpu, zeros found, height span covered, first
 * and last certified zero indices, the anchors implied, RSS.
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
#include <flint/arb_calc.h>
#include <flint/acb_dirichlet.h>

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

static double maxrss_mb(void)
{
    struct rusage ru;
    getrusage(RUSAGE_SELF, &ru);
#ifdef __APPLE__
    return ru.ru_maxrss / 1048576.0;
#else
    return ru.ru_maxrss / 1024.0;
#endif
}

/* smooth N0(t) = theta(t)/pi + 1, Stirling theta */
static void smooth_n_fmpz(fmpz_t n, const fmpz_t tz, slong prec)
{
    arb_t t, x, pi, tmp, r;
    arb_init(t); arb_init(x); arb_init(pi); arb_init(tmp); arb_init(r);
    arb_set_fmpz(t, tz);
    arb_const_pi(pi, prec);
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
    if (argc < 6)
    {
        fprintf(stderr, "usage: %s T_centre W len threads prec [time_multieval] [ztrace]\n", argv[0]);
        return 1;
    }
    fmpz_t T, t0, n, J;
    fmpz_init(T); fmpz_init(t0); fmpz_init(n); fmpz_init(J);
    fmpz_set_str(T, argv[1], 10);
    slong W = atol(argv[2]);
    slong len = atol(argv[3]);
    int threads = atoi(argv[4]);
    slong prec = atol(argv[5]);
    int time_me = (argc > 6) ? atoi(argv[6]) : 0;
    int ztrace = (argc > 7) ? atoi(argv[7]) : 0;
    slong Bover = (argc > 8) ? atol(argv[8]) : 0;   /* optional grid width override (power of 2) */
    double hover = (argc > 9) ? atof(argv[9]) : 0;  /* optional Gaussian h override */
    slong Kover = (argc > 10) ? atol(argv[10]) : 0; /* optional Taylor order override */
    flint_set_num_threads(threads);

    /* parameters: FLINT 3.6.0 heuristic for n in [1e7, 2e17) */
    double x = log(fmpz_get_d(T)), x2 = x*x, x3 = x2*x, x4 = x2*x2;
    slong A = 8, B = 4096, Ns_max = 200;
    double dlogJ = -0.4035 + 0.49086*x + 0.00016299*x2 + -3.6139e-06*x3 + 2.9323e-08*x4;
    double dK = 79.032 + -1.781*x + 0.039243*x2 + -0.00094859*x3 + 7.3149e-06*x4;
    double dgrid = 1186.9 + 130.17*x + -7.4059*x2 + 0.17895*x3 + -0.001602*x4;
    double dinterp = -24.252 + 7.3231*x + -0.38971*x2 + 0.0088745*x3 + -7.4331e-05*x4;
    double dh = 178.66 + -15.127*x + 0.93132*x2 + -0.02311*x3 + 0.00022146*x4;
    double dH = 2.5499 + -0.24402*x + 0.014953*x2 + -0.00037347*x3 + 3.5596e-06*x4;
    if (Bover > 0) B = Bover;
    if (hover > 0) dh = hover;
    if (Kover > 0) dK = (double) Kover;
    arb_t h, H;
    arb_init(h); arb_init(H);
    arb_set_d(h, dh);
    arb_set_d(H, dH);
    fmpz_set_si(J, (slong) exp(dlogJ));
    slong K = (slong) dK;
    slong sigma_grid = ((slong) (dgrid / 2)) * 2 + 1;
    slong sigma_interp = ((slong) (dinterp / 2)) * 2 + 1;

    fmpz_sub_si(t0, T, W);
    smooth_n_fmpz(n, t0, 256);

    double t_me = -1.0, c_me = -1.0;
    if (time_me)
    {
        arb_ptr p = _arb_vec_init(A * B);
        double a0 = now(), b0 = cpu_now();
        acb_dirichlet_platt_multieval(p, T, A, B, h, J, K, sigma_grid, prec);
        t_me = now() - a0; c_me = cpu_now() - b0;
        _arb_vec_clear(p, A * B);
    }

    arf_interval_ptr iv = _arf_interval_vec_init(len);
    double w0 = now(), c0 = cpu_now();
    slong found = _acb_dirichlet_platt_isolate_local_hardy_z_zeros(
        iv, n, len, T, A, B, h, J, K, sigma_grid, Ns_max, H, sigma_interp, prec);
    double w1 = now(), c1 = cpu_now();

    int ordered = 1;
    for (slong i = 0; i < found; i++)
    {
        if (arf_cmp(&iv[i].a, &iv[i].b) >= 0) ordered = 0;
        if (i > 0 && arf_cmp(&iv[i - 1].b, &iv[i].a) > 0) ordered = 0;
        if (ztrace)
        {
            char *sa = arf_get_str(&iv[i].a, 22), *sb = arf_get_str(&iv[i].b, 22);
            fprintf(stderr, "%ld %s %s\n", i, sa, sb);
            flint_free(sa); flint_free(sb);
        }
    }
    double lo = found ? arf_get_d(&iv[0].a, ARF_RND_DOWN) - fmpz_get_d(T) : 0.0;
    double hi = found ? arf_get_d(&iv[found - 1].b, ARF_RND_UP) - fmpz_get_d(T) : 0.0;
    char *Ts = fmpz_get_str(NULL, 10, T), *ns = fmpz_get_str(NULL, 10, n), *Js = fmpz_get_str(NULL, 10, J);

    printf("{\"T\":\"%s\",\"W\":%ld,\"n_start\":\"%s\",\"len\":%ld,\"found\":%ld,\"threads\":%d,\"prec\":%ld,"
           "\"A\":%ld,\"B\":%ld,\"J\":\"%s\",\"K\":%ld,\"sigma_grid\":%ld,\"sigma_interp\":%ld,\"h\":%.4f,\"H\":%.5f,"
           "\"multieval_wall_s\":%.3f,\"multieval_cpu_s\":%.3f,\"total_wall_s\":%.3f,\"total_cpu_s\":%.3f,"
           "\"first_lo_minus_T\":%.4f,\"last_hi_minus_T\":%.4f,\"span\":%.4f,\"ordered_disjoint\":%s,"
           "\"maxrss_MB\":%.1f,\"flint\":\"%s\"}\n",
           Ts, W, ns, len, found, threads, prec, A, B, Js, K, sigma_grid, sigma_interp, dh, dH,
           t_me, c_me, w1 - w0, c1 - c0, lo, hi, hi - lo, ordered ? "true" : "false",
           maxrss_mb(), FLINT_VERSION);
    flint_free(Ts); flint_free(ns); flint_free(Js);
    _arf_interval_vec_clear(iv, len);
    arb_clear(h); arb_clear(H);
    fmpz_clear(T); fmpz_clear(t0); fmpz_clear(n); fmpz_clear(J);
    flint_cleanup_master();
    return 0;
}
