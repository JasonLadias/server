const btcWallet = require('../coin_source_code/btc/wallet')
const bsvWallet = require('../coin_source_code/bsv/wallet')
const bchWallet = require('../coin_source_code/bch/wallet')
const ltcWallet = require('../coin_source_code/ltc/wallet')
const dgbWallet = require('../coin_source_code/dgb/wallet')
const ethWallet = require('../coin_source_code/eth/wallet')
const eosWallet = require('../coin_source_code/eos/wallet')

exports.getAddress = (req, res, next) => {
    //Geting the coinName and addressNo from the POST request
    let addressNo = req.body.addressNo
    let coinName = req.body.coinName
    let address
    let memo

    //Checking if the addressNo is valid
    if (addressNo >= 0) {
        //Checking if the coinName matches a valid coin
        switch (coinName) {
            case 'BTC':
                //BTC WALLET GENERATION CODE
                address = btcWallet.wallet(addressNo)
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, address: address }))
                break
            case 'BSV':
                //BSV WALLET GENERATION CODE
                address = bsvWallet.wallet(addressNo)
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, address: address }))
                break
            case 'BCH':
                //BCH WALLET GENERATION CODE
                address = bchWallet.wallet(addressNo)
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, address: address }))
                break
            case 'LTC':
                //LTC WALLET GENERATION CODE
                address = ltcWallet.wallet(addressNo)
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, address: address }))
                break
            case 'DGB':
                //DGB WALLET GENERATION CODE
                address = dgbWallet.wallet(addressNo)
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, address: address }))
                break
            case 'ETH':
                //ETH WALLET GENERATION CODE
                address = ethWallet.wallet(addressNo)
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, address: address }))
                break
            case 'EOS':
                address = eosWallet.wallet()
                memo = eosWallet.memo()
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, address: address, memo: memo }))
                break
            //ΕΤΗ TOKENS
            case 'POWR':
                //ETH WALLET GENERATION CODE
                address = ethWallet.wallet(addressNo)
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, address: address }))
                break
            case 'OMG':
                //ETH WALLET GENERATION CODE
                address = ethWallet.wallet(addressNo)
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, address: address }))
                break
            case 'LEND':
                //ETH WALLET GENERATION CODE
                address = ethWallet.wallet(addressNo)
                res.send(JSON.stringify({ status: "OK", coinName: coinName, addressNo: addressNo, address: address }))
                break
            default:
                res.send(JSON.stringify({ status: "Error", type: "3", reason: "Coin Name does not exist" }))
        }
    } else {
        res.send(JSON.stringify({ status: "Error", type: "2", reason: "Address Number is not valid" }))
    }
}