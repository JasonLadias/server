let bip39 = require('bip39')
let hdkey = require('hdkey')
let bsv = require('bsv')

const mnemonic = "disagree column thrive calm field okay popular better aerobic panda cycle unveil";
let seed = bip39.mnemonicToSeedSync(mnemonic)//creates seed buffer

const root = hdkey.fromMasterSeed(seed)

//will generate the BSV address having as input the number
exports.wallet = (addressNo) => {

    const addrNode = root.derive("m/44'/236'/0'/0/"+addressNo) //line 1
    let privateKey = new bsv.PrivateKey(addrNode._privateKey.toString('hex'))
    
    let address = privateKey.toAddress()

    return address.toString('hex')
}

//will generate the BSV private key having as input the number
exports.privKey = (addressNo) => {
    const addrNode = root.derive("m/44'/236'/0'/0/" + addressNo)
    let privateKey = new bsv.PrivateKey(addrNode._privateKey.toString('hex'))

    return privateKey.toString('hex')
}