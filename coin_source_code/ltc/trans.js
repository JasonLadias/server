const ltcWallet = require('./wallet')

let ltc = require('litecore-lib')
let request = require('request')

exports.trans = async (addressNo, addressTo, value) => {
    //retrieving bch address & private key
    let address = ltcWallet.wallet(addressNo)
    let privateKey = new ltc.PrivateKey(ltcWallet.privKey(addressNo))
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
                    //we are building the transaction 
                    let tx = new ltc.Transaction() //use bsv library to create a transaction
                        .from(utxos)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();

                    broadcastTX(tx)
                        .then((txid) => {
                            console.log("LTC: Transaction OK | addressNo: " + addressNo + " | address: " + addressTo + " | amount: " + value + " | txid : "+txid)
                            resolve(txid)
                        })
                        .catch((error) =>{
                            console.error("LTC: Api Error | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
                            resolve(-2)
                        })
                } catch (error) {
                    console.error("LTC: Transaction Build Error | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
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
            uri: 'https://insight.litecore.io/api/addr/' + address + '/utxo',
            json: true
        },
            (error, response, body) => {
                if (error) reject(error);
                resolve(body)
            }
        )
    })
}

//broadcast the transaction to blockchair
function broadcastTX(rawtx) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://api.blockchair.com/litecoin/push/transaction',
            method: 'POST',
            "content-type": "application/json",
            json: {
                "data": rawtx
            }
        },
            (error, response, body) => {
                if (error) {
                    reject(error)
                }
                resolve(body.data.transaction_hash)
            }
        )
    })
}