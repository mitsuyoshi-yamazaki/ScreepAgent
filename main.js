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

// role for spawns
// generic creep body

function runSecondSpawn() {
    const spawn = Game.spawns['Spawn2']
    
    const creeps = spawn.pos.findInRange(FIND_CREEPS, 1, {
        filter: creep => (creep.ticksToLive < 1500)
    })
    
    if (creeps.length == 0) {
        return
    }
    
    for (const creep of creeps) {
        const result = spawn.renewCreep(creep)
        
        switch (result) {
        case OK:
            return
            
        default:
            util.log('Spawn2 renewCreep error: ', result)
            break
        }
    }
}

function rooms_init() {
    
    if (!Memory.room_info) {
        Memory.room_info = {}
    }

    for (const room_name in constants.room_info) {
        const room = Game.rooms[room_name]
        const room_info = constants.room_info[room_name]
        
        // util.log('ROOMS: ', room_name, room_info.pos, room)
        
        if (!room) {
            continue
        }
        
        if (!Memory.room_info[room_name]) {
            Memory.room_info[room_name] = {}
        }
        
        if (!Memory.room_info[room_name].source_info) {
        // if (true) {
            var source_info = {}
            
            for (const source of room.find(FIND_SOURCES)) {
                source_info[source.id] = { 
                    id: source.id, 
                    pos: source.pos ,
                    harvester_names: [],
                    room_name: room_name,
                }
            }
            
            Memory.room_info[room_name].source_info = source_info
            // Memory.room_info[room_name].source_info = room.find(FIND_SOURCES).map(source => { return { id: source.id, pos: source.pos }})
            
            // util.log('SOURCE: ', Object.keys(source_info))
        }
        
        // util.log(Memory.room_info[room_name].source_info[0].pos.x)
    }
}

function rooms_event() {
    

    for (const room_name in constants.room_info) {
        const room = Game.rooms[room_name]
        const room_info = constants.room_info[room_name]
        
        if (Memory.room_info[room_name] == null) {
            continue
        }
        
        for (const source_id in Memory.room_info[room_name].source_info) {
            // util.log('SOURCE: ', source_id)
            
            source_event(Memory.room_info[room_name].source_info[source_id])
        }
    }
}

function refresh_harvester_names(source_info) {
    source_info.harvester_names = source_info.harvester_names.filter(name => Game.creeps[name] != null)
}

function source_needs_harvester(source_info) {
    switch (source_info.harvester_names.length) {
    case 0:
        return true
        
    case 1:
        const name = source_info.harvester_names[0]
        return Game.creeps[name].isGoingToDie()
        
    case 2:
        return false
        
    default:
        util.log('[EVENT Source] ', source_info.id, 'unexpectedly found ', source_info.harvester_ids.length, ' harvesters')
        return false
    }
}

function source_event(source_info) {
    refresh_harvester_names(source_info)
    const needs_harvester = source_needs_harvester(source_info)

    if (needs_harvester == false) {
        return
    }
    
    const spawn = Game.spawns['Spawn1'] // TODO: dynamically obtain spawn object && if spawn energy capacity is too low
    
    // TODO: uncomment it
    // const result = spawn.spawnHarvester(source_info.id, source_info.room_name)
    
    // switch (result) {
    // case OK:
    // case ERR_BUSY:
    // case ERR_NOT_ENOUGH_ENERGY:
    //     break
        
    // case default:
    //     util.log('[Event Source] ', spawn.id, ' spawnHarvester error: ', result)
    //     break
    // }
}

