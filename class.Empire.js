const constants = require('constants')
const util = require('util')

require('extension.Spawn')

const Empire = function(name) {
    this.name = name
}

/// Initialization

/**
 * Collect game objects
 */
Empire.prototype.initialize = function() {
    this.spawns = Game.spawns

    for (const spawn_name in this.spawns) {
        const spawn = this.spawns[spawn_name]

        spawn.initialize()
    }
}

/// Actions
Empire.prototype.say = function(message) {
    for (const spawn_name in this.spawns) {
        const spawn = this.spawns[spawn_name]
        spawn.say(message)
    }
}

module.exports = Empire