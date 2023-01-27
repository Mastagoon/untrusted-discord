import { Prisma, PrismaClient } from "@prisma/client"
import dateToCron from "../utils/cronUtils"
import cron from "node-cron"
import { Collection, TextChannel, ThreadMember } from "discord.js"
import bot from "../app"
import { Command } from "../lib/Command"
import config from "../lib/config"
import { CommandArg, CommandExecuteParameters } from "../types"
import getCommandParams from "../utils/getCommandParams"
import Log from "../utils/logger"

const ONE_WEEK_IN_MINUTES = 10080

const commandOptions: CommandArg[] = [
	{
		name: "title",
		description: "The thread title",
		isRequired: true
	},
	{
		name: "time",
		description: "The time of the game ex: 20:15",
		isRequired: true
	},
	{
		name: "date",
		description: "Which day the game is on (default today) ex: 2021-12-31",
		isRequired: false
	},
]

export const scheduleThreadPing = async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>, cronString: string, channel: TextChannel) => {
	cron.schedule(cronString, async () => {
		Log.debug("cron job ran...")
		const thread = await prisma.crons.findFirst({ where: { cronString } })
		if (!thread) return
		await prisma.crons.delete({ where: { id: thread.id } })
		const discordThread = await channel.threads.fetch(thread.threadId)
		if (discordThread === null) return
		// mention everyone in the thread
		// let n = ""
		// discordjs types are wrong. 
		const members = await discordThread.members.fetch(undefined) as unknown as Collection<string, ThreadMember>
		const mentions = members.map((m) => `<@${m.user?.id}>`).join("\n")
		await discordThread.send(`Game time! ${mentions}\nThread will close in 1 hour.`)
		discordThread.autoArchiveDuration = 60
	})
}

const schedule = async (options: CommandExecuteParameters) => {
	const { message, interaction } = options
	// const isSlash = type === "interaction"
	const mes = message ?? interaction
	if (!mes) return
	const channel = await bot.channels.fetch(config.schedule_game_channel_id) as TextChannel
	if (!channel) return
	const params = getCommandParams(mes, commandOptions)
	let { title, time, date } = params
	// prase the date and time to check if they are correct
	if (!title || !time) return
	if (!date) date = new Date().toISOString().split("T")[0]
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/
	const timeRegex = /^\d{2}:\d{2}$/
	if (!dateRegex.test(date)) return mes.reply("Invalid date format")
	if (!timeRegex.test(time)) return mes.reply("Invalid time format")
	if (new Date(`${date} ${time}`).getTime() < Date.now()) return mes.reply("Invalid date or time. Game time is in the past.")
	// if the date is more then 7 days in the future, return
	if (new Date(`${date} ${time}`).getTime() > Date.now() + (ONE_WEEK_IN_MINUTES * 60 * 1000)) return mes.reply("Invalid date or time. Game time is more then 7 days in the future.")
	const cronString = dateToCron(new Date((`${date} ${time}`).trim()))
	// create the cronjob
	const prisma = new PrismaClient()
	const startMessage = await channel.send(`Game time: ${date} ${time}`)
	const thread = await channel.threads.create({
		name: title,
		autoArchiveDuration: ONE_WEEK_IN_MINUTES,
		startMessage
	})
	await prisma.crons.create({ data: { name: title, cronString, threadId: thread.id } })
	scheduleThreadPing(prisma, cronString, channel)
	return mes.reply("Thread created.")
}
export default new Command(
	"schedule",
	"Start a thread in #schedule-a-game",
	["sch", "schedule"],
	schedule,
	commandOptions
)
