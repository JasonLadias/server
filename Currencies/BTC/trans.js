const btcWallet = require('./wallet')

let wif = require('wif')
let axios = require('axios')
let bitcore = require('bitcore-lib')
let logger = require('../../Logging/logger')

//will send the BTC transaction having as input the number, receiving address & amount
exports.trans = async (addressNo, addressTo, value) => {
    let UTXOError = [4, 5, 6]
    let BroadcastError = [7, 8, 9, 10]
    let UTXOErrorFinal = [4, 5, 6, 11]
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

    let i = 0, tx, status
    while (i < 6) {
        if (i % 2 == 0) {
            tx = await UTXO1(address, addressTo, amount, fee, WIF, value)
        } else {
            tx = await UTXO2(address, addressTo, amount, fee, WIF, value)
        }
        console.log(`i:${i}, status:${tx}`)
        if (!UTXOError.includes(tx)) break
        i++
    }

    if (UTXOErrorFinal.includes(tx)) return tx

    i = 0

    while (i < 6) {
        if (i % 2 == 0) {
            status = await server1(tx)
        } else {
            status = await server2(tx)
        }
        console.log(`i:${i}, status:${status}`)
        if (!BroadcastError.includes(status)) break
        i++
    }

    return status

}

const UTXO1 = async (address, addressTo, amount, fee, WIF, value) => {

    let path = "BTC/Utxo"

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
                    let utxos = res.data, sum = 0

                    for (let i = 0; i < utxos.length; i++) {
                        sum += utxos[i]['satoshis']
                    }

                    if (!value) {
                        amount = -fee + sum
                    } else {
                        if (amount > sum) {
                            resolve(11)
                            return
                        }
                    }

                    let tx = new bitcore.Transaction() //use bitcore-lib-cash to create a transaction
                        .from(utxos)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize()

                    resolve(tx.toString('hex'))

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

    return promise
}

const UTXO2 = async (address, addressTo, amount, fee, WIF, value) => {

    let path = "BTC/Utxo"

    let promise = new Promise((resolve, reject) => {
        //getting UTXOs for the specific address
        axios.get('https://blockchain.info/unspent?cors=true&active=' + address)
            .then((res) => {

                if (res.data.unspent_outputs) {
                    let utxos = res.data.unspent_outputs

                    let utxo = [], sum = 0
                    for (let i = 0; i < utxos.length; i++) {
                        utxo = [
                            ...utxo,
                            {
                                "txid": utxos[i]['tx_hash_big_endian'],
                                "vout": utxos[i]['tx_output_n'],
                                "scriptPubKey": utxos[i]['script'],
                                "satoshis": utxos[i]['value']
                            }
                        ]
                        sum += utxos[i]['value']
                    }

                    if (!value) {
                        amount = -fee + sum
                    } else {
                        if (amount > sum) {
                            resolve(11)
                            return
                        }
                    }

                    let tx = new bitcore.Transaction() //use bitcore-lib-cash to create a transaction
                        .from(utxo)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize()

                    resolve(tx.toString('hex'))

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

    return promise

}

const server1 = async (tx) => {

    let path = "BTC/Trans"

    let promise = new Promise((resolve, reject) => {
        //getting UTXOs for the specific address

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
                    logger.log(path, JSON.stringify(req), JSON.stringify(err.data))
                    resolve(7)
                } else {
                    logger.log(path, JSON.stringify(req), err)
                    resolve(9)
                }
            })
    })

    return promise
}


const server2 = async (tx) => {

    let path = "BTC/Trans"

    let promise = new Promise((resolve, reject) => {
        //getting UTXOs for the specific address

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
                    logger.log(path, JSON.stringify(req), JSON.stringify(err.data))
                    resolve(7)
                } else {
                    logger.log(path, JSON.stringify(req), err)
                    resolve(9)
                }
            })

    })

    return promise
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