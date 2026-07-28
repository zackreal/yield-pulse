import { WebSocketServer, WebSocket } from 'ws';
import Redis from 'ioredis';
import { createServer } from 'http';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const WS_PORT = parseInt(process.env.WS_PORT || '3001', 10);

const redisSubscriber = new Redis(REDIS_URL);
const server = createServer();
const wss = new WebSocketServer({ server });

// Track connected clients for broadcasting
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established.');
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
    console.log('WebSocket connection closed.');
  });
});

// Subscribe to the YieldPulse event channel
const CHANNEL_NAME = 'yieldpulse_events';

redisSubscriber.subscribe(CHANNEL_NAME, (err, count) => {
  if (err) {
    console.error('Failed to subscribe to Redis channel:', err);
    return;
  }
  console.log(`Subscribed successfully to ${count} channels (listening on ${CHANNEL_NAME}).`);
});

// Broadcast messages to all connected WS clients when a message is received from Redis
redisSubscriber.on('message', (channel, message) => {
  if (channel === CHANNEL_NAME) {
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
});

server.listen(WS_PORT, () => {
  console.log(`YieldPulse Custom WebSocket Server running on ws://localhost:${WS_PORT}`);
  console.log(`Redis Pub/Sub connected at ${REDIS_URL}`);
});
