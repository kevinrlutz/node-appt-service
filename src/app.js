const express = require('express')
require('./db/mongoose')
const apptRouter = require('./routers/appt-router')

const app = express()

app.use(express.json())
app.use(apptRouter)

module.exports = app
