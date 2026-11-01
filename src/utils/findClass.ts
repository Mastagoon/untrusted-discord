import classInfo from "../data/classData.json"
import aliases from "../data/aliases.json"
import { UntrustedClass } from "../types"

export default (args?: string | null) => {
    if (!args) return null
    const query = args.toLowerCase()
    const aliasId = aliases.find(al => al.name.split(",").includes(query))?.id
    const cl = classInfo.find(c => {
        return String(c.id) === String(aliasId) ||
            c.name?.toLowerCase().split(",").includes(query) ||
            c.name?.split(" ").reduce((res, word) => res += word.slice(0, 1), '').toLowerCase() === query
    })
    console.debug("Found " + cl)
    return cl ? cl as unknown as UntrustedClass : null
}