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

        const destination_room_name = creep.memory.destination_room_name
        const is_arrived = creep.room.name == destination_room_name

        if (!is_arrived) {// || (is_arrived && ((creep.pos.x < 3) || (creep.pos.x > 47)))) {
            
            creep.say(destination_room_name)
            
            const result = creep.moveToRoom(destination_room_name, { x: 25, y: 25 })
            
        switch (result) {
        case OK:
        case ERR_TIRED:
            break
        
        default:
            util.log('[Collector assign] moveToRoom error: ' + result)
            break
        }
            return
        } else {
            creep.say('ARRIVED')
	        creep.changeOngoingTaskTo(constants.ongoing_task.RESERVE)
        }
        }

        // if (creep.memory.ongoing_task == constants.ongoing_task.EXIT_ROOM) {
        // 	if (taskExitRoom.run(creep) == constants.task_state.IN_PROGRESS) {
	       //     return
	       // }
	       // creep.move(creep.pos.x - 3, creep.pos.y)
	       // creep.changeOngoingTaskTo(constants.ongoing_task.RESERVE)
        // }
        
        if (creep.memory.ongoing_task == constants.ongoing_task.RESERVE) {
            taskReserve.run(creep)        
            return
        }
        
        util.log('[Role reserver] something wrong')
    
    }
}

module.exports = roleReserver
