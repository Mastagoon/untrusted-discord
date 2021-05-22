const config = require("../config")
const classData = require("../data/classData.json")
const skillsData = require("../data/skillData.json")
const createEmbedBrowser = require("../utils/createEmbedBrowser")
const { getSkillIcon } = require("../utils/icons")
const { getString } = require("../utils/lang")
const makeEmbed = require("../utils/makeEmbed")

module.exports = {
    name: "skill",
    description: "Use this command to get information about a skill",
    usage: "`"+config.prefix+"skill <skill name>`",
    aliases: 'sk,skillinfo,si',
    execute: async (message, args) => {
        if(!args[0]) return message.reply("Usage `"+config.prefix+"skill <skill name>`")
        const skillInfo = skillsData.find(sk => sk.name.toLowerCase().includes(args.join(" ").toLowerCase())) ||
        skillsData.find(sk => sk.name.split(" ").reduce((res, word) => res += word.slice(0,1), '').toLowerCase() == args[0].toLowerCase())
        if(!skillInfo) return message.reply(getString(message.member, "skillErrNoSkill"))
        // skill found
        const embeds = []
        // skill data embed
        const skillInfoFields = [
            { name: "Skill Description", value: skillInfo.description },
            { name: "Type", value: `${skillInfo.type} Skill`, inline: true }, { name: "Targets", value: skillInfo.targets, inline: true },
            { name: "Cooldown in Days", value: skillInfo.Cooldown_in_days || 0, inline: true }, { name: "Maximum Uses", value: Number(skillInfo.Maximum_uses) || "Unlimited", inline: true }
        ]
        skillInfo.Visits_target == "Yes" && skillInfoFields.push({ name: "Counts as Visit", value: "Yes" })
        skillInfo.Occupies_target == "Yes" && skillInfoFields.push({ name: "Occupies Target", value: "Yes" })
        skillInfo.RNG_based_success == "Yes" && skillInfoFields.push({ name: "RNG Based Success Rate", value: "Yes" })
        embeds.push(await makeEmbed('#FF0000', 'Skill Data', { name: skillInfo.name, iconURL: message.author.avatarURL() }, skillInfoFields, getSkillIcon(skillInfo.id)))
        // skill classes embed
        const skillClassesFields = []
        let index = 1
        classData.map(cl => {
            const skillList = cl.day_skills.concat(cl.night_skills).concat(cl.passive_skills)
            if(skillList.includes(skillInfo.name)) {
                skillClassesFields.push({ name: `${index}. ${cl.ingame_name}`, value: '\u200B' })
                index++
            }
        })
        // skillInfo.classes.forEach((cid, index) => skillClassesFields.push({ name: `${index+1}. ${classData.find(cd => Number(cd.id) === Number(cid)).ingame_name}`, value: '\u200B' }))
        embeds.push(await makeEmbed('#FF0000', 'Classes That Can Use This Skill', { name: skillInfo.name, iconURL: message.author.avatarURL() },skillClassesFields, getSkillIcon(skillInfo.id) ))
        const list = await makeEmbed('#FF0000', 'Index',  { name: skillInfo.name, iconURL: message.author.avatarURL() }, null, getSkillIcon(skillInfo.id), null, '1. Skill Data\n2. Skill Classess')

        message.reply("Searching...").then(mes => {
            return createEmbedBrowser({ embeds, pages: 2, list }, mes, message.author.id)
        })
    }
}