const eosWallet = require('./wallet')

const { Api, JsonRpc, RpcError } = require('eosjs')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util')
const rpc = new JsonRpc('https://eos.greymass.com:443', { fetch })

exports.trans = async (addressTo, value, memo) => {
    //get the privateKey
    let privateKey = eosWallet.privKey()
    //calculating the amount
    let amount = value

    let signatureProvider = new JsSignatureProvider([privateKey])


    let promise = new Promise((resolve, reject) => {
        try {
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
                if(result.transaction_id){
                    resolve(result.transaction_id)
                }else{
                    resolve(-8)
                }
                
            }).catch(error => {
                console.log(error)
                if(error.isFetchError){
                    resolve(-7)
                }else{
                    resolve(-6)
                }
                
            });
        } catch (e) {
            resolve(-6)
        }
    })

    let status = await promise

    return status
}