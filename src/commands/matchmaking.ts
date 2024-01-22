import { Command } from "../lib/Command"
import config from "../lib/config";
import { CommandArg, CommandExecuteParameters } from "../types"
import getPlayerCount from "../utils/getPlayerCount";
const options: CommandArg[] = [];

/*
allowedMentions: { parse: ['users', 'roles'], repliedUser: true } 
*/

//Discord.js requires objects to send more than JUST content.

const cooldown = 60;

const matchmaking = async (options: CommandExecuteParameters) => {
  const { type, message, interaction } = options
  const isSlash = type === "interaction"
  var matchmakingText = `<@&${config.matchmaking_role_id}>! Pinged by <@${interaction.user.id}>`; 

  //const playerCount = await getPlayerCount(true)

  return isSlash ? 
  interaction?.reply({"content":(matchmakingText), "allowedMentions": { parse: ['users', 'roles'], repliedUser: true } }) 
  : message?.reply({"content":(matchmakingText), "allowedMentions": { parse: ['users', 'roles'], repliedUser: true } });
}
export default new Command(
  "matchmaking",
  "Use this command to ping @matchmaking.",
  ["mm", "pingmm", "ping"],
  matchmaking,
  cooldown,
  options
)
