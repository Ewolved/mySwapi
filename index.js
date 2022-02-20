const express = require('express'); // La base
const app = express();
const axios = require('axios').create(); // Pour remplacer les requêtes XHR

const PORT = 3000;

var TotDiameter = 0;

app.set('views', './views'); // Dossier avec les vues
app.set('view engine','ejs'); // EJS Pour passer les données et les utiliser dans un template HTML
app.use('/public', express.static('public')); // On inclue un dossier qui contient des fichiers statiques, pour ici, c'est du CSS

app.get('/:id', async (req, res) => { // Async car traitement de données pour les forwards à la vue après
    const filmId = req.params.id;
    if(parseInt(req.params.id) < 1 || parseInt(req.params.id) > 7) {
        res.render('error404'); // Gestion de l'erreur 404
    } else {
        try {
        const resultFilm = await getFilm(filmId);
        const film = {"title" : resultFilm.title, "id" : filmId}; // Objet film avec des détails qu'on va passer et afficher dans une vue
        const planets = [];
        const word = "mountain"; // variable pour vérifier si il y a des montagnes sur une planète
        const count = 0; 
        for(let planet of resultFilm.planets) {  // planet représente l'entrée vers l'api qui donne les détails de la planète
            const resultPlanet = await getPlanet(planet); // ici on a les données brutes dans resultPlanet
            if(resultPlanet.terrain.includes(word) && 
               parseInt(resultPlanet.surface_water) > 0) {
                planets.push({"name" : resultPlanet.name, "diameter" : resultPlanet.diameter}); // on recrée un objet json plus léger que le retour de l'api 
                TotDiameter += parseInt(resultPlanet.diameter);                         // juste avec les données qui nous intéresse à forward à la vue
               };
            
        };
        console.log('film data : ', film);
        console.log('Total diameter: ', TotDiameter);
        res.render('movie-results', {film : film, totDiameter : TotDiameter, planets : planets}); // On envoie les données traitées à la vue
        TotDiameter = 0; // On réinitialise à zero le total 
        } catch(error) {
            //console.log(error);
        }
    };
});

app.get('*', (req, res) => {  // Gestion error 404 
    res.render('error404');
})



app.listen(PORT, () => {
    console.log('The Central Intelligence Agency is listening to the port : ' + PORT);
});


// les 2 fonctions retournent une promesse afin de pouvoir traiter les données et leur cohérence avant de les forward vers la vue EJS
function getFilm(idFilm) {
    return new Promise(function(resolve, reject) {
        const queryFilm = 'https://swapi.py4e.com/api/films/' + idFilm;
        axios.get(queryFilm).then(
            function(response) {
                let result = response.data;
                resolve(result);
            }
        ).catch(function(error) {
            reject(error);
        })
    });
}

function getPlanet(planet) {
    return new Promise(function(resolve, reject) {
        const queryPlanet = planet;
        axios.get(queryPlanet).then(
            function(response) {
                let result = response.data;
                resolve(result);
            }
        ).catch(function(error) {
            reject(error);
        })
    });
}
