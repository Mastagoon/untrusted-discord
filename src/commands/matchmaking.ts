import { Command } from "../lib/Command"
import config from "../lib/config";
import { CommandArg, CommandExecuteParameters } from "../types"
//import bot from "../app" //Need bot/discord client to find the role.
const options: CommandArg[] = []

const cooldown = 60;

const matchmaking = async (options: CommandExecuteParameters) => {
  const { type, message, interaction } = options
  const isSlash = type === "interaction"
  var response = `<@&${config.matchmaking_role_id}>!`;
  return isSlash ? interaction?.reply((response + ` Pinged by <@${interaction.user.id}>`)) : message?.reply((response + ` Pinged by <@${message.author.id}>`));
  //.displayName: https://old.discordjs.dev/#/docs/discord.js/main/class/User?scrollTo=displayName
  // Apparently doesn't exist acording to ts :shrug:
  //Discord's interaction is .user and message is .author and is quite annoying.
}
export default new Command(
  "matchmaking",
  "Use this command to ping @matchmaking",
  ["mm", "pingmm", "ping"],
  matchmaking,
  cooldown,
  options
)
