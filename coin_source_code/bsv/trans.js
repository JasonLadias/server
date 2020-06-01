const bsvWallet = require('./wallet')

let bsv = require('bsv')
let axios = require('axios')
let timestamp = require('time-stamp')

exports.trans = async (addressNo, addressTo, value) => {
    //retrieving bsv address & private key
    let address = bsvWallet.wallet(addressNo)
    let privateKey = new bsv.PrivateKey(bsvWallet.privKey(addressNo))
    //calculating the amount in sats
    let amount = Number(value) * 100000000
    amount = ~~amount

    //fees needs changing
    let fee = 1000
    let WIF = privateKey.toWIF('hex')

    let promise = new Promise((resolve, reject) => {


        axios.get('https://api.mattercloud.net/api/v3/main/address/' + address + '/utxo')
            .then((res) => {
                if (res.data) {
                    let utxos = res.data

                    let tx = new bsv.Transaction() //use bsv library to create a transaction
                        .from(utxos)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize()


                    let req = {
                        method: 'post',
                        url: 'https://api.blockchair.com/bitcoin-sv/push/transaction',
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify({
                            "data": tx
                        })
                    }

                    console.log("***Request***\n" + timestamp('YYYY/MM/DD - HH:mm:ss'))
                    console.log(req)

                    axios(req)
                        .then((res) => {
                            console.log("***Response***\n" + timestamp('YYYY/MM/DD - HH:mm:ss'))
                            console.log(res)
                            if (res.data.data.transaction_hash) {
                                console.log("Transaction OK")
                                resolve(res.data.data.transaction_hash)
                            } else {
                                console.error("8 - Broadcast server unexpected response")
                                resolve(-8)
                            }
                        })
                        .catch((err) => {
                            console.error("***Response***\n" + timestamp('YYYY/MM/DD - HH:mm:ss'))
                            console.error(err)
                            if (err.isAxiosError) {
                                console.error("7 - Broadcast Server Down")
                                resolve(-7)
                            } else {
                                console.error("9 - Broadcast server unreadable response")
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
