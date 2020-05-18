const bsvWallet = require('./wallet')

let bsv = require('bsv')
let request = require('request')

exports.trans = async (addressNo, addressTo, value) => {
    //retrieving bsv address & private key
    let address = bsvWallet.wallet(addressNo)
    let privateKey = new bsv.PrivateKey(bsvWallet.privKey(addressNo))
    //calculating the amount in sats
    let amount = Number(value) * 100000000
    amount = ~~amount

    //fees needs changing
    let fee = 1000
    let WIF = privateKey.toWIF('hex')

    let promise = new Promise((resolve, reject) => {

        getUTXOs(address)
            .then((utxos) => {
                try {
                    //we are building the transaction 
                    let tx = new bsv.Transaction() //use bsv library to create a transaction
                        .from(utxos)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();

                    broadcastTX(tx)
                        .then((txid) => {
                            console.log("BSV: Transaction OK | addressNo: " + addressNo + " | address: " + addressTo + " | amount: " + value + " | txid : " + txid)
                            resolve(txid)
                        })
                        .catch((error) => {
                            console.error("BSV: Api Error | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
                            resolve(-2)
                        })
                } catch (error) {
                    console.error("BSV: Transaction Build Error | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
                    resolve(-1)
                }

            })


    })

    let status = await promise

    return status

}

//manually hit an insight api to retrieve utxos of address
function getUTXOs(address) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://api.mattercloud.net/api/v3/main/address/' + address + '/utxo',
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
            uri: 'https://api.blockchair.com/bitcoin-sv/push/transaction',
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