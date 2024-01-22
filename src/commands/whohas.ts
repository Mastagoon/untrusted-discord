import { Command } from "../lib/Command"
import { CommandArg, CommandExecuteParameters } from "../types"
import findSkill from "../utils/findSkill"
import { getClassesWithThisSkill } from "./skill"

const options: CommandArg[] = [
  {
    name: "skill",
    description: "The name of the skill",
    isRequired: true
  }
]

const cooldown = 0;

const whoHas = async (options: CommandExecuteParameters) => {
  const { args, type, message, interaction } = options
  const isSlash = type === 'interaction'
  if (!isSlash && !args?.length) return message?.reply('You need to specify a skill')
  const skill = findSkill(isSlash ? interaction?.options.get('skill')?.value as string : args?.join(' '))
  if (!skill) return message ? message?.reply('Could not find a skill with that name') : interaction?.reply('Could not find a skill with that name')
  const embed = getClassesWithThisSkill(skill, isSlash ? interaction!.user : message!.author, true)
  return isSlash ? interaction?.reply({ embeds: [embed] }) : message?.reply({ embeds: [embed] })
}

export default new Command(
  'whohas', 
  "Use this command to learn which classes has a certain skill.",
  ['wh', 'who'],
  whoHas, 
  cooldown, 
  options
)
