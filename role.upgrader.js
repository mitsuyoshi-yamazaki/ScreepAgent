const constants = require('constants')
const util = require('util')

const taskHarvest = require('task.harvest')
const taskUpgrade = require('task.upgrade')

var roleUpgrader = {
    isNeeded: function(room) {
       return  taskBuild.isNeeded(room) 
    },

    run: function(creep) {
        if ((creep.memory.ongoing_task == constants.ongoing_task.NONE) || (creep.memory.ongoing_task == null)) {
            if (creep.carry.energy < 50) {
                creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
            }
            else {
                creep.changeOngoingTaskTo(constants.ongoing_task.UPGRADE)
            }
        }
        
        if (creep.memory.ongoing_task == constants.ongoing_task.HARVEST) {
            
            const x = 17
            const y = 31
            const containers = creep.room.lookAt(x, y).filter(obj => (obj.type == 'structure') && (obj['structure'].structureType = STRUCTURE_CONTAINER))

    	    if (taskHarvest.run(creep, containers[0]) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.UPGRADE)
        }
        if (creep.memory.ongoing_task == constants.ongoing_task.UPGRADE) {
    	    if (taskUpgrade.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.NONE)
        }
        
	    creep.changeAssignTo(constants.assign.NONE)
	},
};

module.exports = roleUpgrader;