import express from 'express';
import Server from '../../server.js';

export default function buildTestServe() {
    const app = express();
    const server = new Server(app);

    return { app, server };
}
