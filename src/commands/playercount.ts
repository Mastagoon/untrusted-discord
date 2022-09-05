import { Command } from "../lib/Command"
import { CommandArg, CommandExecuteParameters } from "../types"
import getPlayerCount from "../utils/getPlayerCount"

const options: CommandArg[] = []

const playerCount = async (options: CommandExecuteParameters) => {
  const { type, message, interaction } = options
  const isSlash = type === "interaction"
  const playerCount = await getPlayerCount(true)
  if (!playerCount)
    return isSlash
      ? interaction?.reply("This feature is currently disabled.")
      : message?.reply("This feature is currently disabled.")
  if (typeof playerCount === "string") {
    const response = `There are currently **less than ${playerCount} operators** online.`
    return isSlash ? interaction?.reply(response) : message?.reply(response)
  }
  // positive number, give more details
  const response = `There are currently **${playerCount.Online_players} operators** online.\n There are **${playerCount.Open_lobbies} open lobbies** and **${playerCount.Active_games} active games.**`
  return isSlash ? interaction?.reply(response) : message?.reply(response)
}
export default new Command(
  "playercount",
  "Use this command to learn which classes has a certain skill",
  ["pc", "online", "players", "operators"],
  playerCount,
  options
)
