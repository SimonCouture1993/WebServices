import express from 'express';
import error from 'http-errors';
import succursalesService from '../services/succursalesService.js';

const router = express.Router();

class SuccursalesRoutes {

    constructor() {

        router.get('/', this.getAll); // GET = SELECT = RETRIEVE
        router.get('/:idSuccursale', this.getOne);  // POST = INSERT = CREATE
        //router.post('/', this.post); // PATCH = UPDATE = UPDATE
        //router.put('/:idPlanet', this.put); // PUT = UPDATE = UPDATE
        //router.patch('/:idPlanet', this.patch); // DELETE = DELETE = DELETE
        //router.delete('/:idPlanet', this.delete);

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
}

new SuccursalesRoutes();

export default router;