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
    let error = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
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
            if (error.includes(status)) {
                res.send(JSON.stringify({ status: "Error", type: status, reason: errorType(status) }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'BSV':
            //BSV transaction
            status = await bsvTrans.trans(addressNo, addressTo, value)
            if (error.includes(status)) {
                res.send(JSON.stringify({ status: "Error", type: status, reason: errorType(status) }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'BCH':
            //BCH transaction
            status = await bchTrans.trans(addressNo, addressTo, value)
            if (error.includes(status)) {
                res.send(JSON.stringify({ status: "Error", type: status, reason: errorType(status) }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'LTC':
            //LTC transaction
            status = await ltcTrans.trans(addressNo, addressTo, value)
            if (error.includes(status)) {
                res.send(JSON.stringify({ status: "Error", type: status, reason: errorType(status) }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'DGB':
            //DGB transaction (not working)
            status = await dgbTrans.trans(addressNo, addressTo, value)
            if (error.includes(status)) {
                res.send(JSON.stringify({ status: "Error", type: status, reason: errorType(status) }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'ETH':
            status = await ethTrans.trans(addressNo, addressTo, value)
            if (error.includes(status)) {
                res.send(JSON.stringify({ status: "Error", type: status, reason: errorType(status) }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'EOS':
            memo = req.body.memo
            status = await eosTrans.trans(addressTo, value, memo)
            if (error.includes(status)) {
                res.send(JSON.stringify({ status: "Error", type: status, reason: errorType(status) }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break

        //ETH Tokens
        case 'POWR':
            status = await ethTokenTrans.trans(addressNo, addressTo, value, '0x595832f8fc6bf59c85c527fec3740a1b7a361269', 6, 'POWR')
            if (error.includes(status)) {
                res.send(JSON.stringify({ status: "Error", type: status, reason: errorType(status) }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'OMG':
            status = await ethTokenTrans.trans(addressNo, addressTo, value, '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07', 18, 'OMG')
            if (error.includes(status)) {
                res.send(JSON.stringify({ status: "Error", type: status, reason: errorType(status) }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'LEND':
            status = await ethTokenTrans.trans(addressNo, addressTo, value, '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03', 18, 'LEND')
            if (error.includes(status)) {
                res.send(JSON.stringify({ status: "Error", type: status, reason: errorType(status) }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        default:
            res.send(JSON.stringify({ status: "Error", type: "3", reason: "Coin Name does not exist" }))
    }

}

const errorType = (status) => {
    if (status == 3) {
        return "Coin Name does not exist"
    } else if (status == 4) {
        return "UTXO server down"
    } else if (status == 5) {
        return "UTXO Server unexpected response"
    } else if (status == 6) {
        return "Transaction build error"
    } else if (status == 7) {
        return "Broadcast server down"
    } else if (status == 8) {
        return "Broadcast server unexpected response ***Possible send of money***"
    } else if (status == 9) {
        return "Broadcast server unreadable response ***Possible send of money***"
    } else if (status == 10) {
        return "Value not set"
    } else if (status == 11) {
        return "Amount not available"
    }
}