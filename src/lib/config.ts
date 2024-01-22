export default {
  // A list of Discord IDs that can use admin commands
  admins: [],
  // The display name of your bot (can also be set through Discord developer portal.)
  bot_name: "Untrusted Bot",
  // Bot activity. Displayed as playing ... in Discord.
  activity: "Untrusted",
  // The prefix used before commands
  prefix: "!",
  avatar:
    "https://cdn.discordapp.com/avatars/844038864464642099/183149246e642c601a3facad0a19b949.webp",
  // Language setting
  // To add a new language, copy English.js in the languages folder, change its name, and translate the lines on that file.
  // The bot will address users depending on their language role. Make sure to add the role NAME in the language setting below.
  language: [
    {
      name: "English", // Language name
      file_name: "English.js", // Name of the language file
      language_role_name: "", // Users who have a role with this name will be addressed with this language (required if the language is not default)
      default: true, // The default language. Only one language can be default.
    },
  ],
  // debug mode for slash commands (guild commands)
  commands_debug_mode: true,
  // guild ID for slash command testing
  slash_command_gid: "673234977948827720",
  // api for player count
  player_count_url: (server: string = "eu01") => `https://${server}.playuntrusted.com/publicAPI/publicAPI.php?request=getPlayerCount`,
  // api for supporter code
  supporter_role_url: (server: string = 'eu01') => `https://${server}.playuntrusted.com/publicAPI/publicAPI.php?request=getSupporterRole`,
  // api for image role
  image_role_url: (server: string = 'eu01') => `https://${server}.playuntrusted.com/publicAPI/publicAPI.php?request=getImageRole`,
  supporter_role_id: "1068515356789977169",
  image_role_id: "", //Unknown
  untrusted_guild_id: "777637565243064341",
  schedule_game_channel_id: "763446129856741376",
  repo_url: `https://github.com/mastagoon/untrusted-discord`,
  matchmaking_role_id: "1130780519827767319"
}
