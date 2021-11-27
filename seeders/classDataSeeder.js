const axios = require("axios")
const classAliases = require("../data/aliases.json")
const fs = require("fs")

axios.get("https://www.playuntrusted.com/publicAPI/publicAPI.php?request=getClasses").then(res => {
    const { data } = res
    // add aliases
    for(cl of data) {
        const alias = classAliases.find(al => Number(al.id) == Number(cl.id))
        cl["name"] = alias?.name
    }
    fs.writeFileSync(`../data/classData.json`, JSON.stringify(data), null, 1)
})