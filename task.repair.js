/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.repair');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants');
const util = require('util');

function run(creep) {
    
}

function isNeeded(room) {
    return room.find(FIND_STRUCTURES, { 
        filter: structure => (structure.hits < 1000)
    }).length > 0
}

module.exports.run = run
module.exports.isNeeded = isNeeded