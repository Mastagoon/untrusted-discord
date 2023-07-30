import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandArg, CommandExecuteParameters } from "../types"
import Log from "../utils/logger"

export class Command {
    name: string
    description: string
    aliases: string[]
    execute: (options: CommandExecuteParameters) => void
    data: SlashCommandBuilder
    args: CommandArg[] = []
    cooldown: number //Seconds

    constructor(name: string, description: string, aliases: string[], execute: (options: CommandExecuteParameters) => void,
    cooldown: number, options?: CommandArg[]) {
        Log.debug(`Adding command: ${name}`)
        this.name = name
        this.description = description
        this.aliases = aliases
        this.execute = execute
        this.cooldown = cooldown
        this.data = new SlashCommandBuilder().setName(this.name).setDescription(this.description)
        if (options) {
            for (const opt of options) {
                this.data.addStringOption(o => o.setName(opt.name).setDescription(opt.description).setRequired(opt.isRequired))
            }
        }
    }
}