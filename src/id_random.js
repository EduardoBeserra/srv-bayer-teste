const idaleatorio = () => {
    let str = stringAleatoria(8)
        + '-'
        + stringAleatoria(4)
        + '-'
        + stringAleatoria(4)
        + '-'
        + stringAleatoria(4)
        + '-'
        + stringAleatoria(12)
    return str
}

const stringAleatoria = length => {
    let str = ''
    for(let i = 0; i < length; i++)
        str += getStr()
    return str
}

const getStr = () => {
    const str = '0123456789abcdefghijklmnopqrstuvwxyz'
    return str[parseInt(Math.random() * str.length)]
}

module.exports = { idaleatorio }