module.exports.loop = function () {
    
    runSecondSpawn()
    
    // TODO: log creep name
    // TODO: change creep name to its assign
    // TODO: SPECIAL assign and it's script-ed
    
    // Game progress (has storage, has more than 700 energy capacity, etc)

    const now = Game.time

    // rooms_init()
    
    // if (now % 7 == 0) {
    if (now % 1 == 0) { // FixMe:
        // rooms_event()
    }
    

    // ------------------- //

    const spawn = Game.spawns['Spawn1'] 
    init(spawn)

    const number_of_creeps = Object.keys(Game.creeps).length
    const charger_capacity = (functionSpawn.newCreepBodyFor(spawn).filter(body => body == CARRY).length) * 50
    var lack_of_energy = spawn.room.find(FIND_STRUCTURES, { filter: taskCharge.filter }).map(structure => structure.energyCapacity - structure.energy).reduce(function(x, y) { return x + y }, 0)
    const charger_needs = Math.max(Math.min(Math.floor(lack_of_energy / charger_capacity), 2), 1)
    const is_need_charge = roleCharger.isNeeded(spawn.room)
    const is_need_build = roleBuilder.isNeeded(spawn.room)
    const number_of_max_builder = 2//Math.floor(number_of_creeps / 4) + 1

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
        
        // if (creep.room.name == 'E6S51') {
        //     creep.changeOngoingTaskTo(1)
        //     continue
        // }

        if (creep.memory.assign != constants.assign.NONE) {
            continue
        }
        
        const number_of_chargers = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.CHARGE).length;
        if ((number_of_chargers < charger_needs) && is_need_charge) {
            creep.changeAssignTo(constants.assign.CHARGE)
            continue
        }
        
        // if ((lack_of_energy > 500) && (creep.carry[RESOURCE_ENERGY] >= 150) && (creep.memory.birth_time % 2 == 0)) {
        //     lack_of_energy = lack_of_energy - creep.carry[RESOURCE_ENERGY]
        //     creep.changeAssignTo(constants.assign.CHARGE)
        //     continue
        // }

        const number_of_upgrader = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.UPGRADE).length;
        if ((number_of_creeps > 3) && (number_of_upgrader < 2)) {
            creep.changeAssignTo(constants.assign.UPGRADE)
            continue
        }
        
        const number_of_builder = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.BUILD).length
        if ((number_of_builder >= number_of_max_builder) && (creep.carry[RESOURCE_ENERGY] < 50) && (creep.ticksToLive > 300)) {
            creep.changeAssignTo(constants.assign.COLLECT)
            continue
        }

        if (is_need_build) {
            creep.changeAssignTo(constants.assign.BUILD)
            continue
        }

        if ((number_of_upgrader > 2) && (creep.carry[RESOURCE_ENERGY] < 50) && (creep.ticksToLive > 300)) {
            creep.changeAssignTo(constants.assign.COLLECT)
        }
        else {
            creep.changeAssignTo(constants.assign.UPGRADE)
        }
    }
    
    showAssignees(spawn)
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.spawning) {
            continue
        }

        creep.runAssignedTask()
        
        // if (creep.memory.assign == constants.assign.BUILD) {
        //     creep.changeAssignTo(constants.assign.COLLECT)
        //     creep.changeOngoingTaskTo(constants.ongoing_task.NONE)
        // }
        
        functionRoad.recordPositionOf(creep)
        
                // creep.changeAssignTo(constants.assign.NONE)
    }
    
    // --
    const towers = Object.values(Game.structures).filter(structure => structure.structureType == STRUCTURE_TOWER)

    for (const tower of towers) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return  (structure.structyreType != STRUCTURE_CONTAINER) &&
                        (structure.hits < structure.hitsMax) && (structure.hits < 1000)
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
    
    if (Game.time % 2 == 0) {
        const room = Game.rooms['E6S51']
        
        if (room) {
        
        const attackers = room.find(FIND_HOSTILE_CREEPS, {
            filter: (creep) => {
                return (creep.getActiveBodyparts(ATTACK) +  creep.getActiveBodyparts(RANGED_ATTACK)) > 0;
            }
        })
        
        if (attackers.length > 2) {
            util.log('DETECT ', attackers.length, ' ATTACKERS!!! owner: ', attackers[0].owner.username)
            
            if (room.controller.safeMode > 0) {
                util.log('Safemode active')
            }
            else {
                util.log('Activate safe mode')
                room.controller.activateSafeMode()
            }
        }
        }
    }
}

function spawnCreep(spawn) {
    if (functionSpawn.shouldSpawn(spawn)) {
        var result = functionSpawn.spawnCreep(spawn)
        
        if(result == OK) {
            util.log('New creep ', Object.keys(Game.creeps).length)
        }
        else if ((result == ERR_BUSY) || (result == ERR_NOT_ENOUGH_ENERGY)) {
            util.log('Failed spawning new creep(as expected) ', result)
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
        spawn.pos.x + 13, 
        spawn.pos.y + i, 
        {align: 'right', opacity: 0.8}
        )
        i += 1
    })
}
