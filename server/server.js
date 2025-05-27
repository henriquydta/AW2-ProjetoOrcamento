import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'))

app.post('/spreadsheet', async (req, res) => {
  try {
    const { ano, mes, dia, tipo, descricao, valor } = req.body

    const params = new URLSearchParams({
      token: process.env.TOKEN,
      ano, mes, dia, tipo, descricao, valor
    })

    if (!process.env.API_URL) {
      throw new Error('API_URL não definida')
    }

    const response = await fetch(`${process.env.API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })

    const result = await response.text()
    res.send(result)
  } catch (err) {
    console.error(err)
    res.status(500).send('Erro ao enviar despesa')
  }
})

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`)
})
