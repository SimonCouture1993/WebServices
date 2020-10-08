import express from 'express';
import error from 'http-errors';

import livresService from '../services/livresService.js';

const FIELDS_REGEX = new RegExp('([^,]*)');

const router = express.Router();

class LivresRoutes {
    constructor() {  
        router.get('/', this.getAll); 
        router.post('/', this.post); // PATCH = UPDATE = UPDATE
        router.get('/:idLivre', this.getOne); 
        router.put('/:idLivre', this.put); 
        router.post('/:idLivre/commentaires', this.addComment);
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
        const retrieveOptions = {};

        // EMBED
        if (req.query.embed === 'inventaires') {
            retrieveOptions.inventaires = true;
            transformOptions.embed.inventaires = true;
        }

        // FIELDS
        if(req.query.fields) { 
            let fields = req.query.fields;
            if(FIELDS_REGEX.test(fields)) {
                fields = fields.replace(/,/g, ' ');
                retrieveOptions.fields = fields;
            } else {
               return next(error.BadRequest()); 
            }

        } else {
            //retrieveOptions.planet = true;
        }

        try {
            let livre = await livresService.retrieveById(req.params.idLivre, retrieveOptions);
            livre = livre.toObject({ getter: false, virtuals: true });
            livre = livresService.transform(livre, transformOptions);
            res.status(200).json(livre);
        } catch (err) {
            return next(err);
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
                livre = livre.toObject({ getter: false, virtuals: true });
                livre = livresService.transform(livre);
                res.status(201).json(livre);
            }
        } catch (err) {
            return next(err);
        }
    }

    async addComment(req,res,next){
        if (!req.body) {
            return next(error.BadRequest());
        } 
        try {
            let livre = await livresService.addComment(req.params.idLivre, req.body);
            res.status(201).json(livre);
        } catch (err) {
            return next(err);
        }
    }

    async post(req, res, next) {
        if (!req.body) {
            return next(error.BadRequest()); //Erreur 400, 415
        }

        try {
            let livreAdded = await livresService.create(req.body);
            livreAdded = livreAdded.toObject({ getter: false, virtual: true });
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