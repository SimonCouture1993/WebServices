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
    }

    async getAll(req, res, next) {
        let categorie;

        const transformOption = { embed: {} };
        const filter = {};

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

            if (pageCount === 1) {
                delete responseBody._links.prev;
                responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`;
                delete responseBody._links.next;
            } else {
                if (req.query.page === 1) {
                    delete responseBody._links.prev;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`;
                    responseBody._links.next = `${process.env.BASE_URL}${pageArray[1].url}`;
                } else if (!hasNextPage) {
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
        if(req.query.fields) { 
            let fields = req.query.fields;
            if(FIELDS_REGEX.test(fields)) {
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
            //let error = livre.validateSync();
            //console.log(error);
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
    async addComment(req,res,next){
        if (!req.body) {
            return next(error.BadRequest());
        } 
        try {
            let livre = await livresService.addComment(req.params.idLivre, req.body);
            //TODO FINIR LE HEADER
            //res.header('Location', livre.commentaires);
            res.status(201).json(livre);
        } catch (err) {
            return next(err);
        }
    }

    async post(req, res, next) {
        if (!req.body) {
            return next(error.BadRequest()); //Erreur 400, 415
        }

        try {
            let livreAdded = await livresService.create(req.body);
            livreAdded = livreAdded.toObject({ getter: false, virtuals: true });
            livreAdded = livresService.transform(livreAdded);

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
            return next(error.InternalServerError(err));
        }
    }
}

new LivresRoutes();
export default router;