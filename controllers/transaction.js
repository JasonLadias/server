const btcTrans = require('../Currencies/BTC/trans')
const bsvTrans = require('../Currencies/BSV/trans')
const bchTrans = require('../Currencies/BCH/trans')
const ltcTrans = require('../Currencies/LTC/trans')
const dgbTrans = require('../Currencies/DGB/trans')
const ethTrans = require('../Currencies/ETH/trans')
const ethTokenTrans = require('../Currencies/ETHToken/trans')
const eosTrans = require('../Currencies/EOS/trans')

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
    let coinName = req.body.coinName
    let addressNo = req.body.addressNo
    let addressTo = req.body.addressTo
    let value = req.body.value
    let memo
    let status
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
        case 'POWR':
            status = await ethTokenTrans.trans(addressNo, addressTo, value, '0x595832f8fc6bf59c85c527fec3740a1b7a361269', 6, 'POWR')
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
            }else if(error[status]){
                res.send(JSON.stringify({ status: "Error", type: status, reason: error[status] }))
            }else{
                res.send(JSON.stringify({ status: "Error", type: 12, reason: "Something unexpected happened" }))
            }
            break
        case 'OMG':
            status = await ethTokenTrans.trans(addressNo, addressTo, value, '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07', 18, 'OMG')
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
            }else if(error[status]){
                res.send(JSON.stringify({ status: "Error", type: status, reason: error[status] }))
            }else{
                res.send(JSON.stringify({ status: "Error", type: 12, reason: "Something unexpected happened" }))
            }
            break
        case 'LEND':
            status = await ethTokenTrans.trans(addressNo, addressTo, value, '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03', 18, 'LEND')
            if(status.status == 'OK'){
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status.tx }))
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
