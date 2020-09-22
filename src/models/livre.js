import mongoose from 'mongoose';

const livreSchema = mongoose.Schema({
    categorie: String,
    titre: String,
    prix: Number,
    auteur: String,
    sujet: String,
    ISBN: String,
    commentaires: [{
        dateCommentaire: Date,
        message: Text,
        etoile: Number
    }] 

}, {
    collection: 'livres'
});

export default mongoose.model('Livre', livreSchema);