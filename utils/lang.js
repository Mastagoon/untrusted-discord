const colors = require("colors")
const config = require("../config")
const Discord = require("discord.js")

/* localization & text formatting */

/**
 * Returns the appropriate string to use depending on the user's language.
 * @param {DJS Member} member the member object of the user
 * @param {String} field name of the needed string
 * @param {Array} params additional parameters to add to the string
 * @returns a string from the appropriate language object
 */
 exports.getString = (member, field, params = []) => {
    let string = ""
    const lang = this.getLang(member)
    string = lang[field]
    for(let i = 0; i < params.length; i++) {
        string = string.replace("%s", params[i])
    }
    return string
}


/**
 * This function Fetches the language Object depending on the user's language. #TODO this needs cleaning 
 * @param {DJS Nember} member the member object of the user
 * @returns the language file of the user
 */
 exports.getLang = (member) => {
    const langs = config.language
    const defLang = langs.find(l => l.default === true)
    if(!member) return require(`../languages/${defLang.file_name}`)  // #TODO this might slow the app down in the long run
    for(l of langs) {
        if(member?.roles?.cache?.find(role => role.name === l.language_role_name))
            return require(`../languages/${l.file_name}`)
    }
    return require(`../languages/${defLang.file_name}`)
}