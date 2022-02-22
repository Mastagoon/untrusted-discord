// import { Command } from "discord.js"
import { Command } from "../Command"
import { CommandExecuteParameters } from "../types"



// const command: Command = {
//     name: "ping",
//     data: new SlashCommandBuilder()
//         .setName('ping')
//         .setDescription('Poong!'),
//     async execute(options: CommandExecuteParameters): Promise<void> {
//         const { interaction, message } = options
//         const isSlash = interaction ? true : false
//         isSlash ? interaction?.reply('Pong!') : message?.reply('Pong!')
//         return
//     },
// }

const ping = (options: CommandExecuteParameters) => {
    return options.type === 'interaction' ? options.message?.reply('pong!') : options.interaction?.reply('Pong!')
}

export default new Command('ping', 'Poong!', 'like so', [], ping)