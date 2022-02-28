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

export enum Factions {
    NEUTRAL = "NEUTRAL",
    NETSEC = "NETSEC",
    AGENT = "AGENT"
}

export enum CaptureChance {
    HIGH = "High",
    MODERATE = "Moderate",
    LOW = "Low",
    VERYLOW = "Very Low"
}

export interface UntrustedClass {
    id: string
    ingame_name: string
    name: string
    type: "Special" | "Field Operations" | "Investigative" | "Offensive"
    unique: boolean
    guarenteed: boolean
    description: string
    faction: Factions
    wincon: string
    day_skills: string[]
    night_skills: string[]
    passive_skills: string[]
    capture_chance?: CaptureChance
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

export interface UserStats {
    inOpsec: boolean
    AvatarURL: string
    currentLevel: string
    levelDescription: string
    currentXp: string
    xpToNextLevel: string
    seasonWins: string
    totalWins: string
    seasonLosses: string
    totalLosses: string
}