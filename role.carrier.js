/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.carrier');
 * mod.thing == 'a thing'; // true
 */
const constants = require('constants')
const util = require('util')

const taskCharge = require('task.charge')

const roleCarrier = {
    run: function(creep) {
        if ((creep.memory.ongoing_task == constants.ongoing_task.NONE) || (creep.memory.ongoing_task == null)) {
            if (creep.carry.energy < 50) {
                creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
            }
            else {
                creep.changeOngoingTaskTo(constants.ongoing_task.CHARGE)
            }
        }
        
        if (creep.memory.ongoing_task == constants.ongoing_task.HARVEST) {
            if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
                const containers = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => structure.structureType == STRUCTURE_CONTAINER
                })
                if (containers.length > 0) {
                    const source = containers[0]
                    
                    if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source)
                    }
                }
                else {
                    util.log('[Carrier role] ', creep.id, ' no source found')
                }
                return 
            }
            
	        creep.changeOngoingTaskTo(constants.ongoing_task.CHARGE)
        }
        if (creep.memory.ongoing_task == constants.ongoing_task.CHARGE) {
    	    if (taskCharge.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
        }
    }
}

module.exports = roleCarrier