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
  var matchmakingPing = `<@&${config.matchmaking_role_id}>!`; // Default response

  const playerCount = await getPlayerCount(true)

  if (!playerCount || playerCount == null) { //If "", 0, etc || null return default response
    return isSlash ? 
    interaction?.reply({"content":(matchmakingPing + ` Pinged by <@${interaction.user.id}>`), "allowedMentions": { parse: ['users', 'roles'], repliedUser: true } }) 
    : message?.reply({"content":(matchmakingPing + ` Pinged by <@${message.author.id}>`), "allowedMentions": { parse: ['users', 'roles'], repliedUser: true } });
  }
  
  //If we are here, we have not had an issue yet.

  /*
  var playerCountText:string = "";
  if (typeof playerCount === "string") {
    playerCountText = `There are currently **${playerCount}.**`
  } else {
    var operativesText = `There are currently **${playerCount.Online_players} operatives online.**`;
    var lobbiesText = `There are **${playerCount.Open_lobbies} open lobbies.**`;
    var activeGamesText = `**There are ${playerCount.Active_games} active games.**`;
    // Converts the each type (Online_players, Open_lobbies, Active_games) to number to get a more response. 
  
    // EG: "There are currently **1 operatives online.**" -> "**There is currently 1 operative online.**"
    if (Number(playerCount.Online_players) == 1) operativesText = "**There is currently 1 operative online.**"; // If (1 == 1), should also = 1.
    // EG: "There are **1 open lobbies**" -> "There is **1 open lobby**"...
    if (Number(playerCount.Open_lobbies) == 1) lobbiesText = "There is **1 open lobby.**";
    // EG: ..."1 active games" -> "1 active game."
    if (Number(playerCount.Active_games) == 1) activeGamesText = "There is **1 active game.**"
    //Removing the spaces creates left aligned text.
    playerCountText = `${operativesText}\n${lobbiesText}\n${activeGamesText}`; //Formatted
  }
  */
  //Since BOTH return string outputs, we can safely assume they work properly, and can format a response.
  // response = playerCountText + response; 
  return isSlash ? 
  interaction?.reply({"content":(matchmakingPing + ` Pinged by <@${interaction.user.id}>\n`), "allowedMentions": { parse: ['users', 'roles'], repliedUser: true } }) 
  : message?.reply({"content":(matchmakingPing + ` Pinged by <@${message.author.id}>\n`), "allowedMentions": { parse: ['users', 'roles'], repliedUser: true } });
}
export default new Command(
  "matchmaking",
  "Use this command to ping @matchmaking.",
  ["mm", "pingmm", "ping"],
  matchmaking,
  cooldown,
  options
)
