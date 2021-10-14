const mongoose = require('mongoose')

const ParceiroSchema = new mongoose.Schema({
    cpf: String,
    qtd: Number
})

module.exports = mongoose.model('Parceiro', ParceiroSchema)
