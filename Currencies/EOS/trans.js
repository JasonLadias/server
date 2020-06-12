const eosWallet = require('./wallet')

let logger = require('../../Logging/logger')
const { Api, JsonRpc, RpcError } = require('eosjs')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util')

exports.trans = async (addressTo, value, memo) => {
    let error = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let path = "EOS/Trans"
    let request = JSON.stringify({
        addressTo: addressTo,
        amount: value,
        memo: memo
    })
    //get the privateKey
    let privateKey = eosWallet.privKey()

    let signatureProvider = new JsSignatureProvider([privateKey])

    let i = 0, status
    while (i < 6) {
        if (i % 2 == 0) {
            status = await server1(addressTo, path, value, signatureProvider, request, memo)
        } else {
            status = await server2(addressTo, path, value, signatureProvider, request, memo)
        }
        if (!error.includes(status)) break
        i++
        console.log(i + " " + status)
    }

    return status

}

const server1 = async (addressTo, path, value, signatureProvider, request, memo) => {

    let promise = new Promise((resolve, reject) => {
        try {

            const rpc = new JsonRpc('http://api.eosn.io', { fetch })

            if (!value) {
                resolve(10)
                return
            }
            let amount = value

            const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

            api.transact({
                actions: [{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: 'testeasybit1',
                        permission: 'active',
                    }],
                    data: {
                        from: 'testeasybit1',
                        to: addressTo,
                        quantity: amount + ' EOS',
                        memo: memo,
                    },
                }]
            }, {
                broadcast: true,
                sign: true,
                blocksBehind: 3,
                expireSeconds: 10,
            }).then(result => {
                logger.log(path, request, JSON.stringify(result))
                if (result.transaction_id) {
                    resolve(result.transaction_id)
                } else {
                    resolve(8)
                }

            }).catch(error => {
                if (error.isFetchError) {
                    logger.log(path, request, JSON.stringify(undefined))
                    resolve(7)
                } else {
                    logger.log(path, request, error)
                    resolve(6)
                }

            });
        } catch (e) {
            resolve(6)
        }
    })

    return promise
}

const server2 = async (addressTo, path, value, signatureProvider, request, memo) => {
    let promise = new Promise((resolve, reject) => {
        try {

            const rpc = new JsonRpc('https://api.eosflare.io', { fetch })

            if (!value) {
                resolve(10)
                return
            }
            let amount = value

            const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

            console.log()

            api.transact({
                actions: [{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: 'testeasybit1',
                        permission: 'active',
                    }],
                    data: {
                        from: 'testeasybit1',
                        to: addressTo,
                        quantity: amount + ' EOS',
                        memo: memo,
                    },
                }]
            }, {
                broadcast: true,
                sign: true,
                blocksBehind: 3,
                expireSeconds: 10,
            }).then(result => {
                logger.log(path, request, JSON.stringify(result))
                if (result.transaction_id) {
                    resolve(result.transaction_id)
                } else {
                    resolve(8)
                }

            }).catch(error => {

                if (error.isFetchError) {
                    logger.log(path, request, JSON.stringify(undefined))
                    resolve(7)
                } else {
                    logger.log(path, request, error)
                    resolve(6)
                }

            });
        } catch (e) {
            resolve(6)
        }
    })

    return promise
}