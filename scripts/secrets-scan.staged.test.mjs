import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, symlinkSync, unlinkSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { stagedSnapshot, gitEnvironment } from './secrets-scan.staged.mjs';
const git=(root,args)=>{const r=spawnSync('git',args,{cwd:root,env:gitEnvironment(process.env),encoding:'utf8'});assert.equal(r.status,0,'synthetic Git setup failed');return r.stdout.trim()};
function fixture(fn){const root=mkdtempSync(join(tmpdir(),'snapshot-test-'));try{git(root,['init','-q']);git(root,['config','user.name','Synthetic']);git(root,['config','user.email','fixture@example.invalid']);writeFileSync(join(root,'original.txt'),'base\n');git(root,['add','--','original.txt']);git(root,['commit','-qm','synthetic baseline']);fn(root);}finally{rmSync(root,{recursive:true,force:true})}}
function unchanged(root,fn){const head=git(root,['rev-parse','HEAD']),index=readFileSync(join(root,'.git','index'));fn();assert.equal(git(root,['rev-parse','HEAD']),head);assert.deepEqual(readFileSync(join(root,'.git','index')),index)}
test('partial stage snapshot uses index bytes and leaves original worktree/index/HEAD untouched',()=>fixture(root=>{
 writeFileSync(join(root,'original.txt'),'index value\n');git(root,['add','--','original.txt']);writeFileSync(join(root,'original.txt'),'worktree value\n');unchanged(root,()=>{const s=stagedSnapshot(root);try{assert.equal(readFileSync(join(s.cwd,'original.txt'),'utf8'),'index value\n');assert.equal(git(s.cwd,['show',':original.txt']),'index value');assert.equal(git(s.cwd,['show','HEAD:original.txt']),'base');s.verify()}finally{s.cleanup()}});assert.equal(readFileSync(join(root,'original.txt'),'utf8'),'worktree value\n');
}));
test('rename, spaces and leading dash preserve target paths and baseline',()=>fixture(root=>{
 git(root,['mv','--','original.txt','- renamed file.txt']);const s=stagedSnapshot(root);try{assert.equal(s.targets,1);assert.equal(readFileSync(join(s.cwd,'- renamed file.txt'),'utf8'),'base\n');assert.equal(git(s.cwd,['diff','--cached','--name-status']),'R100\toriginal.txt\t- renamed file.txt')}finally{s.cleanup()}
}));
test('deletion-only staged set is empty',()=>fixture(root=>{git(root,['rm','--','original.txt']);const s=stagedSnapshot(root);try{assert.equal(s.targets,0)}finally{s.cleanup()}}));
test('binary staged bytes are unchanged even if worktree unreadable',()=>fixture(root=>{
 const bytes=Buffer.from([255,254,0,4,5]);writeFileSync(join(root,'raw.bin'),bytes);git(root,['add','--','raw.bin']);chmodSync(join(root,'raw.bin'),0);const s=stagedSnapshot(root);try{assert.deepEqual(readFileSync(join(s.cwd,'raw.bin')),bytes)}finally{s.cleanup();chmodSync(join(root,'raw.bin'),0o600)}
}));
test('symlink type change retains index mode but never follows target',()=>fixture(root=>{
 unlinkSync(join(root,'original.txt'));symlinkSync('nonexistent-outside',join(root,'original.txt'));git(root,['add','--','original.txt']);const s=stagedSnapshot(root);try{assert.match(git(s.cwd,['ls-files','--stage']),/^120000 /);assert.equal(readFileSync(join(s.cwd,'original.txt'),'utf8'),'nonexistent-outside')}finally{s.cleanup()}
}));
test('GIT environment injection is removed case-insensitively',()=>fixture(root=>{
 const s=stagedSnapshot(root,{...process.env,GIT_DIR:'/nonexistent',gIt_wOrK_tReE:'/nonexistent',GIT_INDEX_FILE:'/nonexistent'});try{s.verify();assert.equal(s.targets,0)}finally{s.cleanup()}
 assert.deepEqual(gitEnvironment({GIT_DIR:'x',git_config_count:'1',Path:'safe'}),{Path:'safe',GIT_OPTIONAL_LOCKS:'0'});
}));
test('source index change after snapshot is detected',()=>fixture(root=>{
 const s=stagedSnapshot(root);try{writeFileSync(join(root,'new.txt'),'changed');git(root,['add','--','new.txt']);assert.throws(()=>s.verify())}finally{s.cleanup()}
}));
test('unmerged index is rejected without modifying original state',()=>fixture(root=>{
 const oid=git(root,['rev-parse','HEAD:original.txt']);git(root,['update-index','--force-remove','--','original.txt']);const record=`100644 ${oid} 1\toriginal.txt\n100644 ${oid} 2\toriginal.txt\n`;const r=spawnSync('git',['update-index','--index-info'],{cwd:root,env:gitEnvironment(process.env),input:record,encoding:'utf8'});assert.equal(r.status,0);unchanged(root,()=>assert.throws(()=>stagedSnapshot(root),/unmerged/));
}));
test('missing staged blob is a coverage failure, not an empty success',()=>fixture(root=>{
 const oid='1'.repeat(40);git(root,['update-index','--add','--cacheinfo',`100644,${oid},missing.txt`]);unchanged(root,()=>assert.throws(()=>stagedSnapshot(root)));
}));
test('newline filenames fail closed instead of truncating target list',()=>fixture(root=>{
 writeFileSync(join(root,'line\nbreak.txt'),'synthetic');git(root,['add','--','line\nbreak.txt']);unchanged(root,()=>assert.throws(()=>stagedSnapshot(root),/unrepresentable/));
}));
