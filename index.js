const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require('cors')

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

morgan.token("body", function (req, res) {
    // only show if there is content in body
    if (Object.keys(req.body).length > 0) {
        return JSON.stringify(req.body)
    }
    else {
        return ""
    }
})

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(cors())

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/info", (req, res) => {
    res.send(`<div>Phonebook has info for ${persons.length} people.</div><div>${new Date()}</div>`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 10000000);
}

app.post("/api/persons", (request, response) => {
    const body = request.body

    console.log(`Adding person named ${body.name} with number ${body.number}`)

    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })
    } else if (persons.findIndex(person => person.name === body.name) > 0) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})