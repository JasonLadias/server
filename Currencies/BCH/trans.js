const bchWallet = require('./wallet')

let bch = require('bitcore-lib-cash')
let axios = require('axios')
let logger = require('../../Logging/logger')

exports.trans = async (addressNo, addressTo, value) => {
    let error = [1,2,3,4,5,6,7,8,9,10,11]
    let path = "BCH/Trans"
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

    let i = 0, status
    while(i<6 ){
        if(i%2 == 0){
            status = await server1(address, addressTo, amount, fee, WIF, path, value)
        }else{
            status = await server2(address, addressTo, amount, fee, WIF, path, value)
        }
        if(!error.includes(status)) break
        i++
    }

    return status

}

const server1 = async (address, addressTo, amount, fee, WIF, path, value) => {

    let promise = new Promise((resolve, reject) => {

        axios.get(`https://api.bitcore.io/api/BCH/mainnet/address/${address}/?unspent=true`)
            .then((res) => {
                if (res.data) {
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

                    console.log(`amount = ${amount}, value = ${value}, sum = ${sum}`)

                    if(!value){
                        amount = -fee + sum
                    }else{
                        if(amount > sum){
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

        axios.get(`https://api.bitcore.io/api/BCH/mainnet/address/${address}/?unspent=true`)
            .then((res) => {
                if (res.data) {
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

                    if(!value){
                        amount = -fee + sum
                    }else{
                        if(amount > sum){
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