const config = require("../config")
const classData = require("../data/classData")
const skillData = require("../data/skillsData")
const { getString } = require("../utils/lang")
const makeEmbed = require("../utils/makeEmbed")
const getClassColor = require("../utils/getClassColor")
const createEmbedBrowser = require("../utils/createEmbedBrowser")
const { getClassIcon } = require("../utils/icons")

module.exports = {
    name: "class",
    description: "Use this command to get information about a certain class.",
    usage: "`"+config.prefix+"class <class name>`",
    aliases: "classinfo,ci",
    execute: async (message, args) => {
        if(!args[0]) return message.reply("Usage `"+config.prefix+"class <class name>`")
        const classInfo = classData.find(c => c.name.split(",").includes(args.join(" ").toLowerCase()))
        if(!classInfo) return message.reply(getString(message.member, "classErrNoClass"))
        // class found
        // format class data
        const embeds = []
        // class data embed
        embeds.push(await makeEmbed(getClassColor(classInfo.faction), 'Class Data', { name: classInfo.ingame_name, iconURL: message.author.avatarURL() }, [
            { name: "Faction", value: classInfo.faction }, { name: "Unique", value: classInfo.unique ? 'Yes' : 'No', inlien: true },
            { name: "Guarenteed Spawn", value: classInfo.guarenteed ? 'Yes' : 'No' , inline: true }, { name: "Node Capture Chance", value: classInfo.capture_chance || 'Cannot Hack' },
            { name: "Win Condition", value: classInfo.wincon }
        ], getClassIcon(classInfo.id), null, classInfo.description))
        // class skills embed
        // day skills
        let classDaySkillFields = [], classNightSkillFields = [], classPassiveSkillFields = []
        classInfo.day_skills?.forEach((sk => {
            const skill = skillData.find(sd => sd.name.toLowerCase() === sk.toLowerCase())
            classDaySkillFields.push({
                name: sk, value: skill.description
            })
        } ))
        classInfo.night_skills?.forEach(sk => { classNightSkillFields.push({ name: sk, value: skillData.find(sd => sd.name.toLowerCase()  === sk.toLowerCase()).description }) })
        classInfo.passive_skills?.forEach(sk => { classPassiveSkillFields.push({ name: sk, value: skillData.find(sd => sd.name.toLowerCase()  === sk.toLowerCase()).description }) })
        embeds.push(await makeEmbed(getClassColor(classInfo.faction), `Day Skills`,  { name: classInfo.ingame_name, iconURL: message.author.avatarURL() }, classDaySkillFields, getClassIcon(classInfo.id), null, classDaySkillFields.length ? '' : 'This class has no Day skills' ))
        embeds.push(await makeEmbed(getClassColor(classInfo.faction), `Night Skills`,  { name: classInfo.ingame_name, iconURL: message.author.avatarURL() }, classNightSkillFields, getClassIcon(classInfo.id), null, classNightSkillFields.length ? '' : 'This class has no Night skills' ))
        embeds.push(await makeEmbed(getClassColor(classInfo.faction), `Passive Skills`,  { name: classInfo.ingame_name, iconURL: message.author.avatarURL() }, classPassiveSkillFields, getClassIcon(classInfo.id), null, classPassiveSkillFields.length ? '' : 'This class has no Passive skills' ))
        
        const list = await makeEmbed(getClassColor(classInfo.faction), 'Index',  { name: classInfo.ingame_name, iconURL: message.author.avatarURL() }, null, getClassIcon(classInfo.id), null, '1. Class Data\n2. Day Skills\n3. Night Skills\n4. Passive Skills')
        message.reply("Searching...").then(mes => {
            return createEmbedBrowser({ embeds, pages: 4, list }, mes, message.author.id)
        })
    }
}