import { Command } from "../lib/Command";
import { CommandArg, CommandExecuteParameters } from "../types";
import bot from "../app";

const options: CommandArg[] = []
const cooldown = 5;

const help = async (options: CommandExecuteParameters) => {
  const { type, message, interaction } = options
  const isSlash = type === "interaction";
  var list = bot.commands;
  var response:string = "!<command> - description\n";
  for (var command of list) {
    var gotCommand = bot.commands.get(command[0]);
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
  help,
  cooldown,
  options
)
