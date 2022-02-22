const Discord = require("discord.js")

/**
 * This function makes it easier to build a message embed object.
 * @param {String|Undefined} color color of the embed
 * @param {String|Undefined} title embed title
 * @param {Object|Undefined} author author name, iconURL, and a click URL
 * @param {Object|Undefined} fields embed fields
 * @param {URL|Undefined} thumbnail the small image at the top left corner of an embed
 * @param {Object|Undefined} footer footer icon and text
 * @param {String|Undefined} description the top most text in the embed after its title
 * @param {URL|Undefined} image a large image at the top right corner of the embed
 * @returns a message embed object
 */
module.exports = makeEmbed = async (color = "#00ff00", title=null, author=null, fields=null, thumbnail=null,  footer=null, description=null, image=null) => {
    const embed = new Discord.MessageEmbed()
    embed.setColor(color)
    title && embed.setTitle(title)
    author && embed.setAuthor(author.name, author.iconURL, author.url)
    fields && embed.addFields(fields)
    thumbnail && embed.setThumbnail(thumbnail)
    footer && embed.setFooter(footer)
    image && embed.setImage(image)
    description && embed.setDescription(description)
    return embed
}