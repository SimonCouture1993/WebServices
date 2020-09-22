import Livre from '../models/livre.js';

class CategoriesService {
    async retrieve(){
        return await Livre.distinct('categorie');
    }
}

export default new CategoriesService();