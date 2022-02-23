import { MessageActionRow, MessageButton } from "discord.js"

export default (currentPage: number, length: number) => {
    const row = new MessageActionRow()
    row.addComponents(new MessageButton().setCustomId('prev').setStyle('SECONDARY').setEmoji('⏮️').setDisabled(currentPage === 0))
    row.addComponents(new MessageButton().setCustomId('end').setStyle('SECONDARY').setEmoji('⏸️'))
    row.addComponents(new MessageButton().setCustomId('next').setStyle('SECONDARY').setEmoji('⏭️').setDisabled(currentPage === length - 1))
    return row
}