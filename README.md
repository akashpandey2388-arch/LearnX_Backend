# LearnX Backend

Express API for submitting an insight for blindspot analysis, retrieving analysis
history, and loading reflection questions. This repository does not include a UI.

## Run

From `blindspot-backend`, run `npm ci`, then `npm start` (port 5000 by default,
overridable with `PORT`). Configure `MONGODB_URI` and `GEMINI_API_KEY` in a local
`.env` for database-backed requests and real AI analysis. Never commit this file.
The managed preview uses port 3000.

## Test

Run `cd blindspot-backend && npm test` with Node.js 22 or newer. HTTP regression
tests stub AI and database calls; they require no credentials or external services.

## Analysis input and errors

`POST /api/analyze` accepts JSON with a non-empty string `userData`. Leading and
trailing whitespace is removed before analysis and storage. Invalid input returns
HTTP 400 with an actionable `{ "error": "..." }` response, without calling the AI
or saving history. Malformed JSON also returns JSON with HTTP 400; bodies over
Express's existing 100 KB limit return JSON with HTTP 413. Successful responses
remain `{ "success": true, "analysis": "...", "savedId": "..." }`.
