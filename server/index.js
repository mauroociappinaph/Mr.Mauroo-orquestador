// V0 — minimal Next.js server, no gateway, no HTTPS, no access gate.
// For development, `next dev` is sufficient.  This file is the production entry.

const http = require("node:http");
const next = require("next");
const { createWsProxy } = require("./ws-proxy");

const PORT = Number(process.env.PORT?.trim()) || 3000;
const HOST = process.env.HOST || "127.0.0.1";
const DEV = process.argv.includes("--dev");

async function main() {
  const app = next({ dev: DEV, hostname: HOST, port: PORT });
  const handle = app.getRequestHandler();

  const wss = createWsProxy();

  await app.prepare();

  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  server.on("upgrade", (req, socket, head) => {
    // Let the ws-proxy handle WS upgrades; forward everything else to Next.js
    if (req.url?.startsWith("/ws")) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else {
      const handleUpgrade = app.getUpgradeHandler();
      handleUpgrade(req, socket, head);
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, HOST, () => {
      server.off("error", reject);
      resolve();
    });
  });

  console.info(`Server ready on http://${HOST}:${PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
