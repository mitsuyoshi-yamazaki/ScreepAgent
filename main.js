const constants = require('constants')
const util = require('util')

const World = require('World')

module.exports.loop = function () {
    console.log('fuga')
    Game.world = new World()
    console.log(Game.world)
    
    // Game.world.expand()
}
