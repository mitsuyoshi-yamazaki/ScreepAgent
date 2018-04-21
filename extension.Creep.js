/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extension.Creep');
 * mod.thing == 'a thing'; // true
 */

const constants = require('constants')
const util = require('util')

Creep.prototype.moveToRoom = function(destination_room_name, opt) {
    if (this.room.name == destination_room_name) {
        if (this.pos.x == 0) {
            return this.move(RIGHT)
        }
        else if (this.pos.x == 49) {
            return this.move(LEFT)
        }
        else if (this.pos.y == 0) {
            return this.move(BOTTOM)
        }
        else if (this.pos.y == 49) {
            return this.move(TOP)
        }
        else {
            return OK
        }
    }
    
    const exit = this.room.findExitTo(destination_room_name)
    const closest_exit = this.pos.findClosestByPath(exit)
    
    return this.moveWith(closest_exit, Object.assign({}, {
        visualizePathStyle: { stroke: '#ffff00' }
    }, opt))
}

Creep.prototype.moveWith = function(obj, opt) {
    return this.moveWith(obj.pos.x, obj.pos.y, opt)
}

Creep.prototype.moveWith = function(x, y, opt) {
    if (((opt == null) || !opt.disable_road_repair) && (this.carry[RESOURCE_ENERGY] > 50)) {
        const road = this.room.lookForAt(LOOK_STRUCTURES, this).filter( structure => structure.structureType == STRUCTURE_ROAD )[0]
        
        if (road && (road.hitsMax - road.hits > 500)) {
            const r = this.repair(road)
            if (r == OK) {
                this.say('🔨')
                return OK
            }
        }
    }

    
    const default_options = {
        reusePath: constants.system.REUSE_PATH,
        ignoreCreeps: true,
    }
    return this.moveTo(x, y, Object.assign({}, default_options, opt))
}

module.exports = {}