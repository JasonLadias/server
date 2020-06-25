const btcTrans = require('../Currencies/BTC/trans')
const bsvTrans = require('../Currencies/BSV/trans')
const bchTrans = require('../Currencies/BCH/trans')
const ltcTrans = require('../Currencies/LTC/trans')
const dgbTrans = require('../Currencies/DGB/trans')
const ethTrans = require('../Currencies/ETH/trans')
const ethTokenTrans = require('../Currencies/ETHToken/trans')
const eosTrans = require('../Currencies/EOS/trans')
const tokenArray = require('../Currencies/ETHToken/tokenArray')

exports.postTransaction = async (req, res, next) => {
    //Geting the coinName from the POST request
    let error = {
        1 : 'Bad Endpoint Request',
        2 : 'Address Number is not valid',
        3 : 'Coin Name does not exist',
        4 : 'UTXO server down',
        5 : 'UTXO Server unexpected response',
        6 : 'Transaction build error',
        7 : 'Broadcast server down',
        8 : 'Broadcast server unexpected response ***Possible send of money***',
        9 : 'Broadcast server unreadable response ***Possible send of money***',
        10 : 'Value not set',
        11 : 'Amount not available',
    }
    
    let tokenName = tokenArray.tokenName()
    let tokenDataObject
    let coinName = req.body.coinName
    let addressNo = req.body.addressNo
    let addressTo = req.body.addressTo
    let value = req.body.value
    let memo
    let status
    let token

    
    if(tokenName.includes(coinName)){
        tokenDataObject = tokenArray.tokenData()
        token = coinName
        coinName = 'TOKEN'
    } 
    //Checking if the coinName matches a valid coin
    switch (coinName) {
        case 'BTC':
            //BTC transaction
            status = await btcTrans.trans(addressNo, addressTo, value)
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
            }else if(error[status]){
                res.send(JSON.stringify({ status: "Error", type: status, reason: error[status] }))
            }else{
                res.send(JSON.stringify({ status: "Error", type: 12, reason: "Something unexpected happened" }))
            }
            break
        case 'BSV':
            //BSV transaction
            status = await bsvTrans.trans(addressNo, addressTo, value)
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
            }else if(error[status]){
                res.send(JSON.stringify({ status: "Error", type: status, reason: error[status] }))
            }else{
                res.send(JSON.stringify({ status: "Error", type: 12, reason: "Something unexpected happened" }))
            }
            break
        case 'BCH':
            //BCH transaction
            status = await bchTrans.trans(addressNo, addressTo, value)
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
            }else if(error[status]){
                res.send(JSON.stringify({ status: "Error", type: status, reason: error[status] }))
            }else{
                res.send(JSON.stringify({ status: "Error", type: 12, reason: "Something unexpected happened" }))
            }
            break
        case 'LTC':
            //LTC transaction
            status = await ltcTrans.trans(addressNo, addressTo, value)
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
            }else if(error[status]){
                res.send(JSON.stringify({ status: "Error", type: status, reason: error[status] }))
            }else{
                res.send(JSON.stringify({ status: "Error", type: 12, reason: "Something unexpected happened" }))
            }
            break
        case 'DGB':
            //DGB transaction (not working)
            status = await dgbTrans.trans(addressNo, addressTo, value)
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
            }else if(error[status]){
                res.send(JSON.stringify({ status: "Error", type: status, reason: error[status] }))
            }else{
                res.send(JSON.stringify({ status: "Error", type: 12, reason: "Something unexpected happened" }))
            }
            break
        case 'ETH':
            status = await ethTrans.trans(addressNo, addressTo, value)
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
            }else if(error[status]){
                res.send(JSON.stringify({ status: "Error", type: status, reason: error[status] }))
            }else{
                res.send(JSON.stringify({ status: "Error", type: 12, reason: "Something unexpected happened" }))
            }
            break
        case 'EOS':
            memo = req.body.memo
            status = await eosTrans.trans(addressTo, value, memo)
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
            }else if(error[status]){
                res.send(JSON.stringify({ status: "Error", type: status, reason: error[status] }))
            }else{
                res.send(JSON.stringify({ status: "Error", type: 12, reason: "Something unexpected happened" }))
            }
            break
        //ETH Tokens
        case 'TOKEN':
            status = await ethTokenTrans.trans(addressNo, addressTo, value, tokenDataObject[token].tokenAddress ,tokenDataObject[token].decimals, token)
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: token, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
            }else if(error[status]){
                res.send(JSON.stringify({ status: "Error", type: status, reason: error[status] }))
            }else{
                res.send(JSON.stringify({ status: "Error", type: 12, reason: "Something unexpected happened" }))
            }
            break
        
        default:
            res.send(JSON.stringify({ status: "Error", type: "3", reason: "Coin Name does not exist" }))
    }

}
