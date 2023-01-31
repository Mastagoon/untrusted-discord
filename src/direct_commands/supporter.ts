import { Client, Message } from "discord.js"
import config from "../lib/config"
import Log from "../utils/logger"

const supporter = async (msg: Message, args: string[], bot: Client): Promise<Message<boolean>> => {
	if (msg.channel.type !== 'DM') return msg.reply({ content: 'This command can only be used in DMs!' })
	if (!args[0]) return msg.reply({ content: 'Please provide a supporter code!' })
	const untrustedGuild = await bot.guilds.fetch(config.untrusted_guild_id)
	const member = untrustedGuild.members.cache.find(m => m.id === msg.author.id)
	if (!member) return msg.reply({ content: 'You are not in the untrusted guild!' })
	if (member.roles.cache.find(r => r.id === config.supporter_role_url()))
		return msg.reply({ content: 'You already have the supporter role!' })
	const code = args[0]
	try {
		const response = await (await fetch({
			url: config.supporter_role_url(), method: "POST",
			// @ts-ignore
			body: JSON.stringify({ code })
		})).json()
		const isCodeValid = response[0].supporter.toLowerCase() === "yes"
		if (!isCodeValid) return msg.reply({ content: 'Invalid supporter code!' })
		const role = msg.guild?.roles.cache.find(r => r.id === config.supporter_role_url())
		if (!role) return msg.reply({ content: 'Supporter role not found!' })
		await member.roles.add(role)
		return msg.reply({ content: 'You have been given the supporter role!' })
	} catch (err: any) {
		Log.error(`supporter.ts: ${err.message}`)
		return msg.reply({ content: 'There was an error while executing this command!' })
	}
}

export default supporter
