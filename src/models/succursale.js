/*
succursale.js
2020-10-16
Auteurs: Simon Couture, André Pinel, Harley Lounsbury
*/

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
    localField:'_id',
    foreignField:'succursale',
    justOne:false
});

export default mongoose.model('Succursale', succursaleSchema);