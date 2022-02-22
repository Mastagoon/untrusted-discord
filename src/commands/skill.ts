// import { Command } from "discord.js"
import { EmbedField, EmbedFieldData, MessageEmbed, ReplyMessageOptions, User } from "discord.js"
import { Command } from "../Command"
import config from "../config"
import classData from "../data/classData.json"
import skillData from "../data/skillData.json"
import { CommandArg, CommandExecuteParameters, Skill } from "../types"
import getIcon from "../utils/getIcon"
import makeEmbed from "../utils/makeEmbed"
import pagination from "../utils/pagination"

// const command: Command = {
//     name: "skill",
//     description: "Use this command to get information about a skill",
//     usage: "`" + config.prefix + "skill <skill name>`",
//     aliases: ['sk', 'skillinfo', 'si'],
//     data: new SlashCommandBuilder().setName('skill').setDescription("Use this command to get information about a skill"),
//     async: execute(options: CommandExecuteParameters): Promise<void> {
// }

const options: CommandArg[] = [
    {
        name: 'skill',
        description: 'The name of the skill',
        isRequired: true
    }
]

const matchSkill = (args?: string | null): Skill | null => {
    if (!args) return null
    const query = args.split(" ")
    const skill = skillData.find(
        sk => sk.name.toLowerCase() == query.join(' ').toLowerCase() // name given
            || sk.aliases.toLowerCase().split(' ').includes(query.join(' ').toLowerCase()) // aliases
            || sk.name.split(" ").reduce((res, word) => res += word.slice(0, 1), '').toLowerCase() == query[0].toLowerCase()
    )
    return skill ? skill as unknown as Skill : null
}

const getClassesWithThisSkill = (skill: Skill, user: User): MessageEmbed => {
    const list: EmbedField[] = []
    classData.map((cl) => {
        const skillList = skill.type.toLowerCase() == 'night' ? cl.night_skills
            : skill.type.toLowerCase() == 'day' ? cl.day_skills : cl.passive_skills
        if (skillList.includes(skill.name))
            list.push({ name: `${list.length + 1}. ${cl.ingame_name}`, value: `\u200B.`, inline: false })
    })
    return makeEmbed({
        footer: { text: 'Untrusted Bot | Page 1 of 2', iconURL: config.avatar },
        description: '',
        color: '#00F7F7', title: 'Classes with this skill', fields: list, author: {
            name: skill.name, iconURL: user.avatarURL() ?? undefined
        }, thumbnail: { url: getIcon(Number(skill.id)) }
    })
}

const createSkillEmbeds = (skill: Skill, user: User) => {
    const embeds: MessageEmbed[] = []
    const fields = [
        { name: 'Skill Description', value: skill.description },
        { name: "Type", value: `${skill.type} Skill`, inline: true }, { name: "Targets", value: skill.targets, inline: true },
        { name: "Cooldown in Days", value: skill.Cooldown_in_days || 0, inline: true }, { name: "Maximum Uses", value: skill.Maximum_uses || "Unlimited", inline: true }
    ] as EmbedFieldData[]
    skill.Visits_target == 'Yes' && fields.push({ name: 'Counts as Visit', value: 'Yes', inline: false })
    skill.Occupies_target == "Yes" && fields.push({ name: "Occupies Target", value: "Yes", inline: false })
    skill.RNG_based_success == "Yes" && fields.push({ name: "RNG Based Success Rate", value: "Yes", inline: false })
    embeds.push(makeEmbed(
        {
            title: skill.name,
            author: {
                name: skill.name, iconURL: user.avatarURL() ?? undefined
            },
            description: skill.description,
            fields: [...fields],
            thumbnail: { url: getIcon(Number(skill.id)) },
            color: '#00F7F7',
            footer: { text: 'Untrusted Bot | Page 1 of 2', iconURL: config.avatar }
        }
    ))
    // classes with this skill
    embeds.push(getClassesWithThisSkill(skill, user))
    return embeds
}

const skill = async (options: CommandExecuteParameters) => {
    const { args, type, message, interaction } = options
    const isSlash = type == 'interaction'
    if (!isSlash) if (!args?.length) return message?.reply('You need to specify a skill')
    const query = isSlash ? interaction?.options.getString('skill') : args?.join(' ')
    const skill = matchSkill(query)
    if (!skill) return message?.reply('Could not find a skill with that name')
    const user = isSlash ? interaction?.user : message?.author
    if (!user) return
    const id = user?.id
    // found skill
    const embeds: MessageEmbed[] = createSkillEmbeds(skill, user)
    const replyOptions: ReplyMessageOptions = { embeds: [embeds[0]], components: [pagination(0, embeds.length)] }
    const reply = isSlash ? await interaction?.reply(replyOptions)
        : await message?.reply(replyOptions)
    // const reply = await message?.reply(replyOptions)
    if (!reply) return
    const collector = reply.createMessageComponentCollector({ filter: i => i.user.id === id, time: 1000 * 60 * 3 })
    let page = 0
    collector.on('collect', (btn) => {
        console.log('collect')
        if (!btn || (btn.customId != 'prev' && btn.customId != 'next')) return
        btn.deferUpdate()
        if (btn.customId == 'prev' && page > 0) --page
        if (btn.customId == 'next' && page < embeds.length - 1) ++page
        reply.edit({
            embeds: [embeds[page]], components: [pagination(page, embeds.length)]
        })
    })
    return
}

export default new Command('skill', 'Use this command to get information about a skill',
    `" + config.prefix + "skill <skill name>`, ['sk', 'skillinfo', 'si'], skill, options
)