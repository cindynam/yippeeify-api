const router = require('express').Router()

router.get('/savedsongs', async (req, res) => {
    let token = req.query.token;
    let data = await fetch(`https://api.spotify.com/v1/me/tracks?limit=5&offset=0`,{
        method: 'GET',
          headers: {
              'Authorization' : `Bearer ${token}`
          }
      });
    data = await data.json();
    data = data.items.map(i => i.track);
    data = data.map(track => {
      return {
        image: track.album.images[0].url,
        artists: track.artists.map(a => a.name),
        link: track.external_urls.spotify,
        duration: Math.trunc(track.duration_ms/1000),
        id: track.id,
        preview: track.preview_url,
        popularity: track.popularity,
        name: track.name
      }
    });
    res.send({data: data
    });
  });

  module.exports = router;