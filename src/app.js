import express from 'express';
import database from './helpers/database.js';
import errors from './helpers/errors.js';
import categoriesRoutes from './routes/categoriesRoutes.js'
import succursalesRoutes from './routes/succursalesRoutes.js'
import livresRoutes from './routes/livresRoutes.js'

const app = express();

database(app);

app.use(express.json());

app.get('/', (req, res, next) => {
    res.status(200); //Code de réponse 200 = OK
    res.set('Content-Type', 'text/plain'); //Réponse en format text
    res.send('WebServices');
});

app.use('/categories', categoriesRoutes);
app.use('/succursales', succursalesRoutes);
app.use('/livres', livresRoutes);

app.use('*',errors);
export default app;