import axios from "axios"
import { MessageEmbed, User } from "discord.js"
import { Command } from "../lib/Command"
import config from "../lib/config"
import { CommandArg, CommandExecuteParameters, UserStats } from "../types"
import getExpRate from "../utils/getExpRate"
import makeEmbed from "../utils/makeEmbed"

const options: CommandArg[] = [
    {
        name: "username",
        description: "The name of the user",
        isRequired: true
    }
]

const createStatEmbed = (user: User, name: string, data: UserStats): MessageEmbed => {
    console.log(data)
    getExpRate(Number(data.currentXp), Number(data.xpToNextLevel))
    return makeEmbed({
        color: 0x00FF00,
        title: `${name}'s stats`,
        author: { name: user.username, iconURL: user.avatarURL() ?? undefined },
        fields: [
            { name: 'Level', value: data.currentLevel, inline: true },
            { name: 'Experience', value: `${data.currentXp}/${data.xpToNextLevel}`, inline: true },
            { name: 'test', value: "", inline: true },
        ],
        thumbnail: { url: data.AvatarURL },
        footer: { text: 'Untrusted Bot', iconURL: config.avatar },
    })
}

const stats = async (options: CommandExecuteParameters) => {
    const { args, type, interaction, message } = options
    const isSlash = type === 'interaction'
    if (!isSlash && !args?.length) return message?.reply('You need to specify a username')
    const username = isSlash ? interaction?.options.getString('username') : args?.join(' ')
    const result = await axios.get(`https://eu01.playuntrusted.com/publicAPI/publicAPI.php?request=getProfile&nickname=${username}`)
    if (!result || !result.data?.length) return isSlash ?
        interaction?.reply("Could not find a user with that name") :
        message?.reply("Could not find a user with that name")
    // const stats: UserStats
    const user = interaction ? interaction.user : message?.author
    const embed = createStatEmbed(user!, username!, JSON.parse(result.data.replace(/\,(?!\s*?[\{\[\"\'\w])/g, ''))[0] as UserStats)
    return isSlash ? interaction?.reply({ embeds: [embed] }) : message?.reply({ embeds: [embed] })
}

export default new Command('stats', 'Use to get the stats of a player', ['stat', 'st'], stats, options)