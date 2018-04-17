/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util');
 * mod.thing == 'a thing'; // true
 */

var constants = require('constants');

var log = function(){
    if(constants.DEBUG){
        console.log.apply(console, arguments);
    }
}

var detailed_log = function(){
    if(constants.DEBUG && constants.DETAILED_LOG){
        console.log.apply(console, arguments);
    }
}

var detailed_say = function(obj, message) {
    if(constants.DEBUG && constants.DETAILED_LOG){
        obj.say(message)
    }
}

module.exports.log = log
module.exports.detailed_log = detailed_log
module.exports.detailed_say = detailed_say
