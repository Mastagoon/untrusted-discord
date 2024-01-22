import bot from "../app";

const getCommand = (command:string) => {
    var gotCommand = bot.commands.get(command);
	return gotCommand;
}

export default getCommand;