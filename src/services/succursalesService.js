import Succursale from '../models/succursale.js';

class SuccursalesService {

    retrieve() {
        return Succursale.find();
    }

    async retrieveById(succursaleId) {
        return await Succursale.findById(succursaleId);
    }

    transform(succursale) {

        //Linking
        succursale.href = `${process.env.BASE_URL}/succursales/${succursale._id}`;
        

        return succursale;
    }
}


export default new SuccursalesService();