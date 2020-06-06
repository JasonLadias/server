const EosWallet = require('eos-wallet')
const secureRandom = require('secure-random')

const mnemonic = "disagree column thrive calm field okay popular better aerobic panda cycle unveil";

const eos = EosWallet.fromMnemonic(mnemonic)

const addrNode = eos.derivePath("m/44'/196'/0'/0/0")

exports.wallet = () =>{
    return "testeasybit1"
}

exports.privKey = () =>{
    return addrNode.getPrivateKey()
}

exports.memo = () =>{
    let arr = secureRandom(3)
    return arr[0]+""+arr[1]+""+arr[2] 
}