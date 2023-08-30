import { Command } from "../lib/Command";
import { CommandArg, CommandExecuteParameters } from "../types";
import bot from "../app";

const options: CommandArg[] = []
const cooldown = 5;

const playerCount = async (options: CommandExecuteParameters) => {
  const { type, message, interaction } = options
  const isSlash = type === "interaction";
  var list = ["class", "github", "help", "matchmaking", "playercount", "schedule", "skill", "stats", "whohas"];
  var response:string = "!<command> - description\n";
  for (var command of list) {
    // @ts-ignore
    var gotCommand = bot.commands.get(command);
    var commandName = gotCommand?.name; 
    var commandDescription = gotCommand?.description;
    response += "!"
    response += commandName;
    response += " - ";
    response += commandDescription;
    response += "\n";
  }
  return isSlash ? interaction?.reply(response) : message?.reply(response)
}
export default new Command(
  "help",
  "Use this command to get help with the commands.",
  ["commands", "cmds", "cmd", "command"],
  playerCount,
  cooldown,
  options
)
