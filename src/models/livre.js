import mongoose from 'mongoose';

const livreSchema = mongoose.Schema({
    categorie: { type: String, maxlength: 100 },
    titre: { type: String, maxlength: 300 },
    prix: Number,
    auteur: { type: String, maxlength: 100 },
    sujet: { type: String, maxlength: 100 },
    ISBN: String,
    commentaires: [{
        dateCommentaire: { type: Date, default: Date.now },
        message: { type: String, maxlength: 300 },
        etoile: { type: Number, min: 0, max: 5 }
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