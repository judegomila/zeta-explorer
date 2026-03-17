import { execSync } from 'child_process';

const BASE = 'http://localhost:3002';
const pages = [
  { path: '/#/simulator', name: 'simulator', selector: 'canvas' },
  { path: '/#/waves', name: 'waves', selector: 'canvas' },
];

for (const pg of pages) {
  const url = `${BASE}${pg.path}`;
  const out = `screenshots/${pg.name}.png`;
  const cmd = `npx playwright screenshot --viewport-size "1280,900" --color-scheme dark --wait-for-selector "${pg.selector}" --wait-for-timeout 4000 "${url}" "${out}"`;
  console.log(`capturing ${pg.name}...`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    // fallback without selector
    const fallback = `npx playwright screenshot --viewport-size "1280,900" --color-scheme dark --wait-for-timeout 6000 "${url}" "${out}"`;
    execSync(fallback, { stdio: 'inherit' });
  }
}
console.log('done');
