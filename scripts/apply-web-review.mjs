import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function applyWebReview(runtime) {
  await copyFile(resolve(root,'web-adaptations/web-support.js'),resolve(runtime,'ui/web-support.js'));
  const appPath=resolve(runtime,'ui/app.js');let app=(await readFile(appPath,'utf8')).replace(/\r\n/g,'\n');
  if(!app.includes('// CHANTCODE WEB REVIEW')){
    function replace(a,b){if(!app.includes(a))throw Error('Review context changed: '+a);app=app.replace(a,b)}
    app="// CHANTCODE WEB REVIEW\nimport { readPractice } from './web-support.js';\n"+app;
    replace("const passedAnswerCount = groupFacts.filter((fact) => progress.spokenAnswerPassed?.[`${fact.left}x${fact.right}`] === true).length;","const passedAnswerCount = readPractice(groupFacts).worked;");
    replace('Apple Speech provides forgiving follow-along practice feedback. A parent separately evaluates and confirms the final independent recitation.','Web follow-along records chants worked through manually, not speech recognition or mastery. A parent separately confirms independent recitation.');
    replace('<span>Follow-Along</span><b>${passedAnswerCount} / ${groupFacts.length} completed</b>','<span>Listen &amp; Repeat</span><b>${passedAnswerCount} / ${groupFacts.length} worked through</b>');
    app=app.replaceAll('chantcode-welcome.png','chantcode-welcome.webp');
    await writeFile(appPath,app);
  }
  const pp=resolve(runtime,'common/progress.js');let progress=(await readFile(pp,'utf8')).replace(/\r\n/g,'\n');
  if(!progress.includes('chantcode-storage-error')){
    const old='globalThis.localStorage?.setItem(STORE, JSON.stringify(progress));';
    if(!progress.includes(old))throw Error('Progress persistence context changed');
    progress=progress.replace(old,'globalThis.localStorage.setItem(STORE, JSON.stringify(progress));');
    const comment='// 存储不可用时继续使用内存中的规范化进度。';
    if(!progress.includes(comment))throw Error('Progress error context changed');
    progress=progress.replace(comment,comment+"\n    globalThis.dispatchEvent?.(new Event('chantcode-storage-error'));");
    await writeFile(pp,progress);
  }
  // Keep fresh imports reproducible and invalidate cached browser adaptations.
  await copyFile(resolve(root,'web-adaptations/assets/chantcode-welcome.webp'),resolve(runtime,'ui/assets/brand/chantcode-welcome.webp'));
  let updated = await readFile(appPath,'utf8');
  updated=updated.replace("'./web-follow-along.js'", "'./web-follow-along.js?v=20260919-review1'").replace("'../common/progress.js'", "'../common/progress.js?v=20260919-review1'");
  await writeFile(appPath,updated);
  let reset = await readFile(pp,'utf8');
  if(!reset.includes("removeItem('chantcode.web-practice.v1')")) {
    reset=reset.replace('export function resetLearningProgress(current) {', "export function resetLearningProgress(current) {\n  try { globalThis.localStorage.removeItem('chantcode.web-practice.v1'); } catch { globalThis.dispatchEvent?.(new Event('chantcode-storage-error')); }");
    await writeFile(pp,reset);
  }
  const indexPath=resolve(runtime,'index.html');let html=await readFile(indexPath,'utf8');
  html=html.replace(/ui\/app\.js\?v=[^"]+/, 'ui/app.js?v=20260919-review1').replace(/ui\/web-follow-along\.css(?:\?v=[^"]+)?/, 'ui/web-follow-along.css?v=20260919-review1');
  html=html.replaceAll('chantcode-welcome.png','chantcode-welcome.webp');
  await writeFile(indexPath,html);

}
