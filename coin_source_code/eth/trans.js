const ethWallet = require('./wallet')

let ethTx = require('ethereumjs-tx').Transaction
let axios = require('axios')
let Web3 = require('web3')
//check web3 before usage

exports.trans = async (addressNo, addressTo, value) => {
    //retrieving eth address & private key
    let address = ethWallet.wallet(addressNo)
    let privateKey = Buffer.from(ethWallet.privKey(addressNo), 'hex')
    //calculating amount in wei
    let amount = value * 1000000000000000000
    amount = ~~amount

    //fees needs changing
    let gasPrice = 13000000000
    let gasLimit = 21000

    let web3 = new Web3('wss://mainnet.infura.io/ws/v3/4fe5d399245448ce9cd6783fc045a4cb')

    let promise = new Promise((resolve, reject) => {
        web3.eth.net.isListening()
            .then(async () => {
                let count = await web3.eth.getTransactionCount(address)
                let params = {
                    nonce: count, //nonce need to be added 
                    to: addressTo,
                    value: amount,
                    gasPrice: gasPrice,
                    gasLimit: gasLimit,
                    chainId: 1
                }

                const tx = new ethTx(params, { chain: 'mainnet' })
                tx.sign(privateKey);
                const serializedTx = tx.serialize()

                let url = 'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=' + serializedTx.toString('hex') + '&apikey=RT7M3E86XGZ2F53S8KFNWDASKH333FXGPP'

                axios.post(url).then(resp => {
                    console.log(resp.data)
                    if (resp.data.error) {
                        resolve(-8)
                    }
                    else {
                        resolve(resp.data.result)
                    }
                }).catch(err => {
                    if (err.isAxiosError) {
                        resolve(-7)
                    } else {
                        resolve(-9)
                    }
                })
            })
            .catch(e => {
                if (e.reason) {
                    resolve(-4)
                } else {
                    resolve(-6)
                }
            })


    })

    let status = await promise

    return status

}