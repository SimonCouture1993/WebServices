import mongoose from 'mongoose';

const livreSchema = mongoose.Schema({
    categorie: { type: String, maxlength: 100 },
    titre: { type: String, maxlength: 300, required: true },
    prix: { type: Number, min: 0.01 },
    auteur: { type: String, maxlength: 100, required: true },
    sujet: { type: String, maxlength: 100 },
    ISBN: { type: String, unique: true, required: true },
    commentaires: [{
        dateCommentaire: { type: Date, default: Date.now },
        message: { type: String, maxlength: 300 },
        etoile: {
            type: Number,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} n\'est pas une valeur entière'
            }
        }
    }]

}, {
    collection: 'livres'
});

livreSchema.virtual('inventaires', {
    ref: 'Inventaire',
    localField: '_id',
    foreignField: 'livre',
    justOne: false
});

export default mongoose.model('Livre', livreSchema);