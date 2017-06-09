adjectives = [
    'Blue',
    'Yellow',
    'Ugly',
    'Superstitious',
    'Fascinating',
    'Temporary'
]

things = [
    'Dog',
    'Light',
    'Bottle',
    'Zombie',
    'Comrad'
]

module.exports = {
    createName: function() {
        var adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        var thing = things[Math.floor(Math.random() * things.length)];
        return adj + thing;
    }
};
