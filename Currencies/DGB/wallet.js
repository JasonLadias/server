let bip39 = require('bip39')
let hdkey = require('hdkey')
let dgb = require('digibyte')

const mnemonic = "disagree column thrive calm field okay popular better aerobic panda cycle unveil";
let seed = bip39.mnemonicToSeedSync(mnemonic)//creates seed buffer

const root = hdkey.fromMasterSeed(seed)

//will generate the LTC address having as input the number
exports.wallet = (addressNo) =>{
    const addrNode = root.derive("m/44'/20'/0'/0/"+addressNo)
    let privateKey = new dgb.PrivateKey(addrNode._privateKey.toString('hex'))

    let address = privateKey.toAddress().toString('hex')

    return address
}

//will generate the LTC private key having as input the number
exports.privKey = (addressNo) =>{
    const addrNode = root.derive("m/44'/20'/0'/0/"+addressNo)
    let privateKey = new dgb.PrivateKey(addrNode._privateKey.toString('hex'))

    return privateKey.toString('hex')
}