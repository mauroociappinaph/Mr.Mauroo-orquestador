// V0 — WS relay with broadcast support for agent interaction events.
// Clients send { type: "broadcast", payload: ... } to relay to all peers.

const WebSocket = require("ws");

let counter = 0;
const clients = new Set();

/**
 * Broadcast a message to every connected client.
 * @param {unknown} data - object or string to send as JSON
 */
function broadcast(data) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

/**
 * Creates a WebSocket relay for local agent communication.
 * Upstream gateway integration is separate — this handles in-process relay.
 */
function createWsProxy() {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on("connection", (ws, req) => {
    const id = ++counter;
    clients.add(ws);
    const label = `ws#${id}`;
    console.info(`[${label}] connected from ${req.socket.remoteAddress} (${clients.size} total)`);

    ws.on("message", (data) => {
      console.info(`[${label}] rx: ${data}`);
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "broadcast") {
          broadcast(msg.payload);
          return;
        }
      } catch {
        // not JSON — fall through to echo
      }
      // V0 fallback: echo back as a simple relay
      ws.send(JSON.stringify({ type: "echo", payload: data.toString() }));
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.info(`[${label}] disconnected (${clients.size} remaining)`);
    });

    ws.on("error", (err) => {
      clients.delete(ws);
      console.error(`[${label}] error:`, err.message);
    });

    ws.send(JSON.stringify({ type: "connected", id }));
  });

  return wss;
}

module.exports = { createWsProxy, broadcast };
