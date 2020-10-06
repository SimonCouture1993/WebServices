import Inventaire from '../models/inventaire.js';
import Livre from '../models/livre.js';

class LivresService {
    retrieve() {
        return Livre.find();
    }

    create(livre) {
        return Livre.create(livre);
    }

    retrieveById(livreId) {

        const retrieveQuery = Livre.findById(livreId);
        if (retrieveOptions.inventaires) {
            retrieveQuery.populate('inventaires');
        }

        return retrieveQuery;
    }

    async update(livreId, livre) {
        const filter = { _id: livreId };
        await Livre.findOneAndUpdate(filter, livre);
        return Livre.findOne(filter);
    }

    transform(inventaire, transformOptions = {}) {
        const livre = inventaire.livre;

        if (livre) {
            inventaire.livre = { href: `${process.env.BASE_URL}/livres/${livre._id}` };
        }

        //Pour embed=livre
        if (transformOption.embed.livre) {
            inventaire.livre = livreService.transform(livre);
        }

        inventaire.href = `${process.env.BASE_URL}/inventaires/${inventaire._id}`;
        delete inventaire._id;

        return livre;
    }
}

export default new LivresService();