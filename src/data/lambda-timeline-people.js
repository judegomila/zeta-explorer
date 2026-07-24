/**
 * @module lambda-timeline-people
 * @fileoverview Registry of the historical people behind the de Bruijn–Newman (Lambda)
 * bound timeline, keyed by the EXACT author strings used in
 * `lambda-historical-timeline.js` (LAMBDA_TIMELINE[].authors), so the timeline UI can
 * look each author up and render a face beside the entry.
 *
 * `photo` is a path under /portraits/ (served from public/) when a freely-licensed
 * portrait (Public Domain or Creative Commons, via Wikimedia Commons) has been sourced,
 * or `null` when none is available — in which case the UI renders a monogram avatar.
 * Attributions for CC-BY/SA images live in public/portraits/CREDITS.json.
 *
 * Non-person authors (the ZPO engine, the paper integration team) are intentionally
 * absent — `personFor()` returns null and the UI shows no face for them. The Polymath
 * collaboration is represented as a collective (no single face).
 */

/** @typedef {{ key: string, display: string, photo: (string|null), wiki: (string|null), life: string, role: string, collective?: boolean }} Person */

/** Keyed by the exact author string in LAMBDA_TIMELINE. @type {Record<string, Person>} */
export const LAMBDA_TIMELINE_PEOPLE = {
  'N.G. de Bruijn': {
    key: 'debruijn', display: 'N. G. de Bruijn', photo: '/portraits/debruijn.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Nicolaas_Govert_de_Bruijn',
    life: '1918–2012', role: 'Defined Λ; first upper bound Λ ≤ 1/2 (1950).',
  },
  'C.M. Newman': {
    key: 'newman', display: 'Charles M. Newman', photo: null,
    wiki: 'https://en.wikipedia.org/wiki/Charles_M._Newman',
    life: 'b. 1946', role: 'Conjectured Λ ≥ 0; the constant bears his name (1976).',
  },
  'G. Csordas': {
    key: 'csordas', display: 'George Csordas', photo: null,
    wiki: 'https://en.wikipedia.org/wiki/Laguerre%E2%80%93P%C3%B3lya_class',
    life: '', role: 'Laguerre–Pólya methods and lower bounds for Λ.',
  },
  'T.S. Norfolk': {
    key: 'norfolk', display: 'Timothy S. Norfolk', photo: null,
    wiki: null, life: '', role: 'Co-author of the 1987 lower bound.',
  },
  'R.S. Varga': {
    key: 'varga', display: 'Richard S. Varga', photo: '/portraits/varga.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Richard_S._Varga',
    life: '1928–2022', role: 'Numerical analyst; several early lower bounds.',
  },
  'A.M. Odlyzko': {
    key: 'odlyzko', display: 'Andrew M. Odlyzko', photo: '/portraits/odlyzko.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Andrew_Odlyzko',
    life: 'b. 1949', role: 'Large-scale zeta-zero computation → sharper lower bounds.',
  },
  'W. Smith': {
    key: 'smith', display: 'Wayne Smith', photo: null,
    wiki: null, life: '', role: 'Co-author of the 1993 lower bound.',
  },
  'X. Saouter': {
    key: 'saouter', display: 'Xavier Saouter', photo: null,
    wiki: null, life: '', role: 'Computational upper bounds (2007, 2011).',
  },
  'T. Papanikolaou': {
    key: 'papanikolaou', display: 'Tobias Papanikolaou', photo: null,
    wiki: null, life: '', role: 'Co-author, 2007 upper bound.',
  },
  'P. Demichel': {
    key: 'demichel', display: 'Patrick Demichel', photo: null,
    wiki: null, life: '', role: 'Co-author, 2007 & 2011 upper bounds.',
  },
  'H.J.J. te Riele': {
    key: 'teriele', display: 'Herman te Riele', photo: null,
    wiki: null, life: '', role: 'Proved the 1990 lower bound Λ > −5.',
  },
  'A. Ruttan': {
    key: 'ruttan', display: 'Alan Ruttan', photo: null,
    wiki: null, life: '', role: 'Co-author of the 1991 lower bound.',
  },
  'Y. Saouter': {
    key: 'ysaouter', display: 'Yannick Saouter', photo: null,
    wiki: null, life: '', role: 'Co-author of the 2011 Lehmer-pair lower bound.',
  },
  'X. Gourdon': {
    key: 'gourdon', display: 'Xavier Gourdon', photo: null,
    wiki: null, life: '', role: 'Co-author of the 2011 Lehmer-pair lower bound.',
  },
  'H. Ki': {
    key: 'ki', display: 'Haseo Ki', photo: null,
    wiki: null, life: '', role: 'Co-author of the strict 2009 upper-bound improvement.',
  },
  'Y.-O. Kim': {
    key: 'kim', display: 'Young-One Kim', photo: null,
    wiki: null, life: '', role: 'Co-author of the strict 2009 upper-bound improvement.',
  },
  'J. Lee': {
    key: 'lee', display: 'Jungseob Lee', photo: null,
    wiki: null, life: '', role: 'Co-author of the strict 2009 upper-bound improvement.',
  },
  'B. Rodgers': {
    key: 'rodgers', display: 'Brad Rodgers', photo: null,
    wiki: 'https://en.wikipedia.org/wiki/De_Bruijn%E2%80%93Newman_constant',
    life: '', role: 'With Tao, proved Λ ≥ 0 (2020) — Newman’s conjecture.',
  },
  'T. Tao': {
    key: 'tao', display: 'Terence Tao', photo: '/portraits/tao.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Terence_Tao',
    life: 'b. 1975', role: 'With Rodgers, proved Λ ≥ 0 (2020).',
  },
  'D.H.J. Polymath': {
    key: 'polymath', display: 'D.H.J. Polymath (collab.)', photo: null,
    wiki: 'https://en.wikipedia.org/wiki/Polymath_Project',
    life: '', role: 'Polymath15 collaboration: barrier method toward Λ ≤ 0.2.', collective: true,
  },
  'D. Platt': {
    key: 'platt', display: 'David J. Platt', photo: null,
    wiki: null, life: '', role: 'With Trudgian, current SOTA upper bound Λ ≤ 0.2 (2021).',
  },
  'T. Trudgian': {
    key: 'trudgian', display: 'Timothy S. Trudgian', photo: null,
    wiki: null, life: '', role: 'With Platt, current SOTA upper bound Λ ≤ 0.2 (2021).',
  },
};

/** Author strings that are not individual people (no face). */
const NON_PERSON = new Set([
  'ZPO Engine (mathexplorer project)',
  'Twin-Ladder v52 paper integration team',
  'Mosaic Intelligence',
]);

/** @returns {Person|null} the person record for an author string, or null if not a person. */
export function personFor(author) {
  if (NON_PERSON.has(author)) return null;
  return LAMBDA_TIMELINE_PEOPLE[author] || null;
}
