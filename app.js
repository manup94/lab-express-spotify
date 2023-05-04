require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:
//home page="artist-search"
app.get("/", (req, res, next) => {
    res.render("artist-search")
})

//second page='/artist-search-result'

app.get('/artist-search-result', (req, res) => {

    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {

            const info = data.body.artists.items

            res.render('artist-search-result', { info })

        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})


//third page="albums"

app.get('/artist-albums/:id', (req, res, next) => {


    const { id, name } = req.params

    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            res.send(data.body.items.name)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


