const bchWallet = require('./wallet')

let bch = require('bitcore-lib-cash')
let request = require('request')

exports.trans = async (addressNo, addressTo, value) => {
    //retrieving bch address & private key
    let address = bchWallet.wallet(addressNo)
    let privateKey = new bch.PrivateKey(bchWallet.privKey(addressNo))
    //calculating the amoun in sats
    let amount = Number(value) * 100000000
    amount = ~~amount

    //fees needs changing
    let fee = 1000
    let WIF = privateKey.toWIF('hex')

    let promise = new Promise((resolve, reject) => {

        getUTXOs(address)
            .then((utxos) => {
                try {
                    //utxo needs manual proccess
                    let utxo = []
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
                    }
                    //we are building the transaction 
                    let tx = new bch.Transaction() //use bitcore-lib-cash to create a transaction
                        .from(utxo)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();

                    broadcastTX(tx)
                        .then((txid) => {
                            console.log("BCH: Transaction OK | addressNo: " + addressNo + " | address: " + addressTo + " | amount: " + value + " | txid : " + txid)
                            resolve(txid)
                        })
                        .catch((error) =>{
                            console.error("BCH: Api Error | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
                            resolve(-2)
                        })
                } catch (error) {
                    console.error("BCH: Transaction Build Error | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
                    resolve(-1)
                }

            })


    })

    let status = await promise

    return status
}


//manually hit the Api to get utxos of BCH. This Api needs modification
function getUTXOs(address) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://api.bitcore.io/api/BCH/mainnet/address/' + address + '/?unspent=true',
            json: true
        },
            (error, response, body) => {
                if (error) reject(error);
                resolve(body)
            }
        )
    })
}

//broadcast the transaction to the blockchair
function broadcastTX(rawtx) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://api.blockchair.com/bitcoin-cash/push/transaction',
            method: 'POST',
            "content-type": "application/json",
            json: {
                "data": rawtx
            }
        },
            (error, response, body) => {
                if (error) {
                    reject(error)
                };
                resolve(body.data.transaction_hash)
            }
        )
    })
}