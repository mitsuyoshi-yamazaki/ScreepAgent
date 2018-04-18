/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.exit_room');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants');
const util = require('util');

function run(creep) {
        const first_room_name =  'E8S51'

        if (creep.room.name != first_room_name) {
            if (creep.pos.x > 47) {
                console.log('EXIT to: ', creep.move(LEFT))
                return constants.task_state.IN_PROGRESS
            }
            // if ((creep.pos.x == 0) || (creep.pos.x == 49) || (creep.pos.y == 0) || (creep.pos.y == 49)) {
            //     const result = creep.moveTo(25, 25, { reusePath: constants.system.REUSE_PATH })
                
            //     switch (result) {
            //     case OK:
            //     case ERR_TIRED:
            //         break
        
            //     default:
            //         util.log('[Exit room task] moveTo: move from border error: ' + result)
            //         return constants.task_state.DONE    // better than stack
            //     }
        
            //     return constants.task_state.IN_PROGRESS
            // }
            // else {
                return constants.task_state.DONE
            // }
        }     
        
        const exit = creep.room.find(FIND_EXIT_LEFT)[1]
        
        const result = creep.moveTo(exit, {
            visualizePathStyle: {stroke: '#cccccc'},
            reusePath: constants.system.REUSE_PATH
        });
        
        switch (result) {
        case OK:
        case ERR_TIRED:
            break
        
        default:
            util.log('[Exit room task] moveTo error: ' + result)
            break
        }
        
        return constants.task_state.IN_PROGRESS
}

module.exports.run = run
