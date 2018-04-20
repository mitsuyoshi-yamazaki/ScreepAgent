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
    const r = creep.upgradeController(target)
    
    if (r == ERR_NOT_IN_RANGE) {
        const result = creep.moveWith(target, {
            visualizePathStyle: {stroke: '#cc0000'},
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
    else if (r == OK) {
        
    }
    else {
        util.log('[Upgrade task]', creep.id, ' upgradeController error: ', r)
    }
    
    return constants.task_state.IN_PROGRESS
}

function isNeeded(room) {
    return true
}

module.exports.run = run
module.exports.isNeeded = isNeeded
