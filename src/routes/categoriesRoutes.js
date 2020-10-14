/*
categorieRoutes.js
2020-10-16
Auteurs: Simon Couture, André Pinel, Harley Lounsbury
*/

import express from 'express';
import error from 'http-errors';

import categorieService from '../services/categoriesService.js';

const router = express.Router();

class CategoriesRoutes {
    constructor() {  
        router.get('/', this.getAll); 
    }

    //==================================================================================
    // getAll Sélection de toute les catégories existantes
    //==================================================================================
    async getAll(req,res,next){
        try {
            let categories = await categorieService.retrieve();
            res.status(200).json(categories);
        } catch (err) {
            return next(error.InternalServerError(err));
        }    
    }
}

new CategoriesRoutes();
export default router;