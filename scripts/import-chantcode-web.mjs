import { readFile, writeFile, mkdir, readdir, cp, stat } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { applyManualFollowAlong } from './apply-web-follow-along.mjs';

// Copies an existing browser runtime. Never invokes a compiler, package manager, or native build.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv[2]) throw new Error('Usage: node scripts/import-chantcode-web.mjs <source-directory> [--replace]');
const sourceRoot = resolve(process.argv[2]);
const prefix = '/free-multiplication-app';
const destination = resolve(root, 'public', prefix.slice(1));
const exists = await stat(destination).then(() => true, () => false);
if (exists && !process.argv.includes('--replace')) throw new Error('Use --replace to back up and replace the existing website copy.');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const stage = resolve(root, '.cache', `chantcode-prebuilt-${stamp}`);
const reportDirectory = resolve(root, '.mcp-backups', stamp);
const manifest = [];
const digest = data => createHash('sha256').update(data).digest('hex');
const allowed = new Set(['.js', '.css', '.html', '.wav', '.mp3', '.m4a', '.mp4', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.woff', '.woff2']);
const textTypes = new Set(['.js', '.css', '.html']);
function rebase(text) {
  return text.replace(/(["'`(])\/(ui|audio|common|game)(?=\/)/g, `$1${prefix}/$2`)
    .replaceAll('/chantcode-complete-groups-overview.png', `${prefix}/chantcode-complete-groups-overview.png`);
}
async function copyFile(path) {
  const data = await readFile(resolve(sourceRoot, path));
  manifest.push({ path, sha256: digest(data), size: data.length });
  const dest = resolve(stage, path);
  await mkdir(dirname(dest), { recursive: true });
  let output = textTypes.has(extname(path)) ? rebase(data.toString('utf8')) : data;
  if (extname(path) === '.html' && !output.includes('name="robots"')) output = output.replace('<head>', '<head>\n<meta name="robots" content="noindex, nofollow">');
  await writeFile(dest, output);
}
async function copyTree(path) {
  for (const entry of await readdir(resolve(sourceRoot, path), { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'source', 'dist', 'build'].includes(entry.name)) continue;
    const p = `${path}/${entry.name}`;
    if (entry.isDirectory()) await copyTree(p);
    else if (entry.isFile() && allowed.has(extname(entry.name)) && !/\.test\./.test(entry.name)) await copyFile(p);
  }
}
await readFile(resolve(sourceRoot, 'game/runtime/index.html')); // Require the supplied prebuilt game.
await mkdir(stage, { recursive: true });
await copyFile('index.html');
await copyFile('chantcode-complete-groups-overview.png');
for (const folder of ['ui', 'common', 'audio', 'game/assets', 'game/runtime']) await copyTree(folder);
if (!(await readFile(resolve(stage, 'ui/app.js'), 'utf8')).includes('const FREE_FULL_ACCESS = true;')) throw new Error('Expected the free-access version.');
if (!(await readFile(resolve(stage, 'ui/referral-config.js'), 'utf8')).includes('REFERRALS_ENABLED = false')) throw new Error('Review enabled purchase/referral configuration before importing.');
await applyManualFollowAlong(stage);
for (const file of manifest) if (digest(await readFile(resolve(sourceRoot, file.path))) !== file.sha256) throw new Error(`Original changed during import: ${file.path}`);
await mkdir(reportDirectory, { recursive: true });
if (exists) await cp(destination, resolve(reportDirectory, 'previous-app'), { recursive: true });
// OneDrive can deny directory renames. Copy after staging and backing up; preserve unreferenced old files.
await cp(stage, destination, { recursive: true, force: true });
await writeFile(resolve(reportDirectory, 'app-import-manifest.json'), JSON.stringify({ sourceRoot, destination, compiled: false, originalFilesUnchanged: true, files: manifest }, null, 2));
console.log(JSON.stringify({ importedFiles: manifest.length, sourceRoot, compiled: false, sourceUnchanged: true, backup: reportDirectory }, null, 2));
