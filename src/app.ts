import Discord, { Collection, Interaction, Message } from "discord.js"
import dotenv from 'dotenv'
import { Command } from "./lib/Command"
import config from './lib/config'
import CommandManager from "./lib/commandManager"
import Log from "./utils/logger"
import path from "path"
dotenv.config({ path: path.join(__dirname, ".env") })
declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>
    }
}


const bot = new Discord.Client({ intents: ["GUILD_MESSAGES", "GUILDS"] })

bot.on("ready", async (): Promise<void> => {
    if (!bot.user) return
    const commandManager = new CommandManager(bot)
    await commandManager.Init()
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
        command.execute({ type: 'interaction', interaction: ir })
    } catch (err: any) {
        console.log('err: ', err.message)
        Log.error(`interactionCreateErr: ${err.message}`)
        await ir.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
})

bot.on('messageCreate', (msg: Message) => {
    if (!msg.content.startsWith(config.prefix)) return
    const args = msg.content.slice(config.prefix.length).split(/ +/)
    const commandName = args.shift()
    const command = bot.commands.get(commandName ?? '')
    if (!command) return
    try {
        command.execute({ message: msg, args, type: 'message' })
    } catch (err: any) {
        Log.error(`messageCreateEvent: ${err.message}`)
        msg.reply({ content: 'There was an error while executing this command!' })
    }
})

bot.login(process.env.BOT_TOKEN)
