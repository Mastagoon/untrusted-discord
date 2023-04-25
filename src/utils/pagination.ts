import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

export default (currentPage: number, length: number) => {
  const row = new ActionRowBuilder<ButtonBuilder>()
  row.addComponents(new ButtonBuilder().setCustomId('prev').setStyle(ButtonStyle.Secondary).setEmoji('⏮️').setDisabled(currentPage === 0))
  row.addComponents(new ButtonBuilder().setCustomId('end').setStyle(ButtonStyle.Secondary).setEmoji('⏸️'))
  row.addComponents(new ButtonBuilder().setCustomId('next').setStyle(ButtonStyle.Secondary).setEmoji('⏭️').setDisabled(currentPage === length - 1))
  return row
}
