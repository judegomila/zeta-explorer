import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import FreshnessBanner from '../components/FreshnessBanner.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED, alpha as TK_ALPHA } from '../styles/tokens.js';

// Editorial (warm) re-theme: full-width shell, identical structure/data/timeline.
// The 40+ per-person / per-era / per-result accent hexes below are KEPT literal
// on purpose — they encode distinct visual identity across many entries and
// collapsing them onto the 6-color warm palette would destroy that. Only the
// generic dark-chrome colors (headings, meta text, nested-box backgrounds) are
// remapped, per the standard set used across other editorial ports:
//   #94a3b8 / #cbd5e1 muted body text        -> var(--ink-soft)
//   #e2e8f0 strong text on dark box          -> var(--ink)
//   #64748b / #334155 / #475569 slate meta   -> var(--faint) / var(--hairline)
//   #3b82f6 blue (structural headers/links)  -> var(--blue)
//   #8b5cf6 / #a78bfa purple (structural box) -> var(--terra)
//   rgba(15,23,42,*) / rgba(30,41,59,*) dark nested-box bg -> var(--paper) / var(--paper2)
//   #0f172a / #1e293b dark dot fill / border -> var(--paper) / var(--hairline)

// ─── Era definitions for people grouping ───
const PEOPLE_ERAS = [
  { id: 'foundational', label: 'Foundational (1700s-1850s)', color: ED.brass },
  { id: 'classical',    label: 'Classical Era (1860s-1930s)', color: ED.series1 },
  { id: 'mid20th',      label: 'Mid-20th Century (1930s-1970s)', color: ED.series3 },
  { id: 'modern',       label: 'Modern Era (1970s-Present)', color: ED.series5 },
];

