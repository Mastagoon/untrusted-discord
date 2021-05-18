const colors = require("colors")

/**
 * This loggs everything
 * @param {String} message the log message
 * @param {String} type message type (debug, info, warning, error). messages are debug by default.
 */
module.exports = (message, type) => {
    switch(type) {
        default:
        case "debug":
            console.log(`[Debug]: `.cyan+`${message}`)
            break
        case "info":
            console.log(`[Info]: ${message}`)
            break
        case "warning":
            console.log(`[Warning]: `.yellow+`${message} `)
            break
        case "error":
            console.log(`[Error]: `.red+`${message}`)
            break
    }
}