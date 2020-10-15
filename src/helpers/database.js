/*
database.js
2020-10-16
Auteurs: Simon Couture, André Pinel, Harley Lounsbury
*/

import mongoose from 'mongoose';

export default app => {
    const url = process.env.DATABASE;
    console.log(url);
    console.log(`[MONGO] - Establish new connection with url: ${url}`);
    mongoose.Promise = global.Promise;
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    mongoose.connect(url).then(
        () => { console.log(`[MONGO] - Connected to: ${url}`); },
        err => { }
    );
}

