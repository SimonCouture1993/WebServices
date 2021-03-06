/*
inventaire.js
2020-10-16
Auteurs: Simon Couture, André Pinel, Harley Lounsbury
*/

import mongoose from 'mongoose';

const inventaireSchema = mongoose.Schema({
    quantite: {
        type: Number, validate: {
            validator: Number.isInteger,
            message: '{VALUE} n\'est pas une valeur entière'
        }
    },
    dateDerniereReception: { type: Date, default: Date.now },
    dateDerniereVente: { type: Date, default: Date.now },
    livre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventaire',
        required: true
    },
    succursale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Succursale',
        required: true
    }

}, {
    collection: 'inventaires'
});

export default mongoose.model('Inventaire', inventaireSchema);