/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.upgrade');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants');
const util = require('util');

function run(creep) {
    if (creep.carry.energy <= 0) {
        return constants.task_state.DONE
    }

    const target = creep.room.controller
    
    if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
        const result = creep.moveTo(target, {
            visualizePathStyle: {stroke: '#aa0000'},
            reusePath: 5
        });
        
        switch (result) {
        case OK:
        case ERR_TIRED:
            break
        
        default:
            util.log('[Upgrade task] moveTo error: ' + result)
            break
        }
    }
    
    return constants.task_state.IN_PROGRESS
}

function isNeeded(room) {
    return true
}

module.exports.run = run
module.exports.isNeeded = isNeeded
