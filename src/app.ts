import Discord, { ActivityType, Collection, GatewayIntentBits, Interaction, Partials, } from "discord.js"
import dotenv from "dotenv"
import { Command } from "./lib/Command"
import config from "./lib/config"
import CommandManager from "./lib/commandManager"
import Log from "./utils/logger"
import path from "path"
import getPlayerCount from "./utils/getPlayerCount"
import CronManager from "./lib/cronManager"
import supporter from "./direct_commands/supporter"

const cooldowns = new Discord.Collection<string, Collection<string, number>>();

dotenv.config({ path: path.join(__dirname, "..", ".env") })
declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>
    aliases: Collection<string, string>
  }
}

const ONE_MINUTE = 1000 * 60

const bot = new Discord.Client({
  intents: [GatewayIntentBits.GuildMessages,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
})

bot.on("ready", async (): Promise<any> => {
  if (!bot.user) return
  const commandManager = new CommandManager(bot)
  const cronManager = new CronManager(bot)
  await commandManager.Init()
  await cronManager.Init()
  Log.info(`Logged in as ${bot.user.tag}`)
  if (bot.user.username != config.bot_name)
    bot.user.setUsername(config.bot_name)
  // loop for player count
  setInterval(async () => {
    const playerCount = await getPlayerCount()
    if (!playerCount)
      return bot.user?.setActivity(config.activity, { type: undefined })
    // I couldn't remove the 'watching | playing' prefix from the activity
    return bot.user?.setActivity(playerCount.toString(), { type: ActivityType.Playing })
  }, ONE_MINUTE)
})

bot.on("interactionCreate", async (ir: Interaction) => {
  if (!ir.isCommand()) return;
  const command = bot.commands.get(ir.commandName);
  if (!command) return;
  if (!cooldowns.has(command.name))
    cooldowns.set(command.name, new Collection());


  const now = Date.now();
  const timestamps = cooldowns.get(command.name) ?? new Collection(); //Couldn't find declaration type. Marked as 'any'
  const COOLDOWN_DURATION = command.cooldown;

  if (timestamps.has(ir.user.id)) {
    const expirationTime = timestamps.get(ir.user.id)! + COOLDOWN_DURATION;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      await ir.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      return;
    }
  }

  timestamps.set(ir.user.id, now);
  try {
    command.execute({ type: "interaction", interaction: ir });
  } catch (err: any) {
    console.log("err: ", err.message);
    Log.error(`interactionCreateErr: ${err.message}`);
    await ir.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    })
  }
})

bot.on("messageCreate", async (msg): Promise<any> => {
  console.log(msg.content); //This does track content recieved by the bot, even itself. Only the content.
  if (!msg.content.startsWith(config.prefix)) return
  const args = msg.content.slice(config.prefix.length).split(/ +/)
  const commandName = args.shift()
  if (commandName == 'supporter') return supporter(msg, args, bot);
  const command = bot.commands.get(bot.aliases.get(commandName ?? "") ?? commandName ?? "") //lol //Omg that must suck.
  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps: any = cooldowns.get(command.name); //Couldn't find declaration type. Marked as 'any'
  const COOLDOWN_DURATION = command.cooldown;

  if (timestamps.has(msg.author.id)) {
    const expirationTime = timestamps.get(msg.author.id) + COOLDOWN_DURATION;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return msg.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }

  timestamps.set(msg.author.id, now);
  setTimeout(() => timestamps.delete(msg.author.id), COOLDOWN_DURATION);

  try {
    command.execute({ message: msg, args, type: "message" });
  } catch (err: any) {
    Log.error(`messageCreateEvent: ${err.message}`);
    msg.reply({ content: "There was an error while executing this command!" });
  }
})

bot.login(process.env.BOT_TOKEN);

export default bot

