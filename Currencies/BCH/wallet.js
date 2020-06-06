let bip39 = require('bip39')
let hdkey = require('hdkey')
let bch = require('bitcore-lib-cash')

const mnemonic = "disagree column thrive calm field okay popular better aerobic panda cycle unveil";
let seed = bip39.mnemonicToSeedSync(mnemonic)//creates seed buffer

const root = hdkey.fromMasterSeed(seed)

//will generate the BCH address having as input the number
exports.wallet = (addressNo) =>{
    const addrNode = root.derive("m/44'/236'/0'/0/"+addressNo)
    let privateKey = new bch.PrivateKey(addrNode._privateKey.toString('hex'))

    let address = privateKey.toAddress().toString('hex')
    address = address.substring(12)

    return address
}

//will generate the BCH private key having as input the number
exports.privKey = (addressNo) =>{
    const addrNode = root.derive("m/44'/236'/0'/0/"+addressNo)
    let privateKey = new bch.PrivateKey(addrNode._privateKey.toString('hex'))

    return privateKey.toString('hex')
}