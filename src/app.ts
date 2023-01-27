import Discord, { Collection, Interaction } from "discord.js"
import dotenv from "dotenv"
import { Command } from "./lib/Command"
import config from "./lib/config"
import CommandManager from "./lib/commandManager"
import Log from "./utils/logger"
import path from "path"
import getPlayerCount from "./utils/getPlayerCount"
dotenv.config({ path: path.join(__dirname, "..", ".env") })
declare module "discord.js" {
	export interface Client {
		commands: Collection<string, Command>
		aliases: Collection<string, string>
	}
}

const ONE_MINUTE = 1000 * 60

const bot = new Discord.Client({ intents: ["GUILD_MESSAGES", "GUILDS"] })

bot.on("ready", async (): Promise<any> => {
	if (!bot.user) return
	const commandManager = new CommandManager(bot)
	await commandManager.Init()
	Log.info(`Logged in as ${bot.user.tag}`)
	if (bot.user.username != config.bot_name)
		bot.user.setUsername(config.bot_name)
	// loop for player count
	setInterval(async () => {
		const playerCount = await getPlayerCount()
		console.log(playerCount)
		if (!playerCount)
			return bot.user?.setActivity(config.activity, { type: undefined })
		// I couldn't remove the 'watching | playing' prefix from the activity
		return bot.user?.setActivity(playerCount.toString(), { type: "WATCHING" })
	}, ONE_MINUTE)
})

bot.on("interactionCreate", async (ir: Interaction) => {
	if (!ir.isCommand()) return
	const command = bot.commands.get(ir.commandName)
	if (!command) return
	try {
		command.execute({ type: "interaction", interaction: ir })
	} catch (err: any) {
		console.log("err: ", err.message)
		Log.error(`interactionCreateErr: ${err.message}`)
		await ir.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		})
	}
})

bot.on("messageCreate", async (msg): Promise<any> => {
	if (!msg.content.startsWith(config.prefix)) return
	const args = msg.content.slice(config.prefix.length).split(/ +/)
	const commandName = args.shift()
	if (commandName == 'supporter') {
		if (msg.channel.type !== 'DM') return msg.reply({ content: 'This command can only be used in DMs!' })
		if (!args[0]) return msg.reply({ content: 'Please provide a supporter code!' })
		const untrustedGuild = await bot.guilds.fetch(config.untrusted_guild_id)
		const member = untrustedGuild.members.cache.find(m => m.id === msg.author.id)
		if (!member) return msg.reply({ content: 'You are not in the untrusted guild!' })
		const code = args[0]
		const isCodeValid = await (await fetch({
			url: config.supporter_role_url, method: "POST",
			// @ts-ignore
			body: JSON.stringify({ code })
		})).json()
		if (!isCodeValid) return msg.reply({ content: 'Invalid supporter code!' })
		const role = msg.guild?.roles.cache.find(r => r.id === config.supporter_role_url)
		if (!role) return msg.reply({ content: 'Supporter role not found!' })
		await member.roles.add(role)
		return msg.reply({ content: 'You have been given the supporter role!' })
	}
	const command = bot.commands.get(
		// lol
		bot.aliases.get(commandName ?? "") ?? commandName ?? ""
	)
	if (!command) return
	try {
		command.execute({ message: msg, args, type: "message" })
	} catch (err: any) {
		Log.error(`messageCreateEvent: ${err.message}`)
		msg.reply({ content: "There was an error while executing this command!" })
	}
})

bot.login(process.env.BOT_TOKEN)
