const constants = require('constants')
const util = require('util')

const Empire = require('class.Empire')

module.exports.loop = function () {
    initialize()
}

/// Initialization
function initialize () {
    Game.empires = [
        new Empire('Mitsuyoshi')
    ]

    for (const empire of Game.empires) {
        empire.initialize()
        empire.say('BELLO')
    }
}
