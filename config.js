module.exports = {
    // A list of Discord IDs that can use admin commands
    admins: [],
    // The display name of your bot (can also be set through Discord developer portal.)
    bot_name: 'Untrusted Bot',
    // Bot activity. Displayed as playing ... in Discord.
    activity: '',
    // The prefix used before commands
    prefix: '!',
    // Language setting
    // To add a new language, copy English.js in the languages folder, change its name, and translate the lines on that file.
    // The bot will address users depending on their language role. Make sure to add the role NAME in the language setting below.
    language: [
        {
            name: "English",    // Language name
            file_name: "English.js",    // Name of the language file
            language_role_name: '', // Users who have a role with this name will be addressed with this language (required if the language is not default)
            default: true   // The default language. Only one language can be default.
        }
    ],
}