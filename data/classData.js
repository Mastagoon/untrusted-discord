module.exports = [
   {
        id: 1,
        ingame_name: "Operation Leader",
        name: "operation leader,ol",
        type: "Special",
        faction: "NETSEC",
        unique: true,
        guarenteed: true,
        description: 'You are the NETSEC operation leader - your role is to coordinate attacks and to sniff out potential threats to your operation. Although you have hacking skills, you have to focus on other matters for the success of the full operation. Don’t get caught.',
        wincon: "Hack the target computer.",
        day_skills: ["Hack Target", "0-Day Exploit", "Grant Root Access"],
        night_skills: ["Emergency Extraction", "Move Hideout"],
        passive_skills: ["Not a Snitch", "Covert Broadcast"],
        capture_chance: "High",
    },
    {
        id: 2,
        ingame_name: "CCTV Specialist",
        name: "cctv specialist,cctv,ctv",
        type: "Field Operations",
        faction: "NETSEC",
        description: 'You have been hired by the Operation Leader to ensure no law enforcement interferes with the operation. You are one of the few that knows the physical location of everyone and you have to keep tabs on what’s happening by planting and monitoring hidden cameras. Everyone may be working together with law enforcement, hence, the need for some old school surveillance duty.',
        wincon: 'Hack the target computer.',
        day_skills: ["Create Hideout", "Bait Law Enforcement", "Desperate Measures"],
        night_skills: ["Move Hideout", "Install CCTV Surveillance"],
        passive_skills: ["Perform CCTV Surveillance"]
    },
    {
        id: 15,
        ingame_name: "Agent Leader",
        name: "agent leader,al",
        type: "Special",
        faction: "AGENT",
        unique: true,
        guarenteed: true,
        description: "You have been tasked in closing down the NETSEC crew forever - a dangerous task… that you have to do. You can’t resort to violence, but you have the government - and its resources - on your side..",
        wincon: "Prevent NETSEC from hacking the target machine and arrest their original leader, or gain root privileges from their Operation Leader, or arrest every NETSEC operative.",
        day_skills: ["All In", "Rollback", "Computer forensics background"],
        night_skills: ["Midnight Meeting", "Strike Deal", "Intelligence Informer"],
        passive_skills: ["Cover Checks Out", "Topology Knowledge"],
        capture_chance: "Moderate"
    }
]