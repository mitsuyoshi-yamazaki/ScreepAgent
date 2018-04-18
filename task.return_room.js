/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.return_room');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants');
const util = require('util');

function run(creep) {
        const first_room_name =  'E8S51'

        if ((creep.room.name == first_room_name) && (creep.pos.x > 3)) {
            return constants.task_state.DONE
        }     
        
        const spawn = Game.spawns['Spawn1']
        
        const result = creep.moveTo(spawn, {
            visualizePathStyle: {stroke: '#cccccc'},
            reusePath: constants.system.REUSE_PATH
        });
        
        switch (result) {
        case OK:
        case ERR_TIRED:
            break
        
        default:
            util.log('[Return room task] moveTo error: ' + result)
            break
        }
        
        return constants.task_state.IN_PROGRESS
}

module.exports.run = run
