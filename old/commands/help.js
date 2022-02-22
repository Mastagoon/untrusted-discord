const Discord = require("discord.js")
const fs = require("fs")
const config = require("../config")
const { getString } = require("../utils/lang")
const commandFiles = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith(".js"))

module.exports = {
    name: "help",
    description: "Shows a list of all available commands.",
    usage: config.prefix+"help",
    aliases: "h",
    execute(message, args) {
        const res = new Discord.MessageEmbed()
            .setColor("#EBCBD0")
            .setTitle(getString(message.member, "commandList"))
            .setFooter("Untrusted Bot", "https://cdn.discordapp.com/attachments/844031096752570398/844330289622286356/logo_untrusted.png")
        for (const file of commandFiles) {
            if(file === 'help.js') continue
            const command = require(`./${file}`)
            res.addFields({
                name: `${config.prefix}${command.name}`,
                value: `${command.description}\nUsage:${command.usage}`,
            })
        }
        message.channel.send(res)
    },
}