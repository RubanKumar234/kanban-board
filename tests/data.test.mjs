import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readTasks, validateTask, STORAGE_KEY } from '../src/taskData.js';
import { columnCoordinates } from '../src/keyboardCoordinates.js';
const task = { id: 'a', title: 'Task', description: '', priority: 'High', status: 'todo' };
function storage(raw) {
  const data = new Map(raw === undefined ? [] : [[STORAGE_KEY, raw]]);
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}
test('missing data uses defaults, empty saved board stays empty', () => {
  assert.deepEqual(readTasks(storage(), [task]).tasks, [task]);
  assert.deepEqual(readTasks(storage('[]'), [task]).tasks, []);
});
test('malformed and non-array data is backed up before defaults are used', () => {
  for (const raw of ['{', 'null', '{}']) {
    const s = storage(raw);
    assert.deepEqual(readTasks(s, [task]).tasks, [task]);
    assert.equal(s.getItem(STORAGE_KEY + '-recovery'), raw);
  }
});
test('invalid, duplicate, and reserved IDs are removed while valid records survive', () => {
  const raw = JSON.stringify([task, null, task, {...task, id:'done'}, {...task,id:'b',priority:'urgent'}]);
  const s = storage(raw);
  assert.deepEqual(readTasks(s, []).tasks, [task]);
  assert.equal(s.getItem(STORAGE_KEY + '-recovery'), raw);
});
test('all fields validated and unknown fields discarded', () => {
  for (const data of [{title:' '},{title:1},{description:null},{status:'invalid'},{id:''},{title:'x'.repeat(101)}])
    assert.equal(validateTask({...task,...data}), null);
  assert.deepEqual(validateTask({...task,extra:true}),task);
});
test('failed recovery blocks destructive overwrite', () => {
  const s = { getItem: () => '{', setItem: () => { throw Error('quota'); } };
  assert.equal(readTasks(s,[task]).blocked,true);
});
test('keyboard moves between columns in either layout and respects boundaries', () => {
  for (const vertical of [false,true]) {
    const target = {left:vertical ? 0 : 400,top:vertical ? 400 : 0,width:300,height:300};
    const args = {currentCoordinates:{x:0,y:0},context:{active:{data:{current:{status:'todo'}}},over:{id:'todo'},collisionRect:{left:0,top:0,width:100,height:100},droppableRects:new Map([['in-progress',target]])}};
    const result = columnCoordinates({code:vertical?'ArrowDown':'ArrowRight',preventDefault(){}},args);
    assert.deepEqual(result,{x:target.left+100,y:target.top+100});
    assert.equal(columnCoordinates({code:'ArrowLeft',preventDefault(){}},args),undefined);
  }
});
