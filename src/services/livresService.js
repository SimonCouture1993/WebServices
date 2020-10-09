import Inventaire from '../models/inventaire.js';
import Livre from '../models/livre.js';

class LivresService {

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

    retrieve(categorie) {
        //SELECT * FROM Livres WHERE categorie = 'Romance'
        return Livre.find({ categorie: categorie });
    }

    create(livre) {
        return Livre.create(livre);
    }

    //==================================================================================
    // retrieveById Retorouve un livre selon un id et des options
    //==================================================================================
    retrieveById(livreId, retrieveOptions) {
        const retrieveQuery = Livre.findOne({ _id: livreId }, retrieveOptions.fields);
        if (retrieveOptions.inventaires) {
            retrieveQuery.populate('inventaires');
        }
        return retrieveQuery;
    }

    async update(livreId, livre) {
        const filter = { _id: livreId };
        await Livre.findOneAndUpdate(filter, livre);
        return Livre.findOne(filter);
    }

    async addComment(livreId, commentaire) {
        const livre = await Livre.findById(livreId);
        livre.commentaires.push(commentaire);
        livre.save();
        console.log(livre.commentaires);
        return livre;
    }

    //==================================================================================
    // transform Tronsform un livre selon des options de transformation
    //==================================================================================
    transform(livre, transformOptions = {}) {
        const inventaire = livre.inventaires;
        livre.href = `${process.env.BASE_URL}/livres/${livre._id}`;
        if (transformOptions.embed) {
            if (transformOptions.embed.inventaires) {
                livre.inventaires = livre.inventaires.map(i => {
                    i.href = `${process.env.BASE_URL}/inventaires/${i._id}`;
                    i.livre = { href: livre.href };
                    i.succursale = { href: `${process.env.BASE_URL}/inventaires/${i._id}` };
                    delete i._id;
                    delete i.id;
                    return i;
                });
            }
        }
        delete livre._id;
        delete livre.id;
        delete livre.__v;

        if (livre.commentaires) {
            livre.commentaires = livre.commentaires.map(i => {
                delete i._id;
                delete i.id;
                return i;
            });
        }
        return livre;
    }
}

export default new LivresService();