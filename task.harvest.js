/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.harvest');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants');
const util = require('util');

function run(creep, target_source) {
    const lack_of_energy = creep.carryCapacity - creep.carry.energy
    
    if (lack_of_energy == 0) {
        return constants.task_state.DONE
    }
    
    if (target_source) {
        var action_type = 'withdraw'
        var result = creep.withdraw(target_source, RESOURCE_ENERGY)
        
        if (result == ERR_INVALID_TARGET) {
            action_type = 'harvest'
            result = creep.harvest(target_source)
        }
        
        switch (result) {
        case OK:
            return constants.task_state.IN_PROGRESS
            
        case ERR_NOT_IN_RANGE:
            move(creep, target_source)
            return constants.task_state.IN_PROGRESS
            
        default:
            util.log('[Harvest task] given target ' + action_type + ' error: ' + result)
            break
        }
    }
    
    var container = null
    var source = null
    var dropped_resource = null
    
    // TODO: find closest
    const dropped_resources = Game.spawns['Spawn1'].room.find(FIND_DROPPED_RESOURCES, {
        filter: resource => (resource.resourceType == RESOURCE_ENERGY) && (resource.amount > 100)
    })
    if (dropped_resources.length) {
        dropped_resource = dropped_resources[0]
    }
    else {
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: structure => (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > lack_of_energy)
        })
        if (containers.length) {
            container = containers[0]
        }
        else {
            // target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            const sources = creep.room.find(FIND_SOURCES_ACTIVE)
            source = sources[creep.memory.birth_time % sources.length]
        }
    }
    
    if (!dropped_resource && !container && !source) {
        util.detailed_log('[Harvest task] No active sources')
        source = creep.pos.findClosestByPath(FIND_SOURCES)
        move(creep, source)
        return constants.task_state.IN_PROGRESS
    }
    
    if (dropped_resource && (creep.pickup(dropped_resource) == ERR_NOT_IN_RANGE)) {
        move(creep, dropped_resource)
    }
    if (container && (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
        move(creep, container)
    }
    if (source && (creep.harvest(source) == ERR_NOT_IN_RANGE)) {
        move(creep, source)
    }
 
    return constants.task_state.IN_PROGRESS
}

function move(creep, pos) {
    const result = creep.moveTo(pos, {
        visualizePathStyle: {stroke: '#00aa00'},
        reusePath: 5
    });
    
    switch (result) {
    case OK:
    case ERR_TIRED:
        break
        
    default:
        util.log('[Harvest task] moveTo error: ' + result)
        break
    }
}

module.exports.run = run