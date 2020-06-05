const express = require('express');

const addressController = require('../controllers/address')
const transactionController = require('../controllers/transaction')
const addressCheckController = require('../controllers/checkAddress')

const router = express.Router()

router.post('/address', addressController.getAddress)

router.post('/send', transactionController.postTransaction)

router.post('/check', addressCheckController.checkAddress)

module.exports = router