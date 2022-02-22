module.exports = (alias, aliasList) => {
    const result = aliasList.find(al => al.alias === alias)?.cmd
    return result || alias
}