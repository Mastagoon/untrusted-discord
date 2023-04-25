import { Factions } from "../types"

export default (faction: Factions) => { return faction === Factions.NETSEC ? 0x00FF01 : faction === Factions.NEUTRAL ? 0xFF0000 : 0xFFC91B }
