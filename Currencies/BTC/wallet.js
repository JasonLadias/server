const bip39 = require('bip39')
const hdkey = require('hdkey')
const createHash = require('create-hash')
const bs58check = require('bs58check')

const mnemonic = "disagree column thrive calm field okay popular better aerobic panda cycle unveil";
let seed = bip39.mnemonicToSeedSync(mnemonic)//creates seed buffer

const root = hdkey.fromMasterSeed(seed)

//will generate the BTC address having as input the number
exports.wallet = (addressNo) => {
    
    const addrnode = root.derive("m/44'/0'/0'/0/" + addressNo)

    const step1 = addrnode._publicKey
    const step2 = createHash('sha256').update(step1).digest()
    const step3 = createHash('rmd160').update(step2).digest()

    let step4 = Buffer.allocUnsafe(21)
    step4.writeUInt8(0x00, 0)
    step3.copy(step4, 1) //step4 now holds the extended RIPMD-160 result
    const step9 = bs58check.encode(step4)//this is the private Key
    //step9 now is the address
    return step9
}

//will generate the BTC private key having as input the number
exports.privKey = (addressNo) => {
    const addrnode = root.derive("m/44'/0'/0'/0/" + addressNo)
    return addrnode._privateKey.toString('hex')
}