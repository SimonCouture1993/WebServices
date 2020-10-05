import express from 'express';
import error from 'http-errors';

import livresService from '../services/livresService.js';

const router = express.Router();

class LivresRoutes {
    constructor() {  
        router.get('/', this.getAll); 
        router.post('/', this.post); // PATCH = UPDATE = UPDATE
        router.get('/:idLivre', this.getOne); 
        router.put('/:idLivre', this.put); 
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

    async getOne(req,res,next){
        const transformOptions = { embed: {} };
        const retrieveOptions = {}

        if (req.query.embed === 'inventaires') {
            retrieveOptions.inventaires = true;
            transformOptions.embed.inventaires = true;
        }


        try {
            let livre = await livresService.retrieveById(req.params.idLivre);
            livre = livre.toObject({ getter: false, virtual: true });
            livre = livresServices.transform(livre, transformOptions);
            res.status(200).json(livre);
        } catch (err) {
            return next(error.InternalServerError(err));
        }    
    }

    async put(req,res,next){
        if (!req.body) {
            return next(error.BadRequest());
        } 

        try {
            let livre = await livresService.update(req.params.idLivre, req.body);

 

            if (req.query._body === 'false') {
                res.status(201).end();
            } else {
                livre = livre.toObject({ getter: false, virtual: true });
                livre = livresService.transform(livre);
                res.status(201).json(livre);
            }
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