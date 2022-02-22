// get classes data
const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")

const crawlClassData = async (url = "https://www.playuntrusted.com/manual/classes/") => {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const selector = $("div.entry-content div")
    let data = []
    // get classes
    $(selector.each(async(i, element) => {
        if(!$(element).hasClass("skilldetail") && $(element).css("float") === "left") {
            // element is class info card
            const classInfo = {
                id: $(element).find("img")?.attr("src")?.split("/")[4].split(".")[0],
                ingame_name: $(element).find("h1").text(),
                name: $(element).find("h1").text().toLowerCase(),
                description: $(element).find("p").first().text(),
                faction: $(element).find("b").first().next().text(),
            }
            if(classInfo.id)
                data.push(classInfo)
        }
    }))
    fs.writeFileSync(`${__dirname}/data/classData.json`, JSON.stringify(data))
}

const crawlSkillData = async (url = "https://www.playuntrusted.com/manual/skills/") => {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const selector = $("div#skillstable")
    const divs = $(selector).find("div").toArray()
    const skillList = []
    for(let i = 0; i < divs.length; i = i + 2) {
        const targetPara = $(divs[i]).find("p").first().next().text() // we'll need this later
        const skillInfo = {
            name: $(divs[i]).find("h1").first().text(),
            aliases: $(divs[i]).find("h1").first().text().toLowerCase(),
            description: $(divs[i]).find("p").first().text(),
            targets:  targetPara.includes("targets network node") ? "Node" : targetPara.includes("targets target player") ? "Players" : "None"
        }
        const skillDetailsDiv = $(divs[i]).next()
        skillInfo.id = skillDetailsDiv.find("img")?.attr("src")?.split("/")[4].split(".")[0],
        detailsP = $(skillDetailsDiv).find("p").first()
        skillInfo.type = detailsP.text().split(" ")[0]
        $(detailsP).find("b").each((i, b) => {
            skillInfo[$(b).text().replace(":","").replaceAll(" ", "_")] = b?.childNodes[0]?.parentNode.next.data.trim()
        })
        if(skillInfo.id) skillList.push(skillInfo)
    }
    fs.writeFileSync(`${__dirname}/data/skillData.json`, JSON.stringify(skillList))
}