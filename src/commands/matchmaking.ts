import { Command } from "../lib/Command"
import { CommandArg, CommandExecuteParameters } from "../types"
//import bot from "../app" //Need bot/discord client to find the role.
const options: CommandArg[] = []

const cooldown = 60;

const matchmaking = async (options: CommandExecuteParameters) => {
  const { type, message, interaction } = options
  const isSlash = type === "interaction"
  var response = `<@&750427946547937323>!`;
  return isSlash ? interaction?.reply((response + ` Pinged by ${interaction.user.username}`)) : message?.reply((response + ` Pinged by ${message.author.username}`));
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
