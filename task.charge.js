/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.charge');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants');
const util = require('util');

function run(creep) {
    if (creep.carry.energy <= 0) {
        return constants.task_state.DONE
    }
    
    const target = getClosestStructure(creep)
    
    if (!target) {
        util.log('[Charge task] No structure to charge')
        return constants.task_state.DONE
    }
    
    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        const result = creep.moveTo(target, {
            visualizePathStyle: {stroke: '#aaaa00'},
            reusePath: 5
        });
        
        switch (result) {
        case OK:
        case ERR_TIRED:
            break
        
        default:
            util.log('[Charge task] moveTo error: ' + result)
            break
        }
    }

    return constants.task_state.IN_PROGRESS
}

const filter = (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER
                    ) && structure.energy < structure.energyCapacity
    }

function isNeeded(room) {
    return room.find(FIND_STRUCTURES, { filter: filter }).length > 0
}

function getClosestStructure(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN
                ) && structure.energy < structure.energyCapacity;
        }
    })
    
    if (target) {
        return target
    }
    
    return creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                    structure.structureType == STRUCTURE_TOWER
                    ) && structure.energy < structure.energyCapacity;
        }
    })
}

module.exports.run = run
module.exports.isNeeded = isNeeded
module.exports.filter = filter
