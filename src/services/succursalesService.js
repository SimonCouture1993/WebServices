import Succursale from '../models/succursale.js';

class SuccursalesService {

    async retrieveById(succursaleId){
        return await Succursale.findById(succursaleId);
    }
}

export default new SuccursalesService();