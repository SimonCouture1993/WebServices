import mongoose from 'mongoose';

const succursaleSchema = mongoose.Schema({
    appelatif: { type: String, unique: true },
    adresse: String,
    ville: String,
    codePostal: String,
    province: String,
    telephone: String,
    telecopieur: String,
    information: String
    
}, {
    collection: 'succursales'
});

succursaleSchema.virtual('inventaires',{
    ref:'Inventaire',
    localDield:'_id',
    foreignField:'succursale',
    justOne:false
});

export default mongoose.model('Succursale', succursaleSchema);