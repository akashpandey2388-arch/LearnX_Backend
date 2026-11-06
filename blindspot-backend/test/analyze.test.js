const { test, before, after, mock } = require('node:test');
const assert = require('node:assert/strict');
const service = require('../services/geminiService');
const Cluster = require('../models/Cluster');

const analyze = mock.method(service, 'analyzeBlindspots', async () => 'Try one small action.');
const save = mock.method(Cluster.prototype, 'save', async function () { return this; });
// Exercise the actual middleware and routes, without external AI or database access.
const app = require('../app');
let server;
let baseUrl;

before(async () => {
    server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
    await new Promise(resolve => server.close(resolve));
    mock.restoreAll();
});

function submit(body, headers = { 'Content-Type': 'application/json' }) {
    return fetch(`${baseUrl}/api/analyze`, { method: 'POST', headers, body });
}

test('invalid insights return actionable JSON without calling AI or saving', async () => {
    const invalidBodies = [undefined, {}, { userData: '' }, { userData: ' \n\t ' },
        { userData: null }, { userData: false }, { userData: 42 },
        { userData: [] }, { userData: {} }];
    for (const body of invalidBodies) {
        const response = await submit(JSON.stringify(body));
        assert.equal(response.status, 400);
        assert.match((await response.json()).error, /non-empty text/i);
    }
    const response = await submit('userData=hello', { 'Content-Type': 'text/plain' });
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /non-empty text/i);
    assert.equal(analyze.mock.callCount(), 0);
    assert.equal(save.mock.callCount(), 0);
});

test('malformed and oversized JSON return actionable JSON errors', async () => {
    for (const [body, status, message] of [
        ['{"userData":', 400, /valid JSON/i],
        [JSON.stringify({ userData: 'a'.repeat(110 * 1024) }), 413, /too large/i]
    ]) {
        const response = await submit(body);
        assert.equal(response.status, status);
        assert.match(response.headers.get('content-type'), /application\/json/);
        assert.match((await response.json()).error, message);
    }
    assert.equal(analyze.mock.callCount(), 0);
    assert.equal(save.mock.callCount(), 0);
});

test('valid insight is trimmed, analyzed and saved with the existing response shape', async () => {
    const response = await submit(JSON.stringify({ userData: '  I keep postponing tasks. \n' }));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.success, true);
    assert.equal(body.analysis, 'Try one small action.');
    assert.match(body.savedId, /^[a-f0-9]{24}$/);
    assert.deepEqual(analyze.mock.calls[0].arguments, ['I keep postponing tasks.']);
    assert.equal(save.mock.calls[0].this.originalInput, 'I keep postponing tasks.');
    assert.equal(save.mock.calls[0].this.aiAnalysis, body.analysis);
});
