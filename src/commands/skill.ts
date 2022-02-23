// import { Command } from "discord.js"
import { ButtonInteraction, CommandInteraction, EmbedField, EmbedFieldData, InteractionCollector, InteractionReplyOptions, Message, MessageComponentInteraction, MessageEmbed, ReplyMessageOptions, User } from "discord.js"
import { Command } from "../lib/Command"
import config from "../lib/config"
import classData from "../data/classData.json"
import { CommandArg, CommandExecuteParameters, Skill } from "../types"
import findSkill from "../utils/findSkill"
import getIcon from "../utils/getIcon"
import makeEmbed from "../utils/makeEmbed"
import pagination from "../utils/pagination"

const options: CommandArg[] = [
    {
        name: 'skill',
        description: 'The name of the skill',
        isRequired: true
    }
]

export const getClassesWithThisSkill = (skill: Skill, user: User): MessageEmbed => {
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

const collectorStop = (collector: InteractionCollector<MessageComponentInteraction>,
    embed: MessageEmbed,
    interaction?
        : CommandInteraction, reply?: Message) => {
    interaction ? interaction!.editReply({
        embeds: [embed],
        components: []
    })
        : reply!.edit({
            embeds: [embed],
            components: []
        })
    return collector.stop()
}

const skill = async (options: CommandExecuteParameters) => {
    const { args, type, message, interaction } = options
    const isSlash = type == 'interaction'
    if (!isSlash && !args?.length) return message?.reply('You need to specify a skill')
    const query = isSlash ? interaction?.options.getString('skill') : args?.join(' ')
    const skill = findSkill(query)
    if (!skill) return message ? message?.reply('Could not find a skill with that name') : interaction?.reply('Could not find a skill with that name')
    const user = isSlash ? interaction?.user : message?.author
    if (!user) return
    const id = user?.id
    // found skill
    const embeds: MessageEmbed[] = createSkillEmbeds(skill, user)
    const replyOptions: ReplyMessageOptions | InteractionReplyOptions = { embeds: [embeds[0]], components: [pagination(0, embeds.length)], fetchReply: true }
    const reply = isSlash ? await interaction?.reply(replyOptions)
        : await message?.reply(replyOptions)
    const filter = (i: MessageComponentInteraction) => i.user.id === id && i.message.id === reply?.id
    const collector = isSlash ?
        interaction?.channel?.createMessageComponentCollector({ filter, time: 1000 * 60 * 3, max: 10 })
        : (reply as Message).createMessageComponentCollector({ filter, time: 1000 * 60 * 3 })
    let page = 0
    collector?.on('collect', (btn: ButtonInteraction) => {
        if (!btn || (btn.customId != 'prev' && btn.customId != 'next' && btn.customId != 'end')) return
        if (btn.customId === 'end') {
            return collectorStop(collector, embeds[page], interaction, reply ?? undefined)
        }
        btn.deferUpdate()
        if (btn.customId.startsWith('prev') && page > 0) --page
        if (btn.customId.startsWith('next') && page < embeds.length - 1) ++page
        reply ? (reply as Message).edit({
            embeds: [embeds[page]], components: [pagination(page, embeds.length)]
        })
            : interaction!.editReply({ embeds: [embeds[page]], components: [pagination(page, embeds.length)] })
    })
    collector?.on('end', () => collectorStop(collector, embeds[page], interaction, reply ?? undefined))
    return
}

export default new Command('skill', 'Use this command to get information about a skill',
    ['sk', 'skillinfo', 'si'], skill, options
)