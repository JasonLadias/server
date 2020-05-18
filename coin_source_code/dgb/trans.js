const dgbWallet = require('./wallet')

let dgb = require('digibyte')
let request = require('request')

exports.trans = async (addressNo, addressTo, value) => {
    //retrieving bch address & private key
    let address = dgbWallet.wallet(addressNo)
    let privateKey = new dgb.PrivateKey(dgbWallet.privKey(addressNo))
    //calculating the amoun in sats
    let amount = Number(value) * 100000000
    amount = ~~amount

    //fees needs changing
    let fee = 10000
    let WIF = privateKey.toWIF('hex')

    let promise = new Promise((resolve, reject) => {

        getUTXOs(address)
            .then((utxos) => {
                try {
                    utxos = utxos.unspent_outputs
                    //script has a problem
                    let utxo = []
                    for (let i = 0; i < utxos.length; i++) {
                        utxo = [
                            ...utxo,
                            {
                                "address": utxos[i]['addr'],
                                "txId": utxos[i]['tx_hash'],
                                "outputIndex": utxos[i]['tx_ouput_n'],
                                "script": utxos[i]['script'],
                                "satoshis": utxos[i]['value']
                            }
                        ]
                    }
                    //we are building the transaction 
                    let tx = new dgb.Transaction() //use dgb library to create a transaction
                        .from(utxo)
                        .to(addressTo, amount)
                        .fee(fee)
                        .change(address)
                        .sign(WIF)
                        .serialize();

                    broadcastTX(tx)
                    console.log("DGB: Transaction OK | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
                    resolve(1)
                } catch (error) {
                    console.error("DGB: Transaction Build Error | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
                    resolve(-1)
                }

            })

    })

    let status = await promise

    return status
}

//manually hit the digiexplorer to retrieve utxos of address
function getUTXOs(address) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://chainz.cryptoid.info/dgb/api.dws?q=unspent&key=8f49991cb951&active=' + address,
            json: true
        },
            (error, response, body) => {
                if (error) reject(error);
                resolve(body)
            }
        )
    })
}

//broadcast the transcation to digiexplorer
function broadcastTX(transaction) {
    return new Promise((resolve, reject) => {
        request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://digiexplorer.info/api/tx/send",
            "body": JSON.stringify({
                "rawtx": transaction
            })
        }, (error, response, body) => {
            if (error) {
                console.error("DGB: Api Error | addressNo: " + addressNo + " | addressTo: " + addressTo + " | amount: " + value)
                reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
}