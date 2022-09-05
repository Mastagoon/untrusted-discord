import { Command } from "../lib/Command"
import config from "../lib/config"
import { CommandArg, CommandExecuteParameters } from "../types"

const options: CommandArg[] = []

const github = async (options: CommandExecuteParameters) => {
  const { type, message, interaction } = options
  const isSlash = type === "interaction"
  const response = `Untrusted Bot is an open source project created by Goon#0480.\nFeel free to contribute or report issues @ ${config.repo_url}.`
  return isSlash ? interaction?.reply(response) : message?.reply(response)
}
export default new Command(
  "github",
  "Check out Untrusted Bot's Github repo.",
  ["gh", "repo", "code"],
  github,
  options
)
