const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.static('build'))
// custom a tokon
morgan.token('body', (request)=> {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
      },
      {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
      }
]

const generateId = () => {
    return Math.floor(Math.random()*1000)
}

app.get('/info', (request, response) => {
    response.send(
        `<div>
            Phonebook has info for ${persons.length} people
            <br/>
            ${new Date()}
        </div>`
    )
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
    console.log('got all!')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(one => {return one.id === id})
    if (!person){
        return response.status(404).end()
    }else{
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(one => {return one.id !== id})
    console.log(persons)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    if(!body.name || !body.number ){
        return response.status(400).json({error:'items not fulfilled.'})
    }
    if(persons.find(one => one.name === body.name)){
        return response.status(400).json({ error:'name must be unique' })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    response.json(person)
})

// Heroku根据环境变量来配置应用的端口 or 本地开发时用3004
const PORT = process.env.PORT || 3004
app.listen(PORT, () => {console.log(`Server running on ${PORT}`)})