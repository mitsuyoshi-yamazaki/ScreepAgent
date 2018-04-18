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
    NULBER_OF_CREEPS            : 14,    // TODO: 動的に決定する
    EMERGENCY_NULBER_OF_CREEPS  : 4
}

module.exports.system = {
    REUSE_PATH  : 10
}

module.exports.assign = {
    NONE      : 0,
    HARVEST   : 1,
    BUILD     : 2,
    UPGRADE   : 3,
    CHARGE    : 4,
    COLLECT   : 5,
    RESERVE   : 6
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
    UPGRADE : 4,
    EXIT_ROOM   : 5,
    RETURN_ROOM : 6,
    RESERVE     : 7
}

module.exports.task_icon = {
    0   : '❗️️',
    1   : '🌿',
    2   : '🔋',
    3   : '🚧',
    4   : '⚡',
    5   : '🏃',
    6   : '🏃',
    7   : '🎫'
}

module.exports.object = {
    SOURCE_NE   : 0,
    SOURCE_NW   : 1
}
