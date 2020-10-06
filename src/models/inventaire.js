import mongoose from 'mongoose';

const inventaireSchema = mongoose.Schema({
    quantite:Number,
    dateDerniereReception:{type:Date, default:Date.now},
    dateDerniereVente:{type:Date, default:Date.now},
    livre:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Inventaire',
        required:true
    },
    succursale:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Succursale',
        required:true
    }
    
},{
    collection: 'inventaires'
});

export default mongoose.model('Inventaire', inventaireSchema);