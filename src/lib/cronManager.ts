import { CronExpressionParser } from "cron-parser"
import { Client, TextChannel } from "discord.js"
import Log from "../utils/logger"
import { scheduleThreadPing } from "../commands/schedule"
import config from "../lib/config"
import { prisma } from "./prisma"

class CronManager {
	private bot: Client

	constructor(bot: Client) {
		this.bot = bot
	}

	public async Init() {
		Log.info("Initializing cron manager")
		await this.loadCrons()
	}

	async loadCrons(): Promise<void> {
		const crons = await prisma.crons.findMany({ where: { expired: false } })
		let channel: TextChannel | null = null
		try {
			channel = await this.bot.channels.fetch(config.schedule_game_channel_id) as TextChannel | null
		} catch (error: any) {
			Log.error(`Error scheduling threads: cannot access channel ${config.schedule_game_channel_id} (${error?.message ?? "unknown error"})`)
			return
		}
		if (!channel) return Log.error(`Error scheduling threads: channel ${config.schedule_game_channel_id} not found !`)
		for (const cron of crons) {
			// check if cron date has passed
			const date = CronExpressionParser.parse(cron.cronString).next().toDate()
			// if date is more than 7 days away, don't schedule it
			if (date.getTime() - Date.now() > 1000 * 60 * 60 * 24 * 7) {
				await prisma.crons.delete({ where: { id: cron.id } })
				continue
			}
			scheduleThreadPing(cron.cronString, channel)
		}
		Log.info(`Loaded ${crons.length} crons`)
	}
}

export default CronManager
