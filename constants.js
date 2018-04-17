/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('constants');
 * mod.thing == 'a thing'; // true
 */

module.exports.DEBUG        = true
module.exports.DETAILED_LOG = false

module.exports.main = {
    NULBER_OF_CREEPS            : 16,    // TODO: 動的に決定する
    EMERGENCY_NULBER_OF_CREEPS  : 4
}

module.exports.assign = {
    NONE      : 0,
    HARVEST   : 1,
    BUILD     : 2,
    UPGRADE   : 3,
    CHARGE    : 4
}

module.exports.assign_icon = {
    0   : '❗️️',
    1   : '🌿',
    2   : '🚧',
    3   : '⚡',
    4   : '🔋'
}

module.exports.task_state = {
    IN_PROGRESS : 0,
    DONE        : 1
}

module.exports.ongoing_task = {
    NONE    : 0,
    HARVEST : 1,
    CHARGE  : 2,
    BUILD   : 3,
    UPGRADE : 4
}

module.exports.task_icon = {
    0   : '❗️️',
    1   : '🌿',
    2   : '🔋',
    3   : '🚧',
    4   : '⚡'
}

module.exports.object = {
    SOURCE_NE   : 0,
    SOURCE_NW   : 1
}
