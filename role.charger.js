const constants = require('constants')
const util = require('util')

const taskHarvest = require('task.harvest')
const taskCharge = require('task.charge')

const roleCharger = {
    isNeeded: function(room) {
       return  taskCharge.isNeeded(room) 
    },

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
            
            const source_id = Memory[creep.room.name][constants.object.SOURCE_NW]
            const source = Game.getObjectById(source_id)

    	    if (taskHarvest.run(creep, source) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.CHARGE)
        }
        if (creep.memory.ongoing_task == constants.ongoing_task.CHARGE) {
    	    if (taskCharge.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.NONE)
        }
        
	    creep.changeAssignTo(constants.assign.NONE)
	}
};

module.exports = roleCharger