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

Creep.prototype.changeAssignTo = function(assign) {
    if (this.memory.assign == assign) {
        util.detailed_log('Assigning the same assign value: ' + assign + ' for ' + this.name)
        return
    }
    
    this.memory.assign = assign
    // if (assign != constants.assign.NONE) {
    //     this.say(constants.assign_icon[assign])
    // }
    
    // console.log('change to ', constants.assign_icon[assign])
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

    case constants.assign.NONE:
        break

    default:
        util.log('Undefined assign: ', this.memory.assign)
        this.changeAssignTo(constants.assign.NONE)
        break
    }
}

module.exports = {}