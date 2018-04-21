/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extension.StructureSpawn');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants')
const util = require('util')

StructureSpawn.prototype.spawnHarvester = function(source_id, room_name) {
    const now = Game.time
    const new_name = 'Creep' + now;
    const meta = {
        source_id: source_id,
        room_name: room_name,
    }
    
    var body = []
    const body_unit = [WORK, WORK, WORK, CARRY, MOVE, MOVE] // TODO: for RCL1
    const unit_cost = 450
    
    body = body.concat(body_unit)
    body = body.concat(body_unit)
    
    return this.spawnCreep(body, new_name, 
            {
                memory: {
                    role: constants.role.HARVESTER,
                    birth_time: now,
                    meta: meta,
                }
            })
}

module.exports = {}