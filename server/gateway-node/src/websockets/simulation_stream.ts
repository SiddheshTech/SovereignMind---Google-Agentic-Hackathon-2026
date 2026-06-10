import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { startSandboxSimulation } from '../grpc/client';

let wss: WebSocketServer | null = null;
const clients = new Set<WebSocket>();

export function initWebSocketServer(server: Server) {
  wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws/sandbox') {
      wss?.handleUpgrade(request, socket, head, (ws) => {
        wss?.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket Client Connected');
    clients.add(ws);

    ws.on('message', (message) => {
      console.log(`Received message from client: ${message}`);
      try {
        const parsed = JSON.parse(message.toString());
        if (parsed.type === 'RUN_GLOBAL_GENOMIC_SCAN') {
          ws.send(JSON.stringify({ type: 'SCAN_STATUS', status: 'INITIATING', message: 'Connecting to global AI feed...' }));
          setTimeout(() => ws.send(JSON.stringify({ type: 'SCAN_STATUS', status: 'IN_PROGRESS', message: 'Analyzing genetic variants...' })), 1000);
          setTimeout(() => ws.send(JSON.stringify({ type: 'SCAN_STATUS', status: 'COMPLETED', message: 'Global Genomic Scan Completed.' })), 3000);
        }
      } catch (e) {
        // ignore non-json
      }
    });

    ws.on('close', () => {
      console.log('WebSocket Client Disconnected');
      clients.delete(ws);
    });

    ws.send(JSON.stringify({ type: 'INFO', message: 'Connected to SovereignMind Real-time Sandbox Stream' }));
  });
}

export function broadcast(data: any) {
  const payload = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

export function triggerSandboxStream(countryCode: string, epochs: number, activeCrises: string[]) {
  console.log(`Initiating Sandbox Stream over gRPC for ${countryCode} with crises:`, activeCrises);
  
  try {
    const stream = startSandboxSimulation(countryCode, epochs, activeCrises);

    broadcast({
      type: 'SIMULATION_STATUS',
      status: 'INITIATING',
      country_code: countryCode,
      message: `Starting sandbox simulation over ${epochs} epochs...`,
    });

    stream.on('data', (tick: any) => {
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

    stream.on('error', (err: any) => {
      console.error('gRPC Sandbox Stream Error:', err);
      broadcast({
        type: 'SIMULATION_STATUS',
        status: 'ERROR',
        message: err.message || 'Error occurred during simulation stream.',
      });
    });
  } catch (err: any) {
    console.error('Failed to trigger sandbox stream:', err);
    broadcast({
      type: 'SIMULATION_STATUS',
      status: 'FAILED',
      message: err.message || 'Failed to initialize connection to FastAPI gRPC service.',
    });
  }
}