const PEOPLE = [
  // ═══════════════════════════════════════════════
  // FOUNDATIONAL (1700s - 1850s)
  // ═══════════════════════════════════════════════
  {
    name: 'Leonhard Euler',
    years: '1707-1783',
    era: 'foundational',
    initials: 'LE',
    color: ED.brass,
    wiki: 'https://en.wikipedia.org/wiki/Leonhard_Euler',
    bio: 'Discovered the Euler product formula connecting the zeta function to primes (1737) and solved the Basel Problem, computing the first nontrivial zeta value. Founded analytic number theory.',
  },
  {
    name: 'Carl Friedrich Gauss',
    years: '1777-1855',
    era: 'foundational',
    initials: 'CG',
    color: ED.brass,
    wiki: 'https://en.wikipedia.org/wiki/Carl_Friedrich_Gauss',
    bio: 'Conjectured as a teenager that the number of primes up to x is approximately x/ln(x), the Prime Counting Conjecture. His insight launched the quantitative study of prime distribution.',
  },
  {
    name: 'Peter Gustav Lejeune Dirichlet',
    years: '1805-1859',
    era: 'foundational',
    initials: 'PD',
    color: ED.brass,
    wiki: 'https://en.wikipedia.org/wiki/Peter_Gustav_Lejeune_Dirichlet',
    bio: 'Introduced Dirichlet series and L-functions, proving that every arithmetic progression with coprime modulus and residue contains infinitely many primes. His L-functions generalize the zeta function.',
  },
  {
    name: 'Pafnuty Chebyshev',
    years: '1821-1894',
    era: 'foundational',
    initials: 'PC',
    color: ED.brass,
    wiki: 'https://en.wikipedia.org/wiki/Pafnuty_Chebyshev',
    bio: 'Established the first rigorous bounds on the prime counting function, proving that pi(x) is asymptotically of order x/ln(x). His estimates were the strongest results before the proof of PNT.',
  },
  {
    name: 'Bernhard Riemann',
    years: '1826-1866',
    era: 'foundational',
    initials: 'BR',
    color: ED.series1,
    wiki: 'https://en.wikipedia.org/wiki/Bernhard_Riemann',
    bio: 'In a single 8-page paper (1859), extended the zeta function to all complex numbers, derived the functional equation, and stated the Hypothesis that all nontrivial zeros have real part 1/2.',
  },

  // ═══════════════════════════════════════════════
  // CLASSICAL ERA (1860s - 1930s)
  // ═══════════════════════════════════════════════
  {
    name: 'David Hilbert',
    years: '1862-1943',
    era: 'classical',
    initials: 'DH',
    color: ED.series1,
    wiki: 'https://en.wikipedia.org/wiki/David_Hilbert',
    bio: 'Listed the Riemann Hypothesis as the 8th problem on his famous list of 23 unsolved problems (1900). Co-originator of the Hilbert-Polya conjecture that zeta zeros are eigenvalues of a self-adjoint operator.',
  },
  {
    name: 'Jacques Hadamard',
    years: '1865-1963',
    era: 'classical',
    initials: 'JH',
    color: ED.series3,
    wiki: 'https://en.wikipedia.org/wiki/Jacques_Hadamard',
    bio: 'Proved the Prime Number Theorem independently in 1896 by showing zeta(s) has no zeros on Re(s)=1. Also proved the product formula for the xi function over its zeros.',
  },
  {
    name: 'Charles de la Vallee-Poussin',
    years: '1866-1962',
    era: 'classical',
    initials: 'CV',
    color: ED.series3,
    wiki: 'https://en.wikipedia.org/wiki/Charles_Jean_de_la_Vall%C3%A9e_Poussin',
    bio: 'Proved the Prime Number Theorem independently of Hadamard in 1896. Established the first zero-free region for zeta, showing no zeros exist near the line Re(s)=1.',
  },
  {
    name: 'G.H. Hardy',
    years: '1877-1947',
    era: 'classical',
    initials: 'GH',
    color: ED.series5,
    wiki: 'https://en.wikipedia.org/wiki/G._H._Hardy',
    bio: 'Proved in 1914 that infinitely many zeros of the zeta function lie on the critical line Re(s)=1/2, providing the first concrete evidence for RH. Pioneer of analytic number theory in England.',
  },
  {
    name: 'Edmund Landau',
    years: '1877-1938',
    era: 'classical',
    initials: 'EL',
    color: ED.series5,
    wiki: 'https://en.wikipedia.org/wiki/Edmund_Landau',
    bio: 'Posed his four problems, described as out of reach, at the 1912 ICM. Made fundamental contributions to the distribution of primes and the theory of the zeta function, establishing many classical estimates.',
  },
  {
    name: 'J.E. Littlewood',
    years: '1885-1977',
    era: 'classical',
    initials: 'JL',
    color: ED.series5,
    wiki: 'https://en.wikipedia.org/wiki/John_Edensor_Littlewood',
    bio: 'Collaborator of Hardy who proved that pi(x) - Li(x) changes sign infinitely often, and established key zero density estimates for the zeta function that constrain the distribution of zeros off the critical line.',
  },
  {
    name: 'Harald Bohr',
    years: '1887-1951',
    era: 'classical',
    initials: 'HB',
    color: ED.series5,
    wiki: 'https://en.wikipedia.org/wiki/Harald_Bohr',
    bio: 'Developed the theory of almost periodic functions and applied it to the Riemann zeta function. Co-proved with Landau that zeros cluster near the critical line, establishing the Bohr-Landau theorem.',
  },
  {
    name: 'George Polya',
    years: '1887-1985',
    era: 'classical',
    initials: 'GP',
    color: ED.series5,
    wiki: 'https://en.wikipedia.org/wiki/George_P%C3%B3lya',
    bio: 'Co-originator of the Hilbert-Polya conjecture: that zeta zeros are eigenvalues of a self-adjoint operator. This spectral philosophy has guided the field for a century and underlies the Berry-Keating approach.',
  },
  {
    name: 'Andre Weil',
    years: '1906-1998',
    era: 'classical',
    initials: 'AW',
    color: '#3730a3',
    wiki: 'https://en.wikipedia.org/wiki/Andr%C3%A9_Weil',
    bio: 'Proved the Riemann Hypothesis for function fields over finite fields (Weil conjectures). Developed the Weil explicit formula connecting primes to zeros, a key bridge between number theory and geometry.',
  },

  // ═══════════════════════════════════════════════
  // MID-20TH CENTURY (1930s - 1970s)
  // ═══════════════════════════════════════════════
  {
    name: 'Carl Ludwig Siegel',
    years: '1896-1981',
    era: 'mid20th',
    initials: 'CS',
    color: ED.series6,
    wiki: 'https://en.wikipedia.org/wiki/Carl_Ludwig_Siegel',
    bio: 'Discovered the Riemann-Siegel formula in Riemann\'s unpublished notes, providing an efficient asymptotic expansion for computing zeta on the critical line. This formula underpins all large-scale numerical verification.',
  },
  {
    name: 'Alan Turing',
    years: '1912-1954',
    era: 'mid20th',
    initials: 'AT',
    color: ED.series7,
    wiki: 'https://en.wikipedia.org/wiki/Alan_Turing',
    bio: 'Designed a gear-based analog computer for computing zeta zeros (1939), developed a new method for calculating the zeta function (1943), and used the Manchester Mark I to verify 1,104 zeros (1950).',
  },
  {
    name: 'Paul Turan',
    years: '1910-1976',
    era: 'mid20th',
    initials: 'PT',
    color: ED.series6,
    wiki: 'https://en.wikipedia.org/wiki/Paul_Tur%C3%A1n',
    bio: 'Developed power sum methods in analytic number theory and proved that the Riemann Hypothesis is equivalent to certain bounds on power sums over zeta zeros. Pioneered probabilistic number theory.',
  },
  {
    name: 'Norman Levinson',
    years: '1912-1975',
    era: 'mid20th',
    initials: 'NL',
    color: ED.series6,
    wiki: 'https://en.wikipedia.org/wiki/Norman_Levinson',
    bio: 'Proved in 1974 that at least one-third of the nontrivial zeros of zeta lie on the critical line. His method, using mollifiers, remains the foundation for all subsequent improvements on this proportion.',
  },
  {
    name: 'Roger Apery',
    years: '1916-1994',
    era: 'mid20th',
    initials: 'RA',
    color: ED.series6,
    wiki: 'https://en.wikipedia.org/wiki/Roger_Ap%C3%A9ry',
    bio: 'Stunned the mathematical world in 1979 by proving that zeta(3) is irrational, using a miraculous recurrence relation. The proof was so unexpected that it was initially met with disbelief.',
  },
  {
    name: 'Atle Selberg',
    years: '1917-2007',
    era: 'mid20th',
    initials: 'AS',
    color: ED.series6,
    wiki: 'https://en.wikipedia.org/wiki/Atle_Selberg',
    bio: 'Proved that a positive proportion of zeta zeros lie on the critical line (1942). Developed the Selberg trace formula connecting spectral theory to geometry, and gave an elementary proof of PNT. Fields Medal 1950.',
  },
  {
    name: 'Nicolaas de Bruijn',
    years: '1918-2012',
    era: 'mid20th',
    initials: 'NB',
    color: '#0369a1',
    wiki: 'https://en.wikipedia.org/wiki/Nicolaas_Govert_de_Bruijn',
    bio: 'Introduced the heat-evolved xi function and proved that forward heat flow preserves the reality of zeros (1950). Showed that RH implies the de Bruijn-Newman constant Lambda is at most 0.',
  },
  {
    name: 'Roger Penrose',
    years: '1931-',
    era: 'mid20th',
    initials: 'RP',
    color: ED.series1,
    wiki: 'https://en.wikipedia.org/wiki/Roger_Penrose',
    bio: 'Developed twistor theory (1967), providing a geometric framework connecting complex analysis and physics. Twistor variables offer a novel perspective on the analytic structure of the zeta function.',
  },

  // ═══════════════════════════════════════════════
  // MODERN ERA (1970s - Present)
  // ═══════════════════════════════════════════════
  {
    name: 'Michael Berry',
    years: '1941-',
    era: 'modern',
    initials: 'MB',
    color: ED.series3,
    wiki: 'https://en.wikipedia.org/wiki/Michael_Berry_(physicist)',
    bio: 'Co-proposed the Berry-Keating conjecture (1999) that zeta zeros are eigenvalues of the quantized Hamiltonian H=xp, providing the most concrete realization of the Hilbert-Polya spectral approach.',
  },
  {
    name: 'Hugh Montgomery',
    years: '1944-',
    era: 'modern',
    initials: 'HM',
    color: ED.brass,
    wiki: 'https://en.wikipedia.org/wiki/Hugh_Montgomery_(mathematician)',
    bio: 'Discovered the pair correlation conjecture (1973), revealing that the spacing of zeta zeros matches the GUE distribution from random matrix theory. Freeman Dyson recognized the formula at a tea break.',
  },
  {
    name: 'Charles Newman',
    years: '1946-2020',
    era: 'modern',
    initials: 'CN',
    color: ED.series2,
    wiki: 'https://en.wikipedia.org/wiki/Charles_M._Newman',
    bio: 'Conjectured in 1976 that the de Bruijn-Newman constant Lambda >= 0, meaning RH sits at the exact threshold of the heat flow. This conjecture was proved 44 years later by Rodgers and Tao.',
  },
  {
    name: 'Alain Connes',
    years: '1947-',
    era: 'modern',
    initials: 'AC',
    color: ED.series5,
    wiki: 'https://en.wikipedia.org/wiki/Alain_Connes',
    bio: 'Fields Medalist who developed a noncommutative geometry approach to RH. Co-constructed the Bost-Connes system (1995), a C*-dynamical system whose partition function is zeta. Developed trace formula and Weil quadratic form approaches (2024-2026).',
  },
  {
    name: 'Gregory Chaitin',
    years: '1947-',
    era: 'modern',
    initials: 'GC',
    color: ED.series2,
    wiki: 'https://en.wikipedia.org/wiki/Gregory_Chaitin',
    bio: 'Defined Chaitin\'s Omega, a halting probability that is algorithmically random. His work on algorithmic information theory reveals deep connections between randomness, incompleteness, and the complexity of mathematical truths like RH.',
  },
  {
    name: 'Andrew Odlyzko',
    years: '1949-',
    era: 'modern',
    initials: 'AO',
    color: ED.series1,
    wiki: 'https://en.wikipedia.org/wiki/Andrew_Odlyzko',
    bio: 'Performed massive computational verification of zeta zeros near the 10^20-th zero (1987), confirming GUE statistics to extraordinary precision. His computations remain the most compelling numerical evidence for RH.',
  },
  {
    name: 'Peter Sarnak',
    years: '1953-',
    era: 'modern',
    initials: 'PS',
    color: ED.series5,
    wiki: 'https://en.wikipedia.org/wiki/Peter_Sarnak',
    bio: 'Advocated for the Grand Riemann Hypothesis encompassing all automorphic L-functions. Established deep connections between spectral theory, arithmetic quantum chaos, and the distribution of zeta zeros.',
  },
  {
    name: 'Brian Conrey',
    years: '1955-',
    era: 'modern',
    initials: 'BC',
    color: ED.series5,
    wiki: 'https://en.wikipedia.org/wiki/Brian_Conrey',
    bio: 'Improved Levinson\'s result to show that at least 40% of zeta zeros lie on the critical line (1989), using refined mollifier techniques. Directs the American Institute of Mathematics.',
  },
  {
    name: 'Xian-Jin Li',
    years: '1958-',
    era: 'modern',
    initials: 'XL',
    color: ED.series4,
    wiki: 'https://en.wikipedia.org/wiki/Li%27s_criterion',
    bio: 'Proved Li\'s criterion (1997): RH is equivalent to the positivity of a sequence of real numbers lambda_n defined from the zeros. This elegant reformulation connects RH to passivity in signal processing.',
  },
  {
    name: 'Jon Keating',
    years: '1965-',
    era: 'modern',
    initials: 'JK',
    color: ED.series3,
    wiki: 'https://en.wikipedia.org/wiki/Jon_Keating',
    bio: 'Co-proposed the Berry-Keating conjecture (H=xp Hamiltonian) and, with Snaith, used random matrix theory to predict exact moment formulae for zeta on the critical line (2000).',
  },
  {
    name: 'German Sierra',
    years: '',
    era: 'modern',
    initials: 'GS',
    color: ED.series2,
    wiki: 'https://en.wikipedia.org/wiki/Germ%C3%A1n_Sierra',
    bio: 'Proposed a physical realization of the Berry-Keating Hamiltonian using Landau levels in a magnetic field, connecting the Riemann zeros to the quantum Hall effect and condensed matter physics.',
  },
  {
    name: 'Terence Tao',
    years: '1975-',
    era: 'modern',
    initials: 'TT',
    color: ED.series6,
    wiki: 'https://en.wikipedia.org/wiki/Terence_Tao',
    bio: 'Fields Medalist who co-proved with Brad Rodgers that the de Bruijn-Newman constant Lambda >= 0 (2020), establishing that RH, if true, is true by the slimmest possible margin.',
  },
  {
    name: 'Brad Rodgers',
    years: '',
    era: 'modern',
    initials: 'BRo',
    color: ED.series1,
    wiki: 'https://en.wikipedia.org/wiki/Brad_Rodgers_(mathematician)',
    bio: 'Co-proved with Terence Tao that the de Bruijn-Newman constant Lambda >= 0, confirming Newman\'s 1976 conjecture. The proof used a barrier argument analyzing the heat flow evolution of zeros.',
  },
  {
    name: 'James Maynard',
    years: '1987-',
    era: 'modern',
    initials: 'JM',
    color: ED.series3,
    wiki: 'https://en.wikipedia.org/wiki/James_Maynard_(mathematician)',
    bio: 'Achieved the first improvement to zero density estimates in over 80 years with Guth (2024), breaking the Ingham bound. Also proved landmark results on primes in short intervals. Fields Medal 2022.',
  },
  {
    name: 'Larry Guth',
    years: '',
    era: 'modern',
    initials: 'LG',
    color: '#65a30d',
    wiki: 'https://en.wikipedia.org/wiki/Larry_Guth',
    bio: 'Co-achieved with Maynard the 2024 zero density breakthrough, the most significant recent progress toward RH. Applied techniques from decoupling and harmonic analysis to improve the Ingham bound.',
  },
  {
    name: 'David Platt',
    years: '',
    era: 'modern',
    initials: 'DP',
    color: ED.series1,
    wiki: 'https://en.wikipedia.org/wiki/David_Platt_(mathematician)',
    bio: 'With Trudgian, performed the most rigorous certified numerical verification of RH, confirming all zeros up to height 3 x 10^12 lie on the critical line using interval arithmetic (2021).',
  },
];

