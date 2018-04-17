/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('function.spawn');
 * mod.thing == 'a thing'; // true
 */

var constants = require('constants');

function newCreepBodyFor(spawn) {
    if (Object.keys(Game.creeps).length < 4) {
        return [WORK, CARRY, MOVE]
    }
    
    var energy_map = {
        WORK: 100,
        CARRY: 50,
        MOVE: 50
    }
    var available_energy = spawn.room.energyCapacityAvailable
    
    var number_of_works = Math.floor((available_energy * 0.5) / energy_map['WORK'])
    var energy_left = available_energy - (number_of_works * energy_map['WORK'])
    var number_of_carry = Math.floor((energy_left / 2) / energy_map['CARRY'])
    
    var body = []
    
    var works = Array.from(Array(number_of_works).keys()).map(_ => WORK)
    body = body.concat(works)
    
    var carries = Array.from(Array(number_of_carry).keys()).map(_ => CARRY)
    body = body.concat(carries)

    var moves = Array.from(Array(number_of_carry).keys()).map(_ => MOVE)
    body = body.concat(moves)
    
    return body
}

function shouldSpawn(spawn) {
    const number_of_creeps = Object.keys(Game.creeps).length
    if (number_of_creeps < constants.main.EMERGENCY_NULBER_OF_CREEPS) {
        return true
    }
    
    const is_energy_available = spawn.room.energyAvailable == spawn.room.energyCapacityAvailable
    const is_creep_needed = number_of_creeps < constants.main.NULBER_OF_CREEPS
    
    return is_energy_available && is_creep_needed
}

function spawnCreep(spawn) {
    const now = Game.time
    const new_name = 'Creep' + now;
    var body = newCreepBodyFor(spawn)
    var assign = constants.assign.NONE

    const number_of_harvesters = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.HARVEST).length;
    if (number_of_harvesters == 0) {
    // if (false) {
        body = [MOVE, CARRY]
        
        const available_energy = spawn.room.energyCapacityAvailable - 100
        
        if (available_energy % 100 == 50) {
            body = body.concat([MOVE])
        }
        
        const number_of_works = Math.floor(available_energy / 100)
        const works = Array.from(Array(number_of_works).keys()).map(_ => WORK)

        body = body.concat(works)
        
        assign = constants.assign.HARVEST
    }

    return spawn.spawnCreep(body, new_name, 
            {
                memory: {
                    assign: assign,
                    birth_time: now,
                    ongoing_task: constants.ongoing_task.NONE,
                    energy_source_index: now % spawn.room.find(FIND_SOURCES).length // FixMe: remove when it become unnecessary
                }
            });
}

function cleanupMemory() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

module.exports.shouldSpawn = shouldSpawn
module.exports.spawnCreep = spawnCreep
module.exports.cleanupMemory = cleanupMemory
module.exports.newCreepBodyFor = newCreepBodyFor

