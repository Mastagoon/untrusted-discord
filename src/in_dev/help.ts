import { Command } from "../lib/Command";
import { CommandArg, CommandExecuteParameters } from "../types";
import bot from "../app";

import {
  EmbedBuilder,
//  APIEmbed,
//  ButtonInteraction,
//  CacheType,
//  CommandInteraction,
//  EmbedField,
//  InteractionCollector,
//  InteractionReplyOptions,
//  InteractionResponse,
//  Message,
//  MessageComponentInteraction,
//  MessageReplyOptions,
//  User,
} from "discord.js";
import config from "../lib/config";
//import findSkill from "../utils/findSkill";
//import getClassColor from "../utils/getClassColor";
//import getIcon from "../utils/getIcon";
//import makeEmbed from "../utils/makeEmbed";
//import pagination from "../utils/pagination";
//import getCommandParams from "../utils/getCommandParams";
import getCommand from "../utils/getCommand";
//import { Embed } from "@discordjs/builders";

const options: CommandArg[] = []
const cooldown = 5;

/*
const commandDescriptionEmbedField = (commandName: string) => {
  const command = getCommand(commandName)
  return {
    name: command?.name ?? "Err", //This was misspelt, I only noticed cause I was reusing code.
    value: command!.description,
    inline: false
  }
}
///*
/*
const createCommandEmbed = (/*cl: UntrustedClass, user: User) => {
  //const embeds: APIEmbed[] = []
  //embeds.push(
    var embed = makeEmbed({
      title: "Command Data",
      author: { name: "demo", icon_url: user.avatar ?? "" },
      fields: [
        { name: "test", value: "test"} 
      ],
      //thumbnail: { url: getIcon(Number(cl.id), true) },
      description: "",
      footer: { text: "Untrusted Bot | Page 1", icon_url: config.avatar },
    })
    return embed;
  }
  const classDaySkills: EmbedField[] =
    cl.day_skills.map((sk) => skillDescriptionEmbedField(sk)) ?? []
  const classNightSkills: EmbedField[] =
    cl.night_skills.map((sk) => skillDescriptionEmbedField(sk)) ?? []
  const classPassiveSkills: EmbedField[] =
    cl.passive_skills.map((sk) => skillDescriptionEmbedField(sk)) ?? []
  for (let i = 0; i < 3; i++)
    embeds.push(
      makeEmbed({
        color: getClassColor(cl.faction),
        author: { name: cl.ingame_name, icon_url: user.avatarURL() ?? "" },
        thumbnail: { url: getIcon(Number(cl.id), true) },
        footer: {
          text: `Untrusted Bot | Page ${i + 2} of 4`,
          icon_url: config.avatar,
        },
      })
    )
  embeds[1].fields = classDaySkills
  embeds[1].description = classDaySkills.length
    ? ""
    : "This class has no Day Skills"
  embeds[1].title = "Day Skills"
  embeds[2].fields = classNightSkills
  embeds[2].description = classNightSkills.length
    ? ""
    : "This class has no Night Skills"
  embeds[2].title = "Night Skills"
  embeds[3].fields = classPassiveSkills
  embeds[3].description = classPassiveSkills.length
    ? ""
    : "This class has no Passive Skills"
  embeds[3].title = "Passive Skills"

  //return embeds
//}


const collectorStop = (
  collector: InteractionCollector<ButtonInteraction<CacheType>>,
  embed: APIEmbed,
  interaction?: CommandInteraction,
  reply?: Message | InteractionResponse
) => {
  interaction
    ? interaction!.editReply({
      embeds: [embed],
      components: [],
    })
    : reply!.edit({
      embeds: [embed],
      components: [],
    })
  return collector.stop()
}


/*
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

/*
default_embed.addFields(
  //{ name: 'Regular field title', value: 'Some value here' },
  //{ name: '\u200B', value: '\u200B' },
  { name: 'Inline field title', value: 'Some value here', inline: true },
  { name: 'Inline field title', value: 'Some value here', inline: true },
  { name: 'Inline field title', value: 'Some value here', inline: true },
  { name: 'Inline field title', value: 'Some value here', inline: true },
  { name: 'Inline field title', value: 'Some value here', inline: true },
  { name: 'Inline field title', value: 'Some value here', inline: true },
  { name: 'Inline field title', value: 'Some value here', inline: true },
)

const classCommand = async (options: CommandExecuteParameters) => {
  const { args, type, message, interaction } = options
  const isSlash = type == "interaction";
  for (var item of bot.commands) {
    var info = getCommand(item[0])
  }
  if (!isSlash && !args?.length)
    //@ts-ignore
    return message!.reply({ embeds: [default_embed] })
  const user = isSlash ? interaction?.user : message?.author
  if (!user) return
  const query = isSlash
    ? interaction!.options.get("class")?.value as string
    : args?.join(" ")
  //@ts-ignore
  const classData = getCommand(query)
  if (!classData)
    return isSlash
      //@ts-ignore
      ? interaction?.reply({ embeds: [default_embed] })
      //@ts-ignore
      : message?.reply(`"!${query}" does not exist, did you type it in properly?`)
  //const embeds: APIEmbed[] = createCommandEmbed( user!)
  const replyOptions: MessageReplyOptions | InteractionReplyOptions = {
    embeds: [embeds[0]],
    components: [pagination(0, embeds.length)],
    fetchReply: true,
  }
  const reply = isSlash
    ? await interaction?.reply(replyOptions)
    : await message?.reply(replyOptions as MessageReplyOptions)
  let page = 0
  const filter = (i: MessageComponentInteraction) =>
    i.user.id === user.id && i.message.id === reply?.id
  const collector = (isSlash
    ? interaction?.channel?.createMessageComponentCollector({
      filter,
      time: 1000 * 60 * 3,
      max: 10,
    })
    : reply!.createMessageComponentCollector({ filter, time: 1000 * 60 * 3 })) as InteractionCollector<ButtonInteraction<CacheType>>
  collector?.on("collect", (btn: ButtonInteraction) => {
    if (
      !btn ||
      (btn.customId != "prev" &&
        btn.customId != "next" &&
        btn.customId != "end")
    )
      return
    if (btn.customId === "end") {
      return collectorStop(
        collector,
        embeds[page],
        interaction,
        reply ?? undefined
      )
    }
    btn.deferUpdate()
    if (btn.customId == "prev" && page > 0) --page
    if (btn.customId == "next" && page < embeds.length - 1) ++page
    !isSlash
      ? reply!.edit({
        embeds: [embeds[page]],
        components: [pagination(page, embeds.length)],
      })
      : interaction!.editReply({
        embeds: [embeds[page]],
        components: [pagination(page, embeds.length)],
      })
  })
  collector?.on("end", () =>
    collectorStop(collector, embeds[page], interaction, reply ?? undefined)
  )
  return
}
*/

