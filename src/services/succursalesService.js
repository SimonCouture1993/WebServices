import Succursale from '../models/succursale.js';

class SuccursalesService {

    retrieve() {
        return Succursale.find();
    }

    async retrieveById(succursaleId) {
        return await Succursale.findById(succursaleId);
    }

    create(succursale) {
        return Succursale.create(succursale);
    }

    async update(succursaleId, succursale) {
        const filter = { _id: succursaleId };
        await Succursale.findOneAndUpdate(filter, succursale);
        return Succursale.findOne(filter);
    }

    transform(succursale) {

        //Linking
        succursale.href = `${process.env.BASE_URL}/succursales/${succursale._id}`;
        

        return succursale;
    }
}


export default new SuccursalesService();