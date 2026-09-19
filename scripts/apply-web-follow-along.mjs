import { applyWebReview } from './apply-web-review.mjs';
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function applyManualFollowAlong(runtimeRoot) {
  const appPath = resolve(runtimeRoot, 'ui/app.js');
  let app = (await readFile(appPath, 'utf8')).replace(/\r\n/g, '\n');
  if (!app.includes('// CHANTCODE WEB MANUAL FOLLOW-ALONG')) {
    const replace = (before, after) => {
      if (app.split(before).length !== 2) throw new Error(`Web adaptation context changed: ${before.slice(0,65)}`);
      app = app.replace(before, after);
    };
    app = `import { mountManualFollowAlong } from './web-follow-along.js';\n${app}`;
    replace("function go(route, options = {}) {", "function go(route, options = {}) {\n  webFollowCleanup?.(); webFollowCleanup = null;");
    replace("function childRecite(group, list) {", "function childRecite(group, list) {\n  if (!IS_NATIVE_IOS) return startWebFollowAlong(list, group);");
    replace("  const facts = getRecitationFacts(mode);\n  const normalizedRunKind", "  const facts = getRecitationFacts(mode);\n  if (!IS_NATIVE_IOS) return startWebFollowAlong(facts, null);\n  const normalizedRunKind");
    replace("['recite', 'Recite Yourself', `child-recite-${group}`]", "['recite', IS_NATIVE_IOS ? 'Recite Yourself' : 'Listen & Repeat', `child-recite-${group}`]");
    replace("${label === 'Recite Yourself' ? ' data-mobile-label=\"Recite\"' : ''}", "${label === 'Recite Yourself' ? ' data-mobile-label=\"Recite\"' : label === 'Listen & Repeat' ? ' data-mobile-label=\"Repeat\"' : ''}");
    const helper = `\n// CHANTCODE WEB MANUAL FOLLOW-ALONG\nlet webFollowCleanup = null;\nfunction startWebFollowAlong(list, group) {\n  webFollowCleanup?.();\n  stopVoice(); session = { type: 'web-follow-along' };\n  shell((group ? lessonSteps('recite', group) : '') + '<div id="webFollowAlong"></div>', 'child', 'child', { focus: true });\n  webFollowCleanup = mountManualFollowAlong(document.querySelector('#webFollowAlong'), list, multiplicationFactAudioPath);\n}\nwindow.addEventListener('pagehide', () => { webFollowCleanup?.(); webFollowCleanup = null; });\n`;
    // Initialize cleanup before the app's startup can navigate.
    replace("const app = document.querySelector('#app');", helper + "\nconst app = document.querySelector('#app');");
    await writeFile(appPath, app);
  }
  for (const [source, dest] of [['manual-follow-along.js','web-follow-along.js'],['manual-follow-along.css','web-follow-along.css']]) await copyFile(resolve(projectRoot,'web-adaptations',source),resolve(runtimeRoot,'ui',dest));
  const indexPath = resolve(runtimeRoot,'index.html');
  let index = await readFile(indexPath,'utf8');
  if (!index.includes('/ui/web-follow-along.css')) {
    index=index.replace('</head>','  <link rel="stylesheet" href="/free-multiplication-app/ui/web-follow-along.css">\n</head>');
    await writeFile(indexPath,index);
  }
  await applyWebReview(runtimeRoot);
}
