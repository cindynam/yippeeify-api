const express = require('express');
//const fetch = require('node-fetch');
const router = express.Router();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

router.get('/login', async (req, res) => {
  let scope = 'user-read-private user-read-email user-top-read user-library-read playlist-modify-private playlist-modify-public ugc-image-upload';
  res.send({ url: `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}` });
});

router.post('/token', async (req, res) => {
  let token = await fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'))
    },
    body: `code=${req.body.code}&grant_type=authorization_code&redirect_uri=${SPOTIFY_REDIRECT_URI}`
  })
  token = await token.json();
  res.send({ token: token.access_token, refresh_token: token.refresh_token });
});

module.exports = router;
