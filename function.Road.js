/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('function.Road');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants')
const util = require('util')

function keyOf(walkable) {
    return walkable.pos.x + ',' + walkable.pos.y
}

function init(room) {
    return  // FixMe:
    
    if (!Memory.road) {
        Memory.road = {}
    }
    if (!Memory.road[room.name]) {
        Memory.road[room.name] = {}
    }
    
    if (Game.time % 120) {
        for (const key in Memory.road[room.name]) {
            Memory.road[room.name][key] -= 1
            
            if (Memory.road[room.name][key] <= 0) {
                delete Memory.road[room.name][key]
            }
            else if (Memory.road[room.name][key] > 1) {
                const arr = key.split(',')
                const x = Number(arr[0])
                const y = Number(arr[1])
                
                constructRoadAt(room, x, y)
            }
        }
    }
}

function recordPositionOf(walkable) {
        return  // FixMe:

    const key = keyOf(walkable)
    
    Memory.road[walkable.room.name][key] += 1
}

function constructRoadAt(room, x, y) {   // TODO: so far it's restricted to the initial room
    const result = room.createConstructionSite(x, y, STRUCTURE_ROAD)
    
    switch(result) {
    case OK:
        util.detailed_log('[Road] create road at ' + x + ',' + y)
        
    case ERR_INVALID_TARGET:
        break
        
    default:
        util.log('[Road] createConstructionSite error: ' + x + ',' + y + ' (' + result + ')')
        break
    }
}

module.exports.init = init
module.exports.recordPositionOf = recordPositionOf