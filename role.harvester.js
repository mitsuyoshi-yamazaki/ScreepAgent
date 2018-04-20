const constants = require('constants')
const util = require('util')

const taskHarvest = require('task.harvest')
const taskCharge = require('task.charge')
const taskExitRoom = require('task.exit_room')

const roleHarvester = {
    _run: function(creep) {
        // goto destination
        // if arrived: record tick to 
        // if no container: construct
        
        
    },
    
    isNeeded: function(room) {
        const number_of_harvesters = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.HARVEST).length;
        return number_of_harvesters < 1
    },

    run: function(creep) {
        if ((creep.room.name != creep.memory.meta.destination_room_name)) {
            taskExitRoom.run(creep)
            return
        }
        
        
        const x = creep.memory.meta.destination_pos.x
        const y = creep.memory.meta.destination_pos.y

        if ((creep.pos.x != x) || (creep.pos.y != y)) {
            const result = creep.moveTo(x, y, { reusePath: constants.system.REUSE_PATH * 2 })
            
            switch (result) {
                case OK:
                case ERR_TIRED:
                    break
                    
                case ERR_NO_PATH:
                    break
            
                default:
                    util.log('[Harvester role] moveTo error: ', result, creep.name)
                    break
                }

            return
        }

        // const source_id = Memory[creep.room.name][constants.object.SOURCE_NE]
        // const source = Game.getObjectById(source_id)
        const source = creep.pos.findInRange(FIND_SOURCES, 1)[0]
        
        if ((creep.carryCapacity == creep.carry.energy) || (source.energy == 0)) {
            // transfer
            
            const containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: structure => (structure.structureType == STRUCTURE_CONTAINER)// && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
            })
            
            if (containers.length) {
                const result = creep.transfer(containers[0], RESOURCE_ENERGY)
                
                switch (result) {
                case OK:
                    break
                
                case ERR_FULL:
                    util.log('[Harvester role] transfer error: ', result, creep.name)
                    creep.room.createConstructionSite(x + 1, y, STRUCTURE_CONTAINER)
                    const site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
                    creep.build(site)
                    break
            
                default:
                    util.log('[Harvester role] transfer error: ', result, creep.name)
                    break
                }
            }
            else {
                util.log('[Harvester role] no containers found ', creep.name)
                
                creep.room.createConstructionSite(x + 1, y - 1, STRUCTURE_CONTAINER)
                const site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
                creep.build(site)
            }
        }
        else {
            // harvest
            const result = creep.harvest(source)
        
            switch (result) {
            case OK:
            case ERR_NOT_ENOUGH_RESOURCES:
                break
            
            default:
                util.log('[Harvester role] harvest error: ', result, creep.name)
                break
            }
        }
        
        // This creep won't be un-assigned
    }
}

module.exports = roleHarvester;