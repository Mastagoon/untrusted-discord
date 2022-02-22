import { SlashCommandBuilder } from "@discordjs/builders"
import Discord, { Collection, Command, Interaction } from "discord.js"
import dotenv from 'dotenv'
import fs from "fs"
import path from 'path'
import config from './config'
import InitSlashCommands from "./slashCommands"
import Log from "./utils/logger"

dotenv.config({ path: __dirname + "/.env" })

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>
    }

    export interface Command {
        // name: string
        execute(interaction: CommandInteraction): Promise<void>
        data: SlashCommandBuilder
        // aliases: string[]
    }
}

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'))
const bot = new Discord.Client({ intents: ["GUILD_MESSAGES", "GUILDS"] })
bot.commands = new Collection()

for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', file)).default as Command
    bot.commands.set(command.data.name, command)
    // #TODO command aliases
}

bot.on("ready", async (): Promise<void> => {
    if (!bot.user) return
    await InitSlashCommands(bot)
    Log.info(`Logged in as ${bot.user.tag}`)
    if (bot.user.username != config.bot_name)
        bot.user.setUsername(config.bot_name)
    bot.user.setActivity(config.activity)
})

bot.on('interactionCreate', async (ir: Interaction) => {
    if (!ir.isCommand()) return
    const command = bot.commands.get(ir.commandName)
    if (!command) return
    try {
        await command.execute(ir)
    } catch (err: any) {
        console.log('err: ', err.message)
        await ir.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }

})

bot.login(process.env.BOT_TOKEN)