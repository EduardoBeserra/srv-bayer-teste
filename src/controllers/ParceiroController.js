const Parceiro = require('../models/Parceiro')
const utils = require('../utils')

module.exports = {
    async index(req, res) {
        const parceiros = await Parceiro.find()
        return res.json(parceiros)
    },

    async find(req, res) {
        const {cpf} = req.params
        const parceiros = await Parceiro.find({cpf})
        return res.json(parceiros)
    },

    async store(req, res) {
        console.log("\n", utils.formatDateHour(new Date()), "Criando parceiro.")

        const {cpf, qtd} = req.body

        let parceiro = await Parceiro.findOne({ cpf })
        if(parceiro)
            parceiro = await Parceiro.findOneAndUpdate({ cpf }, { qtd })
        else
            parceiro = await Parceiro.create({
                cpf, qtd
            })
        console.log(parceiro)
        
        return res.json(parceiro)
    },

    async delete(req, res) {
        const {cpf} = req.params
        await Parceiro.deleteMany({cpf}, (err, res) => {
            console.log("\n", utils.formatDateHour(new Date()), "Excluindo parceiros.")
            if(err) {
                console.log("Ocorreu erro na exclusao.")
                console.log(err)
            }
            console.log(res)
        })
        return res.json({})
    },

    async baixarSaldo(cpf, qtd) {
        let parceiro = await Parceiro.findOne({cpf})
        let qtdret = 0.0
        if(!parceiro)
            return -1

        if(parceiro.qtd > qtd) {
            qtdret = qtd
            parceiro.qtd -= qtd
        } else {
            qtdret = parceiro.qtd
            parceiro.qtd = 0
        }

        await Parceiro.findByIdAndUpdate(parceiro._id, {qtd: parceiro.qtd})
        return qtdret
    }
}