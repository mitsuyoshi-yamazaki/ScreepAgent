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

const first_room_name =  'E8S51'
const left_room_name = 'E7S51'
const left_left_room_name = 'E6S51'

function run(creep) {
    if (creep.room.name != creep.memory.destination_room_name) {
        console.log('wrong room: ', creep.room.name)
        return
    }
    
    const target = creep.room.controller
    const should_claim = (creep.room.name == left_left_room_name) && (Game.gcl.level == 2)
    
    var reserve_result = null
    
    if (should_claim) {
        // creep.say('CLAIMing')
        reserve_result = creep.claimController(target)
    }
    else {    
        // creep.say('RESERVing', creep.room.name, Game.gcl.level)
        console.log()
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