// Portrait key per person name. A face at /portraits/<key>.jpg is shown when the key is
// listed in PORTRAIT_KEYS below (a freely-licensed Wikimedia PD/CC portrait was sourced);
// otherwise the person's colored-initials avatar is used. Attributions: /portraits/CREDITS.json.
const NAME_TO_KEY = {
  'Leonhard Euler': 'euler',
  'Carl Friedrich Gauss': 'gauss',
  'Peter Gustav Lejeune Dirichlet': 'dirichlet',
  'Pafnuty Chebyshev': 'chebyshev',
  'Bernhard Riemann': 'riemann',
  'David Hilbert': 'hilbert',
  'Jacques Hadamard': 'hadamard',
  'Charles de la Vallee-Poussin': 'vallee-poussin',
  'G.H. Hardy': 'hardy',
  'Edmund Landau': 'landau',
  'J.E. Littlewood': 'littlewood',
  'Harald Bohr': 'bohr',
  'George Polya': 'polya',
  'Andre Weil': 'weil',
  'Carl Ludwig Siegel': 'siegel',
  'Alan Turing': 'turing',
  'Paul Turan': 'turan',
  'Norman Levinson': 'levinson',
  'Roger Apery': 'apery',
  'Atle Selberg': 'selberg',
  'Nicolaas de Bruijn': 'debruijn',
  'Roger Penrose': 'penrose',
  'Michael Berry': 'berry',
  'Hugh Montgomery': 'montgomery',
  'Charles Newman': 'newman',
  'Alain Connes': 'connes',
  'Gregory Chaitin': 'chaitin',
  'Andrew Odlyzko': 'odlyzko',
  'Peter Sarnak': 'sarnak',
  'Brian Conrey': 'conrey',
  'Xian-Jin Li': 'li',
  'Jon Keating': 'keating',
  'German Sierra': 'sierra',
  'Terence Tao': 'tao',
  'Brad Rodgers': 'rodgers',
  'James Maynard': 'maynard',
  'Larry Guth': 'guth',
  'David Platt': 'platt',
};

// Keys with a sourced, freely-licensed portrait file in public/portraits/.
// Expanded as portraits are verified + downloaded (Wikimedia PD/CC only).
const PORTRAIT_KEYS = new Set([
  // Public domain
  'euler', 'gauss', 'dirichlet', 'chebyshev', 'riemann', 'hilbert', 'hadamard',
  'vallee-poussin', 'hardy', 'landau', 'littlewood', 'polya', 'turing', 'sarnak',
  // CC-BY / CC-BY-SA (attributions in /portraits/CREDITS.json + on-page credit)
  'weil', 'siegel', 'turan', 'selberg', 'penrose', 'berry', 'montgomery', 'connes',
  'chaitin', 'conrey', 'maynard', 'guth', 'debruijn', 'tao', 'odlyzko',
  // (skipped — no freely-licensed portrait, initials fallback:
  //  bohr, apery, levinson, newman, li, keating, sierra, rodgers, platt)
]);

const ERAS = [
  { id: 'origins', label: 'Origins', color: ED.brass },
  { id: 'classical', label: 'Classical', color: ED.series1 },
  { id: 'pnt', label: 'PNT Era', color: ED.series3 },
  { id: 'modern', label: 'Modern', color: ED.series5 },
  { id: 'computational', label: 'Computational', color: ED.series6 },
  { id: 'recent', label: 'Recent', color: ED.series7 },
];

