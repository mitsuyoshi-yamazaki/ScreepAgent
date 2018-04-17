const constants = require('constants');
const util = require('util');

const extensionCreep = require('extension.Creep');

const functionSpawn = require('function.spawn')
const functionRoad = require('function.Road')
const functionExtension = require('function.Extension')

const roleHarvester = require('role.harvester');
const roleCharger = require('role.charger');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const taskCharge = require('task.charge')

module.exports.loop = function () {
    
    // TODO: use flag to flag road and extension construction site
    
    const spawn = Game.spawns['Spawn1']
    init(spawn)

    const number_of_creeps = Object.keys(Game.creeps).length
    const charger_capacity = functionSpawn.newCreepBodyFor(spawn).filter(body => body == CARRY).length
    const lack_of_energy = spawn.room.find(FIND_STRUCTURES, { filter: taskCharge.filter }).map(structure => structure.energyCapacity - structure.energy).reduce(function(x, y) { return x + y }, 0)
    const charger_needs = Math.min(Math.floor((lack_of_energy / charger_capacity) / 3), 5)
    const is_need_charge = roleCharger.isNeeded(spawn.room)
    const is_need_build = roleBuilder.isNeeded(spawn.room)

    functionRoad.init(spawn.room)
    
    if (Game.time % 60 == 0) {
        functionExtension.placeExtensions(spawn)
    }

    functionSpawn.cleanupMemory()
    spawnCreep(spawn)

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.spawning) {
            continue
        }

        if (creep.memory.assign != constants.assign.NONE) {
            continue
        }
        
        var number_of_chargers = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.CHARGE).length;
        if ((number_of_chargers < charger_needs) && is_need_charge) {
            creep.changeAssignTo(constants.assign.CHARGE)
            continue
        }
        
        var number_of_upgrader = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.UPGRADE).length;
        if ((number_of_creeps > 3) && (number_of_upgrader <= 3)) {
            creep.changeAssignTo(constants.assign.UPGRADE)
            continue
        }
        
        if (is_need_build) {
            creep.changeAssignTo(constants.assign.BUILD)
            continue
        }
        
        creep.changeAssignTo(constants.assign.UPGRADE)
    }
    
    showAssignees(spawn)
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.spawning) {
            continue
        }

        creep.runAssignedTask()
        
        functionRoad.recordPositionOf(creep)
        
                // creep.changeAssignTo(constants.assign.NONE)
    }
    
    // --
    const towers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_TOWER
    })

    for (const tower of towers) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return 
                    ((structure.structureType != STRUCTURE_WALL) && (structure.hits < structure.hitsMax)) ||
                    ((structure.structureType == STRUCTURE_WALL) && (structure.hits < 500))
                
            }
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
}

function init(spawn) {
    if (!Memory[spawn.room.name]) {
        Memory[spawn.room.name] = {}
    }
    
    if (!Memory[spawn.room.name][constants.object.SOURCE_NE]) {
        const x = 17
        const y = 33
        
        const objects = spawn.room.lookAt(x, y).filter(obj => obj.type == 'source')

        Memory[spawn.room.name][constants.object.SOURCE_NE] = objects[0]['source'].id
    }
    
    if (!Memory[spawn.room.name][constants.object.SOURCE_NW]) {
        const x = 7
        const y = 3
        
        const objects = spawn.room.lookAt(x, y).filter(obj => obj.type == 'source')

        Memory[spawn.room.name][constants.object.SOURCE_NW] = objects[0]['source'].id
    }
}

function spawnCreep(spawn) {
    if (functionSpawn.shouldSpawn(spawn)) {
        var result = functionSpawn.spawnCreep(spawn)
        
        if(result == OK) {
            util.log('New creep ', Object.keys(Game.creeps).length)
        }
        else if ((result == ERR_BUSY) || (result == ERR_NOT_ENOUGH_ENERGY)) {
            util.detailed_log('Failed spawning new creep(as expected) ', result)
        }
        else {
            util.log('Failed spawning new creep ', result)
        }
    }
    
    var spawning = spawn.spawning
    
    if(spawning) { 
        var message = '🛠 ' + (spawning.needTime - spawning.remainingTime) + '/' + spawning.needTime
        
        spawn.room.visual.text(
            message,
            spawn.pos.x, 
            spawn.pos.y - 2, 
            {align: 'left', opacity: 0.8}
        )
    }
}

function showAssignees(spawn) {
    var number_of_creeps = Object.keys(Game.creeps).length

    var i = 0
    Object.keys(constants.assign).map(function(key, index) {
        var number = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign[key]).length
        return key + ' : ' + number + '/' + number_of_creeps
    })
    .forEach(function(message){
        spawn.room.visual.text(
        message,
        spawn.pos.x + 8, 
        spawn.pos.y + i, 
        {align: 'right', opacity: 0.8}
        )
        i += 1
    })
}
