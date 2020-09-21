import express from 'express';
import database from './helpers/database.js';
import errors from './helpers/errors.js';


const app = express();

database(app);

app.use(express.json());

//http://localhost:5600/premiere
app.get('/', (req, res, next) => {

    res.status(200); //Code de réponse 200 = OK
    res.set('Content-Type', 'text/plain'); //Réponse en format text
    res.send('WebServices');

});


errors(app);
export default app;