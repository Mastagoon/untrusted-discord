const axios = require("axios")
const fs = require("fs")

axios.get("https://www.playuntrusted.com/publicAPI/publicAPI.php?request=getSkills").then(res => {
    const { data } = res
    let regex = /\,(?!\s*?[\{\[\"\'\w])/g  // remove trailing commas
    fs.writeFileSync(`../data/skillData.json`, data.replace(regex, ''), null, 1)
})