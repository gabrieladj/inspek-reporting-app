const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    clientName: String,
    companyName: String,
    email: String,
    phoneNumber: String,
    mailingAddress: String,
    contactPerson: String
});

module.exports = mongoose.model('Client', ClientSchema);
