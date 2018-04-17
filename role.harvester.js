const constants = require('constants')
const util = require('util')

const taskHarvest = require('task.harvest')
const taskCharge = require('task.charge')

const roleHarvester = {
    isNeeded: function(room) {
        const number_of_harvesters = _.filter(Game.creeps, (creep) => creep.memory.assign == constants.assign.HARVEST).length;
        return number_of_harvesters < 1
    },

    run: function(creep) {
        const x = 16
        const y = 32
        
        if ((creep.pos.x != x) || (creep.pos.y != y)) {
            const result = creep.moveTo(x, y)
            
            switch (result) {
                case OK:
                    break
                    
                case ERR_NO_PATH:
                    
                    break
            
                default:
                    util.log('[Harvester role] moveTo error: ' + result)
                    break
                }

            return
        }

        const source_id = Memory[creep.room.name][constants.object.SOURCE_NE]
        const source = Game.getObjectById(source_id)
        
        if ((creep.carryCapacity == creep.carry.energy) || (source.energy == 0)) {
            // transfer
            
            const containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: structure => (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
            })
            
            if (containers.length) {
                const result = creep.transfer(containers[0], RESOURCE_ENERGY)
                
                switch (result) {
                case OK:
                    break
            
                default:
                    util.log('[Harvester role] transfer error: ' + result)
                    break
                }
            }
            else {
                util.log('[Harvester role] no containers found')
                
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
                util.log('[Harvester role] harvest error: ' + result)
                break
            }
        }
        
        // This creep won't be un-assigned
    }
}

module.exports = roleHarvester;