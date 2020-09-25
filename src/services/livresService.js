import Livre from '../models/livre.js';

class LivresService {

    retrieve() {
        return Livre.find();
    }

    create(livre) {
        return Livre.create(livre);
    }
}

export default new LivresService();