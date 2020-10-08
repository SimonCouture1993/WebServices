import express from 'express';
import error from 'http-errors';
import succursalesService from '../services/succursalesService.js';

const router = express.Router();

class SuccursalesRoutes {

    constructor() {

        router.get('/', this.getAll);                   // GET = SELECT = RETRIEVE
        router.get('/:idSuccursale', this.getOne);  
        router.post('/', this.post);                    // POST = INSERT = CREATE
        router.put('/:idSuccursale', this.put);         // PATCH = UPDATE = UPDATE

    }

    async getAll(req,res,next){
        try {
            const succursales = await succursalesService.retrieve();

            const tranformSuccursales = succursales.map(s => {
                s = s.toObject({ getter: false, virtual: true });
                s = succursalesService.transform(s);

                return s;
            });

            res.status(200).json(tranformSuccursales);
        } catch (err) {
            return next(error.InternalServerError(err));
        }    
    }

    async getOne(req, res, next) {
        
        try {
            let succursale = await succursalesService.retrieveById(req.params.idSuccursale);
            succursale = succursale.toObject({ getter: false, virtual: true });
            succursale = succursalesService.transform(succursale);
            res.status(200).json(succursale);
        } catch (err) {
            return next(error.InternalServerError(err));
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
            } else if(err.message.includes('Planet validation')) {
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