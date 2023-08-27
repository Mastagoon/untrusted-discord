import { Command } from "../lib/Command"
import { CommandArg, CommandExecuteParameters } from "../types"
import getPlayerCount from "../utils/getPlayerCount"

const options: CommandArg[] = []
const cooldown = 5;

const playerCount = async (options: CommandExecuteParameters) => {
  const { type, message, interaction } = options
  const isSlash = type === "interaction"
  const playerCount = await getPlayerCount(true)
  if (!playerCount)
    return isSlash
      ? interaction?.reply("This feature is currently disabled.")
      : message?.reply("This feature is currently disabled.")
  if (typeof playerCount === "string") {
    const response = `There are currently **${playerCount}.**`
    return isSlash ? interaction?.reply(response) : message?.reply(response)
  }
  // positive number, give more details

  // Sets default text strings.
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
  const response = `${operativesText}\n${lobbiesText}\n${activeGamesText}`; //Formatted
  return isSlash ? interaction?.reply(response) : message?.reply(response)
}
export default new Command(
  "playercount",
  "Use this command to check how many players are currently in-game.",
  ["pc", "online", "players", "operatives"],
  playerCount,
  cooldown,
  options
)
