import { APIEmbed } from "discord-api-types/v9"
import { CommandInteraction, EmbedField, EmbedFooterData, Message, User } from "discord.js"

export interface CommandExecuteParameters {
    interaction?: CommandInteraction
    message?: Message
    args?: string[]
    type: 'interaction' | 'message'
}

export interface CommandArg {
    name: string
    description: string
    isRequired: boolean
}

export interface Skill {
    id: string
    name: string
    aliases: string
    description: string
    type: string
    targets: string
    Cooldown_in_days: string
    Visits_target: 'No' | 'Yes'
    Occupies_target: 'No' | 'Yes'
    Maximum_uses: 'unlimited'
    RNG_based_success: 'No' | 'Yes'
}

export interface EmbedArgs {
    color?: string
    title?: string
    author?: User
    fields?: EmbedField[]
    thumbnail?: string
    footer?: EmbedFooterData
    image?: string
    description?: string
    options: APIEmbed
}