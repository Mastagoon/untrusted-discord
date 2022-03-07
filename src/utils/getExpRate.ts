export default (current: number, next: number) => {
    const ratio = Math.floor(current / next * 100)
    return ratio
    // const arr = []
    // for(let i = 0; i < ratio; i = i + 10) {
    //     arr.push('🟩')
    // }
}