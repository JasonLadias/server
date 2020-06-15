const ltcWallet = require('./wallet')

let ltc = require('litecore-lib')
let axios = require('axios')
let logger = require('../../Logging/logger')

exports.trans = async (addressNo, addressTo, value) => {
    let error = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let path = "LTC/Trans"
    //retrieving bch address & private key
    let address = ltcWallet.wallet(addressNo)
    let privateKey = new ltc.PrivateKey(ltcWallet.privKey(addressNo))
    //calculating the amoun in sats
    let amount
    if (value) {
        amount = Number(value) * 100000000
        amount = ~~amount
    }

    //fees needs changing
    let fee = 1000
    let WIF = privateKey.toWIF('hex')

    let i = 0, status
    while (i < 6) {
        if (i % 2 == 0) {
            status = await server1(address, addressTo, amount, fee, WIF, path, value)
        } else {
            status = await server2(address, addressTo, amount, fee, WIF, path, value)
        }
        if (!error.includes(status)) break
        i++
    }

    return status

}

const server1 = async (address, addressTo, amount, fee, WIF, path, value) => {

    let promise = new Promise((resolve, reject) => {

        axios.get('https://insight.litecore.io/api/addr/' + address + '/utxo')
            .then((res) => {
                if (res.data) {
                    let utxos = res.data, sum = 0

                    for (let i = 0; i < utxos.length; i++) {
                        sum += utxos[i]['satoshis']
                    }

                    if (!value) {
                        amount = -fee + sum
                    }else{
                        if (amount > sum) {
                            resolve(11)
                            return
                        }
                    }

                    let tx = new ltc.Transaction() //use bsv library to create a transaction
                        .from(utxos)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();

                    let req = {
                        method: 'post',
                        url: 'https://api.blockchair.com/litecoin/push/transaction',
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

    return promise
}

const server2 = async (address, addressTo, amount, fee, WIF, path, value) => {


    let promise = new Promise((resolve, reject) => {

        axios.get('https://insight.litecore.io/api/addr/' + address + '/utxo')
            .then((res) => {
                if (res.data) {
                    let utxos = res.data, sum = 0

                    for (let i = 0; i < utxos.length; i++) {
                        sum += utxos[i]['satoshis']
                    }

                    if (!value) {
                        amount = -fee + sum
                    }else{
                        if (amount > sum) {
                            resolve(11)
                            return
                        }
                    }

                    let tx = new ltc.Transaction() //use bsv library to create a transaction
                        .from(utxos)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();

                    let req = {
                        method: 'post',
                        url: 'https://api.blockchair.com/litecoin/push/transaction',
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

    return promise
}