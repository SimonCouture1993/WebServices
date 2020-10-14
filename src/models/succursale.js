/*
succursale.js
2020-10-16
Auteurs: Simon Couture, André Pinel, Harley Lounsbury
*/

import mongoose from 'mongoose';

const succursaleSchema = mongoose.Schema({
    appelatif: { type: String, unique: true },
    adresse: { type: String, maxlength: 255, required: true },
    ville: { type: String, maxlength: 255, required: true },
    codePostal: {
        type: String, validate: {
            validator: function (v) {
                return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(v);
            }
        }
    },
    province: { type: String, maxlength: 50, required: true },
    telephone: {
        type: String, maxlength: 15, required: true, validate: {
            validator: function (v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            }
        }
    },
    telecopieur: {
        type: String, maxlength: 15, required: true, validate: {
            validator: function (v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            }
        }
    },
    information: { type: String, maxlength: 255 }

}, {
    collection: 'succursales'
});

succursaleSchema.virtual('inventaires', {
    ref: 'Inventaire',
    localField: '_id',
    foreignField: 'succursale',
    justOne: false
});

export default mongoose.model('Succursale', succursaleSchema);