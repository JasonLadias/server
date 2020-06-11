const ethWallet = require('./wallet')

let ethTx = require('ethereumjs-tx').Transaction
let axios = require('axios')
let Web3 = require('web3')
let logger = require('../../Logging/logger')

exports.trans = async (addressNo, addressTo, value) => {
    let error = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let path = "ETH/Trans"
    let request
    //retrieving eth address & private key
    let address = ethWallet.wallet(addressNo)
    let privateKey = Buffer.from(ethWallet.privKey(addressNo), 'hex')
    //calculating amount in wei
    let amount
    if (value) {
        amount = value * 1000000000000000000
        amount = ~~amount
    }

    

    let i = 0, status
    while (i < 6) {
        if (i % 2 == 0) {
            status = await server1(address, addressTo, amount, privateKey, path, value, request)
        } else {
            status = await server2(address, addressTo, amount, privateKey, path, value, request)
        }
        if (!error.includes(status)) break
        i++
        console.log(i + " " +status)
    }

    return status

}

exports.addressCheck = async (address) =>{
    
    let web3 = new Web3('wss://mainnet.infura.io/ws/v3/4fe5d399245448ce9cd6783fc045a4cb')

    let promise = new Promise((resolve, reject) => {
        web3.eth.net.isListening()
            .then(async () => {
                let checker = await web3.eth.getCode(address)
                resolve(checker)
            })
            .catch(e => {
                if(e.reason){
                    resolve(-10)
                }else{
                    resolve(-11)
                }
            })


    })

    let status = await promise

    return status
}

const server1 = async (address, addressTo, amount, privateKey, path, value, request) => {
    let gasPrice = 27000000000
    let gasLimit = 21000

    let web3 = new Web3('wss://mainnet.infura.io/ws/v3/4fe5d399245448ce9cd6783fc045a4cb')
    
    let promise = new Promise((resolve, reject) => {
        
        web3.eth.net.isListening()
            .then(async () => {
                let count = await web3.eth.getTransactionCount(address)

                if(!value){
                    amount = await web3.eth.getBalance(address)
                    amount = Number(amount)
                    amount -= gasPrice * gasLimit
                }

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
                request = "\nPOST " + url

                axios.post(url).then(resp => {
                    logger.log(path,request,JSON.stringify(resp.data))
                    if (resp.data.error) {
                        resolve(8)
                    }
                    else {
                        resolve(resp.data.result)
                    }
                }).catch(err => {
                    if (err.isAxiosError) {
                        logger.log(path,request,JSON.stringify(err.response))
                        resolve(7)
                    } else {
                        logger.log(path,request,err)
                        resolve(9)
                    }
                })
            })
            .catch(e => {
                if (e.reason) {
                    resolve(4)
                } else {
                    resolve(6)
                }
            })


    })

    return promise
}

const server2 = async (address, addressTo, amount, privateKey , path, value, request) => {

    let gasPrice = 27000000000
    let gasLimit = 21000

    let web3 = new Web3('https://sparkling-empty-wind.quiknode.pro/68dd0066be83ed81dccf915a619414d79c32260e/')

    let promise = new Promise((resolve, reject) => {
        
        web3.eth.net.isListening()
            .then(async () => {
                let count = await web3.eth.getTransactionCount(address)

                if(!value){
                    amount = await web3.eth.getBalance(address)
                    amount = Number(amount)
                    amount -= gasPrice * gasLimit
                }

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
                request = "\nPOST " + url

                axios.post(url).then(resp => {
                    logger.log(path,request,JSON.stringify(resp.data))
                    if (resp.data.error) {
                        resolve(8)
                    }
                    else {
                        resolve(resp.data.result)
                    }
                }).catch(err => {
                    if (err.isAxiosError) {
                        logger.log(path,request,JSON.stringify(err.response))
                        resolve(7)
                    } else {
                        logger.log(path,request,err)
                        resolve(9)
                    }
                })
            })
            .catch(e => {
                console.log(e)
                if (e.reason) {
                    resolve(4)
                } else {
                    resolve(6)
                }
            })


    })

    return promise
}