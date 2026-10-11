// The tip calculator that the hero demo "writes". This exact code is what runs
// in the preview iframe, so the demo is never fake.

export interface DemoFile {
  name: string;
  path: string;
  content: string;
}

export const APP_ROOT = '/home/user/app';
export const PROMPT_V1 = 'A tip calculator with a split-the-bill slider';
export const PROMPT_V2 = 'Add dark mode and round the total up';

const INDEX_V1 = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tip Calculator</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<main class="card">
  <h1>Tip Calculator</h1>
  <label>Bill
    <input id="bill" type="number" value="86.40" step="0.01" min="0">
  </label>
  <label>Tip <output id="tipOut">18%</output>
    <input id="tip" type="range" min="0" max="30" value="18">
  </label>
  <label>Split between <output id="splitOut">2</output>
    <input id="split" type="range" min="1" max="12" value="2">
  </label>
  <div class="total">
    <span>Each pays</span>
    <strong id="each">$50.98</strong>
  </div>
</main>
<script src="app.js"></script>
</body>
</html>
`;

const STYLES_V1 = `:root {
  --bg: #f4f1ea;
  --card: #ffffff;
  --ink: #1b1b1b;
  --line: #e6e1d6;
  --accent: #f5a524;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--bg);
  color: var(--ink);
  font: 16px/1.4 system-ui, sans-serif;
}
.card {
  width: min(360px, 92vw);
  padding: 24px;
  border-radius: 16px;
  background: var(--card);
  box-shadow: 0 12px 40px rgba(0, 0, 0, .12);
}
h1 { margin: 0 0 16px; font-size: 22px; }
label { display: block; margin: 14px 0; font-weight: 600; }
input { width: 100%; margin-top: 6px; accent-color: var(--accent); }
input[type=number] {
  padding: 10px;
  font-size: 18px;
  color: inherit;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 8px;
}
output { float: right; color: var(--accent); }
.total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}
.total strong { font-size: 32px; }
`;

const APP_V1 = `const bill = document.getElementById('bill');
const tip = document.getElementById('tip');
const split = document.getElementById('split');
const tipOut = document.getElementById('tipOut');
const splitOut = document.getElementById('splitOut');
const each = document.getElementById('each');

function update() {
  const amount = Number(bill.value) || 0;
  const total = amount * (1 + tip.value / 100);
  const share = total / split.value;
  tipOut.textContent = tip.value + '%';
  splitOut.textContent = split.value;
  each.textContent = '$' + share.toFixed(2);
}

[bill, tip, split].forEach(el => el.addEventListener('input', update));
update();
`;

// Version 2: dark mode + round the total up.
const INDEX_V2 = INDEX_V1.replace('<body>', '<body class="dark">').replace(
  '  <h1>Tip Calculator</h1>',
  `  <h1>Tip Calculator</h1>
  <button id="theme" type="button">Light mode</button>`,
);

const DARK_BLOCK = `body.dark {
  --bg: #121212;
  --card: #1c1c1c;
  --ink: #f2f2f2;
  --line: #2e2e2e;
}
#theme {
  float: right;
  margin-top: -40px;
  padding: 6px 10px;
  font: inherit;
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 999px;
}
`;

const STYLES_V2 = STYLES_V1.replace('* { box-sizing: border-box; }', `${DARK_BLOCK}* { box-sizing: border-box; }`);

const APP_V2 = APP_V1.replace(
  "  each.textContent = '$' + share.toFixed(2);",
  "  each.textContent = '$' + Math.ceil(share);",
).replace(
  'update();\n',
  `update();

const theme = document.getElementById('theme');
theme.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  theme.textContent = dark ? 'Light mode' : 'Dark mode';
});
`,
);

const mk = (name: string, content: string): DemoFile => ({ name, path: `${APP_ROOT}/${name}`, content });

export const FILES_V1: DemoFile[] = [mk('index.html', INDEX_V1), mk('styles.css', STYLES_V1), mk('app.js', APP_V1)];
export const FILES_V2: DemoFile[] = [mk('index.html', INDEX_V2), mk('styles.css', STYLES_V2), mk('app.js', APP_V2)];

/** Inline the css/js so the whole app runs from a single srcDoc. */
export function buildSrcDoc(files: DemoFile[]): string {
  const html = files.find((f) => f.name === 'index.html')?.content;
  if (!html) return '';
  const css = files.find((f) => f.name === 'styles.css')?.content ?? '';
  const js = files.find((f) => f.name === 'app.js')?.content ?? '';
  return html
    .replace('<link rel="stylesheet" href="styles.css">', `<style>${css}</style>`)
    .replace('<script src="app.js"></script>', `<script>${js}</script>`);
}

export type DiffLineType = 'ctx' | 'add' | 'del';
export interface DiffLine { type: DiffLineType; text: string }
export interface DiffHunk { file: string; lines: DiffLine[] }

export const DIFF_HUNKS: DiffHunk[] = [
  {
    file: 'styles.css',
    lines: [
      { type: 'ctx', text: '  --accent: #f5a524;' },
      { type: 'ctx', text: '}' },
      ...DARK_BLOCK.trimEnd().split('\n').map((text) => ({ type: 'add' as const, text })),
      { type: 'ctx', text: '* { box-sizing: border-box; }' },
    ],
  },
  {
    file: 'app.js',
    lines: [
      { type: 'ctx', text: '  splitOut.textContent = split.value;' },
      { type: 'del', text: "  each.textContent = '$' + share.toFixed(2);" },
      { type: 'add', text: "  each.textContent = '$' + Math.ceil(share);" },
      { type: 'ctx', text: '}' },
      { type: 'ctx', text: '' },
      { type: 'ctx', text: 'update();' },
      { type: 'add', text: '' },
      { type: 'add', text: "const theme = document.getElementById('theme');" },
      { type: 'add', text: "theme.addEventListener('click', () => {" },
      { type: 'add', text: "  const dark = document.body.classList.toggle('dark');" },
      { type: 'add', text: "  theme.textContent = dark ? 'Light mode' : 'Dark mode';" },
      { type: 'add', text: '});' },
    ],
  },
];

export const DIFF_TOTAL_LINES = DIFF_HUNKS.reduce((n, h) => n + h.lines.length, 0);

export interface DemoVersion {
  id: string;
  prompt: string;
  files: DemoFile[];
  minutesAgo: number;
}

export const VERSIONS: DemoVersion[] = [
  { id: 'v2', prompt: PROMPT_V2, files: FILES_V2, minutesAgo: 6 },
  { id: 'v1', prompt: PROMPT_V1, files: FILES_V1, minutesAgo: 14 },
];
