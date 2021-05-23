const config = require("../config")
const classData = require("../data/classData.json")
const skillsData = require("../data/skillData.json")
const { getSkillIcon } = require("../utils/icons")
const { getString } = require("../utils/lang")
const makeEmbed = require("../utils/makeEmbed")

module.exports = {
    name: "whohas",
    description: "Use this command to learn which classes has a certain skill",
    usage: "`"+config.prefix+"whohas <skill name>`",
    aliases: 'wh,who',
    execute: async (message, args) => {
        if(!args[0]) return message.reply("Usage `"+config.prefix+"whohas <skill name>`")
        const skillInfo = skillsData.find(sk => sk.name.toLowerCase().includes(args.join(" ").toLowerCase())) || 
        skillsData.find(sk => sk.name.split(" ").reduce((res, word) => res += word.slice(0,1), '').toLowerCase() == args[0].toLowerCase())
        if(!skillInfo) return message.reply(getString(message.member, "skillErrNoSkill"))
        // skill found
        // find classes with this skill
        const skillClassesFields = []
        let index = 1
        classData.map(cl => {
            const skillList = cl.day_skills.concat(cl.night_skills).concat(cl.passive_skills)
            if(skillList.includes(skillInfo.name)) {
                skillClassesFields.push({ name: `${index}. ${cl.ingame_name}`, value: '\u200B' })
                index++
            }
        })
        const embed = await makeEmbed('#00F7F7', `Classes That Can Use ${skillInfo.name}`, { name: skillInfo.name, iconURL: message.author.avatarURL() },skillClassesFields, getSkillIcon(skillInfo.id))
        embed.setFooter('Untrusted Bot', "https://cdn.discordapp.com/attachments/844031096752570398/844330289622286356/logo_untrusted.png")
        return message.reply(embed)
    }
}