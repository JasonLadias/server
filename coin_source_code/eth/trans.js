const ethWallet = require('./wallet')

let ethTx = require('ethereumjs-tx').Transaction
let axios = require('axios')
let Web3 = require('web3')
let timestamp = require('time-stamp')


exports.trans = async (addressNo, addressTo, value) => {
    //retrieving eth address & private key
    let address = ethWallet.wallet(addressNo)
    let privateKey = Buffer.from(ethWallet.privKey(addressNo), 'hex')
    //calculating amount in wei
    let amount
    if (value) {
        amount = value * 1000000000000000000
        amount = ~~amount
    }


    //fees needs changing
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