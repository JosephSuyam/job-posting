import express, { Express, json, urlencoded } from 'express';
import dotenv from 'dotenv';
import baseRouter from './src/routes/base.route';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api', baseRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
