import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Import routers
import stationsRouter from './routes/stations.js';
import routesRouter from './routes/routes.js';
import bookingsRouter from './routes/bookings.js';
import luggageTypesRouter from './routes/luggageTypes.js';
import ticketsRouter from './routes/tickets.js';

// Use routers
app.use('/api/stations', stationsRouter);
app.use('/api/routes', routesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/luggage-types', luggageTypesRouter);
app.use('/api/tickets', ticketsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});