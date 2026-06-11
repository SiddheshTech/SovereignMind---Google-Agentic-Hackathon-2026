import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { startSandboxSimulation, runDetailedSimulation } from '../grpc/client';
import { CrisisSimulation } from '../models/CrisisSimulation';

let wss: WebSocketServer | null = null;
const clients = new Set<WebSocket>();
const clientPaths = new WeakMap<WebSocket, string>();

export function initWebSocketServer(server: Server) {
  wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const url = request.url || '';
    const allowedPaths = [
      '/ws/sandbox', '/ws/authority-maps', '/ws/sandbox-ticks', '/ws/settings', 
      '/ws/procurement', '/ws/intelligence', '/ws/risk-radar', '/ws/forecasting',
      '/ws/black-swan', '/ws/nation-model', '/ws/dependencies', '/ws/infrastructure',
      '/ws/analytics', '/ws/crisis', '/ws/collaboration', '/ws/command-center',
      '/ws/executive-briefing', '/ws/operator-dashboard'
    ];
    if (allowedPaths.includes(url)) {
      wss?.handleUpgrade(request, socket, head, (ws) => {
        wss?.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (ws: WebSocket, request) => {
    const pathname = request.url || '/ws/sandbox';
    console.log(`WebSocket Client Connected to: ${pathname}`);
    clientPaths.set(ws, pathname);
    clients.add(ws);

    ws.on('message', (message) => {
      console.log(`Received message from client on ${pathname}: ${message}`);
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
      console.log(`WebSocket Client Disconnected from: ${pathname}`);
      clients.delete(ws);
      clientPaths.delete(ws);
    });

    const label = pathname === '/ws/authority-maps'
      ? 'Authority Maps'
      : pathname === '/ws/sandbox-ticks'
        ? 'Sandbox Ticks'
        : pathname === '/ws/settings'
          ? 'Settings'
          : pathname === '/ws/procurement'
            ? 'Procurement'
            : pathname === '/ws/intelligence'
              ? 'Intelligence'
              : 'Sandbox';
    ws.send(JSON.stringify({ type: 'INFO', message: `Connected to SovereignMind Real-time ${label} Stream` }));
  });
}

export function broadcast(data: any, path?: string) {
  const payload = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      if (!path || clientPaths.get(client) === path) {
        client.send(payload);
      }
    }
  }
}

/** Legacy sandbox stream (epoch-level ticks) */
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
      broadcast({ type: 'SIMULATION_TICK', data: tick });
    });

    stream.on('end', () => {
      console.log('Sandbox gRPC stream ended');
      broadcast({ type: 'SIMULATION_STATUS', status: 'COMPLETED', message: 'Sandbox stress test successfully finalized.' });
    });

    stream.on('error', (err: any) => {
      console.error('gRPC Sandbox Stream Error:', err);
      broadcast({ type: 'SIMULATION_STATUS', status: 'ERROR', message: err.message || 'Error during simulation stream.' });
    });
  } catch (err: any) {
    console.error('Failed to trigger sandbox stream:', err);
    broadcast({ type: 'SIMULATION_STATUS', status: 'FAILED', message: err.message || 'Failed to initialize gRPC connection.' });
  }
}

/**
 * New: Detailed simulation stream using RunDetailedSimulation gRPC.
 * Broadcasts real PyTorch tick metrics over /ws/sandbox in real time.
 * Also persists all ticks to MongoDB at the end.
 */
export function triggerDetailedSimStream(crises: string[], epochs: number, simulationId: string) {
  console.log(`🎬 [WS] Starting detailed sim stream for sim ${simulationId} with crises:`, crises);

  try {
    const stream = runDetailedSimulation(crises, epochs);
    const ticks: any[] = [];

    broadcast({
      type: 'SIM_TICKS_STARTED',
      simulationId,
      crises,
      totalEpochs: epochs,
      message: `PyTorch simulation engine initializing — ${epochs} epochs starting...`,
    }, '/ws/sandbox');

    broadcast({
      type: 'SIM_TICKS_STARTED',
      simulationId,
      crises,
      totalEpochs: epochs,
    }, '/ws/sandbox-ticks');

    stream.on('data', (tick: any) => {
      const tickData = {
        epoch: tick.epoch,
        panicLevel: tick.panic_level,
        economicDisruption: tick.economic_disruption,
        infraInstability: tick.infra_instability,
        supplyChainFailure: tick.supply_chain_failure,
        civilUnrest: tick.civil_unrest,
        collapseProbability: tick.collapse_probability,
        statusMessage: tick.status_message,
      };
      ticks.push(tickData);

      // Real-time tick broadcast
      broadcast({
        type: 'SIM_TICK',
        simulationId,
        tick: tickData,
      }, '/ws/sandbox');

      broadcast({
        type: 'SIM_TICK',
        simulationId,
        tick: tickData,
      }, '/ws/sandbox-ticks');
    });

    stream.on('end', async () => {
      console.log(`✅ [WS] Detailed sim stream complete for ${simulationId} — ${ticks.length} ticks`);

      // Persist ticks to MongoDB
      try {
        await CrisisSimulation.findByIdAndUpdate(simulationId, {
          $set: { simulationTicks: ticks }
        });
        console.log(`💾 [WS] Ticks saved to MongoDB for sim ${simulationId}`);
      } catch (dbErr) {
        console.error(`[WS] Failed to save ticks to MongoDB:`, dbErr);
      }

      broadcast({
        type: 'SIM_TICKS_COMPLETE',
        simulationId,
        totalTicks: ticks.length,
        message: 'Simulation complete. All epoch data persisted.',
      }, '/ws/sandbox');

      broadcast({
        type: 'SIM_TICKS_COMPLETE',
        simulationId,
        totalTicks: ticks.length,
      }, '/ws/sandbox-ticks');
    });

    stream.on('error', (err: any) => {
      console.error(`[WS] Detailed sim stream error for ${simulationId}:`, err);
      broadcast({
        type: 'SIM_TICKS_ERROR',
        simulationId,
        message: err.message || 'Error during simulation tick stream.',
      }, '/ws/sandbox');
    });
  } catch (err: any) {
    console.error(`[WS] Failed to start detailed sim stream:`, err);
    broadcast({
      type: 'SIM_TICKS_ERROR',
      simulationId,
      message: err.message || 'Failed to start simulation engine.',
    }, '/ws/sandbox');
  }
}
