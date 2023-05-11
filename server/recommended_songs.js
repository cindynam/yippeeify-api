const router = require('express').Router();

router.get('/', async (req, res) => {
    let token = req.query.token;

    let trackSeeds = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=5&offset=0', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    trackSeeds = await trackSeeds.json();
    trackSeeds = trackSeeds.items.map(trackObject => trackObject.id).join(',');


    // get recommended tracks based on top tracks
    let data = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${trackSeeds}&max_popularity=75`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    data = await data.json();
    data = data.tracks.map(track => {
        return {
            id: track.id,
            name: track.name,
            artists: track.artists.map(artist => artist.name).join(', '),
            image: track.album.images[0].url,
            link: track.external_urls.spotify,
            popularity: track.popularity,
            duration: Math.trunc(track.duration_ms / 1000),
            uri: track.uri,
            previewUrl: track.preview_url
        }
    });
    res.send({
        data: data
    });
});

module.exports = router;