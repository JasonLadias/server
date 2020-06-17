const ethWallet = require('../ETH/wallet')

let ethTx = require('ethereumjs-tx').Transaction
let axios = require('axios')
let Web3 = require('web3')
let abi = require('human-standard-token-abi')
let logger = require('../../Logging/logger')

exports.trans = async (addressNo, addressTo, value, tokenAddress, decimals, ticker) => {
    let UTXOError = [4, 5, 6]
    let BroadcastError = [7, 8, 9, 10]
    let UTXOErrorFinal = [4, 5, 6, 11]

    //retrieving eth address & private key
    let address = ethWallet.wallet(addressNo)
    let privateKey = Buffer.from(ethWallet.privKey(addressNo), 'hex')

    let amount
    if (value) {
        amount = value * Math.pow(10, decimals)
    }

    //fees needs changing
    let i = 0, status, tx
    while (i < 6) {
        if (i % 2 == 0) {
            tx = await UTXO1(address, addressTo, amount, privateKey, value, tokenAddress, ticker)
        } else {
            tx = await UTXO2(address, addressTo, amount, privateKey, value, tokenAddress, ticker)
        }
        console.log(`i:${i}, status:${tx}`)
        if (!UTXOError.includes(tx)) break
        i++
    }

    if (UTXOErrorFinal.includes(tx)) return tx

    i = 0

    while (i < 6) {
        if (i % 2 == 0) {
            status = await server1(tx,ticker)
        } else {
            status = await server2(tx,ticker)
        }
        console.log(`i:${i}, status:${status}`)
        if (!BroadcastError.includes(status)) break
        i++
    }

    return status


}

const UTXO1 = async (address, addressTo, amount, privateKey, value, tokenAddress, ticker) => {
    let path = ticker + "/Utxo"

    let gasPrice = 45000000000
    let gasLimit = 21000

    let web3 = new Web3('wss://mainnet.infura.io/ws/v3/4fe5d399245448ce9cd6783fc045a4cb')

    let promise = new Promise((resolve, reject) => {
        web3.eth.net.isListening()
            .then(async () => {
                let count = await web3.eth.getTransactionCount(address)

                // This file is just JSON stolen from the contract page on etherscan.io under "Contract ABI"
                let abiArray = abi

                let contract = new web3.eth.Contract(abiArray, tokenAddress, { from: address })

                if (!value) {
                    amount = await contract.methods.balanceOf(address).call()
                    amount = Number(amount)
                    console.log(amount)
                } else {
                    let sum = await contract.methods.balanceOf(address).call()
                    console.log(sum + " " + amount)
                    if (amount > sum) {
                        resolve(11)
                        return
                    }
                }


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

                resolve(serializedTx.toString('hex'))
            }).catch(e => {
                if (e.code == 1006) {
                    resolve(4)
                } else {
                    resolve(6)
                }
            })
    })

    return promise
}

const UTXO2 = async (address, addressTo, amount, privateKey, value, tokenAddress, ticker) => {
    let path = ticker + "/Utxo"

    let gasPrice = 45000000000
    let gasLimit = 21000

    let web3 = new Web3('https://sparkling-empty-wind.quiknode.pro/68dd0066be83ed81dccf915a619414d79c32260e/')

    let promise = new Promise((resolve, reject) => {
        web3.eth.net.isListening()
            .then(async () => {
                let count = await web3.eth.getTransactionCount(address)

                // This file is just JSON stolen from the contract page on etherscan.io under "Contract ABI"
                let abiArray = abi

                let contract = new web3.eth.Contract(abiArray, tokenAddress, { from: address })

                if (!value) {
                    amount = await contract.methods.balanceOf(address).call()
                    amount = Number(amount)
                    console.log(amount)
                } else {
                    let sum = await contract.methods.balanceOf(address).call()
                    console.log(sum + " " + amount)
                    if (amount > sum) {
                        resolve(11)
                        return
                    }
                }


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

                resolve(serializedTx.toString('hex'))
            }).catch(e => {
                if (e.code == 1006) {
                    resolve(4)
                } else {
                    resolve(6)
                }
            })
    })

    return promise
}

const server1 = async (tx, ticker) => {

    let path = ticker + "/Trans"

    let promise = new Promise((resolve, reject) => {


        let url = 'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=' + tx + '&apikey=RT7M3E86XGZ2F53S8KFNWDASKH333FXGPP'
        let request = "\nPOST " + url

        axios.post(url).then(resp => {
            logger.log(path, request, JSON.stringify(resp.data))
            if (resp.data.error) {
                resolve(8)
            }
            else {
                resolve({status: 'OK',tx:resp.data.result})
            }
        }).catch(err => {
            if (err.isAxiosError) {
                logger.log(path, request, JSON.stringify(err.response))
                resolve(7)
            } else {
                logger.log(path, request, err)
                resolve(9)
            }
        })



    })

    return promise
}

const server2 = async (tx, ticker) => {

    let path = ticker + "/Trans"

    let promise = new Promise((resolve, reject) => {


        let url = 'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=' + tx + '&apikey=RT7M3E86XGZ2F53S8KFNWDASKH333FXGPP'
        let request = "\nPOST " + url

        axios.post(url).then(resp => {
            logger.log(path, request, JSON.stringify(resp.data))
            if (resp.data.error) {
                resolve(8)
            }
            else {
                resolve({status: 'OK',tx:resp.data.result})
            }
        }).catch(err => {
            if (err.isAxiosError) {
                logger.log(path, request, JSON.stringify(err.response))
                resolve(7)
            } else {
                logger.log(path, request, err)
                resolve(9)
            }
        })



    })

    return promise
}