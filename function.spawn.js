/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('function.spawn');
 * mod.thing == 'a thing'; // true
 */

var constants = require('constants');
const util = require('util')

const first_room_name =  'E8S51'
const left_room_name = 'E7S51'
const left_left_room_name = 'E6S51'

function newCreepBodyFor(spawn) {
    if (Object.keys(Game.creeps).length < 4) {
        return [WORK, CARRY, MOVE]
    }
    
    var available_energy = spawn.room.energyAvailable
    const energy_unit = 200
    const body_unit = [WORK, CARRY, MOVE]
    var body = []

    while (available_energy >= energy_unit) {
        body = body.concat(body_unit)
        available_energy = available_energy - energy_unit
    }

    return body
}

function shouldSpawn(spawn) {
    const number_of_creeps = Object.keys(Game.creeps).length
    if (number_of_creeps < constants.main.EMERGENCY_NULBER_OF_CREEPS) {
        return true
    }
    
    const is_energy_available = (spawn.room.energyAvailable == spawn.room.energyCapacityAvailable) || (spawn.room.energyAvailable >= 800)
    const is_creep_needed = number_of_creeps < constants.main.NULBER_OF_CREEPS
    
    return is_energy_available && is_creep_needed
}

function spawnCreep(spawn) {
    const now = Game.time
    const new_name = 'Creep' + now;
    var body = null
    var assign = constants.assign.NONE
    var destination_room_name = null
    var meta = {}

    var available_energy = spawn.room.energyAvailable


    const number_of_creeps = Object.keys(Game.creeps).length

    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.HARVEST)
    if ((number_of_creeps > 8) && (harvesters.length < 1)) {
        body = [MOVE, CARRY, CARRY]
        
        const energy = available_energy - 150
        
        const number_of_works = Math.min(Math.floor((energy) / 100), 6) // 6WORK, 2CARRY -> 100/9tick + 1tick -> 3000/300tick
        const works = Array.from(Array(number_of_works).keys()).map(_ => WORK)
        body = body.concat(works)
        
        const number_of_moves = Math.min(Math.floor((energy - (number_of_works * 100)) / 50), 2)
        const moves = Array.from(Array(number_of_moves).keys()).map(_ => MOVE)
        body = body.concat(moves)

        assign = constants.assign.HARVEST
        
        // if ((harvesters.length == 1) && (harvesters[0].memory.meta.destination_room_name == first_room_name)) {
        //     meta = {
        //         destination_room_name: left_room_name,
        //         destination_pos: { x: 39, y: 28 }
        //     }
        // }
        // else {
            meta = {
                destination_room_name: first_room_name,
                destination_pos: { x: 16, y: 32 }
            }
        // }
        
    }
    else if (available_energy > 700) {
        const reservers = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.RESERVE);
        if ((number_of_creeps > 8) && (reservers.length < 2)) {
            body = [CLAIM]  // TODO: Double CLAIM body parts 
            
            const number_of_moves = Math.min(Math.floor((available_energy - 600) / 50), 2)
            const moves = Array.from(Array(number_of_moves).keys()).map(_ => MOVE)
            
            body = body.concat(moves)
            assign = constants.assign.RESERVE
            
            const room_names = ['E7S51', 'E9S51']
            const reserving_room_names = reservers.map(reserver => reserver.memory.destination_room_name)
            
            destination_room_name = room_names[0]   // For if destination_room_name couldn't be determined
            
            for (const target_room_name of room_names) {
                if (reserving_room_names.includes(target_room_name) == false) {
                    destination_room_name = target_room_name
                    break
                }
            }
        }
    }
    
    if ((body == null) && (number_of_creeps > 10)) {
        const carrier = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.CARRIER)
        if (carrier.length == 0) {
            body = []
            
            const energy_unit = 200
            const body_unit = [CARRY, CARRY, MOVE]

            while (available_energy >= energy_unit) {
                body = body.concat(body_unit)
                available_energy = available_energy - energy_unit
            }
            
            assign = constants.assign.CARRIER
            // meta = {
            //     source: {
            //         room_name: 'E8S51',
                    
            //     }
            // }
        }
    }
    
    if (body == null) {
        body = newCreepBodyFor(spawn)
    }
    
    const result = spawn.spawnCreep(body, new_name, 
            {
                memory: {
                    assign: assign,
                    birth_time: now,
                    ongoing_task: constants.ongoing_task.NONE,
                    energy_source_index: now % spawn.room.find(FIND_SOURCES).length, // FixMe: remove when it become unnecessary
                    destination_room_name: destination_room_name,   // FixMe: remove when it become unnecessary (move it into meta)
                    meta: meta
                }
            });
            
    if (result == OK) {
        util.log('[Spawn] spawn creep with body ', body)
        // util.log('enrgy: ', available_energy, ' number of creeps ', number_of_creeps, ' number of reservers ', reservers.length)
    }        
    
    return result
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

