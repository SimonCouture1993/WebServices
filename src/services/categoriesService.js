import Livre from '../models/livre.js';

class CategoriesService {
    //==================================================================================
    // retrieve Retrouve toutes les catégories distictes parmis les livres
    //==================================================================================
     retrieve(){
        return Livre.distinct('categorie');
    }
}

export default new CategoriesService();