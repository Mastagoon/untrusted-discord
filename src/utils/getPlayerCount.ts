import config from "../lib/config"

export default async (
  verbose = false
): Promise<
  | string
  | { Online_players: string; Open_lobbies: string; Active_games: string }
  | null
> => {
  try {
    const res = (await (await fetch(config.player_count_url())).json())[0]
    if (res["Show_status"]?.toLowerCase() !== "yes") return null
    const playerCount = Number(res["Online_players"])
    if (playerCount > 0 && verbose) {
      return {
        Online_players: playerCount.toString(),
        Open_lobbies: res["Open_lobbies"],
        Active_games: res["Active_games"],
      }
    }
    return `${playerCount < 0 ? `Less than ${Math.abs(playerCount)} ` : playerCount
      } operatives online`
  } catch (err) {
    console.log(err)
    return 'Failed to get the player count.'
  }
}
