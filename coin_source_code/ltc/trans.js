const ltcWallet = require('./wallet')

let ltc = require('litecore-lib')
let request = require('request')
let axios = require('axios')

exports.trans = async (addressNo, addressTo, value) => {
    //retrieving bch address & private key
    let address = ltcWallet.wallet(addressNo)
    let privateKey = new ltc.PrivateKey(ltcWallet.privKey(addressNo))
    //calculating the amoun in sats
    let amount = Number(value) * 100000000
    amount = ~~amount

    //fees needs changing
    let fee = 1000
    let WIF = privateKey.toWIF('hex')

    let promise = new Promise((resolve, reject) => {

        axios.get('https://insight.litecore.io/api/addr/' + address + '/utxo')
            .then((res) => {
                if (res.data) {
                    let utxos = res.data

                    let tx = new ltc.Transaction() //use bsv library to create a transaction
                        .from(utxos)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();
                    
                    axios({
                        method: 'post',
                        url: 'https://api.blockchair.com/litecoin/push/transaction',
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify({
                            "data": tx
                        })
                    })
                        .then((res) => {
                            if (res.data.data.transaction_hash) {
                                resolve(res.data.data.transaction_hash)
                            } else {
                                resolve(-8)
                            }
                        })
                        .catch((err) => {
                            if (err.isAxiosError) {
                                resolve(-7)
                            } else {
                                resolve(-9)
                            }
                        })

                } else {
                    resolve(-5)
                }
            })
            .catch((err) => {
                if (err.isAxiosError) {
                    resolve(-4)
                } else {
                    resolve(-6)
                }
            })
    

    })

    let status = await promise

    return status
}
