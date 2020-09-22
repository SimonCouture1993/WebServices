import mongoose from 'mongoose';

const succursaleSchema = mongoose.Schema({
    appelatif: { type: String, unique: true },
    adresse: String,
    ville: String,
    codePostal: String,
    province: String,
    telephone: String,
    telecopieur: String,
    information: Text
    
}, {
    collection: 'succursales'
});

export default mongoose.model('Succursale', succursaleSchema);