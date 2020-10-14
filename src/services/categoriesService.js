/*
categorieService.js
2020-10-16
Auteurs: Simon Couture, André Pinel, Harley Lounsbury
*/

import Livre from '../models/livre.js';

class CategoriesService {
    //==================================================================================
    // retrieve : Retrouve toutes les catégories distictes parmis les livres
    //==================================================================================
     retrieve(){
        return Livre.distinct('categorie');
    }
}

export default new CategoriesService();