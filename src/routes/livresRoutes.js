import express from 'express';
import error from 'http-errors';

import livresService from '../services/livresService.js';

const router = express.Router();

class LivresRoutes {
    constructor() {  
        router.get('/', this.getAll); 
        router.post('/', this.post); // PATCH = UPDATE = UPDATE
    }

    async getAll(req,res,next){
        try {
            let livres = await livresService.retrieve();
            //succursale = succursalesService.transform(succursale);
            res.status(200).json(livres);
        } catch (err) {
            return next(error.InternalServerError(err));
        }    
    }

    async post(req, res, next) {

        if (!req.body) {
            return next(error.BadRequest()); //Erreur 400, 415
        }

        //Validation à faire soit par mongoose ou par nous même

        try {
            let livreAdded = await livresService.create(req.body);
            // livreAdded = livreAdded.toObject({ getter: false, virtual: true });
            // livreAdded = livresService.transform(livreAdded);

            res.header('Location', livreAdded.href)

            if (req.query._body === 'false') {
                res.status(201).end();
            } else {
                res.status(201).json(livreAdded);
            }

        } catch (err) {
            //Gestion des erreurs Mongo
            if (err.name === 'MongoError') {
                switch (err.code) {
                    case 11000:
                        return next(error.Conflict(err)); //409
                }
            }
            return next(error.InternalServerError(err));
        }
    }
}

new LivresRoutes();
export default router;