const default_embed = new EmbedBuilder()
.setColor(0x0099FF)
.setTitle('Github')
.setURL('https://github.com/Mastagoon/untrusted-discord')
.setAuthor({ name: 'Untrusted Bot', iconURL: config.avatar, url: 'https://github.com/Mastagoon/untrusted-discord' })
.setDescription('The bot\'s commands.')
.setThumbnail(config.avatar)
//.setImage(config.avatar)
.setTimestamp()
.setFooter({ text: 'Some footer text here', iconURL: config.avatar});

const newEmbed = default_embed;
const commandDescriptionEmbedField = (commandName: string) => {
  const command = getCommand(commandName)
  return {
    name: command?.name ?? "Err",
    value: command!.description,
    inline: false
  }
}

const classCommand = async (options: CommandExecuteParameters) => {
  const { args, type, message, interaction } = options
  const isSlash = type == "interaction";
  console.log(0)
  if (!isSlash && !args?.length)
    //@ts-ignore
    return message!.reply({ embeds: [default_embed] })
  const user = isSlash ? interaction?.user : message?.author
  if (!user) return
  const query = isSlash
    ? interaction!.options.get("class")?.value as string
    : args?.join(" ")
  console.log(bot.commands)
  for (var commandName of bot.commands) {
    console.log(commandName);
    //@ts-ignore
    var data = commandDescriptionEmbedField(getCommand(commandName[0]));
    //@ts-ignore
    newEmbed.addFields(data);
    console.log(data);
  }
  console.log(1);
  //@ts-ignore
  const classData = getCommand(query)
  console.log(query, classData);
  if (!classData)
    return isSlash
      //@ts-ignore
      ? interaction?.reply(`"!${query}" does not exist, did you type it in properly?`)
      //@ts-ignore
      : message?.reply(`"!${query}" does not exist, did you type it in properly?`)
  return isSlash
    //@ts-ignore
    ? interaction?.reply({ embeds: [newEmbed] })
    //@ts-ignore
    : message?.reply({ embeds: [newEmbed] })
}

export default new Command(
  "help",
  "Use this command to get help with the commands.",
  ["commands", "cmds", "cmd", "command"],
  classCommand,
  cooldown,
  options
)
