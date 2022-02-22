import { REST } from "@discordjs/rest"
import * as API from 'discord-api-types/v9'
import { Client } from "discord.js"
import config from "./config"
import Log from "./utils/logger"


const InitSlashCommands = async (bot: Client) => {
    const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN ?? "")
    try {
        const slashCmds = []
        for(const cmd of bot.commands) {
            slashCmds.push(cmd[1].data.toJSON())
        }
        Log.info(`Refreshing slash commands...`)
        await rest.put(
            API.Routes.applicationGuildCommands(bot.user?.id ?? '', config.slash_command_gid),
            { body: slashCmds }
        )
        Log.info(`Successfully refreshed slash commands.`)
    } catch (err: any) {
        Log.error(err.message)
        // throw err
    }
}


export default InitSlashCommands