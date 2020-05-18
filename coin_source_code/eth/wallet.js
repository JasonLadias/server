let bip39 = require('bip39')
let hdkey = require('hdkey')
let ethUtil = require('ethereumjs-util')

const mnemonic = "disagree column thrive calm field okay popular better aerobic panda cycle unveil";
let seed = bip39.mnemonicToSeedSync(mnemonic)//creates seed buffer

const root = hdkey.fromMasterSeed(seed)

//will generate the LTC address having as input the number
exports.wallet = (addressNo) => {
    const addrNode = root.derive("m/44'/60'/0'/0/" + addressNo)

    let pubKey = ethUtil.privateToPublic(addrNode._privateKey);
    let addr = ethUtil.publicToAddress(pubKey).toString('hex');
    let address = "0x"+addr
    return address
}

//will generate the LTC private key having as input the number
exports.privKey = (addressNo) => {
    const addrNode = root.derive("m/44'/60'/0'/0/" + addressNo)

    return addrNode._privateKey.toString('hex')
}