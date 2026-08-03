import { ChatInputCommandInteraction, Message } from "discord.js";
import { CommandArg } from "../types";

const getCommandParams = (
	c: Message<boolean> | ChatInputCommandInteraction | undefined,
	options: CommandArg[]
) => {
	// const username = isSlash ? interaction?.options.getString('username') : args?.join(' ')
	let strings: string[] = []
	if (c instanceof Message) {
		strings = c.content.split(" ");
	} else if (c) {
		strings = options.map((o) => c.options.getString(o.name) ?? "");
	}
	const params: Record<string, string | undefined> = {};
	options.forEach((o, index) => {
		params[o.name] = strings[index];
	})
	return params
}

export default getCommandParams
