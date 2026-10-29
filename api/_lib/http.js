/* Helpers shared by the Vercel functions in /api. The leading underscore keeps this folder from being a public route. */
"use strict";

function sendJson(res, status, body, cacheControl, headers) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cacheControl || "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  for (const k of Object.keys(headers || {})) res.setHeader(k, headers[k]);
  res.end(JSON.stringify(body));
}

function allowGet(req, res) {
  if (req.method === "GET" || req.method === "HEAD") return true;
  res.setHeader("Allow", "GET, HEAD");
  sendJson(res, 405, { error: "method_not_allowed" });
  return false;
}

const timeout = ms => (typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(ms || 8000) : undefined);

/* Public errors carry a short code only; details go to the function logs (never a secret). */
function sendError(res, e, tag, cacheControl) {
  const code = e && e.code ? e.code : "unavailable";
  console.error("[" + tag + "]", code, (e && (e.detail || e.message)) || e);
  sendJson(res, (e && e.status) || 502, { error: code }, cacheControl || "public, s-maxage=10");
}

const fail = (status, code, detail) => Object.assign(new Error(code), { status, code, detail });

module.exports = { sendJson, allowGet, sendError, timeout, fail };
