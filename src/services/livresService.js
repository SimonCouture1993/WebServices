import Livre from '../models/livre.js';

class LivresService {

    retrieveById(livreId) {
        return Livre.findById(livreId);
    }

    async update(livreId, livre) {
        const filter = { _id: livreId };
        await Livre.findOneAndUpdate(filter, livre);
        return Livre.findOne(filter);
    }

    transform(livre, transformOptions = {}) {
        //Linking
        livre.href = `${process.env.BASE_URL}/livres/${livre._id}`;
        delete livre._id;
        //delete livre.__v;
        return livre;
    }
}

export default new LivresService();