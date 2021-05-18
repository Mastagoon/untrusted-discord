const config = require("../config")
const classData = require("../data/classData")
const skillsData = require("../data/skillsData")
const createEmbedBrowser = require("../utils/createEmbedBrowser")
const { getSkillIcon, getClassIcon } = require("../utils/icons")
const { getString } = require("../utils/lang")
const makeEmbed = require("../utils/makeEmbed")

module.exports = {
    name: "skill",
    dsecription: "Use this command to get information about a skill",
    usage: "`"+config.prefix+"skill <skill name>`",
    aliases: 'sk,skillinfo,si',
    execute: async (message, args) => {
        if(!args[0]) return message.reply("Usage `"+config.prefix+"skill <skill name>`")
        const skillInfo = skillsData.find(sk => sk.aliases.split(",").includes(args.join(" ").toLowerCase()))
        if(!skillInfo) return message.reply(getString(message.member, "skillErrNoSkill"))
        // skill found
        const embeds = []
        // skill data embed
        const skillInfoFields = [
            { name: "Skill Description", value: skillInfo.description },
            { name: "Type", value: `${skillInfo.type} Skill`, inline: true }, { name: "Targets", value: skillInfo.targets, inline: true },
            { name: "Cooldown in Days", value: skillInfo.cooldown || 0, inline: true }, { name: "Maximum Uses", value: skillInfo.uses || "Unlimited", inline: true }
        ]
        skillInfo.visits && skillInfoFields.push({ name: "Counts as Visit", value: "Yes" })
        skillInfo.occupies && skillInfoFields.push({ name: "Occupies Target", value: "Yes" })
        skillInfo.rng && skillInfoFields.push({ name: "RNG Based Success Rate", value: "Yes" })
        embeds.push(await makeEmbed('#FF0000', 'Skill Data', { name: skillInfo.name, iconURL: message.author.avatarURL() }, skillInfoFields, getSkillIcon(skillInfo.id)))
        // skill classes embed
        const skillClassesFields = []
        skillInfo.classes.forEach((cid, index) => skillClassesFields.push({ name: `${index+1}. ${classData.find(cd => cd.id === cid).ingame_name}`, value: '\u200B' }))
        embeds.push(await makeEmbed('#FF0000', 'Classes With This Skill', { name: skillInfo.name, iconURL: message.author.avatarURL() },skillClassesFields ))
        const list = await makeEmbed('#FF0000', 'Index',  { name: skillInfo.name, iconURL: message.author.avatarURL() }, null, getSkillIcon(skillInfo.id), null, '1. Skill Data\n2. Skill Classess')

        message.reply("Searching...").then(mes => {
            return createEmbedBrowser({ embeds, pages: 2, list }, mes, message.author.id)
        })
    }
}