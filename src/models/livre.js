import mongoose from 'mongoose';

const livreSchema = mongoose.Schema({
    categorie: String,
    titre: {type:String, maxlength:300},
    prix: Number,
    auteur: {type:String, maxlength:100},
    sujet: {type:String, maxlength:100},
    ISBN: String,
    commentaires: [{
        dateCommentaire: {type:Date, default: Date.now},
        message: {type:String, maxlength:300},
        etoile: {type : Number, min : 0, max : 5}
    }] 

}, {
    collection: 'livres'
});

export default mongoose.model('Livre', livreSchema);