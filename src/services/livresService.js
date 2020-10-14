import Inventaire from '../models/inventaire.js';
import Livre from '../models/livre.js';

class LivresService {

    //==================================================================================
    // retrieveByCritera Retrouve un livre selon une catégorie et des options du metadata
    //==================================================================================
    retrieveByCriteria(filter, retrieveOptions) {

        const limit = retrieveOptions.limit;
        const skip = (retrieveOptions.page - 1) * limit + retrieveOptions.skip; // Ajout de la gestion du paramètre page

        const retrieveQuery = Livre.find(filter, retrieveOptions.fields).limit(limit).skip(skip);
        const countQuery = Livre.countDocuments(filter);

        if (retrieveOptions.livre) {
            retrieveQuery.populate('Livre');
        }

        //Promise all attend que les deux promesses(requêtes) soient terminées avant de compléter l'opération
        return Promise.all([retrieveQuery, countQuery]);

    }

    //==================================================================================
    // Creation d'un livre
    //==================================================================================
    create(livre) {
        return Livre.create(livre);
    }

    //==================================================================================
    // retrieveById Retrouve un livre selon un id et des options
    //==================================================================================
    retrieveById(livreId, retrieveOptions) {
        const retrieveQuery = Livre.findOne({ _id: livreId }, retrieveOptions.fields);
        if (retrieveOptions.inventaires) {
            retrieveQuery.populate('inventaires');
        }
        return retrieveQuery;
    }

    //=======================================================================================
    // update Retrouve un livre selon un id et effectue la mise à jour selon le body envoyé
    //=======================================================================================
    async update(livreId, livre) {
        const filter = { _id: livreId };
        await Livre.findOneAndUpdate(filter, livre, { runValidators: true });
        return Livre.findOne(filter);
    }

    //=======================================================================================
    // Ajoute un commentaire sur un livre
    //=======================================================================================
    async addComment(livreId, commentaire) {
        const livre = await Livre.findById(livreId);
        livre.commentaires.push(commentaire)
        await livre.save();
        return livre;
    }

    //==================================================================================
    // transform Transforme un livre selon des options de transformation
    //==================================================================================
    transform(livre, transformOptions = {}) {
        // Transformation du livre avec embed si besoin
        livre.href = `${process.env.BASE_URL}/livres/${livre._id}`;
        if (transformOptions.embed) {
            if (transformOptions.embed.inventaires) {
                livre.inventaires = livre.inventaires.map(i => {
                    i.href = `${process.env.BASE_URL}/inventaires/${i._id}`;
                    i.livre = { href: livre.href };
                    i.succursale = { href: `${process.env.BASE_URL}/succursales/${i._id}` };
                    delete i._id;
                    delete i.id;
                    return i;
                });
            }
        } 
        // Transformation des commentaires
        if (livre.commentaires) {
            livre.commentaires = livre.commentaires.map(c => {
                c.href = `${process.env.BASE_URL}/livres/${livre._id}/commentaires/${c._id}`;
                delete c._id;
                delete c.id;
                return c;
            });
        }
        
        delete livre._id;
        delete livre.id;
        delete livre.__v;
        return livre;
    }
}

export default new LivresService();