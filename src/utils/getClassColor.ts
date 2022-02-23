import { Factions } from "../types"

export default (faction: Factions) => { return faction === Factions.NETSEC ? '#00FF01' : faction === Factions.NEUTRAL ? '#FF0000' : '#FFC91B' }