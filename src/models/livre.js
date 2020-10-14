import mongoose from 'mongoose';
import isbnValidate from 'isbn-validate';

const livreSchema = mongoose.Schema({
    categorie: { type: String, maxlength: 100 },
    titre: { type: String, maxlength: 300, required: true },
    prix: { type: Number, min: 0.01 },
    auteur: { type: String, maxlength: 100, required: true },
    sujet: { type: String, maxlength: 100 },
    ISBN: {
        type: String, unique: true, required: true, validate: {
            validator: function (arr) {
                return isbnValidate.Validate(arr);
            }
            , message: 'l\'ISBN fournis n\'est pas valide'
        }
    },
    commentaires: [{
        dateCommentaire: { type: Date, default: Date.now },
        message: { type: String, maxlength: 300 },
        etoile: {
            type: Number,
            min: 1,
            max: 5,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} n\'est pas une valeur entière'
            }
        }
    }]

}, {
    collection: 'livres',
    strict: 'throw'
});

livreSchema.virtual('inventaires', {
    ref: 'Inventaire',
    localField: '_id',
    foreignField: 'livre',
    justOne: false
});

export default mongoose.model('Livre', livreSchema);