const TIMELINE = [
  {
    year: 1650,
    era: 'origins',
    title: 'Pietro Mengoli poses the Basel Problem',
    content: 'Asks for the exact value of the sum 1 + 1/4 + 1/9 + 1/16 + ... (sum of reciprocal squares). This problem would remain open for nearly a century.',
    math: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\;?',
  },
  {
    year: 1737,
    era: 'origins',
    title: "Euler's Product Formula",
    content: "Leonhard Euler discovers the fundamental connection between the sum over integers and the product over primes. This is the birth of analytic number theory and the conceptual foundation of our entire oscillator chain model.",
    math: '\\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}, \\quad s > 1',
    highlight: true,
  },
  {
    year: 1735,
    era: 'origins',
    title: 'Euler solves the Basel Problem',
    content: 'Euler proves the sum of reciprocal squares equals pi squared over six. This is the first non-trivial value of what will become the zeta function.',
    math: '\\zeta(2) = \\frac{\\pi^2}{6}',
  },
  {
    year: 1748,
    era: 'origins',
    title: 'Euler computes zeta at even integers',
    content: 'Euler extends his result to all positive even integers, expressing them as rational multiples of powers of pi using Bernoulli numbers.',
    math: '\\zeta(2k) = (-1)^{k+1} \\frac{(2\\pi)^{2k} B_{2k}}{2(2k)!}',
  },
  {
    year: 1859,
    era: 'classical',
    title: "Riemann's Epoch-Making Memoir",
    content: "Bernhard Riemann publishes his only paper on number theory: 'Ueber die Anzahl der Primzahlen unter einer gegebenen Grosse.' In 8 pages, he extends the zeta function to all complex numbers via analytic continuation, derives the functional equation, introduces the xi function, proves the product formula over zeros, and states the hypothesis that all nontrivial zeros have real part 1/2. This single paper launches an entire field.",
    math: '\\xi(s) = \\xi(1-s), \\qquad \\text{all nontrivial zeros at } \\operatorname{Re}(s) = \\tfrac{1}{2} \\;?',
    highlight: true,
  },
  {
    year: 1885,
    era: 'classical',
    title: 'Stieltjes claims a proof (never published)',
    content: "Thomas Stieltjes writes to Hermite claiming he has proven RH via bounds on the Mertens function M(x). The proof never materializes, but his bound M(x) = O(x^{1/2}) is later shown to be equivalent to RH.",
    math: 'M(x) = \\sum_{n \\leq x} \\mu(n) = O(x^{1/2+\\varepsilon}) \\;\\Longleftrightarrow\\; \\text{RH}',
  },
  {
    year: 1895,
    era: 'pnt',
    title: "Von Mangoldt's Explicit Formula",
    content: "Hans von Mangoldt rigorously proves the explicit formula connecting the prime counting function to the zeros of zeta. Each zero contributes an oscillatory correction to the prime distribution.",
    math: '\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log(2\\pi) - \\frac{1}{2}\\log(1 - x^{-2})',
  },
  {
    year: 1896,
    era: 'pnt',
    title: 'Prime Number Theorem Proved',
    content: "Independently, Jacques Hadamard and Charles-Jean de la Vallee Poussin prove the Prime Number Theorem: pi(x) ~ x/ln(x). The key step is showing zeta(s) has no zeros on the line Re(s) = 1. This establishes the first zero-free region.",
    math: '\\pi(x) \\sim \\frac{x}{\\ln x}, \\qquad \\zeta(1 + it) \\neq 0',
    highlight: true,
  },
  {
    year: 1896,
    era: 'pnt',
    title: "Hadamard's Product Formula",
    content: "Hadamard proves the product representation of xi over its zeros, showing zeta can be factored over zeros just as polynomials factor over roots.",
    math: '\\xi(s) = \\xi(0) \\prod_{\\rho} \\left(1 - \\frac{s}{\\rho}\\right)',
  },
  {
    year: 1900,
    era: 'pnt',
    title: "Hilbert's Eighth Problem",
    content: "David Hilbert includes the Riemann Hypothesis as part of his eighth problem at the International Congress of Mathematicians in Paris, calling it one of the great unsolved problems of mathematics.",
  },
  {
    year: 1914,
    era: 'modern',
    title: 'Hardy: Infinitely Many Zeros on the Critical Line',
    content: "G.H. Hardy proves that infinitely many zeros of zeta lie on Re(s) = 1/2. This is the first result confirming that the critical line is indeed special, though it doesn't prove ALL zeros are there.",
    math: '\\#\\{\\rho : \\operatorname{Re}(\\rho) = \\tfrac{1}{2},\\; 0 < \\operatorname{Im}(\\rho) < T\\} \\to \\infty',
  },
  {
    year: 1921,
    era: 'modern',
    title: 'Hardy-Littlewood Approximate Functional Equation',
    content: "Hardy and Littlewood derive an approximate functional equation that allows efficient computation of zeta on the critical line, laying groundwork for both numerical verification and theoretical estimates.",
  },
  {
    year: 1932,
    era: 'modern',
    title: "Nyquist's Stability Criterion",
    content: "Harry Nyquist publishes his stability criterion for feedback systems. Decades later, this provides a control-theoretic interpretation of RH: the oscillator chain feedback loop must be stable.",
  },
  {
    year: 1939,
    era: 'modern',
    title: "Turing Designs a Zeta Function Machine",
    content: "Alan Turing designs a gear-based analog computer for computing zeros of the Riemann zeta function. The machine would use approximately 80 gear wheels to evaluate the zeta function on the critical line. Though the machine was never completed due to the outbreak of World War II, it represents the first attempt at mechanical verification of RH.",
  },
  {
    year: 1943,
    era: 'modern',
    title: "Turing's Zeta Calculation Method",
    content: "Turing's paper 'A Method for the Calculation of the Zeta-Function' is published, describing a practical technique for numerically evaluating the Riemann zeta function on the critical line. The method improves on previous approaches and lays the theoretical groundwork for his later computational verifications.",
  },
  {
    year: 1942,
    era: 'modern',
    title: "Selberg's Breakthrough",
    content: "Atle Selberg proves that a positive proportion of zeros lie on the critical line. This is later quantified and improved by many authors.",
    math: '\\#\\{\\rho : \\operatorname{Re}(\\rho) = \\tfrac{1}{2},\\; |\\operatorname{Im}(\\rho)| < T\\} > c \\cdot T \\log T',
  },
  {
    year: 1950,
    era: 'modern',
    title: 'De Bruijn and the Heat Flow',
    content: "N.G. de Bruijn introduces the heat-evolved xi function and proves that forward heat flow preserves the reality of zeros. This leads to the de Bruijn-Newman constant Lambda.",
    math: '\\frac{\\partial H_{\\tau}}{\\partial \\tau} = \\frac{\\partial^2 H_{\\tau}}{\\partial t^2}, \\quad H_0 = \\Xi',
  },
  {
    year: 1950,
    era: 'computational',
    title: "Turing Verifies Zeros with the Manchester Mark I",
    content: "Using the Manchester Mark I electronic computer, Turing verifies the first 1,104 zeros of the Riemann zeta function, extending Titchmarsh's earlier verification of 1,041 zeros. This is the first use of an electronic computer for systematic verification of the Riemann Hypothesis.",
    highlight: true,
  },
  {
    year: 1953,
    era: 'computational',
    title: "Turing's Posthumous Zeta Paper",
    content: "'Some Calculations of the Riemann Zeta-function' is published posthumously, detailing Turing's computational methods and results from his Manchester Mark I calculations. The paper describes his practical algorithms and the verification of zeros beyond Titchmarsh's results.",
  },
  {
    year: 1956,
    era: 'modern',
    title: 'Selberg Trace Formula',
    content: "Selberg proves his trace formula for hyperbolic surfaces, providing a spectral interpretation analogous to the explicit formula. Primes correspond to closed geodesics, zeros to eigenvalues.",
    math: '\\sum_n h(r_n) = \\frac{\\text{Area}}{4\\pi} \\int h(r)\\,r\\tanh(\\pi r)\\,dr + \\sum_{\\{\\gamma\\}} \\frac{\\log N\\gamma}{N\\gamma^{1/2} - N\\gamma^{-1/2}} g(\\log N\\gamma)',
  },
  {
    year: 1958,
    era: 'modern',
    title: 'Vinogradov-Korobov Zero-Free Region',
    content: "Vinogradov and Korobov independently establish the best known zero-free region, which remains essentially unimproved for over 60 years.",
    math: '\\sigma > 1 - \\frac{c}{(\\log|t|)^{2/3}(\\log\\log|t|)^{1/3}}',
    highlight: true,
  },
  {
    year: 1973,
    era: 'modern',
    title: "Montgomery's Pair Correlation Conjecture",
    content: "Hugh Montgomery discovers that the pair correlation of zeta zeros matches the GUE (Gaussian Unitary Ensemble) of random matrix theory. At a tea break, Freeman Dyson recognizes the formula. This opens the deep connection between number theory and mathematical physics.",
    math: '1 - \\left(\\frac{\\sin \\pi u}{\\pi u}\\right)^2 \\quad \\text{(GUE pair correlation)}',
    highlight: true,
  },
  {
    year: 1974,
    era: 'modern',
    title: "Levinson's 1/3 Result",
    content: "Norman Levinson proves that at least one-third of the nontrivial zeros lie on the critical line.",
    math: '\\text{At least } \\tfrac{1}{3} \\text{ of zeros have } \\operatorname{Re}(\\rho) = \\tfrac{1}{2}',
  },
  {
    year: 1976,
    era: 'modern',
    title: "Newman's Constant",
    content: "Charles Newman conjectures that the de Bruijn-Newman constant Lambda satisfies Lambda >= 0, meaning the heat flow threshold is exactly at the RH boundary. This conjecture would wait 44 years for proof.",
    math: '\\Lambda \\geq 0 \\;\\text{(conjectured by Newman, proved 2020)}',
  },
  {
    year: 1987,
    era: 'computational',
    title: "Odlyzko's Numerical Verification",
    content: "Andrew Odlyzko computes millions of zeta zeros near the 10^20-th zero with extraordinary precision, confirming GUE statistics to many decimal places. His computations remain among the most compelling numerical evidence for both RH and the GUE hypothesis.",
    highlight: true,
  },
  {
    year: 1989,
    era: 'modern',
    title: "Conrey's 2/5 Result",
    content: "Brian Conrey improves Levinson's result, showing that at least 2/5 of zeros lie on the critical line.",
    math: '\\text{At least } 40\\% \\text{ of zeros on the critical line}',
  },
  {
    year: 1990,
    era: 'modern',
    title: "Julia's Primon Gas",
    content: "Bernard Julia introduces the primon gas model: a quantum statistical system whose partition function is the Riemann zeta function, with primes as fundamental particles.",
    math: 'Z(\\beta) = \\zeta(\\beta) = \\prod_p \\frac{1}{1 - p^{-\\beta}}',
  },
  {
    year: 1995,
    era: 'modern',
    title: 'Bost-Connes Phase Transition',
    content: "Jean-Benoit Bost and Alain Connes construct a C*-dynamical system with partition function zeta(beta), exhibiting spontaneous symmetry breaking at beta = 1. This makes the phase transition at sigma = 1 rigorous.",
    math: '\\beta_c = 1: \\text{ unique KMS state} \\;(\\beta \\leq 1) \\;\\leftrightarrow\\; \\text{symmetry breaking} \\;(\\beta > 1)',
  },
  {
    year: 1997,
    era: 'modern',
    title: 'Li Criterion',
    content: "Xian-Jin Li proves that RH is equivalent to the positivity of a sequence of real numbers defined from the zeros. In the oscillator model, this is a passivity condition.",
    math: '\\text{RH} \\;\\Longleftrightarrow\\; \\lambda_n > 0 \\text{ for all } n \\geq 1',
  },
  {
    year: 1999,
    era: 'modern',
    title: "Berry-Keating xp Hamiltonian",
    content: "Michael Berry and Jon Keating propose that the zeta zeros are eigenvalues of the quantized Hamiltonian H = xp. This is the most concrete form of the Hilbert-Polya conjecture.",
    math: 'H = \\frac{1}{2}(xp + px), \\quad \\text{eigenvalues} = \\tfrac{1}{2} + i\\gamma_n \\;?',
  },
  {
    year: 2000,
    era: 'computational',
    title: 'Clay Millennium Prize',
    content: "The Clay Mathematics Institute names the Riemann Hypothesis as one of seven Millennium Prize Problems, offering $1,000,000 for a proof or disproof.",
    highlight: true,
  },
  {
    year: 2000,
    era: 'modern',
    title: 'Keating-Snaith Moment Conjecture',
    content: "Jon Keating and Nina Snaith use random matrix theory to predict the exact leading coefficient for moments of zeta on the critical line, resolving conjectures that had been open for decades.",
    math: '\\int_0^T |\\zeta(\\tfrac{1}{2}+it)|^{2k}\\,dt \\sim C_k \\cdot T(\\log T)^{k^2}',
  },
  {
    year: 2004,
    era: 'computational',
    title: "Gourdon Verifies 10^13 Zeros",
    content: "Xavier Gourdon verifies that the first 10^13 nontrivial zeros all lie on the critical line, using the Odlyzko-Schonhage algorithm.",
    math: '10^{13} \\text{ zeros verified on } \\operatorname{Re}(s) = \\tfrac{1}{2}',
  },
  {
    year: 2015,
    era: 'recent',
    title: "Tao's Chowla Conjecture (Averaged)",
    content: "Terence Tao proves the logarithmically-averaged Chowla conjecture, breaking the parity barrier in multiplicative number theory using entropy methods.",
  },
  {
    year: 2016,
    era: 'recent',
    title: "Matomaki-Radziwill Short Intervals",
    content: "Kaisa Matomaki and Maksym Radziwill prove that multiplicative functions exhibit cancellation in almost all short intervals, a breakthrough in understanding prime distribution at small scales.",
  },
  {
    year: 2017,
    era: 'recent',
    title: "Bender-Brody-Mueller PT-Symmetric Operator",
    content: "Carl Bender, Dorje Brody, and Markus Mueller propose a PT-symmetric Hamiltonian whose eigenvalues correspond to zeta zeros, advancing the Hilbert-Polya program.",
    math: 'H = \\frac{1}{1 - e^{-i\\hat{p}}}(\\hat{x}\\hat{p} + \\hat{p}\\hat{x})\\frac{1}{1 - e^{-i\\hat{p}}}',
  },
  {
    year: 2020,
    era: 'recent',
    title: "Rodgers-Tao: Lambda >= 0",
    content: "Brad Rodgers and Terence Tao prove Newman's 1976 conjecture that the de Bruijn-Newman constant Lambda is non-negative. Combined with de Bruijn's result that RH implies Lambda <= 0, this means RH holds by the slimmest possible margin — the oscillator chain sits exactly at the stability threshold.",
    math: '\\Lambda \\geq 0 \\quad \\text{(proved)}, \\quad \\text{RH} \\Leftrightarrow \\Lambda \\leq 0',
    highlight: true,
  },
  {
    year: 2021,
    era: 'computational',
    title: 'Platt-Trudgian Rigorous Verification',
    content: "David Platt and Tim Trudgian rigorously verify RH to height 3 x 10^12 using interval arithmetic, providing the strongest certified computational evidence.",
    math: '\\text{All zeros with } |\\operatorname{Im}(\\rho)| < 3 \\times 10^{12} \\text{ verified on critical line}',
  },
  {
    year: 2024,
    era: 'recent',
    title: 'Guth-Maynard Zero Density Breakthrough',
    content: "Larry Guth and James Maynard achieve the first improvement to zero-density estimates in over 80 years, improving the Ingham bound. This is the most significant recent progress toward RH.",
    math: 'N(\\sigma, T) \\ll T^{A(\\sigma)(1-\\sigma)+\\varepsilon} \\quad \\text{(improved bound)}',
    highlight: true,
  },
  {
    year: 2025,
    era: 'recent',
    title: 'zetaexplorer — a computer-assisted RH engine room',
    content: "Jude Gomila launches the mathexplorer / zetaexplorer project: an open engine room for the Riemann Hypothesis via the de Bruijn-Newman constant. It combines the twin-ladder operator model, interactive simulators, and an autonomous fleet of AI engines that map approach routes and push barrier bounds on Lambda, with a live ledger of results, no-go theorems, and open problems.",
  },
  {
    year: 2026,
    era: 'recent',
    title: 'AI fleet + human work — computer-assisted Lambda candidates',
    content: "Running the twin-ladder barrier method, an autonomous AI fleet (Claude, Codex, and ChatGPT) together with human work produces computer-assisted candidates Lambda <= 0.1787854 (reviewed by Dan Romik, being prepared for public release) and a sharper Lambda <= 0.1758354, each certified in interval arithmetic with parts of the reduction Lean-checked. These are candidates, not peer-reviewed theorems: RH remains open and Platt-Trudgian Lambda <= 0.2 remains the rigorous benchmark. The program also establishes no-go theorems (flow-blindness; frozen-rung = Platt-Trudgian) showing the route caps at verified zero height.",
    math: '\\Lambda \\le 0.1758354 \\quad \\text{(computer-assisted candidate.)}',
    highlight: true,
  },
];

