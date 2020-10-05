import mongoose from 'mongoose';

const inventaireSchema = mongoose.Schema({
    quantite:Number,
    dateDerniereReception:{type:Date, default:Date.now},
    dateDerniereVente:{type:Date, default:Date.now},
    livre:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'inventaires',
        required:true
    },
    succursale:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'succursales',
        required:true
    }
    
},{
    collection: 'inventaires'
});

export default mongoose.model('Inventaire', inventaireSchema);