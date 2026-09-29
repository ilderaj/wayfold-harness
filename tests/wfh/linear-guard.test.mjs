import test from 'node:test';
import assert from 'node:assert/strict';
import {guard} from '../../wfh/skills/linear-work-control/scripts/guard.mjs';
const now = Date.now();
const identity = {workspaceId:'dcaa7009-b84b-49ba-ab84-de1f0c46ba51',projectId:'fbabc28b-ff1b-4e06-9786-058dbc3ed36d',issueId:'454e02a0-89de-4a17-b06b-b18a4842986e',taskId:'demo',taskMarker:'harness-task: wfh/demo',productKey:'wfh'};
const fixture = () => ({authorized:true,coverageComplete:true,observedAt:new Date(now).toISOString(),expected:{...identity},observed:{...identity}});
test('exact target passes; shared team/title cannot substitute for a Project UUID',()=>{
  assert.equal(guard(fixture(),now).ok,true);
  const x=fixture();x.observed.projectId=x.observed.issueId;
  assert.equal(guard(x,now).ok,false);
});
test('missing coverage, stale evidence, credentials and identity rewriting fail closed',()=>{
  for (const edit of [x=>x.coverageComplete=false,x=>x.authorized=false,x=>x.observedAt='2000-01-01',x=>x.observed.productKey='swf',x=>x.secret='fixture']) {
    const x=fixture();edit(x);assert.equal(guard(x,now).ok,false);
  }
  const x=fixture();x.expected.productKey=x.observed.productKey='swf';
  assert.equal(guard(x,now).ok,true);assert.equal(x.observed.productKey,'swf');
});
