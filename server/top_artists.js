const router = require('express').Router();

router.get('/', async (req, res) => {
    let token = req.query.token;
    let timeframe = req.query.timeframe;
    let url = `https://api.spotify.com/v1/me/top/artists?time_range=${timeframe}&limit=20&offset=0`;

    let data = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    data = await data.json();
    data = data.items.map(artistObject => {
        return {
            image: artistObject.images[0].url,
            name: artistObject.name,
            popularity: artistObject.popularity,
            id: artistObject.id,
            genre: artistObject.genres.join(', '),
            link: artistObject.external_urls.spotify
        }
    });
    res.send({
        data: data
    });
});

module.exports = router;