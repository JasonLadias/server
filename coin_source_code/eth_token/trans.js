const ethWallet = require('../eth/wallet')

let ethTx = require('ethereumjs-tx').Transaction
let axios = require('axios')
let Web3 = require('web3')
let abi = require('human-standard-token-abi')
let timestamp = require('time-stamp')

exports.trans = async (addressNo, addressTo, value, tokenAddress, decimals) => {
    //retrieving eth address & private key
    let address = ethWallet.wallet(addressNo)
    let privateKey = Buffer.from(ethWallet.privKey(addressNo), 'hex')

    let amount = value * Math.pow(10, decimals)


    //fees needs changing
    let gasPrice = 23000000000
    let gasLimit = 21000

    let web3 = new Web3('wss://mainnet.infura.io/ws/v3/4fe5d399245448ce9cd6783fc045a4cb')

    let promise = new Promise((resolve, reject) => {
        web3.eth.net.isListening()
            .then(async () => {
                let count = await web3.eth.getTransactionCount(address)

                // This file is just JSON stolen from the contract page on etherscan.io under "Contract ABI"
                let abiArray = abi

                let contract = new web3.eth.Contract(abiArray, tokenAddress, { from: address })

                let params = {
                    "from": address,
                    "nonce": "0x" + count.toString(16),
                    "gasPrice": gasPrice,
                    "gasLimit": "0xEA60",
                    "to": tokenAddress,
                    "value": "0x0",
                    "data": contract.methods.transfer(addressTo, amount.toString()).encodeABI(),
                    "chainId": 0x01
                }

                const tx = new ethTx(params)
                tx.sign(privateKey);
                const serializedTx = tx.serialize()

                let url = 'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=' + serializedTx.toString('hex') + '&apikey=RT7M3E86XGZ2F53S8KFNWDASKH333FXGPP'
                
                console.log("***Request***\n" + timestamp('YYYY/MM/DD - HH:mm:ss'))
                console.log(url)
                
                axios.post(url).then(resp => {
                    console.log("***Response***\n" + timestamp('YYYY/MM/DD - HH:mm:ss'))
                    console.log(resp)
                    if (resp.data.error) {
                        console.error("8 - Broadcast server unexpected response")
                        resolve(-8)
                    }
                    else {
                        console.log("Transaction OK")
                        resolve(resp.data.result)
                    }
                }).catch(err => {
                    console.error("***Response***\n" + timestamp('YYYY/MM/DD - HH:mm:ss'))
                    console.error(err)
                    if (err.isAxiosError) {
                        console.error("7 - Broadcast Server Down")
                        resolve(-7)
                    } else {
                        console.error("9 - Broadcast server unreadable response")
                        resolve(-9)
                    }
                })
            })
            .catch(e => {
                if (e.code == 1006) {
                    resolve(-4)
                } else {
                    resolve(-6)
                }
            })


    })

    let status = await promise

    return status
    
}