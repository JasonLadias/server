const ethTrans = require('../Currencies/ETH/trans')

exports.checkAddress = async (req,res,next) =>{
    let address = req.body.address
    let check = await ethTrans.addressCheck(address)
    if(check == '0x'){
        res.send(JSON.stringify({ status: "OK", type: "address"}))
    }else if(check == -10){
        res.send(JSON.stringify({ status: "Error", type: "10", reason: "Address Checker does not respond" }))
    }else if(check == -11){
        res.send(JSON.stringify({ status: "Error", type: "11", reason: "Address not valid" }))
    }else{
        res.send(JSON.stringify({ status: "OK", type: "contract"}))
    }
}