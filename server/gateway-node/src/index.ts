import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { initWebSocketServer } from './websockets/simulation_stream';
import authRoutes from './routes/auth';
import { connectMongoDB } from './config/mongodb';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startGateway() {
  // Connect to MongoDB first
  await connectMongoDB();

  const app = express();
  const httpServer = createServer(app);

  // Setup WebSockets
  initWebSocketServer(httpServer);

  // Setup Apollo GraphQL Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  }));
  app.use(express.json());

  // Mount Apollo middleware
  app.use(
    '/graphql',
    expressMiddleware(apolloServer)
  );

  // Mount Auth routes
  app.use('/api/auth', authRoutes);

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'SovereignMind Gateway Node', database: 'MongoDB Connected' });
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 SovereignMind API Gateway active at:`);
    console.log(`   - HTTP/GraphQL: http://localhost:${PORT}/graphql`);
    console.log(`   - Auth API:     http://localhost:${PORT}/api/auth`);
    console.log(`   - WebSockets:   ws://localhost:${PORT}/ws/sandbox`);
  });
}

startGateway().catch((err) => {
  console.error('Fatal API Gateway Error:', err);
  process.exit(1);
});
