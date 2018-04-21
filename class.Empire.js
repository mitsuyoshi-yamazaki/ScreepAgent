const constants = require('constants')
const util = require('util')

const Empire = function() {
}

/// Initialization

/**
 * Collect game objects
 */
Empire.prototype.initialize = function() {
    this.spawns = Game.spawns
}

/// Actions
Empire.prototype.say = function(message) {
    for (const spawn of this.spawns) {
        spawn.say(message)
    }
}

module.exports = Empire