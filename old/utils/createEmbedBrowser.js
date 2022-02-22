const Discord = require("discord.js")

const emojis = ["⬅️" , "⏹️" , "➡️", "ℹ️"]

module.exports = async(data, message, userId, time = 120000) => {
    if(!data) return message.edit("No results.") 
    const { pages, embeds, list } = data
    if(pages == 1) {
        const embed = new Discord.MessageEmbed(embeds[0])
        embed.setFooter()
        return message.edit("", embed)
    }
    let i = 0
    for(embed of embeds) {
        embeds[i] = new Discord.MessageEmbed(embed).setFooter(`Page ${i+1}/${pages} | ${message.guild?.me.hasPermission("MANAGE_MESSAGES") ? "Use the arrow emojis below to browse through the pages." : "Give me 'manage messages' permission so that i can do my job better."}`, "https://cdn.discordapp.com/attachments/844031096752570398/844330289622286356/logo_untrusted.png")
        i++
    }
    const listEmbed = new Discord.MessageEmbed(list).setFooter(`Index page | 
    ${message.guild?.me.hasPermission("MANAGE_MESSAGES") ? "Please enter a page number." : "Give me 'manage messages' permission so that i can do my job better"}`, "https://cdn.discordapp.com/attachments/844031096752570398/844330289622286356/logo_untrusted.png")
    message.edit("", embeds[0])
    let index = 0
    for(emoji of emojis) await message.react(emoji)
    const filter = (r, u) => emojis.includes(r.emoji.name) && u.id === userId
    const reactionCollector = message.createReactionCollector(filter, { time })
    if(message.guild?.me.hasPermission("MANAGE_MESSAGES"))
        reactionCollector.on(`end`,() => message.reactions.removeAll())
    reactionCollector.on(`collect`, (r,u) => {
        switch(emojis.indexOf(r.emoji.name)) {
            case 0: //previous
                if(index > 0) {
                    index--
                    message.edit("", embeds[index])
                }
                break
            case 1: //stop
                return reactionCollector.stop()
            case 2: //next
                if(index < embeds.length-1) {
                    index++
                    message.edit("", embeds[index])
                }
                break
            case 3: //list
                message.edit("", listEmbed)
                message.channel.send(`ℹ️  Please select a number to browse`).then(tempmes => {
                    const messageCollector = tempmes.channel.createMessageCollector(
                        (m) => m.author.id === userId, time
                    )
                    messageCollector.on(`end`,() => tempmes.delete())
                    messageCollector.on(`collect`, m => {
                        if(Number(m.content) > 0 && Number(m.content) <= embeds.length) {
                            index = Number(m.content)-1
                            message.edit("", embeds[index])
                            messageCollector.stop()
                        }
                    })
                })
                break
        }
        if(message.guild?.me.hasPermission("MANAGE_MESSAGES"))
            r.users.remove(u.id)
    })
}