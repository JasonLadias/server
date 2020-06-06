const btcWallet = require('../Currencies/BTC/wallet')
const bsvWallet = require('../Currencies/BSV/wallet')
const bchWallet = require('../Currencies/BCH/wallet')
const ltcWallet = require('../Currencies/LTC/wallet')
const dgbWallet = require('../Currencies/DGB/wallet')
const ethWallet = require('../Currencies/ETH/wallet')
const eosWallet = require('../Currencies/EOS/wallet')

exports.getAddress = (req, res, next) => {
    //Geting the coinName and addressNo from the POST request
    let addressNo = req.body.addressNo,
        coinName = req.body.coinName,
        address,
        memo

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