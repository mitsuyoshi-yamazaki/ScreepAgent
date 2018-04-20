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
const taskCharge = require('task.charge')
const taskUpgrade = require('task.upgrade')
const taskExitRoom = require('task.exit_room')
const taskReturnRoom = require('task.return_room')
const taskMoveRoom = require('task.move_room')

const first_room_name =  'E8S51'
const left_room_name = 'E7S51'
const left_left_room_name = 'E6S51'

const roleCollector = {
    run: function(creep) {

        // creep.say('COLLECT')
        
        if ((creep.memory.ongoing_task == constants.ongoing_task.NONE) || (creep.memory.ongoing_task == null)) {
            if (creep.carry.energy < 50) {
                creep.changeOngoingTaskTo(constants.ongoing_task.EXIT_ROOM)
            }
            else {
                if (creep.room.name == first_room_name) {
                    // creep.changeAssignTo(constants.assign.NONE)
                    creep.changeAssignTo(constants.assign.UPGRADE)  // 何もすることがないと止まるの回避
                    console.log('Change assign to UPGRADE')
                    return
                }
                else {
                    creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
                }
            }
        }
        else if ((creep.room.name == left_left_room_name) && (creep.ticksToLive < 1300) && (creep.pos.x >= 19) && (creep.pos.x <= 36) && (creep.pos.y <= 20)) {
            creep.say('renew')
            creep.changeOngoingTaskTo(constants.ongoing_task.RENEW)
        }
        
        if (creep.memory.ongoing_task == constants.ongoing_task.EXIT_ROOM) {

        // const destination_room_name = ['E6S51', 'E7S51', 'E9S51', 'E7S51', 'E9S51'][creep.memory.birth_time % 5]
            const creeps_in_second_room = _.filter(Game.creeps, (creep) => creep.room.name == left_left_room_name)
            var rooms = ['E6S51', 'E7S51', 'E9S51']
            
            if (creeps_in_second_room.length > 7) {
                rooms = ['E7S51', 'E9S51']
            }
        
            const destination_room_name = rooms[creep.memory.birth_time % rooms.length]
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
    	        creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
            }
        }

        // if (creep.memory.ongoing_task == constants.ongoing_task.EXIT_ROOM) {
        // 	if (taskExitRoom.run(creep) == constants.task_state.IN_PROGRESS) {
	       //     return
	       // }
        //     // if ((creep.memory.birth_time % 3 != 0) && (taskMoveRoom.run(creep, FIND_EXIT_LEFT, left_left_room_name) == constants.task_state.IN_PROGRESS)) {
        //     //     return
        //     // }
	       // creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
        // }
        
        if (creep.memory.ongoing_task == constants.ongoing_task.RENEW) {
            creep.say('ing')
            if (creep.ticksToLive >= 1400) {
                            creep.say('done!')

    	        creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
            }
            else {
                creep.say('RENEW')
                creep.moveWith(23, 12)
                return
            }
        }


        if (creep.memory.ongoing_task == constants.ongoing_task.HARVEST) {
    	    if (taskHarvest.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        if ((creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) && taskCharge.isNeeded(creep.room)) {
	            creep.changeOngoingTaskTo(constants.ongoing_task.CHARGE)
	        }
	        else if (taskBuild.isNeeded(creep.room)) {
	            creep.changeOngoingTaskTo(constants.ongoing_task.BUILD)
	        }
	        else if (creep.room.controller.my == true) {
	            creep.changeOngoingTaskTo(constants.ongoing_task.UPGRADE)
	        }
	        else {
	            creep.say('return')
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

        if (creep.memory.ongoing_task == constants.ongoing_task.CHARGE) {
    	    if (taskCharge.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
        }

        if (creep.memory.ongoing_task == constants.ongoing_task.UPGRADE) {
    	    if (taskUpgrade.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
	        return
        }

        if (creep.memory.ongoing_task == constants.ongoing_task.RETURN_ROOM) {
    	    if (taskReturnRoom.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
        }
        
        
        util.detailed_log('[Role collector] Unexpected ongoing_task: ', creep.memory.ongoing_task)
    }
}

module.exports = roleCollector