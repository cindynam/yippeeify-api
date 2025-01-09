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

        trackSeeds = trackSeeds.items;

        let topTracks = trackSeeds.map(track => (
            {
                name: track.name,
                artist: track.artists[0].name
            }
        ));

        const topTrackNames = topTracks.map(track => track.name);

        // Get 9 random tracks
        let tracksToSearch = [];
        for (let i = 0; i < 9; i++) {
            if (topTracks.length > 0) {
                let random = Math.floor(Math.random() * topTracks.length);
                tracksToSearch.push(topTracks[random]);
                topTracks.splice(random, 1);
            }
        }

        let recommendedSongs = [];

        // Get tracks based on searching for a random top track and omitting the first result.
        for(let track of tracksToSearch){
            let data = await fetch(`https://api.spotify.com/v1/search?limit=20&type=track&q=${track.artist} ${track.name}&offset=1`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            data = await data.json();
            let recommendedSongNames = recommendedSongs.map(track => track.name);
            //let recommendedSongNames = recommendedSongs.map(track => track.name);
            // Filter out tracks that are already in top tracks or top artists, return 20 tracks after filtering.
            let resultantTracks = data.tracks.items.filter(track => 
                (![...topTrackNames, ...recommendedSongNames].includes(track.name)) &&
                track.popularity > 20)
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
            randomTrack = resultantTracks[Math.floor(Math.random() * resultantTracks.length)];
            recommendedSongs.push(randomTrack);
        }

        res.send({
            data: recommendedSongs
        });

    } catch (error) {
        console.log(error)
        res.status(404).send({ error: error });
    }
});

module.exports = router;