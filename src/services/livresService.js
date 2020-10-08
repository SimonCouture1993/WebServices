import Inventaire from '../models/inventaire.js';
import Livre from '../models/livre.js';

class LivresService {
    retrieve() {
        return Livre.find();
    }

    create(livre) {
        return Livre.create(livre);
    }

    retrieveById(livreId, retrieveOptions) {

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

    transform(livre, transformOptions = {}) {
        const inventaire = livre.inventaires;
        console.log(inventaire)
        if (inventaire) {
            livre.inventaires.href = `${process.env.BASE_URL}/inventaires/${inventaire._id}` ;
        }

        //Pour embed=livre
        if (transformOptions.embed) {
            if (transformOptions.embed.inventaire) {
                livre.inventaires = livre.inventaires.map(i => {
                    i.href = `${process.env.BASE_URL}/inventaires/${inventaire._id}`;
                    i.livre = { href: livre.href };
                    return i;
                });
            }
        }
        delete inventaire._id;
        return livre;
    }
}

export default new LivresService();