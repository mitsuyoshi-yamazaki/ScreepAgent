/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.reserve');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants');
const util = require('util');

function run(creep) {
    if (creep.room.name != creep.memory.destination_room_name) {
        console.log('wrong room: ', creep.room.name)
        return
    }
    
    const target = creep.room.controller
    
    
    // console.log('room: ', creep.room.name)
    
    var reserve_result = creep.claimController(target)
    
    if (reserve_result == ERR_GCL_NOT_ENOUGH) {
        reserve_result = creep.reserveController(target)
    }
    
    if ((reserve_result == ERR_NOT_IN_RANGE)) {
        const result = creep.moveTo(target, {
            visualizePathStyle: {stroke: '#ffffff'},
            reusePath: constants.system.REUSE_PATH
        });
        
        switch (result) {
        case OK:
        case ERR_TIRED:
            break
        
        default:
            util.log('[Reserve task] moveTo error: ' + result)
            break
        }
    }
    else if (reserve_result == OK) {
        
    }
    else {
        console.log('reserve error: ', reserve_result)
    }
    
    return constants.task_state.IN_PROGRESS
}


module.exports.run = run
