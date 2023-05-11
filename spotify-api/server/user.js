const router = require('express').Router();

router.get('/', async (req, res) => {
    let token = req.query.token;
    let data = await fetch(`https://api.spotify.com/v1/me/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    data = await data.json();
    res.send({
        id: data.id,
        username: data.display_name,
        profile_image: data.images[0].url
    });
});

module.exports = router;