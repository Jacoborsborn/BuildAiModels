const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;

// Keep this aligned with `vercel.json` rewrites.
const REWRITES = new Map([
  ["/", "/BAMLanding.html"],
  ["/studio", "/Content Generation/BAMStudio.html"],
  ["/auth", "/BAMAuth.html"],
  ["/account", "/BAMAccount.html"],
  ["/legal", "/BAMLegal.html"],
  ["/course", "/Course.html"],
]);

const CONTENT_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"],
]);

function safeResolve(rootDir, requestPathname) {
  const decoded = decodeURIComponent(requestPathname);
  const cleaned = decoded.split("?")[0].split("#")[0];
  const withoutLeadingSlash = cleaned.replace(/^\/+/, "");
  const resolved = path.resolve(rootDir, withoutLeadingSlash);
  const normalizedRoot = path.resolve(rootDir) + path.sep;
  if (!resolved.startsWith(normalizedRoot)) return null;
  return resolved;
}

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8", ...headers });
  res.end(body);
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method !== "GET" && req.method !== "HEAD") {
      return send(res, 405, "Method Not Allowed");
    }

    let pathname = url.pathname;
    if (REWRITES.has(pathname)) pathname = REWRITES.get(pathname);

    // If they request a directory, serve index.html (if present).
    if (pathname.endsWith("/")) pathname = pathname + "index.html";

    const absolutePath = safeResolve(ROOT, pathname);
    if (!absolutePath) return send(res, 400, "Bad Request");

    fs.stat(absolutePath, (err, stat) => {
      if (err || !stat.isFile()) {
        return send(res, 404, `Not Found: ${pathname}`);
      }

      const ext = path.extname(absolutePath).toLowerCase();
      const contentType = CONTENT_TYPES.get(ext) || "application/octet-stream";

      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      });

      if (req.method === "HEAD") return res.end();

      const stream = fs.createReadStream(absolutePath);
      stream.on("error", () => send(res, 500, "Server Error"));
      stream.pipe(res);
    });
  } catch {
    send(res, 400, "Bad Request");
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`BAM running at http://localhost:${PORT}`);
});

