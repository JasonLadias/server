const bsvWallet = require('./wallet')

let bsv = require('bsv')
let request = require('request')
let axios = require('axios')

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


            axios.get('https://api.mattercloud.net/api/v3/main/address/' + address + '/utxo')
                .then((res) => {
                    if (res.data) {
                        let utxos = res.data

                        let tx = new bsv.Transaction() //use bsv library to create a transaction
                            .from(utxos)
                            .to(addressTo, amount)
                            .fee(fee)
                            .change(address)
                            .sign(WIF)
                            .serialize()

                        axios({
                            method: 'post',
                            url: 'https://api.blockchair.com/bitcoin-sv/push/transaction',
                            headers: { "Content-Type": "application/json" },
                            data: JSON.stringify({
                                "data": tx
                            })
                        })
                            .then((res) => {
                                console.log(res)
                                if (res.data.data.transaction_hash) {
                                    resolve(res.data.data.transaction_hash)
                                } else {
                                    console.log("API Server unexpected response")
                                    resolve(-2)
                                }
                            })
                            .catch((err) => {
                                if(err.isAxiosError){
                                    console.log("API Server error")
                                }else{
                                    console.log("something shitty happen")
                                }
                                
                                resolve(-2)
                            })

                    } else {
                        console.log("build error")
                        resolve(-1)
                    }
                })
                .catch((err) => {
                    if(err.isAxiosError){
                        console.log("UTXO API Server error")
                    }else{
                        console.log("something shitty happen")
                    }
                    resolve(-1)
                })
        }


        /*
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

            */
    )

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