/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.build');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants');
const util = require('util');

function run(creep) {
    if (creep.carry.energy <= 0) {
        return constants.task_state.DONE
    }
    
    const site = getClosestConstructionSite(creep)
    
    if (!site) {
        return constants.task_state.DONE
    }
    
    if (creep.build(site) == ERR_NOT_IN_RANGE) {
        const result = creep.moveTo(site, {
            visualizePathStyle: {stroke: '#0000aa'},
            reusePath: 5
        });
        
        switch (result) {
        case OK:
        case ERR_TIRED:
            break
        
        default:
            util.log('[Build task] moveTo error: ' + result)
            break
        }
    }
    
    return constants.task_state.IN_PROGRESS
}

function isNeeded(room) {
    return room.find(FIND_CONSTRUCTION_SITES).length > 0
}

function getClosestConstructionSite(creep) {
    var site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
        filter: (site) => 
            (site.structureType == STRUCTURE_TOWER) ||
            (site.structureType == STRUCTURE_EXTENSION)
    })
    
    if (site) {
        return site
    }
    
    return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
}

module.exports.run = run
module.exports.isNeeded = isNeeded
