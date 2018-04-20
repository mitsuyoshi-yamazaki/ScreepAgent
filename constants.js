/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('constants');
 * mod.thing == 'a thing'; // true
 */

const constants = {
    DEBUG: true,
    DETAILED_LOG: false,
    NULL: 'null',
    
    main: {
        NULBER_OF_CREEPS            : 26,    // TODO: 動的に決定する
        EMERGENCY_NULBER_OF_CREEPS  : 4,
    },
    
    system: {
        REUSE_PATH  : 3
    },
    
    room_info: {
        E8S51: { pos: { x: +0, y: +0 } },
        E7S51: { pos: { x: -1, y: +0 } },
        E6S51: { pos: { x: -2, y: +0 } },
    },

    role: {
        NONE        : 'none',
        HARVESTER   : 'harvester',
        CARRIER     : 'cariier',
        WORKER      : 'worker',
        RESERVER    : 'reserver',
    },

    assign: {   // TODO: remove
        NONE      : 0,
        HARVEST   : 1,
        BUILD     : 2,
        UPGRADE   : 3,
        CHARGE    : 4,
        COLLECT   : 5,
        RESERVE   : 6,
        MANUAL    : 7,
        CARRIER   : 8,
    },
    
    task_state: {
    IN_PROGRESS : 0,
    DONE        : 1
    },
    
    ongoing_task: {
    NONE    : 0,
    HARVEST : 1,
    CHARGE  : 2,
    BUILD   : 3,
    UPGRADE : 4,
    EXIT_ROOM   : 5,
    RETURN_ROOM : 6,
    RESERVE     : 7,
    RENEW       : 8,
    },
    
    task_icon: {
    0   : '❗️️',
    1   : '🌿',
    2   : '🔋',
    3   : '🚧',
    4   : '⚡',
    5   : '🏃',
    6   : '🏃',
    7   : '🎫'
    },
    
    object: {
        SOURCE_NE   : 0,
        SOURCE_NW   : 1
    },
}

module.exports = constants

// module.exports.DEBUG        = true
// module.exports.DETAILED_LOG = false

// module.exports.main = {
//     NULBER_OF_CREEPS            : 12,    // TODO: 動的に決定する
//     EMERGENCY_NULBER_OF_CREEPS  : 4,
// }

// module.exports.system = {
//     REUSE_PATH  : 10
// }

// module.exports.assign = {
//     NONE      : 0,
//     HARVEST   : 1,
//     BUILD     : 2,
//     UPGRADE   : 3,
//     CHARGE    : 4,
//     COLLECT   : 5,
//     RESERVE   : 6
// }

// module.exports.task_state = {
//     IN_PROGRESS : 0,
//     DONE        : 1
// }

// module.exports.ongoing_task = {
//     NONE    : 0,
//     HARVEST : 1,
//     CHARGE  : 2,
//     BUILD   : 3,
//     UPGRADE : 4,
//     EXIT_ROOM   : 5,
//     RETURN_ROOM : 6,
//     RESERVE     : 7
// }

// module.exports.task_icon = {
//     0   : '❗️️',
//     1   : '🌿',
//     2   : '🔋',
//     3   : '🚧',
//     4   : '⚡',
//     5   : '🏃',
//     6   : '🏃',
//     7   : '🎫'
// }

// module.exports.object = {
//     SOURCE_NE   : 0,
//     SOURCE_NW   : 1
// }
