const eosWallet = require('./wallet')

let logger = require('../../Logging/logger')
const { Api, JsonRpc, RpcError } = require('eosjs')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util')
const rpc = new JsonRpc('http://api.eosn.io', { fetch })

exports.trans = async (addressTo, value, memo) => {
    let path = "EOS/Trans"
    let request = JSON.stringify({
        addressTo: addressTo,
        amount: value,
        memo: memo
    })
    //get the privateKey
    let privateKey = eosWallet.privKey()

    let signatureProvider = new JsSignatureProvider([privateKey])

    let promise = new Promise((resolve, reject) => {
        try {
            if(!value){
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
                expireSeconds: 30,
            }).then(result => {
                logger.log(path, request, JSON.stringify(result))
                if(result.transaction_id){
                    resolve(result.transaction_id)
                }else{
                    resolve(8)
                }
                
            }).catch(error => {
                console.log(error)
                if(error.isFetchError){
                    logger.log(path, request, JSON.stringify(undefined))
                    resolve(7)
                }else{
                    logger.log(path, request, error)
                    resolve(6)
                }
                
            });
        } catch (e) {
            resolve(6)
        }
    })

    let status = await promise

    return status
}