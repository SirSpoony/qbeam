var namegen = require('../util/namegen')
var express = require('express');

var router = express.Router();

var nameIDPairs = [];

/* GET id from name. */
router.get('/', function(req, res, next) {
    var name = req.query.name;

    var id;
    for (var i = 0; i < nameIDPairs.length; i++) {
        if (nameIDPairs[i].name === name) {
            id = nameIDPairs[i].id;
        }
    }

    if (!name || !id) {
        res.json({
            status: 'invalid',
            id: -1
        });
        return;
    }

    console.log(id);

    res.json({
        status: 'valid',
        id: id
    });
});

/* POST name and id pair. */
router.post('/', function(req, res, next) {
    var name = req.body.name;
    var id = req.body.id;

    if (name === null || name === '') {
        name = namegen.createName();
    }

    nameIDPairs.push({
        name: name,
        id: id
    });

    res.json({
        name: name
    });
});

module.exports = router;
