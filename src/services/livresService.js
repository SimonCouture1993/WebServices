import Inventaire from '../models/inventaire.js';
import Livre from '../models/livre.js';

class LivresService {
    retrieve() {
        return Livre.find();
    }

    create(livre) {
        return Livre.create(livre);
    }

    retrieveById(livreId, retrieveOptions) {

        const retrieveQuery = Livre.findOne({_id:livreId},retrieveOptions.fields);

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

    async addComment(livreId, commentaire)
    {
      const livre = await Livre.findById(livreId);
      livre.commentaires.push(commentaire);
      livre.save();
      console.log(livre.commentaires);
      return livre;
    }

    transform(livre, transformOptions = {}) {
        const inventaire = livre.inventaires;

        livre.href = `${process.env.BASE_URL}/livres/${livre._id}`;

        //Pour embed=livre
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
        return livre;
    }
}

export default new LivresService();