import skillData from "../data/skillData.json"
import { Skill } from "../types"

export default (args?: string | null) => {
    if (!args) return null
    const query = args.split(" ")
    const skill = skillData.find(
        sk => sk.name.toLowerCase() == query.join(' ').toLowerCase() // name given
            || sk.aliases.toLowerCase().split(' ').includes(query.join(' ').toLowerCase()) // aliases
            || sk.name.split(" ").reduce((res, word) => res += word.slice(0, 1), '').toLowerCase() == query[0].toLowerCase()
    )
    return skill ? skill as unknown as Skill : null
}