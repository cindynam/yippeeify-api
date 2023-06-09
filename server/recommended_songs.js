const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
    try {
        let token = req.query.token;

        // Get top tracks and artists.
        let trackSeeds = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20&offset=0', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        trackSeeds = await trackSeeds.json();
        
        let artistSeeds = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=0', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        artistSeeds = await artistSeeds.json();

        artistSeeds = artistSeeds.items;
        trackSeeds = trackSeeds.items;

        const topArtists = artistSeeds.map(artist => artist.name);
        const topTracks = trackSeeds.slice(0, 10).map(track => track.name);

        // Get 3 random tracks and 2 random artists.
        let seeds = { artists: [], tracks: [] }
        for (let i = 0; i < 3; i++) {
            if (trackSeeds.length > 0) {
                let random = Math.floor(Math.random() * trackSeeds.length);
                seeds.tracks.push(trackSeeds[random].id);
                trackSeeds.splice(random, 1);
            }
        }
        for (let i = 0; i < 2; i++) {
            if (artistSeeds.length > 0) {
                let random = Math.floor(Math.random() * artistSeeds.length);
                seeds.artists.push(artistSeeds[random].id);
                artistSeeds.splice(random, 1);
            }
        }

        // Get recommended tracks based on seeds.
        let data = await fetch(`https://api.spotify.com/v1/recommendations?limit=100&seed_artists=${seeds.artists.join(',')}&seed_tracks=${seeds.tracks.join(',')}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        data = await data.json();
        // Filter out tracks that are already in top tracks or top artists, return 20 tracks after filtering.
        data = data.tracks
            .filter(track => (!topArtists.includes(track.artists[0].name) && !topTracks.includes(track.name)))
            .slice(0, 20)
            .map(track => {
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

    } catch (error) {
        res.status(404).send({ error: error });
    }
});

module.exports = router;