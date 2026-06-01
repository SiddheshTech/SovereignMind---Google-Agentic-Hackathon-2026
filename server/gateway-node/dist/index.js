"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const schema_1 = require("./graphql/schema");
const resolvers_1 = require("./graphql/resolvers");
const simulation_stream_1 = require("./websockets/simulation_stream");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
async function startGateway() {
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    // Setup WebSockets
    (0, simulation_stream_1.initWebSocketServer)(httpServer);
    // Setup Apollo GraphQL Server
    const apolloServer = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers,
    });
    await apolloServer.start();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Mount Apollo middleware
    app.use('/graphql', (0, express4_1.expressMiddleware)(apolloServer));
    app.get('/health', (req, res) => {
        res.json({ status: 'OK', service: 'SovereignMind Gateway Node' });
    });
    httpServer.listen(PORT, () => {
        console.log(`🚀 SovereignMind API Gateway active at:`);
        console.log(`   - HTTP/GraphQL: http://localhost:${PORT}/graphql`);
        console.log(`   - WebSockets:   ws://localhost:${PORT}/ws/sandbox`);
    });
}
startGateway().catch((err) => {
    console.error('Fatal API Gateway Error:', err);
    process.exit(1);
});
