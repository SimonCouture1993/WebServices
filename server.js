import './env.js';

import app from './src/app.js';

const PORT = 5700;

app.listen(PORT, err => {

    if(err) {
        process.exit(1);
    }
    
    console.log(`Serveur en écoute sur le port: ${PORT}`);
    
});

