adjectives = [
    'Blue',
    'Red',
    'Green',
    'Ugly',
    'Neat',
    'Old',
    'Great'
]

things = [
    'Dog',
    'Light',
    'Bottle',
    'Zombie',
    'Comrad',
    'Chair',
    'Lion',
    'Beast'
]

module.exports = {
    createName: function() {
        var adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        var thing = things[Math.floor(Math.random() * things.length)];
        return adj + thing;
    }
};
