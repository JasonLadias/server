const bchWallet = require('./wallet')

let bch = require('bitcore-lib-cash')
let axios = require('axios')


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

        axios.get('https://api.bitcore.io/api/BCH/mainnet/address/' + address + '/?unspent=true')
            .then((res) => {
                if (res.data) {
                    let utxos = res.data

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

                    axios({
                        method: 'post',
                        url: 'https://api.blockchair.com/bitcoin-cash/push/transaction',
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify({
                            "data": tx
                        })
                    })
                        .then((res) => {
                            if (res.data.data.transaction_hash) {
                                resolve(res.data.data.transaction_hash)
                            } else {
                                resolve(-8)
                            }
                        })
                        .catch((err) => {
                            if (err.isAxiosError) {
                                resolve(-7)
                            } else {
                                resolve(-9)
                            }
                        })

                } else {
                    resolve(-5)
                }
            })
            .catch((err) => {
                if (err.isAxiosError) {
                    resolve(-4)
                } else {
                    resolve(-6)
                }
            })
    })

    let status = await promise

    return status
}