function PersonCard({ person }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const key = NAME_TO_KEY[person.name];
  const photo = key && PORTRAIT_KEYS.has(key) && !imgFailed ? `/portraits/${key}.jpg` : null;
  return (
    <div style={{
      display: 'flex', gap: 14, padding: 16,
      background: 'var(--paper2)',
      border: `1px solid ${person.color}25`,
      borderRadius: 10,
      transition: 'border-color 0.2s',
      position: 'relative',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = person.color + '60'}
    onMouseLeave={e => e.currentTarget.style.borderColor = person.color + '25'}
    >
      {/* Wikipedia link in top-right corner */}
      {person.wiki && (
        <a
          href={person.wiki}
          target="_blank"
          rel="noopener noreferrer"
          title={`${person.name} on Wikipedia`}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 22,
            height: 22,
            borderRadius: 4,
            background: 'color-mix(in srgb, var(--ink-faint) 15%, transparent)',
            border: '1px solid color-mix(in srgb, var(--rule) 25%, transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: 'var(--faint)',
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(135,123,103,0.3)';
            e.currentTarget.style.color = 'var(--ink)';
            e.currentTarget.style.borderColor = TK_ALPHA(ED.rule, 0.5);
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = TK_ALPHA(ED.inkFaint, 0.15);
            e.currentTarget.style.color = 'var(--faint)';
            e.currentTarget.style.borderColor = TK_ALPHA(ED.rule, 0.25);
          }}
        >
          W
        </a>
      )}

      {/* Portrait: photo when a freely-licensed one exists, else colored-initials avatar */}
      <div style={{ flexShrink: 0 }}>
        {photo ? (
          <img
            src={photo}
            alt={person.name}
            title={person.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            style={{
              width: 48, height: 48, borderRadius: '50%',
              objectFit: 'cover', display: 'block',
              border: `2px solid ${person.color}`,
              boxShadow: `0 0 12px ${person.color}30`,
            }}
          />
        ) : (
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: person.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#ffffff',
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            letterSpacing: '-0.5px',
            boxShadow: `0 0 12px ${person.color}30`,
          }}>
            {person.initials}
          </div>
        )}
      </div>

      {/* Bio */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ margin: 0, fontSize: 15, color: 'var(--ink)' }}>
          {person.name}
        </h4>
        {person.years && (
          <div style={{
            fontSize: 12, color: person.color, fontFamily: 'var(--ed-mono, var(--font-mono))',
            marginBottom: 6, fontWeight: 600,
          }}>
            {person.years}
          </div>
        )}
        <p style={{
          margin: 0, fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.65,
        }}>
          {person.bio}
        </p>
      </div>
    </div>
  );
}

