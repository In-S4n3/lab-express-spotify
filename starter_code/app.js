require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Path to the partials
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    //console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:

// HOME PAGE ROUTE
app.get('/', (req, res, next) => {
  res.render('index')
})

// ARTISTS ROUTE
app.get('/artists', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.searchArtists)
  .then(data => {
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    //console.log('The received data from the API: ', data.body.artists.items[0]);
    let spotifyArtists = data.body.artists.items
    res.render('artists', { Artists : spotifyArtists});
    
  })
  .catch(err => {
    //console.log('The error while searching artists occurred: ', err);
  });
})

// ALBUMS ROUTE
app.get('/albums/:artistId', (req, res, next) => {
  //console.log(req.params.artistId);
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    //console.log('rendering albums:', data.body.items);
    res.render('albums', {Albums: data.body.items})
  })
  .catch(err => {
    //console.log('The error while searching artists occurred: ', err);
  });
})

// TRACKS ROUTE
app.get('/tracks/:albumsId', (req, res, next) => {
  //console.log(req.params.albumsId);
  spotifyApi
  .getAlbumTracks(req.params.albumsId)
  .then(data => {
    console.log('rendering tracks:', data.body.items);
    res.render('tracks', {Tracks: data.body.items})
  })
  .catch(err => {
    //console.log('The error while searching artists occurred: ', err);
  });
})

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
