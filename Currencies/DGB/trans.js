const dgbWallet = require('./wallet')

let dgb = require('digibyte')
let axios = require('axios')
let logger = require('../../Logging/logger')

exports.trans = async (addressNo, addressTo, value) => {
    let error = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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


        axios.get('https://digiexplorer.info/api/addr/' + address + '/utxo')
            .then((res) => {

                console.log(res.data)
                if (res.data) {

                    let utxos = res.data

                    if (!value) {
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

    return promise
}

const server2 = async (address, addressTo, amount, fee, WIF, path, value) => {

    let promise = new Promise((resolve, reject) => {

        axios.get('https://digiexplorer.info/api/addr/' + address + '/utxo')
            .then((res) => {

                console.log(res.data)
                if (res.data) {

                    let utxos = res.data

                    if (!value) {
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

    return promise
}