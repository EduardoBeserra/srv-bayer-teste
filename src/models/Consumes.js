const mongoose = require('mongoose')

const ConsumesSchema = new mongoose.Schema({
    consumption_id: String,
    parceiro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parceiro'
    },
    creation_date: String,
    quantity: Number,
    status: String
})

module.exports = mongoose.model('Consumes', ConsumesSchema)
