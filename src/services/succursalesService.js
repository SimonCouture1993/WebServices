/*
succursalesService.js
2020-10-16
Auteurs: Simon Couture, André Pinel, Harley Lounsbury
*/

import Succursale from '../models/succursale.js';

class SuccursalesService {

    //==================================================================================
    // retrieve : Retrouve une succursale
    //==================================================================================
    retrieve() {
        return Succursale.find();
    }

    //==================================================================================
    // retrieveById : Retrouve une succursale selon son ID et des paramètres "fields"
    //==================================================================================
    async retrieveById(succursaleId, retrieveOptions) {
        const retrieveQuery = Succursale.findOne({ _id: succursaleId }, retrieveOptions.fields);

        if (retrieveOptions.inventaires) {
            retrieveQuery.populate('inventaires');
        }
        return retrieveQuery;
    }

    create(succursale) {
        return Succursale.create(succursale);
    }

    async update(succursaleId, succursale) {
        const filter = { _id: succursaleId };
        await Succursale.findOneAndUpdate(filter, succursale);
        return Succursale.findOne(filter);
    }

    //==================================================================================
    // transform : Transforme une succursale selon des options de transformation
    //==================================================================================
    transform(succursale, transformOptions = {}) {

        if (transformOptions.embed) {
            if (transformOptions.embed.inventaires) {
                succursale.inventaires = succursale.inventaires.map(i => {
                    i.href = `${process.env.BASE_URL}/inventaires/${i._id}`; // Lien URL pour trouver un inventaire.
                    i.livre = { href: `${process.env.BASE_URL}/livres/${i.livre._id}` }; // Lien URL pour trouver un livre.
                    i.succursale = { href: `${process.env.BASE_URL}/succursales/${i.succursale._id}` }; // Lien URL pour trouver une succursale.
                    delete i._id;
                    delete i.id;
                    return i;
                });
            }
        }
        // Lien URL pour trouver une succursale
        succursale.href = `${process.env.BASE_URL}/succursales/${succursale._id}`;
        delete succursale._id;
        delete succursale.__v;
        delete succursale.id;
        return succursale;
    }
}

export default new SuccursalesService();