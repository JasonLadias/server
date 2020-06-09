const btcWallet = require('./wallet')

let wif = require('wif')
let axios = require('axios')
let bitcore = require('bitcore-lib')
let logger = require('../../Logging/logger')

//will send the BTC transaction having as input the number, receiving address & amount
exports.trans = async (addressNo, addressTo, value) => {
    let path = "BTC/Trans"
    //retrieving BTC address & privateKey for the specific number
    let address = btcWallet.wallet(addressNo)
    let privateKey = Buffer.from(btcWallet.privKey(addressNo), 'hex')
    //convert BTC to Sats and cuts the decimals
    let amount
    if (value) {
        amount = Number(value) * 100000000
        amount = ~~amount
    }
    //fee needs changing
    let fee = 1000
    let WIF = wif.encode(128, privateKey, true)

    //we use promise to get asyncronous results, resolve in promise works as a return in a normal function
    let promise = new Promise((resolve, reject) => {
        //getting UTXOs for the specific address


        axios({
            method: 'post',
            url: 'https://insight.bitpay.com/api/addrs/utxo',
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                "addrs": address
            })
        })
            .then((res) => {
                if (res.data) {
                    let utxos = res.data

                    if(!value){
                        amount = -fee
                        for (let i = 0; i < utxos.length; i++) {
                            amount += utxos[i]['satoshis']
                        }
                    }

                    let tx = new bitcore.Transaction() //use bitcore-lib-cash to create a transaction
                        .from(utxos)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize()

                    let req = {
                        method: 'post',
                        url: 'https://api.blockchair.com/bitcoin/push/transaction',
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify({
                            "data": tx
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


/*
axios.get('https://blockchain.info/unspent?cors=true&active=' + address)
            .then((res) => {

                if (res.data.unspent_outputs) {
                    let utxos = res.data.unspent_outputs

                    let utxo = []
                    for (let i = 0; i < utxos.length; i++) {
                        utxo = [
                            ...utxo,
                            {
                                "address": JSON.stringify(address),
                                "txId": utxos[i]['tx_hash'],
                                "outputIndex": utxos[i]['tx_output_n'],
                                "script": utxos[i]['script'],
                                "satoshis": utxos[i]['value']
                            }
                        ]
                    }

                    console.log(utxo)

                    let tx = new bitcore.Transaction() //use bitcore-lib-cash to create a transaction
                        .from(utxo)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize()


                    axios({
                        method: 'post',
                        url: 'https://api.blockchair.com/bitcoin/push/transaction',
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify({
                            "data": tx
                        })
                    })
                        .then((res) => {
                            //console.log(res)
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

*/