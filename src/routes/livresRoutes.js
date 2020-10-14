/*
livreRoutes.js
2020-10-16
Auteurs: Simon Couture, André Pinel, Harley Lounsbury
*/

import express from 'express';
import error from 'http-errors';
import paginate from 'express-paginate';
import livresService from '../services/livresService.js';

const FIELDS_REGEX = new RegExp('([^,]*)');

const router = express.Router();

class LivresRoutes {
    constructor() {
        router.get('/', paginate.middleware(20, 50), this.getAll);
        router.post('/', this.post);
        router.get('/:idLivre', this.getOne);
        router.put('/:idLivre', this.put);
        router.post('/:idLivre/commentaires', this.addComment);
        router.get('/:idLivre/inventaires', this.getInventaires);
        router.delete('/:idLivre', this.delete);
    }

    //==================================================================================
    // getAll Sélection de tous les livre avec un metaData
    //==================================================================================
    async getAll(req, res, next) {
        let categorie;

        const transformOption = { embed: {} };
        const filter = {};

        //Options du metaData
        const retrieveOptions = {
            limit: req.query.limit,
            page: req.query.page,
            skip: parseInt(req.query.skip, 10)
        };

        // Recherche par catégorie
        if (req.query.categorie) {
            filter.categorie = req.query.categorie;
        }

        try {
            let [livres, itemsCount] = await livresService.retrieveByCriteria(filter, retrieveOptions);

            const pageCount = Math.ceil(itemsCount / req.query.limit);
            const hasNextPage = paginate.hasNextPages(req)(pageCount);
            const pageArray = paginate.getArrayPages(req)(3, pageCount, req.query.page);

            const transformLivres = livres.map(e => {
                e = e.toObject({ getter: false, virtuals: true });
                e = livresService.transform(e, retrieveOptions, transformOption);
                return e;
            });
            // Construction de la metaData
            const responseBody = {
                _metadata: {
                    hasNextPage: hasNextPage,
                    page: req.query.page,
                    limit: req.query.limit,
                    totalPages: pageCount,
                    totalDocument: itemsCount
                },
                _links: {
                    prev: ``,
                    self: ``,
                    next: ``
                },
                results: transformLivres
            };

            if (pageCount === 1) { // S'il y a seulement une seule page.
                delete responseBody._links.prev;
                responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`;
                delete responseBody._links.next;
            } else {
                if (req.query.page === 1) { // Affichage des liens pour la première page.
                    delete responseBody._links.prev;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`;
                    responseBody._links.next = `${process.env.BASE_URL}${pageArray[1].url}`;
                } else if (!hasNextPage) { // Affichage des liens pour la dernière page.
                    responseBody._links.prev = `${process.env.BASE_URL}${pageArray[1].url}`;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[2].url}`;
                    delete responseBody._links.next;
                } else {
                    responseBody._links.prev = `${process.env.BASE_URL}${pageArray[0].url}`;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[1].url}`;
                    responseBody._links.next = `${process.env.BASE_URL}${pageArray[2].url}`;
                }
            }
            res.status(200).json(responseBody);
        } catch (err) {
            return next(err);
        }
    }

    //==================================================================================
    // getOne Sélection d'un livre avec embed inventaires et fields
    //==================================================================================
    async getOne(req, res, next) {
        const transformOptions = { embed: {} };
        const retrieveOptions = {};

        // Section Embed
        if (req.query.embed === 'inventaires') {
            retrieveOptions.inventaires = true;
            transformOptions.embed.inventaires = true;
        }

        // Section Fields
        if (req.query.fields) {
            let fields = req.query.fields;
            if (FIELDS_REGEX.test(fields)) {
                fields = fields.replace(/,/g, ' ');
                retrieveOptions.fields = fields;
            } else {
                return next(error.BadRequest());
            }
        }
        try {
            let livre = await livresService.retrieveById(req.params.idLivre, retrieveOptions);
            livre = livre.toObject({ getter: false, virtuals: true });
            livre = livresService.transform(livre, transformOptions);
            res.status(200).json(livre);
        } catch (err) {
            return next(err);
        }
    }

    //==================================================================================
    // put mise à jour partielle d'un livre
    //==================================================================================
    async put(req, res, next) {
        if (!req.body) {
            return next(error.BadRequest());
        }
        try {
            let livre = await livresService.update(req.params.idLivre, req.body);
            if (req.query._body === 'false') {
                res.status(201).end();
            } else {
                livre = livre.toObject({ getter: false, virtuals: true });
                livre = livresService.transform(livre);
                res.status(201).json(livre);
            }
        } catch (err) {
            return next(err);
        }
    }

    //==================================================================================
    // addComment mise à jour partielle d'un livre
    //==================================================================================
    async addComment(req, res, next) {
        if (!req.body) {
            return next(error.BadRequest());
        }
        try {
            let livre = await livresService.addComment(req.params.idLivre, req.body);
            livre = livre.toObject({ getter: false, virtuals: true });
            livre = livresService.transform(livre);
            res.header('Location', livre.commentaires[livre.commentaires.length - 1].href); // On met le dernier commentaire de la liste (celui le plus récent) dans le header
            if (req.query._body === 'false') {
                res.status(201).end();
            } else {
                res.status(201).json(livre.commentaires[livre.commentaires.length - 1]); // On met le dernier commentaire de la liste (celui le plus récent) dans la réponse
            }
        } catch (err) {
            return next(err);
        }
    }

    //==================================================================================
    // Ajout d'un livre 
    //==================================================================================
    async post(req, res, next) {
        if (!req.body) {
            return next(error.BadRequest()); //Erreur 400, 415
        }

        try {
            let livreAdded = await livresService.create(req.body);
            livreAdded = livreAdded.toObject({ getter: false, virtuals: true });
            livreAdded = livresService.transform(livreAdded);

            // HEADER location contenant l'URL du livre ajouté.
            res.header('Location', livreAdded.href)

            if (req.query._body === 'false') {
                res.status(201).end();
            } else {
                res.status(201).json(livreAdded);
            }

        } catch (err) {
            //Gestion des erreurs Mongo
            if (err.name === 'MongoError') {
                switch (err.code) {
                    case 11000:
                        return next(error.Conflict(err)); //409
                }
            }
            return next(err);
        }
    }


    //==================================================================================
    // Suppression d'un livre
    //==================================================================================
    delete(req, res, next) {
        if (!req.body) {
            return next(error.BadRequest()); //Erreur 400, 415
        }

        try {
            livresService.delete(req.params.idLivre);
            res.status(204).end();

        } catch (err) {
            return next(err);
        }
    }

    //==================================================================================
    // Selection des inventaires d'un livre
    //==================================================================================
    async getInventaires(req, res, next) {
        if (!req.body) {
            return next(error.BadRequest());
        }

        try {
            let inventaires = await livresService.retrieveInventairesByLivre(req.params.idLivre);

            inventaires = inventaires.map(i => {
                i = i.toObject({ getter: false, virtuals: true });
                i = livresService.transformInventaire(i);
                return i;
            });

            res.status(200).json(inventaires);

        } catch (err) {
            return next(err);
        }
    }
}

new LivresRoutes();
export default router;