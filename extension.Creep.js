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

const roleHarvester = require('role.harvester')
const roleCharger = require('role.charger')
const roleUpgrader = require('role.upgrader')
const roleBuilder = require('role.builder')
const roleCollector = require('role.collector')
const roleReserver = require('role.reserver')
const roleCarrier = require('role.carrier')

Creep.prototype.isGoingToDie = function() {
    const preparation_time = this.memory.meta.preparation_time
    
    if (preparation_time == null) {
        return false
    }
    return (preparation_time + 5) > this.ticksToLive
}

Creep.prototype.moveToRoom = function(destination_room_name, pos) {
    if (this.room.name == destination_room_name) {
        if ((this.pos.x == pos.x) && (this.pos.y == pos.y)) { // If pos is a object's position, the user of this function should take care of it
            return OK
        }
        
        // TODO: make pos to optional, and default pos to room controller
        console.log('[Creep] moveToRoom same room ', destination_room_name, this.room.name)
        return this.moveWith(pos, {
            visualizePathStyle: {stroke: '#ffff00'},
        })
    }
    
    const exit = this.room.findExitTo(destination_room_name)
    const closest_exit = this.pos.findClosestByPath(exit)
    
    return this.moveWith(closest_exit, {
        visualizePathStyle: {stroke: '#ffff00'},
    })
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
        else {
        }
    }

    
    const default_options = {
        reusePath: constants.system.REUSE_PATH,
        ignoreCreeps: true,
    }
    return this.moveTo(x, y, Object.assign({}, default_options, opt))
}

// ----------------------- //

Creep.prototype.changeAssignTo = function(assign) {
    // if ((this.room.name == 'E6S51') && (assign != constants.assign.COLLECT)) {
    //     util.log('change assign from ', this.memory.assign, 'to', assign)
    //     return
    // }
    
    if (this.memory.assign == assign) {
        util.detailed_log('Assigning the same assign value: ' + assign + ' for ' + this.name)
        return
    }
    
    this.changeOngoingTaskTo(constants.ongoing_task.NONE)
    this.memory.assign = assign
}

Creep.prototype.changeOngoingTaskTo = function(task) {
    if (this.memory.ongoing_task == task) {
        util.detailed_log('Changing to the same ongoing_task value: ' + task + ' for ' + this.name)
        return
    }
    
    this.memory.ongoing_task = task
    if (task != constants.ongoing_task.NONE) {
        this.say(constants.task_icon[task])
    }
}

Creep.prototype.runAssignedTask = function() {
    switch (this.memory.assign) {
    case constants.assign.HARVEST:
        roleHarvester.run(this)
        break
        
    case constants.assign.BUILD:
        roleBuilder.run(this)
        break

    case constants.assign.UPGRADE:
        roleUpgrader.run(this)
        break

    case constants.assign.CHARGE:
        roleCharger.run(this)
        break

    case constants.assign.COLLECT:
        roleCollector.run(this)
        break

    case constants.assign.RESERVE:
        roleReserver.run(this)
        break
        
    case constants.assign.CARRIER:
        roleCarrier.run(this)
        break

    case constants.assign.MANUAL:
        // this.say("Let's go")
        
        if (this.name == 'Attacker') {
            const destination = 'E1S51'
                this.say('Hello')
        
            if (this.room.name == destination) {
                // this.moveTo(36, 18)
            }
            else {
                // this.moveToRoom(destination, { x: 29, y: 17 })
            }
        }
        else {
            this.move(TOP_LEFT)
            // this.moveTo(this.room.controller)
        }
        
        // console.log('attack: ', this.attack(Game.getObjectById('5ad2ba4fd208df4226bad477')))
        break

    case constants.assign.NONE:
        break

    default:
        util.log('Undefined assign: ', this.memory.assign)
        this.changeAssignTo(constants.assign.NONE)
        break
    }
}

module.exports = {}