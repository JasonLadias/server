const express = require('express');

const addressController = require('../Controllers/address')
const transactionController = require('../Controllers/transaction')
const addressCheckController = require('../Controllers/checkAddress')

const router = express.Router()

router.post('/address', addressController.getAddress)

router.post('/send', transactionController.postTransaction)

router.post('/check', addressCheckController.checkAddress)

module.exports = router