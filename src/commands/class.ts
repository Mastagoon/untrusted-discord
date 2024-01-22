import {
  APIEmbed,
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  EmbedField,
  InteractionCollector,
  InteractionReplyOptions,
  InteractionResponse,
  Message,
  MessageComponentInteraction,
  MessageReplyOptions,
  User,
} from "discord.js";
import { Command } from "../lib/Command";
import config from "../lib/config";
import { CommandArg, CommandExecuteParameters, UntrustedClass } from "../types";
import findClass from "../utils/findClass";
import findSkill from "../utils/findSkill";
import getClassColor from "../utils/getClassColor";
import getIcon from "../utils/getIcon";
import makeEmbed from "../utils/makeEmbed";
import pagination from "../utils/pagination";

const options: CommandArg[] = [
  {
    name: "class",
    description: "The name of the class",
    isRequired: true,
  },
]

const cooldown = 0;

const skillDescriptionEmbedField = (sk: string) => {
  const skill = findSkill(sk)
  return {
    name: skill?.name ?? "Unknown Skill", //This was misspelt, I only noticed cause I was reusing code.
    value: skill!.description,
    inline: false,
  }
}

const createClassEmbeds = (cl: UntrustedClass, user: User): APIEmbed[] => {
  const embeds: APIEmbed[] = []
  embeds.push(
    makeEmbed({
      color: getClassColor(cl.faction),
      title: "Class Data",
      author: { name: cl.ingame_name, icon_url: user.avatarURL() ?? "" },
      fields: [
        { name: "Faction", value: cl.faction, inline: true },
        { name: "Type", value: cl.type, inline: true },
        {
          name: "Unique",
          value: cl.unique ? "Yes" : "No",
          inline: true,
        },
        {
          name: "Guaranteed Spawn",
          value: cl.guarenteed ? "Yes" : "No",
          inline: true,
        },
        {
          name: "Node Capture Chance",
          value: cl.capture_chance || "Cannot Hack",
        },
        { name: "Win Condition", value: cl.wincon },
      ],
      thumbnail: { url: getIcon(Number(cl.id), true) },
      description: cl.description,
      footer: { text: "Untrusted Bot | Page 1 of 4", icon_url: config.avatar },
    })
  )
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

  return embeds
}

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

const classCommand = async (options: CommandExecuteParameters) => {
  const { args, type, message, interaction } = options
  const isSlash = type == "interaction"
  if (!isSlash && !args?.length)
    return message!.reply("You need to specify a skill")
  const user = isSlash ? interaction?.user : message?.author
  if (!user) return
  const query = isSlash
    ? interaction!.options.get("class")?.value as string
    : args?.join(" ")
  const classData = findClass(query)
  if (!classData)
    return isSlash
      ? interaction?.reply("No class found")
      : message?.reply("No class found")
  const embeds: APIEmbed[] = createClassEmbeds(classData, user!)
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

export default new Command(
  "class",
  "Use this command to get information about a certain class.",
  ["classinfo", "cl", "ci"],
  classCommand,
  cooldown,
  options
)

