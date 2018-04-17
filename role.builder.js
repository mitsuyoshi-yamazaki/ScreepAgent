const constants = require('constants')
const util = require('util')

const taskHarvest = require('task.harvest')
const taskBuild = require('task.build')

function get_nearest_construction_site_id(creep) {
    var site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
    
    if (!site) {
        return null
    }
    
    return site.id
}

var roleBuilder = {
    isNeeded: function(room) {
       return  taskBuild.isNeeded(room) 
    },

    run: function(creep) {
        if ((creep.memory.ongoing_task == constants.ongoing_task.NONE) || (creep.memory.ongoing_task == null)) {
            if (creep.carry.energy < 50) {
                creep.changeOngoingTaskTo(constants.ongoing_task.HARVEST)
            }
            else {
                creep.changeOngoingTaskTo(constants.ongoing_task.BUILD)
            }
        }
        
        if (creep.memory.ongoing_task == constants.ongoing_task.HARVEST) {
            
            const source_id = Memory[creep.room.name][constants.object.SOURCE_NW]
            const source = Game.getObjectById(source_id)

    	    if (taskHarvest.run(creep, source) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.BUILD)
        }
        if (creep.memory.ongoing_task == constants.ongoing_task.BUILD) {
    	    if (taskBuild.run(creep) == constants.task_state.IN_PROGRESS) {
	            return
	        }
	        creep.changeOngoingTaskTo(constants.ongoing_task.NONE)
        }
        
	    creep.changeAssignTo(constants.assign.NONE)
	},
};

module.exports = roleBuilder;