const express = require('express')
const routes = express.Router()
const id_random = require('./id_random')
const utils = require('./utils')

const ParceiroController = require('./controllers/ParceiroController')
const ConsumesController = require('./controllers/ConsumesController')

routes.get('/', (req, res) => {
    return res.send('TESTE Server isenção de royalties da Bayer.')
})

routes.post('/token.oauth2', (req, res) => {
    console.log("\n", utils.formatDateHour(new Date()), 'Requisicao de token')
    let token = {
        access_token: "z4rRvAQEO6C8DKBhGY2woZQnoryS",
        refresh_token: "0kZk9cCe50F3ZLPXxJ59ripHbt2afvhsZcqpk933R0",
        token_type: "Bearer",
        expires_in: 7199
    }
    console.log('Token retornado:', token)
    return res.json(token)
})

routes.post('/baixacredit/consume', async (req, res) => {
    console.log('----------------------------------------')
    const {growerDocNumber, qty} = req.body

    console.log("\n", utils.formatDateHour(new Date()),
        `Requisicao de consumo de saldo. Parceiro: ${growerDocNumber}, qtd: ${qty}`)

    let ret = {}
    let id = id_random.idaleatorio()
    let qtd = qty
    if(qty > 0)
        qtd = await ParceiroController.baixarSaldo(growerDocNumber, qty)
    await ConsumesController.store(id, growerDocNumber, qtd)

    ret = {
        status: "Success",
        Result: id,
        message: "Credit consumption request succeeded."
    }

    console.log('Retorno: ', ret)
    
    return res.json(ret)
})

routes.get('/credit-consumption/status', ConsumesController.findAll)
routes.get('/credit-consumption/status/:id', ConsumesController.find)
routes.post('/baixacredit/cancelation', ConsumesController.cancel)

routes.get('/parceiro', ParceiroController.index)
routes.get('/parceiro/:cpf', ParceiroController.find)
routes.post('/parceiro', ParceiroController.store)
routes.delete('/parceiro/:cpf', ParceiroController.delete)

module.exports = routes
