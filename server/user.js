const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
    try {
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

    } catch (error) {
        console.log("error");
        res.status(404).send({ error: error });
    }
});

module.exports = router;