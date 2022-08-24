require('dotenv').config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require('cors')
const Person = require('./models/person')

morgan.token("body", function (req, res) {
    // only show if there is content in body
    if (Object.keys(req.body).length > 0) {
        return JSON.stringify(req.body)
    }
    else {
        return ""
    }
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: "malformed id" })
    }

    next(error)
}

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(cors())
app.use(express.static("build"))
app.use(errorHandler)

app.get("/info", (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<div>Phonebook has info for ${persons.length} people.</div><div>${new Date()}</div>`)
    })
})

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if(person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

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
    }
    //else if (persons.findIndex(person => person.name === body.name) > 0) {
    //    return response.status(400).json({
    //        error: "name must be unique"
    //    })
    //}

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})