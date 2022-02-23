import classInfo from "../data/classData.json"
import aliases from "../data/aliases.json"
import { UntrustedClass } from "../types"

export default (args?: string | null) => {
    if (!args) return null
    const cl = classInfo.find(c =>
        // alias check
        c.id === aliases.find(al => al.name.split(",").includes(args.toLowerCase()))?.id ||
        // shorthand
        c.name?.toLowerCase().split(",").includes(args.toLowerCase()) ||
        // first char of every character
        c.name?.split(" ").reduce((res, word) => res += word.slice(0, 1), '').toLowerCase() === args.toLowerCase()
    )
    return cl ? cl as unknown as UntrustedClass : null
}