let bip39 = require('bip39')
let hdkey = require('hdkey')
let ltc = require('litecore-lib')

const mnemonic = "disagree column thrive calm field okay popular better aerobic panda cycle unveil";
let seed = bip39.mnemonicToSeedSync(mnemonic)//creates seed buffer

const root = hdkey.fromMasterSeed(seed)

//will generate the LTC address having as input the number
exports.wallet = (addressNo) =>{
    const addrNode = root.derive("m/44'/2'/0'/0/"+addressNo)
    let privateKey = new ltc.PrivateKey(addrNode._privateKey.toString('hex'))

    let address = privateKey.toAddress().toString('hex')

    return address
}

//will generate the LTC private key having as input the number
exports.privKey = (addressNo) =>{
    const addrNode = root.derive("m/44'/2'/0'/0/"+addressNo)
    let privateKey = new ltc.PrivateKey(addrNode._privateKey.toString('hex'))

    return privateKey.toString('hex')
}