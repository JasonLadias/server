const express = require('express');

const addressController = require('../controllers/address')
const transactionController = require('../controllers/transaction')

const router = express.Router()

router.post('/address', addressController.getAddress)

router.post('/send', transactionController.postTransaction)

module.exports = router