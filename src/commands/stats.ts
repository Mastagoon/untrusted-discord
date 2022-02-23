import axios from "axios"
import { MessageEmbed } from "discord.js"
import { Command } from "../lib/Command"
import { CommandArg, CommandExecuteParameters, UserStats } from "../types"
import makeEmbed from "../utils/makeEmbed"

const options: CommandArg[] = [
    {
        name: "username",
        description: "The name of the user",
        isRequired: true
    }
]

const createStatEmbed = (data: UserStats): MessageEmbed => {
    console.log(data)
    return makeEmbed({
        color: 0x00FF00,
        description: data.totalWins ?? 'fasfsdaf'
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
    const embed = createStatEmbed(JSON.parse(result.data.replace(/\,(?!\s*?[\{\[\"\'\w])/g, '')) as UserStats)
    return isSlash ? interaction?.reply({ embeds: [embed] }) : message?.reply({ embeds: [embed] })
}

export default new Command('stats', 'Use to get the stats of a player', ['stat', 'st'], stats, options)