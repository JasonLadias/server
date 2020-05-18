const btcWallet = require('./wallet')

const request = require('request')
const wif = require('wif')
const bitcore = require('bitcore-lib')

//will send the BTC transaction having as input the number, receiving address & amount
exports.trans = async (addressNo, addressTo, value) => {
    //retrieving BTC address & privateKey for the specific number
    let address = btcWallet.wallet(addressNo)
    let privateKey = Buffer.from(btcWallet.privKey(addressNo), 'hex')
    //convert BTC to Sats and cuts the decimals
    let amount = Number(value) * 100000000
    amount = ~~amount
    //fee needs changing
    let fee = 1000
    let WIF = wif.encode(128, privateKey, true)

    //we use promise to get asyncronous results, resolve in promise works as a return in a normal function
    let promise = new Promise((resolve, reject) => {
        //getting UTXOs for the specific address

        getUTXOs(address)
            .then((utxos) => {
                try {
                    console.log(utxos)
                    //we are building the transaction 
                    let tx = new bitcore.Transaction() //use bitcore-lib-cash to create a transaction
                        .from(utxos)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();

                    broadcastTX(tx.toString('hex'))
                        .then((txid) => {
                            console.log("BTC: Transaction OK | addressNo: " + addressNo + " | address: " + addressTo + " | amount: " + value + " | txid : " + txid)
                            resolve(txid)
                        })
                        .catch((error) => {
                            console.error("BTC: Api Error | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
                            resolve(-2)
                        })
                } catch (error) {
                    console.error("BTC: Transaction Build Error | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
                    resolve(-1)
                }

            })

    })

    let status = await promise

    return status

}

function broadcastTX(rawtx) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://api.blockchair.com/bitcoin/push/transaction',
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
                console.log(response)
                resolve(body.data.transaction_hash)
            }
        )
    })
}

function getUTXOs(address) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://insight.bitpay.com/api/addrs/utxo',
            method: 'POST',
            "content-type": "application/json",
            json: {
                "addrs": address
            }
        },
            (error, response, body) => {
                if (error) reject(error);
                resolve(body)
            }
        )
    })
}