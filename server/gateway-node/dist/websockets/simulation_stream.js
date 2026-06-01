"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocketServer = initWebSocketServer;
exports.broadcast = broadcast;
exports.triggerSandboxStream = triggerSandboxStream;
const ws_1 = require("ws");
const client_1 = require("../grpc/client");
let wss = null;
const clients = new Set();
function initWebSocketServer(server) {
    wss = new ws_1.WebSocketServer({ noServer: true });
    server.on('upgrade', (request, socket, head) => {
        if (request.url === '/ws/sandbox') {
            wss?.handleUpgrade(request, socket, head, (ws) => {
                wss?.emit('connection', ws, request);
            });
        }
    });
    wss.on('connection', (ws) => {
        console.log('WebSocket Client Connected');
        clients.add(ws);
        ws.on('message', (message) => {
            console.log(`Received message from client: ${message}`);
            // Clients could push manual stress interventions here
        });
        ws.on('close', () => {
            console.log('WebSocket Client Disconnected');
            clients.delete(ws);
        });
        ws.send(JSON.stringify({ type: 'INFO', message: 'Connected to SovereignMind Real-time Sandbox Stream' }));
    });
}
function broadcast(data) {
    const payload = JSON.stringify(data);
    for (const client of clients) {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(payload);
        }
    }
}
function triggerSandboxStream(countryCode, epochs, activeCrises) {
    console.log(`Initiating Sandbox Stream over gRPC for ${countryCode} with crises:`, activeCrises);
    try {
        const stream = (0, client_1.startSandboxSimulation)(countryCode, epochs, activeCrises);
        broadcast({
            type: 'SIMULATION_STATUS',
            status: 'INITIATING',
            country_code: countryCode,
            message: `Starting sandbox simulation over ${epochs} epochs...`,
        });
        stream.on('data', (tick) => {
            console.log(`Received sandbox tick epoch ${tick.epoch} from FastAPI gRPC server`);
            broadcast({
                type: 'SIMULATION_TICK',
                data: tick,
            });
        });
        stream.on('end', () => {
            console.log('Sandbox gRPC stream ended');
            broadcast({
                type: 'SIMULATION_STATUS',
                status: 'COMPLETED',
                message: 'Sandbox stress test successfully finalized.',
            });
        });
        stream.on('error', (err) => {
            console.error('gRPC Sandbox Stream Error:', err);
            broadcast({
                type: 'SIMULATION_STATUS',
                status: 'ERROR',
                message: err.message || 'Error occurred during simulation stream.',
            });
        });
    }
    catch (err) {
        console.error('Failed to trigger sandbox stream:', err);
        broadcast({
            type: 'SIMULATION_STATUS',
            status: 'FAILED',
            message: err.message || 'Failed to initialize connection to FastAPI gRPC service.',
        });
    }
}
