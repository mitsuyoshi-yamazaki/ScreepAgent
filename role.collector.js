/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.collector');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants')
const util = require('util')

const taskHarvest = require('task.harvest')
const taskBuild = require('task.build')
const taskExitRoom = require('task.exit_room')
const taskReturnRoom = require('task.return_room')
const taskMoveRoom = require('task.move_room')

const first_room_name =  'E8S51'
const left_room_name = 'E7S51'
const left_left_room_name = 'E6S51'

const roleCollector = {
    run: function(creep) {
        if ((creep.memory.ongoing_task == constants.ongoing_task.NONE) || (creep.memory.ongoing_task == null)) {
            if (creep.carry.energy < 50) {
                creep.changeOngoingTaskTo(constants.ongoing_task.EXIT_ROOM)
            }
            else {
                if (creep.room.name == first_room_name) {
                    // creep.changeAssignTo(constants.assign.NONE)
                    creep.changeAssignTo(constants.assign.UPGRADE)  // 何もすることがな何もすることがないと止まるの回避
                    console.log('Change assign to UPGRADE')
                    return
                }
                else {
                    creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
                }
            }
        }

        if (creep.memory.ongoing_task == constants.ongoing_task.EXIT_ROOM) {
        	if (taskExitRoom.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
            // if ((creep.memory.birth_time % 3 != 0) && (taskMoveRoom.run(creep, FIND_EXIT_LEFT, left_left_room_name) == constants.task_state.IN_PROGRESS)) {
            //     return
            // }
	        creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
        }

        if (creep.memory.ongoing_task == constants.ongoing_task.HARVEST) {
    	    if (taskHarvest.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        if (taskBuild.isNeeded(creep.room)) {
	            creep.changeOngoingTaskTo(constants.ongoing_task.BUILD)
	        }
	        else {
	            creep.changeOngoingTaskTo(constants.ongoing_task.RETURN_ROOM)
	        }
        }
        
        if (creep.memory.ongoing_task == constants.ongoing_task.BUILD) {
    	    if (taskBuild.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
	        return
        }

        if (creep.memory.ongoing_task == constants.ongoing_task.RETURN_ROOM) {
    	    if (taskReturnRoom.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeAssignTo(constants.assign.NONE)
        }
        
        util.log('[Role collector] something wrong')
    }
}

module.exports = roleCollector