const ethWallet = require('../ETH/wallet')

let ethTx = require('ethereumjs-tx').Transaction
let axios = require('axios')
let Web3 = require('web3')
let abi = require('human-standard-token-abi')
let logger = require('../../Logging/logger')

exports.trans = async (addressNo, addressTo, value, tokenAddress, decimals, ticker) => {
    let error = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let path = ticker+"/Trans", request
    //retrieving eth address & private key
    let address = ethWallet.wallet(addressNo)
    let privateKey = Buffer.from(ethWallet.privKey(addressNo), 'hex')

    let amount
    if (value) {
        amount = value * Math.pow(10, decimals)
    }

    //fees needs changing
    let i = 0, status
    while (i < 6) {
        if (i % 2 == 0) {
            status = await server1(address, addressTo, amount, privateKey, path, value, request, tokenAddress)
        } else {
            status = await server2(address, addressTo, amount, privateKey, path, value, request, tokenAddress)
        }
        if (!error.includes(status)) break
        i++
    }

    return status

}

const server1 = async (address, addressTo, amount, privateKey , path, value, request, tokenAddress) => {

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

                if (!value) {
                    amount = await contract.methods.balanceOf(address).call()
                    amount = Number(amount)
                    console.log(amount)
                }else{
                    let sum = await contract.methods.balanceOf(address).call()
                    console.log(sum + " "+ amount)
                    if(amount > sum){
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

                let url = 'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=' + serializedTx.toString('hex') + '&apikey=RT7M3E86XGZ2F53S8KFNWDASKH333FXGPP'

                request = "\nPOST " + url

                axios.post(url).then(resp => {
                    logger.log(path, request, JSON.stringify(resp.data))
                    if (resp.data.error) {
                        resolve(8)
                    }
                    else {
                        resolve(resp.data.result)
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
            .catch(e => {
                if (e.code == 1006) {
                    resolve(4)
                } else {
                    resolve(6)
                }
            })


    })

    return promise
}

const server2 = async (address, addressTo, amount, privateKey , path, value, request, tokenAddress) => {

    let gasPrice = 23000000000
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
                }else{
                    let sum = await contract.methods.balanceOf(address).call()
                    if(amount > sum){
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

                let url = 'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=' + serializedTx.toString('hex') + '&apikey=RT7M3E86XGZ2F53S8KFNWDASKH333FXGPP'

                request = "\nPOST " + url

                axios.post(url).then(resp => {
                    logger.log(path, request, JSON.stringify(resp.data))
                    if (resp.data.error) {
                        resolve(8)
                    }
                    else {
                        resolve(resp.data.result)
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
            .catch(e => {
                if (e.code == 1006) {
                    resolve(4)
                } else {
                    resolve(6)
                }
            })


    })

    return promise
}