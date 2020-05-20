const btcTrans = require('../coin_source_code/btc/trans')
const bsvTrans = require('../coin_source_code/bsv/trans')
const bchTrans = require('../coin_source_code/bch/trans')
const ltcTrans = require('../coin_source_code/ltc/trans')
const dgbTrans = require('../coin_source_code/dgb/trans')
const ethTrans = require('../coin_source_code/eth/trans')
const ethTokenTrans = require('../coin_source_code/eth_token/trans')
const eosTrans = require('../coin_source_code/eos/trans')

exports.postTransaction = async (req, res, next) => {
    //Geting the coinName from the POST request
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
            if (status == -4) {
                res.send(JSON.stringify({ status: "Error", type: "4", reason: "UTXO server down" }))
            } else if (status == -5) {
                res.send(JSON.stringify({ status: "Error", type: "5", reason: "UTXO Server unexpected response" }))
            } else if (status == -6) {
                res.send(JSON.stringify({ status: "Error", type: "6", reason: "Transaction build error" }))
            } else if (status == -7) {
                res.send(JSON.stringify({ status: "Error", type: "7", reason: "Broadcast server down" }))
            } else if (status == -8) {
                res.send(JSON.stringify({ status: "Error", type: "8", reason: "Broadcast server unexpected response ***Possible send of money***" }))
            } else if (status == -9) {
                res.send(JSON.stringify({ status: "Error", type: "9", reason: "Broadcast server unreadable response ***Possible send of money***" }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'BSV':
            //BSV transaction
            status = await bsvTrans.trans(addressNo, addressTo, value)
            if (status == -4) {
                res.send(JSON.stringify({ status: "Error", type: "4", reason: "UTXO server down" }))
            } else if (status == -5) {
                res.send(JSON.stringify({ status: "Error", type: "5", reason: "UTXO Server unexpected response" }))
            } else if (status == -6) {
                res.send(JSON.stringify({ status: "Error", type: "6", reason: "Transaction build error" }))
            } else if (status == -7) {
                res.send(JSON.stringify({ status: "Error", type: "7", reason: "Broadcast server down" }))
            } else if (status == -8) {
                res.send(JSON.stringify({ status: "Error", type: "8", reason: "Broadcast server unexpected response ***Possible send of money***" }))
            } else if (status == -9) {
                res.send(JSON.stringify({ status: "Error", type: "9", reason: "Broadcast server unreadable response ***Possible send of money***" }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'BCH':
            //BCH transaction
            status = await bchTrans.trans(addressNo, addressTo, value)
            if (status == -4) {
                res.send(JSON.stringify({ status: "Error", type: "4", reason: "UTXO server down" }))
            } else if (status == -5) {
                res.send(JSON.stringify({ status: "Error", type: "5", reason: "UTXO Server unexpected response" }))
            } else if (status == -6) {
                res.send(JSON.stringify({ status: "Error", type: "6", reason: "Transaction build error" }))
            } else if (status == -7) {
                res.send(JSON.stringify({ status: "Error", type: "7", reason: "Broadcast server down" }))
            } else if (status == -8) {
                res.send(JSON.stringify({ status: "Error", type: "8", reason: "Broadcast server unexpected response ***Possible send of money***" }))
            } else if (status == -9) {
                res.send(JSON.stringify({ status: "Error", type: "9", reason: "Broadcast server unreadable response ***Possible send of money***" }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'LTC':
            //LTC transaction
            status = await ltcTrans.trans(addressNo, addressTo, value)
            if (status == -1) {
                res.send(JSON.stringify({ status: "Error", type: "4", reason: "Transaction Build error" }))
            } else if (status == -2) {
                res.send(JSON.stringify({ status: "Error", type: "5", reason: "Transaction API error" }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'DGB':
            //DGB transaction (not working)
            status = await dgbTrans.trans(addressNo, addressTo, value)
            if (status == -4) {
                res.send(JSON.stringify({ status: "Error", type: "4", reason: "UTXO server down" }))
            } else if (status == -5) {
                res.send(JSON.stringify({ status: "Error", type: "5", reason: "UTXO Server unexpected response" }))
            } else if (status == -6) {
                res.send(JSON.stringify({ status: "Error", type: "6", reason: "Transaction build error" }))
            } else if (status == -7) {
                res.send(JSON.stringify({ status: "Error", type: "7", reason: "Broadcast server down" }))
            } else if (status == -8) {
                res.send(JSON.stringify({ status: "Error", type: "8", reason: "Broadcast server unexpected response ***Possible send of money***" }))
            } else if (status == -9) {
                res.send(JSON.stringify({ status: "Error", type: "9", reason: "Broadcast server unreadable response ***Possible send of money***" }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'ETH':
            status = await ethTrans.trans(addressNo, addressTo, value)
            if (status == -1) {
                res.send(JSON.stringify({ status: "Error", type: "4", reason: "Transaction Build error" }))
            } else if (status == -2) {
                res.send(JSON.stringify({ status: "Error", type: "5", reason: "Transaction API error" }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'EOS':
            memo = req.body.memo
            status = await eosTrans.trans(addressTo, value, memo)
            if (status == -1) {
                res.send(JSON.stringify({ status: "Error", type: "4", reason: "Transaction Build error" }))
            } else if (status == -2) {
                res.send(JSON.stringify({ status: "Error", type: "5", reason: "Transaction API error" }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressTo: addressTo, value: value, txid: status }))
            }
            break

        //ETH Tokens
        case 'POWR':
            status = await ethTokenTrans.trans(addressNo, addressTo, value, '0x595832f8fc6bf59c85c527fec3740a1b7a361269', 6)
            if (status == -1) {
                res.send(JSON.stringify({ status: "Error", type: "4", reason: "Transaction Build error" }))
            } else if (status == -2) {
                res.send(JSON.stringify({ status: "Error", type: "5", reason: "Transaction API error" }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'OMG':
            status = await ethTokenTrans.trans(addressNo, addressTo, value, '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07', 18)
            if (status == -1) {
                res.send(JSON.stringify({ status: "Error", type: "4", reason: "Transaction Build error" }))
            } else if (status == -2) {
                res.send(JSON.stringify({ status: "Error", type: "5", reason: "Transaction API error" }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        case 'LEND':
            status = await ethTokenTrans.trans(addressNo, addressTo, value, '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03', 18)
            if (status == -1) {
                res.send(JSON.stringify({ status: "Error", type: "4", reason: "Transaction Build error" }))
            } else if (status == -2) {
                res.send(JSON.stringify({ status: "Error", type: "5", reason: "Transaction API error" }))
            } else {
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, addressTo: addressTo, value: value, txid: status }))
            }
            break
        default:
            res.send(JSON.stringify({ status: "Error", type: "3", reason: "Coin Name does not exist" }))
    }

}