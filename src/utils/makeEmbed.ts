import { MessageEmbed, MessageEmbedOptions } from "discord.js"

export default (args: MessageEmbedOptions) => {
    return new MessageEmbed(args)
}