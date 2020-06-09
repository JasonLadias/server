const dgbWallet = require('./wallet')

let dgb = require('digibyte')
let axios = require('axios')
let logger = require('../../Logging/logger')

exports.trans = async (addressNo, addressTo, value) => {
    let path = "DGB/Trans"
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

                    axios(req)
                        .then((res) => {
                            logger.log(path, JSON.stringify(req), JSON.stringify(res.data))
                            if (res.data.data.transaction_hash) {
                                resolve(res.data.data.transaction_hash)
                            } else {
                                resolve(8)
                            }
                        })
                        .catch((err) => {
                            if (err.isAxiosError) {
                                logger.log(path, JSON.stringify(req), JSON.stringify(err.response))
                                resolve(7)
                            } else {
                                logger.log(path, JSON.stringify(req), err)
                                resolve(9)
                            }
                        })

                } else {
                    resolve(5)
                }
            })
            .catch((err) => {
                if (err.isAxiosError) {
                    resolve(4)
                } else {
                    resolve(6)
                }
            })



    })

    let status = await promise

    return status
}