function ResultExplainer({ title, author, color, tldr, math, explanation, whyItMatters, zpoConnection }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div style={{
      background: 'var(--paper2)',
      border: `1px solid ${color}25`,
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Header - always visible */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '14px 18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: expanded ? `1px solid ${color}20` : 'none',
        }}
      >
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: color, flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{title}</span>
            <span style={{ fontSize: 11, color: color, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{author}</span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--ink)' }}>TLDR:</strong> {tldr}
          </p>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12"
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
        >
          <path d="M2 4l4 4 4-4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '16px 18px' }}>
          {math && (
            <div style={{ marginBottom: 16 }}>
              <BlockMath tex={math} />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <h4 style={{ color, fontSize: 12, marginBottom: 6 }}>How It Works</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.7, margin: 0 }}>
              {explanation}
            </p>
          </div>

          <div style={{ marginBottom: 14 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 12, marginBottom: 6 }}>Why It Matters</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.7, margin: 0 }}>
              {whyItMatters}
            </p>
          </div>

          {zpoConnection && (
            <div style={{
              padding: '10px 14px', borderRadius: 6,
              background: 'color-mix(in srgb, var(--accent-deco) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-deco) 25%, transparent)',
            }}>
              <h4 style={{ color: 'var(--terra)', fontSize: 12, marginBottom: 4 }}>Twin-Ladder Bridge Connection</h4>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                {zpoConnection}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [selectedEra, setSelectedEra] = useState('all');
  const milestones = TIMELINE.filter(e => e.highlight);
  const filtered = selectedEra === 'all'
    ? TIMELINE
    : selectedEra === 'milestones'
      ? milestones
      : TIMELINE.filter(e => e.era === selectedEra);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>History of the Riemann Zeta Function</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            A timeline of breakthroughs from Euler's product formula (1737) through the modern era.
            Nearly three centuries of mathematics, connecting number theory, complex analysis, physics,
            and computation in pursuit of the Riemann Hypothesis.
          </p>
        </div>

        <FreshnessBanner date="2026-08-28" note="public timeline of the zeta function & RH, through the 2026 computer-assisted Λ candidates" />

      <div className="filter-bar" style={{ marginTop: 20 }}>
        <button
          className={`filter-btn ${selectedEra === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedEra('all')}
          aria-pressed={selectedEra === 'all'}
        >
          All ({TIMELINE.length})
        </button>
        <button
          className={`filter-btn ${selectedEra === 'milestones' ? 'active' : ''}`}
          onClick={() => setSelectedEra('milestones')}
          style={selectedEra === 'milestones' ? { borderColor: 'var(--brass-dk)', color: 'var(--brass-dk)' } : {}}
          aria-pressed={selectedEra === 'milestones'}
        >
          Milestones ({milestones.length})
        </button>
        {ERAS.map(era => {
          const count = TIMELINE.filter(e => e.era === era.id).length;
          return (
            <button
              key={era.id}
              className={`filter-btn ${selectedEra === era.id ? 'active' : ''}`}
              onClick={() => setSelectedEra(era.id)}
              style={selectedEra === era.id ? { borderColor: era.color, color: era.color } : {}}
              aria-pressed={selectedEra === era.id}
            >
              {era.label} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ position: 'relative', marginTop: 24 }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute', left: 80, top: 0, bottom: 0, width: 2,
          background: 'linear-gradient(to bottom, var(--brass-deco), var(--series-1), var(--series-3), var(--series-5), var(--series-6), var(--series-7))',
          opacity: 0.3,
        }} />

        {filtered.map((entry, i) => {
          const era = ERAS.find(e => e.id === entry.era);
          return (
            <div key={i} style={{
              display: 'flex', gap: 24, marginBottom: 4, position: 'relative',
            }}>
              {/* Year */}
              <div style={{
                width: 60, textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))',
                fontSize: 14, fontWeight: 700, color: era?.color || 'var(--ink-soft)',
                paddingTop: 16, flexShrink: 0,
              }}>
                {entry.year}
              </div>

              {/* Dot */}
              <div style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                background: entry.highlight ? era?.color : 'var(--paper)',
                border: `2px solid ${era?.color || 'var(--faint)'}`,
                marginTop: 18, zIndex: 1,
                boxShadow: entry.highlight ? `0 0 8px ${era?.color}40` : 'none',
              }} />

              {/* Card */}
              <div style={{
                flex: 1, padding: '12px 16px', marginBottom: 8,
                background: entry.highlight ? 'var(--paper2)' : 'var(--paper)',
                border: `1px solid ${entry.highlight ? era?.color + '40' : 'var(--hairline)'}`,
                borderRadius: 8,
              }}>
                <h3 style={{
                  margin: 0, fontSize: 15, color: 'var(--ink)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {entry.title}
                  {entry.highlight && (
                    <span style={{
                      fontSize: 10, padding: '2px 6px', borderRadius: 4,
                      background: era?.color + '20', color: era?.color,
                      fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      Milestone
                    </span>
                  )}
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                  {entry.content}
                </p>
                {entry.math && (
                  <div style={{ marginTop: 8 }}>
                    <BlockMath tex={entry.math} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* People Section */}
      <div style={{ marginTop: 48 }}>
        <h2 className="ed-h2" style={{ color: 'var(--ink)', marginBottom: 4, fontSize: 22 }}>Key Figures in the History of the Riemann Hypothesis</h2>
        <p style={{ color: 'var(--faint)', fontSize: 14, marginTop: 0, marginBottom: 24 }}>
          The mathematicians, physicists, and computer scientists whose work shaped our understanding of the zeta function and its zeros — from Euler through to the present day.
        </p>

        {PEOPLE_ERAS.map(era => {
          const eraPeople = PEOPLE.filter(p => p.era === era.id);
          if (eraPeople.length === 0) return null;
          return (
            <div key={era.id} style={{ marginBottom: 32 }}>
              <h3 style={{
                color: era.color, fontSize: 16, fontWeight: 700,
                marginBottom: 14, paddingBottom: 8,
                borderBottom: `2px solid ${era.color}30`,
                fontFamily: 'var(--ed-mono, var(--font-mono))',
                letterSpacing: '0.5px',
              }}>
                {era.label}
                <span style={{ color: 'var(--faint)', fontWeight: 400, fontSize: 13, marginLeft: 10 }}>
                  ({eraPeople.length} {eraPeople.length === 1 ? 'person' : 'people'})
                </span>
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 14,
              }}>
                {eraPeople.map((person, i) => (
                  <PersonCard key={i} person={person} />
                ))}
              </div>
            </div>
          );
        })}
        <p style={{ fontSize: 10.5, color: 'var(--faint)', lineHeight: 1.5, marginTop: 4 }}>
          Portrait credits: photographs from Wikimedia Commons — Public Domain for the historical
          figures (Euler through Turing) and Creative Commons (CC-BY / CC-BY-SA, several from the
          Mathematisches Forschungsinstitut Oberwolfach / Konrad Jacobs) for the modern ones; full
          per-image attributions in <a href="/portraits/CREDITS.json" target="_blank" rel="noreferrer" style={{ color: 'var(--faint)' }}>/portraits/CREDITS.json</a>.
          Contributors with no freely-licensed portrait are shown as initials.
        </p>
      </div>

      {/* ─── Key Results Explained (TLDRs) ─── */}
      <div style={{ marginTop: 48 }}>
        <h2 className="ed-h2" style={{ color: 'var(--ink)', marginBottom: 4, fontSize: 22 }}>Key Results Explained</h2>
        <p style={{ color: 'var(--faint)', fontSize: 14, marginTop: 0, marginBottom: 24 }}>
          Accessible summaries of the mathematical results that underpin the Twin-Ladder Bridge framework and the broader
          study of the Riemann zeta function.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Euler Product */}
          <ResultExplainer
            title="Euler Product Formula (1737)"
            author="Euler"
            color={ED.brass}
            tldr="The sum over all integers equals the product over all primes. This is because every integer factors uniquely into primes."
            math={"\\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}, \\quad \\text{Re}(s) > 1"}
            explanation="Expand each factor 1/(1-p^{-s}) = 1 + p^{-s} + p^{-2s} + ... as a geometric series. When you multiply all these series together, each term in the product picks one power of each prime. By the fundamental theorem of arithmetic, every positive integer n has a unique prime factorization, so every 1/n^s appears exactly once."
            whyItMatters="This is the foundation of the oscillator chain model. Each prime contributes one 'stage' to the cascade, and the product assembles the full zeta function. It's also why primes are connected to the zeros: the Euler product encodes prime distribution in the analytic structure of ζ."
            zpoConnection="Each factor 1/(1-p^{-s}) is the transfer function of an LC oscillator with resonant frequency ω_p = 2π/log(p). The Euler product = a cascade of oscillator stages."
          />

          {/* Functional Equation */}
          <ResultExplainer
            title="Functional Equation (1859)"
            author="Riemann"
            color={ED.series1}
            tldr="ζ(s) and ζ(1-s) are related by a known factor χ(s). This symmetry around σ = ½ is the deepest structural property of ζ."
            math={"\\zeta(s) = \\chi(s) \\cdot \\zeta(1-s), \\quad \\chi(s) = \\pi^{s-1/2} \\frac{\\Gamma((1-s)/2)}{\\Gamma(s/2)}"}
            explanation="Riemann derived this by applying the Poisson summation formula to the theta function θ(t) = Σ exp(-πn²t). The key step is the identity θ(1/t) = √t · θ(t), which encodes modular symmetry. Applying the Mellin transform to this identity produces the functional equation."
            whyItMatters="The functional equation forces a symmetry in the zero distribution: if ζ(ρ) = 0, then ζ(1-ρ) = 0 too. Combined with the Euler product (which gives zeros only for 0 < Re(s) < 1), this means zeros come in pairs symmetric about σ = ½. RH says they actually lie ON σ = ½."
            zpoConnection="χ(s) is the 'bridge' connecting the direct ladder ζ(s) to the dual ladder ζ(1-s). At σ = ½, |χ| = 1 exactly — the bridge is lossless/unitary."
          />

          {/* Analytic Continuation */}
          <ResultExplainer
            title="Analytic Continuation (1859)"
            author="Riemann"
            color={ED.series3}
            tldr="The zeta function, originally defined for Re(s) > 1, can be extended to the entire complex plane (except s = 1) while preserving all its analytic properties."
            math={"\\zeta(s) = \\frac{\\eta(s)}{1 - 2^{1-s}}, \\quad \\eta(s) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^s} \\text{ converges for Re}(s) > 0"}
            explanation="The Dirichlet series Σ 1/n^s converges only for Re(s) > 1. But the alternating series η(s) = Σ (-1)^{n-1}/n^s converges for Re(s) > 0 by the alternating series test. Since ζ(s) = η(s)/(1-2^{1-s}), this extends ζ into the critical strip. The functional equation then extends it to Re(s) < 0."
            whyItMatters="The zeros of ζ live in the critical strip 0 < Re(s) < 1, where the original Dirichlet series diverges. Without analytic continuation, we can't even talk about these zeros. This is Gap S4 in the Twin-Ladder Bridge framework."
            zpoConnection="The eta relation is how the oscillator cascade extends into the critical strip. The regularization factor 1/(1-2^{1-s}) accounts for the 'impedance mismatch' at the prime 2."
          />

          {/* Prime Number Theorem */}
          <ResultExplainer
            title="Prime Number Theorem (1896)"
            author="Hadamard & de la Vallée-Poussin"
            color={ED.series5}
            tldr="The number of primes up to x is approximately x/ln(x). Equivalently: the n-th prime is roughly n·ln(n)."
            math={"\\pi(x) \\sim \\frac{x}{\\ln x} \\quad \\text{as } x \\to \\infty"}
            explanation="The proof shows ζ(s) has no zeros on the line Re(s) = 1. Since the error in π(x) ~ x/ln(x) is controlled by how close zeros get to Re(s) = 1, proving they stay away gives PNT. RH (zeros at Re(s) = ½) would give the strongest possible error bound: |π(x) - Li(x)| = O(√x · log x)."
            whyItMatters="PNT is the most fundamental theorem about prime distribution. It shows primes thin out logarithmically. The proof technique — controlling zeros of ζ — is the template for all analytic number theory."
            zpoConnection="In oscillator terms, PNT says the oscillator frequencies ω_p = 2π/log(p) thin out, with average spacing growing like log(p)/p. The cascade has decreasing coupling as primes grow."
          />

          {/* Hardy's Theorem */}
          <ResultExplainer
            title="Infinitely Many Zeros on the Critical Line (1914)"
            author="Hardy"
            color={ED.series7}
            tldr="ζ(½ + it) has infinitely many real zeros. That is, the Z-function Z(t) changes sign infinitely often."
            math={"\\#\\{t \\in [0, T] : \\zeta(\\tfrac{1}{2} + it) = 0\\} \\to \\infty \\text{ as } T \\to \\infty"}
            explanation="Hardy used the integral ∫₀ᵀ Z(t)² dt and showed it grows like T log T, while if Z(t) had only finitely many sign changes, the integral would grow differently. The argument uses the self-dual property of ζ on the critical line."
            whyItMatters="This was the first evidence that the critical line is special. It was later strengthened by Selberg (positive proportion, 1942), Levinson (≥ 1/3, 1974), and Conrey (≥ 2/5, 1989)."
            zpoConnection="In the oscillator model, zeros on the critical line correspond to perfect destructive interference between direct and dual ladder signals — the bridge-balanced null."
          />

          {/* Li's Criterion */}
          <ResultExplainer
            title="Li's Criterion (1997)"
            author="Li"
            color={ED.series4}
            tldr="RH is true if and only if a specific sequence of numbers λ₁, λ₂, λ₃, ... are all positive."
            math={"\\text{RH} \\iff \\lambda_n = \\sum_{\\rho} \\left[1 - \\left(1 - \\frac{1}{\\rho}\\right)^n\\right] > 0 \\quad \\forall n \\geq 1"}
            explanation="Li showed this by relating λ_n to the sum of n-th powers of 1 - 1/ρ over nontrivial zeros. If all zeros have Re(ρ) = ½, then |1 - 1/ρ| < 1 and the powers decay, giving positive λ_n. A zero off the critical line would eventually make some λ_n negative."
            whyItMatters="Reduces RH to checking positivity of a computable sequence. We can verify λ_n > 0 for specific n using known zeros, but proving it for ALL n requires proving RH itself."
            zpoConnection="In the oscillator model, λ_n > 0 is a passivity condition: the cascade network dissipates energy at every harmonic. A negative λ_n would mean the network generates energy — an instability."
          />

          {/* Apéry's Theorem */}
          <ResultExplainer
            title="Irrationality of ζ(3) (1979)"
            author="Apéry"
            color={ED.series6}
            tldr="ζ(3) = 1 + 1/8 + 1/27 + 1/64 + ... ≈ 1.202 is irrational. It cannot be expressed as a fraction a/b."
            math={"\\zeta(3) = \\frac{5}{2} \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^3 \\binom{2n}{n}} \\notin \\mathbb{Q}"}
            explanation="Apéry constructed sequences a_n, b_n satisfying the recurrence (n+1)³a_{n+1} = (2n+1)(17n²+17n+5)a_n - n³a_{n-1}, with a_n integers and b_n·ζ(3) - a_n → 0 faster than any geometric sequence. If ζ(3) = p/q, then q·b_n·ζ(3) - q·a_n would be a nonzero integer smaller than 1 for large n — contradiction."
            whyItMatters="One of the most surprising proofs in 20th century mathematics. Even today, ζ(5) irrationality remains open. The recurrence coefficients (17n²+17n+5) seem miraculous."
            zpoConnection="In the Twin-Ladder Bridge model, odd zeta values correspond to anti-resonant modes where the dual ladder contributes zero information. Their irrationality reflects the irreducible complexity of the prime distribution."
          />

          {/* Rodgers-Tao */}
          <ResultExplainer
            title="de Bruijn–Newman Constant Λ ≥ 0 (Rodgers–Tao 2020)"
            author="Rodgers & Tao"
            color={ED.series7}
            tldr="Rodgers and Tao proved Λ ≥ 0: if RH is true, it is true 'by the narrowest possible margin.' The heat parameter Λ at which zeros first leave the critical line equals 0 exactly if RH holds — Λ = 0 is open."
            math={"\\Lambda \\geq 0 \\quad \\text{(proved)}, \\quad \\text{RH} \\iff \\Lambda \\leq 0 \\implies \\Lambda = 0 \\text{ if RH is true}"}
            explanation="De Bruijn showed that if you 'heat-flow' the xi function (Gaussian smoothing), zeros stay real for sufficiently large flow time τ ≥ Λ. Newman conjectured Λ ≥ 0. Rodgers and Tao proved this using a barrier argument: if Λ < 0, then running the heat flow backward by |Λ| would push zeros off the real axis, contradicting the structure of the xi function."
            whyItMatters="Combined with RH ⟹ Λ ≤ 0 (de Bruijn 1950), this means Λ = 0 exactly if RH is true. The zeta function is at the exact threshold between 'all zeros real' (Λ ≤ 0) and 'some zeros complex' (Λ > 0)."
            zpoConnection="In the thermodynamic model, τ = 0 corresponds to the critical temperature σ = ½. The heat flow is thermal diffusion: positive τ smooths (keeps zeros real), negative τ sharpens (zeros escape). Λ = 0 means the system is at exact phase balance."
          />

          {/* Montgomery Pair Correlation */}
          <ResultExplainer
            title="Pair Correlation Conjecture (1973)"
            author="Montgomery"
            color={ED.brass}
            tldr="The spacing between consecutive zeta zeros follows the same statistics as eigenvalues of random unitary matrices (GUE). Primes 'repel' like eigenvalues."
            math={"\\lim_{T \\to \\infty} \\frac{1}{N(T)} \\#\\left\\{j \\neq k : \\frac{(\\gamma_j - \\gamma_k)\\log T}{2\\pi} \\in [\\alpha, \\beta]\\right\\} = \\int_\\alpha^\\beta \\left(1 - \\left(\\frac{\\sin \\pi u}{\\pi u}\\right)^2\\right) du"}
            explanation="Montgomery was computing the pair correlation of zeta zeros when Freeman Dyson recognized the formula at a tea break: 'That's the pair correlation of eigenvalues of random Hermitian matrices!' This unexpected connection links number theory to quantum mechanics and statistical physics."
            whyItMatters="If true, it implies RH is 'generic' — the zeros behave like eigenvalues of a 'typical' operator, consistent with the Hilbert-Pólya conjecture. Odlyzko's computations (1987) confirmed GUE statistics to extraordinary precision."
            zpoConnection="In the oscillator model, GUE statistics correspond to the energy level repulsion of coupled oscillators. The prime oscillator chain naturally produces this repulsion through its coupling structure."
          />

          {/* Guth-Maynard */}
          <ResultExplainer
            title="Zero Density Breakthrough (2024)"
            author="Guth & Maynard"
            color={ED.series3}
            tldr="The first improvement in 80+ years to how many zeros can exist off the critical line. Fewer off-line zeros means primes are better behaved."
            math={"N(\\sigma, T) \\ll T^{A(\\sigma)(1-\\sigma)+\\varepsilon}, \\quad A(\\sigma) \\text{ improved over Ingham (1940)}"}
            explanation="Zero density estimates bound how many zeros can exist with Re(ρ) = σ ≠ ½. The classical Ingham bound (1940) gives N(σ,T) ≪ T^{3(1-σ)/(2-σ)}. Guth and Maynard improved the exponent using new techniques from decoupling and harmonic analysis. Fewer off-line zeros means better estimates for primes in short intervals."
            whyItMatters="This is the most significant recent progress toward RH. While it doesn't prove RH, it tightens the constraints on where zeros can be, making a counterexample to RH harder to construct."
            zpoConnection="In the network analogy, zero-density bounds constrain how many zeta resonances may lie away from the critical line. For the displayed S₂₁ = ζ(2s)/ζ(s), those zeros are generic poles, so this does not measure completion of a Darlington transmission-zero condition."
          />
        </div>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: 'var(--hairline)' }}>
        <h3 style={{ color: 'var(--ink-soft)', marginTop: 0 }}>The Story So Far</h3>
        <p style={{ color: 'var(--faint)', fontSize: 14, lineHeight: 1.8 }}>
          After nearly 170 years, the Riemann Hypothesis remains unproven. Over <strong style={{ color: 'var(--ink)' }}>10<sup>13</sup> zeros</strong> have
          been verified computationally. The proportion known to lie on the critical line is
          at least <strong style={{ color: 'var(--ink)' }}>5/12</strong> (Pratt–Robles–Zaharescu–Zeindler
          2020, peer-reviewed); a 2026 external computer-assisted result claims ≥ 2/3 (0.6725) unconditionally
          (Lean-checked, reviewed by Conrey and Goldston, not peer-reviewed) — see{' '}
          <Link to="/critical-line-proportion" style={{ color: 'var(--brass-dk)' }}>critical-line proportion</Link>. The de Bruijn-Newman
          constant has been shown to be exactly zero if and only if RH holds. Zero-density estimates
          continue to tighten, and connections to random matrix theory, quantum mechanics, and
          dynamical systems grow deeper each decade. The prize remains $1,000,000.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--blue)' }}>
        <h3 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/paper" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Paper</Link>
          <Link to="/literature" style={{ color: 'var(--brass)', fontSize: 13 }}>Literature</Link>
          <Link to="/concepts" style={{ color: 'var(--green)', fontSize: 13 }}>Concepts</Link>
          <Link to="/formal-proof" style={{ color: 'var(--blue)', fontSize: 13 }}>Formal Proof</Link>
        </div>
        <p style={{ margin: '14px 0 0' }}>
          <Link to="/">← the atlas</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
