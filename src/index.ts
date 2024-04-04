import express, { type Application } from 'express';
import Router from './presentation/routes';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase } from './infrastructure/database/config';
import swaggerSpec from './infrastructure/swagger/swagger';
import cors from 'cors';
import { logIncomingRequest, logOutgoingResponse } from './infrastructure/middleware/loggingMiddleware';

const PORT = process.env.PORT || 3000;
const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(logIncomingRequest);
app.use(logOutgoingResponse);

const startServer = async () => {
  try {
    await connectDatabase();
    app.use(Router);
    app.listen(PORT, () => {
      console.log('Server is running on port', PORT);
    });
  } catch (e) {
    console.info(`An error occurred when starting the application: ${e}`);
  }
};

startServer();
