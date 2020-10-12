import Succursale from '../models/succursale.js';

class SuccursalesService {

    retrieve() {
        return Succursale.find();
    }

    async retrieveById(succursaleId, retrieveOptions) {
        // return await Succursale.findById(succursaleId);
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

    transform(succursale, transformOptions = {}) {

        if (transformOptions.embed) {
            if (transformOptions.embed.inventaires) {
                succursale.inventaires = succursale.inventaires.map(i => {
                    console.log(succursale.inventaires);
                    i.href = `${process.env.BASE_URL}/inventaires/${i._id}`;
                    i.livre = { href: `${process.env.BASE_URL}/livres/${i.livre._id}` };
                    i.succursale = { href: `${process.env.BASE_URL}/succursales/${i.succursale._id}` };
                    delete i._id;
                    delete i.id;
                    return i;
                });
            }
        }

        succursale.href = `${process.env.BASE_URL}/succursales/${succursale._id}`;
        delete succursale._id;
        delete succursale.__v;
        delete succursale.id;
        return succursale;
    }
}

export default new SuccursalesService();