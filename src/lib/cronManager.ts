import cronParser from "cron-parser"
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
		this.loadCrons()
	}

	async loadCrons(): Promise<void> {
		const crons = await prisma.crons.findMany({ where: { expired: false } })
		const channel = await this.bot.channels.fetch(config.schedule_game_channel_id) as TextChannel
		if (!channel) return Log.error(`Error scheduling threads: channel ${config.schedule_game_channel_id} not found !`)
		for (const cron of crons) {
			// check if cron date has passed
			const date = cronParser.parseExpression(cron.cronString).next().toDate()
			// if date is more than 7 days away, don't schedule it
			if (date.getTime() - Date.now() > 1000 * 60 * 60 * 24 * 7) {
				await prisma.crons.delete({ where: { id: cron.id } })
				continue
			}
			scheduleThreadPing(prisma, cron.cronString, channel)
		}
		Log.info(`Loaded ${crons.length} crons`)
	}
}

export default CronManager
