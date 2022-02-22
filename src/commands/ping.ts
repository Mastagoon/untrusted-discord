import { SlashCommandBuilder } from "@discordjs/builders"
import { Command, CommandInteraction } from "discord.js"



const command: Command = {
     data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Poong!'),
    async execute(interaction: CommandInteraction): Promise<void> {
        interaction.reply('Pong!')
    },
}
export default command