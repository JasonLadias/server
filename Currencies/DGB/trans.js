const dgbWallet = require('./wallet')

let dgb = require('digibyte')
let axios = require('axios')
let timestamp = require('time-stamp')

exports.trans = async (addressNo, addressTo, value) => {
    //retrieving bch address & private key
    let address = dgbWallet.wallet(addressNo)
    let privateKey = new dgb.PrivateKey(dgbWallet.privKey(addressNo))
    //calculating the amoun in sats
    let amount
    if (value) {
        amount = Number(value) * 100000000
        amount = ~~amount
    }

    //fees needs changing
    let fee = 10000
    let WIF = privateKey.toWIF('hex')

    let promise = new Promise((resolve, reject) => {


        axios.get('https://digiexplorer.info/api/addr/' + address + '/utxo')
            .then((res) => {

                console.log(res.data)
                if (res.data) {

                    let utxos = res.data

                    if(!value){
                        amount = -fee
                        for (let i = 0; i < utxos.length; i++) {
                            amount += utxos[i]['amount']
                        }
                    }

                    let tx = new dgb.Transaction() //use dgb library to create a transaction
                        .from(utxos)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();

                    let req = {
                        method: 'post',
                        url: 'https://digiexplorer.info/api/tx/send',
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify({
                            "rawtx": tx
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
