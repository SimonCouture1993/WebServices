import express from 'express';
import error from 'http-errors';
import succursalesService from '../services/succursalesService.js';

const router = express.Router();

const FIELDS_REGEX = new RegExp('([^,]*)');

class SuccursalesRoutes {

    constructor() {

        router.get('/', this.getAll);                   // GET = SELECT = RETRIEVE
        router.get('/:idSuccursale', this.getOne);  
        router.post('/', this.post);                    // POST = INSERT = CREATE
        router.put('/:idSuccursale', this.put);         // PATCH = UPDATE = UPDATE

    }

    async getAll(req,res,next){
        const transformOptions = { embed: {} };
        try {
            let succursales = await succursalesService.retrieve();
            succursales = succursalesService.transform(succursales, transformOptions);

            const tranformSuccursales = succursales.map(s => {
                s = s.toObject({ getter: false, virtuals: true });
                s = succursalesService.transform(s);

                return s;
            });

            res.status(200).json(tranformSuccursales);
        } catch (err) {
            return next(err);
        }    
    }

    async getOne(req, res, next) {
        const transformOptions = { embed: {} };
        const retrieveOptions = {};

         if (req.query.embed === 'inventaires') {
            retrieveOptions.inventaires = true;
            transformOptions.embed.inventaires = true;
        }

        if(req.query.fields) { 
            let fields = req.query.fields;
            if(FIELDS_REGEX.test(fields)) {
                fields = fields.replace(/,/g, ' ');
                retrieveOptions.fields = fields;
            } else {
               return next(error.BadRequest()); 
            }
        }
        
        try {
            let succursale = await succursalesService.retrieveById(req.params.idSuccursale, retrieveOptions);
            succursale = succursale.toObject({ getter: false, virtuals: true });
            succursale = succursalesService.transform(succursale, transformOptions);
            res.status(200).json(succursale);
        } catch (err) {
            return next(err);
        }
    }

    async post(req, res, next) {

        if(!req.body) {
            return next(error.BadRequest()); //Erreur 400, 415
        }

        try {
            let succursaleAjoute = await succursalesService.create(req.body);
            succursaleAjoute = succursaleAjoute.toObject({ getter: false, virtual: true });
            succursaleAjoute = succursalesService.transform(planetAdded);

            res.header('Location', succursaleAjoute.href);

            if(req.query._body === 'false') {
                res.status(201).end();
            } else {
                res.status(201).json(succursaleAjoute);
            }

        } catch(err) {
            //Gestion des erreurs Mongo
            if(err.name === 'MongoError') {
                switch(err.code) {
                    case 11000:
                        return next(error.Conflict(err)); //409
                }
            } else if(err.message.includes('Succursale validation')) {
                return next(error.PreconditionFailed(err));
            }
    
            return next(error.InternalServerError(err));
        }
    }

    async put(req, res, next) {

        if (!req.body) {
            return next(error.BadRequest());
        }

        try {
            let succursale = await succursalesService.update(req.params.idSuccurale, req.body);
            succursale =  succursale.toObject({ getter: false, virtual: true});
            succursale = succursalesService.transform(succursale);
            
            if(req.query._body === 'false') {
                res.status(200).end();
            } else {
                res.status(200).json(succursale);
            }

        } catch (error) {
            return next(error.InternalServerError());
        }
    }
}

new SuccursalesRoutes();

export default router;