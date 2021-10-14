const Consumes = require('../models/Consumes')
const Parceiro = require('../models/Parceiro')
const utils = require('../utils')

function formatDate(d) {
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = {
    async store(id, cpf, qtd) {
        const parceiro = await Parceiro.findOne({
            cpf
        })
        let consumes = {}
        if (parceiro) {
            if (qtd > 0) {
                consumes = {
                    parceiro: parceiro._id,
                    consumption_id: id,
                    creation_date: formatDate(new Date()),
                    quantity: qtd,
                    status: "REGISTERED",
                    message: "Credit consumption status found."
                }
            } else {
                consumes = {
                    parceiro: parceiro._id,
                    consumption_id: id,
                    creation_date: formatDate(new Date()),
                    quantity: qtd,
                    status: "REJECTED",
                    message: "Credit consumption status found."
                }
            }
        } else {
            consumes = {
                consumption_id: id,
                creation_date: formatDate(new Date()),
                quantity: qtd,
                status: "VALIDATION_ERROR"
            }
        }

        console.log(consumes)

        await Consumes.create(consumes)
    },

    async find(req, res) {
        const {id} = req.params

        console.log("\n", utils.formatDateHour(new Date()), `Requisição de consulta: ID ${id}`)

        const consumes = await Consumes.findOne({
            consumption_id: id
        })
        let errors = null

        if (!consumes)
            return res.json({})

        let status = consumes.status

        if (consumes.status === "VALIDATION_ERROR")
            errors = [{
                    "error": "Error, Grower not found",
                    "message": "pod.b2b.error.failed.retrieving.grower.info"
                },
                {
                    "error": "Error, Affiliate not found",
                    "message": "pod.b2b.error.affiliate.not.found"
                },
                {
                    "error": "Error, affiliate is not enable to report",
                    "message": "pod.b2b.error.affiliate.not.enable"
                }
            ]
        else if(consumes.status === "REJECTED")
            errors = [{
                    "error": "Not enough balance to consume",
                    "message": "cec.registration.balance.error"
                }
            ]
        else if(consumes.status === "CANCELED") {
            errors = [{
                error: {},
                message: "pod.b2b.error.headoffice.not.consolidated.message"
            }]
            status = "REGISTERED"
        }

        const newconsumes = {
            status: "Success",
            message: "Credit consumption status found.",
            result: [{
                consumption_id: consumes.consumption_id,
                creation_date: consumes.creation_date,
                quantity: consumes.quantity.toFixed(2),
                status,
                errors
            }]
        }

        console.log('Retorno', newconsumes)
        return res.json(newconsumes)
    },

    async findAll(req, res) {
        const consumes = await Consumes.find()
        return res.json(consumes)
    },

    async cancel(req, res) {
        const {consumptionId} = req.body
        console.log("\n", utils.formatDateHour(new Date()), `Requisição de cancelamento. ID: ${consumptionId}`)

        let consumes = await Consumes.findOne({
            consumption_id: consumptionId
        })
        let ret = {}

        console.log(consumes.status)
        if (consumes && (consumes.status === 'REGISTERED' || consumes.consumption_id === 'gk7i7v61-s1ij-ehqo-h88f-qhr6okgb77z5' )) {
            await Consumes.findByIdAndUpdate(consumes._id, {
                status: "CANCELED"
            })
            const p = await Parceiro.findById(consumes.parceiro)
            if(consumes.consumption_id !== 'gk7i7v61-s1ij-ehqo-h88f-qhr6okgb77z5')
                await Parceiro.findByIdAndUpdate(consumes.parceiro, {
                    qtd: p.qtd + consumes.quantity
                })
            ret = {
                status: "Success",
                result: {
                    consumptionId: consumes.consumption_id,
                    creation_date: consumes.creation_date
                },
                message: "pod.b2b.credit.consumption.succeed"
            }
        } else {
            ret = {
                status: "Failed",
                result: {
                    consumptionId: consumptionId,
                    error: {
                        message: "pod.b2b.credit.consumption.not.found.with.this.criteria",
                        error: "Error credit consumption not found with this criteria"
                    }
                },
                message: "Failed to request cancellation credit consumption"
            }
        }
        console.log('Retorno: ', ret)
        return res.json(ret)
    }
}