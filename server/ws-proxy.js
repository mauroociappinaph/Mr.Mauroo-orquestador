// V0 stub — minimal WS relay, no gateway auth
// Placeholder for local agent communication channel.

const WebSocket = require("ws");

let counter = 0;

/**
 * Creates a basic WebSocket relay for local agent communication.
 * In V0 this is a no-op stub; agents communicate via direct in-process calls.
 * Future versions will relay messages between Next.js server and external agent processes.
 */
function createWsProxy() {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on("connection", (ws, req) => {
    const id = ++counter;
    const label = `ws#${id}`;
    console.info(`[${label}] connected from ${req.socket.remoteAddress}`);

    ws.on("message", (data) => {
      console.info(`[${label}] rx: ${data}`);
      // V0: echo back as a simple relay
      ws.send(JSON.stringify({ type: "echo", payload: data.toString() }));
    });

    ws.on("close", () => {
      console.info(`[${label}] disconnected`);
    });

    ws.on("error", (err) => {
      console.error(`[${label}] error:`, err.message);
    });

    ws.send(JSON.stringify({ type: "connected", id }));
  });

  return wss;
}

module.exports = { createWsProxy };
