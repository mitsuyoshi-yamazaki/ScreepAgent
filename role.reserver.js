/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.reserver');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants')
const util = require('util')

const taskExitRoom = require('task.exit_room')
const taskMoveRoom = require('task.move_room')
const taskReserve = require('task.reserve')

const roleReserver = {
    run: function(creep) {
        if ((creep.memory.ongoing_task == constants.ongoing_task.NONE) || (creep.memory.ongoing_task == null)) {
                if (creep.room.name == creep.memory.destination_room_name) {
                    creep.changeAssignTo(constants.assign.RESERVE)
                }
                else {
                    creep.changeOngoingTaskTo(constants.ongoing_task.EXIT_ROOM)
                }
        }
        
        if (creep.memory.ongoing_task == constants.ongoing_task.EXIT_ROOM) {
        	if (taskExitRoom.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.move(creep.pos.x - 3, creep.pos.y)
	        creep.changeOngoingTaskTo(constants.ongoing_task.RESERVE)
        }
        
        if (creep.memory.ongoing_task == constants.ongoing_task.RESERVE) {
            taskReserve.run(creep)        
            return
        }
        
        util.log('[Role reserver] something wrong')
    
    }
}

module.exports = roleReserver
