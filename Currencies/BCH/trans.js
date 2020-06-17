const bchWallet = require('./wallet')

let bch = require('bitcore-lib-cash')
let axios = require('axios')
let logger = require('../../Logging/logger')

exports.trans = async (addressNo, addressTo, value) => {
    let UTXOError = [4,5,6]
    let BroadcastError = [7,8,9,10]
    let UTXOErrorFinal = [4,5,6,11]
    //retrieving bch address & private key
    let address = bchWallet.wallet(addressNo)
    let privateKey = new bch.PrivateKey(bchWallet.privKey(addressNo))
    //calculating the amoun in sats
    let amount
    if (value) {
        amount = Number(value) * 100000000
        amount = ~~amount
    }
    //fees needs changing
    let fee = 2000
    let WIF = privateKey.toWIF('hex')

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

    if(UTXOErrorFinal.includes(tx)) return tx

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

    let path = "BCH/Utxo"

    let promise = new Promise((resolve, reject) => {

        let req = `https://api.bitcore.io/api/BCH/mainnet/address/${address}/?unspent=true`

        axios.get(req)
            .then((res) => {
                if (res.data) {
                    logger.log(path, `GET ${req}`, JSON.stringify(res.data))
                    let utxos = res.data

                    let utxo = [], sum = 0
                    for (let i = 0; i < utxos.length; i++) {
                        utxo = [
                            ...utxo,
                            {
                                "txId": utxos[i]['mintTxid'],
                                "outputIndex": utxos[i]['mintIndex'],
                                "address": utxos[i]['address'],
                                "script": utxos[i]['script'],
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

                    //we are building the transaction 
                    let tx = new bch.Transaction() //use bitcore-lib-cash to create a transaction
                        .from(utxo)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();

                    resolve(tx)

                } else {
                    resolve(5)
                }
            })
            .catch((err) => {
                if (err.isAxiosError) {
                    logger.log(path, `GET ${req}`, JSON.stringify(err.data))
                    resolve(4)
                } else {
                    logger.log(path, `GET ${req}`, err)
                    resolve(6)
                }
            })
    })

    return promise
}

const UTXO2 = async (address, addressTo, amount, fee, WIF, value) => {

    let path = "BCH/Utxo"

    let promise = new Promise((resolve, reject) => {

        let req = `https://api.bitcore.io/api/BCH/mainnet/address/${address}/?unspent=true`
        axios.get(req)
            .then((res) => {
                if (res.data) {
                    logger.log(path, `GET ${req}`, JSON.stringify(res.data))

                    let utxos = res.data

                    let utxo = [], sum = 0
                    for (let i = 0; i < utxos.length; i++) {
                        utxo = [
                            ...utxo,
                            {
                                "txId": utxos[i]['mintTxid'],
                                "outputIndex": utxos[i]['mintIndex'],
                                "address": utxos[i]['address'],
                                "script": utxos[i]['script'],
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

                    //we are building the transaction 
                    let tx = new bch.Transaction() //use bitcore-lib-cash to create a transaction
                        .from(utxo)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();

                    resolve(tx)

                } else {
                    logger.log(path, `GET ${req}`, res)
                    resolve(5)
                }
            })
            .catch((err) => {
                if (err.isAxiosError) {
                    logger.log(path, `GET ${req}`, JSON.stringify(err.data))
                    resolve(4)
                } else {
                    logger.log(path, `GET ${req}`, err)
                    resolve(6)
                }
            })
    })

    return promise
}

const server1 = async (tx) => {

    let path = "BCH/Trans"

    let promise = new Promise((resolve, reject) => {

        let req = {
            method: 'post',
            url: 'https://api.blockchair.com/bitcoin-cash/push/transaction',
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

    let path = "BCH/Trans"

    let promise = new Promise((resolve, reject) => {


        let req = {
            method: 'post',
            url: 'https://api.blockchair.com/bitcoin-cash/push/transaction',
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