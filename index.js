const express = require('express'); // La base
const app = express();
const axios = require('axios'); // Pour remplacer les requêtes XHR

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
        const resultFilm = await getFilm(filmId);
        const film = {"title" : resultFilm.title, "id" : filmId}; // Objet film avec des détails qu'on va passer et afficher dans une vue
        const planets = [];
        const word = "mountain"; // variable pour vérifier si il y a des montagnes sur une planète
        const count = 0; 
        for(let planet of resultFilm.planets) { 
            const resultPlanet = await getPlanet(planet);
            if(resultPlanet.terrain.includes())
            planets.push(resultPlanet);
            TotDiameter += await getDiameterOfPlanet(resultPlanet);
        }
        console.log('film data : ', film);
        console.log('Total diameter: ', TotDiameter);
        res.render('movie-results', {film : film, totDiameter : TotDiameter, planets : planets}); // On envoie les données traitées à la vue
        TotDiameter = 0; // On réinitialise à zero le total 
    }
});


app.listen(PORT, () => {
    console.log('The Central Intelligence Agency is listening to the port : ' + PORT);
});


// les 3 fonctions retournent une promesse afin de pouvoir traiter les données et leur cohérence avant de les forward vers la vue EJS
function getFilm(idFilm) {
    return new Promise(function(resolve, reject) {
        const queryFilm = 'https://swapi.py4e.com/api/films/' + idFilm;
        axios.get(queryFilm).then(
            (response) => {
                let result = response.data;
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });
}

function getPlanet(planet) {
    return new Promise(function(resolve, reject) {
        const queryPlanet = planet;
        axios.get(queryPlanet).then(
            (response) => {
                let result = response.data;
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });
}

function getDiameterOfPlanet(planet) {
    return new Promise(function(resolve, reject) {
        let diameter = parseInt(planet.diameter);
        resolve(diameter);
        reject('error');
    })
};