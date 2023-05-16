const router = require('express').Router();
const fetch = require('node-fetch');

const playlistImage = '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';

router.post('/', async (req, res) => {
    try {
        let token = req.body.token;
        let userId = req.body.userId;
        let songUris = req.body.songUris;
        // Creates a playlist for the user
        let playlist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "name": 'yippee!',
                "description": "song recommendations by yippeeify",
                "public": "true"
            })
        });
        let playlistId = await playlist.json();
        playlistId = playlistId.id;

        // Add custom playlist cover image
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'image/jpeg'
            },
            body: playlistImage
        });

        // Add songs to playlist
        let updatedPlaylist = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${songUris}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        updatedPlaylist = await updatedPlaylist.json();

        res.send({
            playlistId: playlistId
        });

    } catch (error) {
        res.status(404).send({ error: error });
    }
});

module.exports = router;
