import Livre from '../models/livre.js';

class CategoriesService {
     retrieve(){
        return Livre.distinct('categorie');
    }
}

export default new CategoriesService();