import express, { type Application } from 'express';
import Router from './presentation/routes';
import swaggerUi from 'swagger-ui-express';

const PORT = process.env.PORT || 3000;

const app: Application = express();
app.use(express.json());
app.use(express.static('public'));

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  }),
);

app.use(Router);

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
