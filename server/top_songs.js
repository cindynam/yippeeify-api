const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  try {
    let token = req.query.token;
    let timeframe = req.query.timeframe;
    let url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeframe}&limit=9&offset=0`;

    let data = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    data = await data.json();

    data = data.items.map(trackObject => {
      return {
        image: trackObject.album.images[0].url,
        artists: trackObject.artists.map(a => a.name).join(', '),
        link: trackObject.external_urls.spotify,
        duration: Math.trunc(trackObject.duration_ms / 1000),
        name: trackObject.name,
        id: trackObject.id,
        popularity: trackObject.popularity
      }
    });
    
    res.send({
      data: data
    });

  } catch (error) {
    res.status(404).send({ error: error });
  }
});

module.exports = router;