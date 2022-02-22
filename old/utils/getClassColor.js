module.exports = (faction) => {
    return faction.toLowerCase() === 'netsec' ? '#00FF01' : faction.toLowerCase() === 'neutral' ? '#FF0000' : '#FFC91B'
}