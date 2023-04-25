import { APIEmbed, EmbedBuilder } from "discord.js"

export default (args: APIEmbed): APIEmbed => {
  return new EmbedBuilder(args).data
}
