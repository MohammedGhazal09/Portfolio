import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = resolve(__dirname, "dist");
const port = Number(process.env.PORT) || 4173;

const contentTypes = {
  ".br": "application/octet-stream",
  ".css": "text/css; charset=utf-8",
  ".gz": "application/gzip",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function resolveStaticPath(urlPath) {
  const safePath = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.(\/|\\|$))+/, "");
  const requestedPath = resolve(distDir, `.${sep}${safePath}`);
  if (!requestedPath.startsWith(`${distDir}${sep}`) && requestedPath !== distDir) {
    return null;
  }
  return requestedPath;
}

function sendFile(filePath, response) {
  const extension = extname(filePath);
  response.writeHead(200, {
    "Content-Type": contentTypes[extension] ?? "application/octet-stream",
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
  });
  createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  if (!request.url) {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const staticPath = resolveStaticPath(request.url);
  if (!staticPath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const filePath =
    existsSync(staticPath) && statSync(staticPath).isFile() ? staticPath : join(distDir, "index.html");

  if (!existsSync(filePath)) {
    response.writeHead(500);
    response.end("Build output not found. Run npm run build before npm start.");
    return;
  }

  sendFile(filePath, response);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on ${port}`);
});
