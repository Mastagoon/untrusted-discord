import { CacheType, CommandInteraction, Message } from "discord.js";
import { CommandArg } from "../types";

const getCommandParams = (c: Message<boolean> | CommandInteraction<CacheType> | undefined, options: CommandArg[]) => {
	// const username = isSlash ? interaction?.options.getString('username') : args?.join(' ')
	let strings: string[] = []
	if (c instanceof Message) {
		strings = c.content.split(" ");
	} else if (c instanceof CommandInteraction) {
		strings = c.options.data.map((o) => o.value as string);
	}
	const params: Record<string, string> = {};
	options.forEach((o, index) => {
		params[o.name] = strings[index];
	})
	return params
}

export default getCommandParams
