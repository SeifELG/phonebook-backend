require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('postBody', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } else {
        return 'no body'
    }
})

app.use(morgan('tiny'))
app.use(morgan('method :url :status :res[content-length] - :response-time ms :postBody'))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get("/", (req, res) => {
    res.send("all good here")
})

app.get("/api/persons", (req, res) => {
    //res.json(persons)
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get("/api/info", (req, res) => {
    Person.countDocuments({}, (err, count) => {
        const infoStr = `Phonebook has info for ${count} people`
        const timestamp = new Date()
        const result = infoStr + "<br><br>" + timestamp
        res.send(result + timestamp)
    })

})

app.get("/api/persons/:id", (req, res, next) => {
    //const id = Number(req.params.id)
    // const person = persons.find(e => e.id === id)
    // console.log(person)
    // if (person) {
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }

    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    //const id = Number(req.params.id)
    //persons = persons.filter(e => e.id !== id)
    //res.status(204).end()

    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


app.post("/api/persons/", (req, res, next) => {
    const body = req.body

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    Person.find({name:body.name}).then(people => {
        if(people.length > 0 ){
            return res.status(400).json({ error: "this person already exists" })
        } else{
            newPerson.save()
            .then(person => {
                res.json(person)
            })
            .catch(error => next(error))
        }
    })

    /*
    if (!body.name) {
        return res.status(400).json({ error: "name is required" })
    } else if (!body.number) {
        return res.status(400).json({ error: "number is required" })
    } else if (persons.filter(e => e.name == body.name).length != 0) {
        return res.status(400).json({ error: "name already exists in phonebook" })
    }


    const newPerson = {
        id: Math.random(999999),
        name: req.body.name,
        number: req.body.number
    }
    persons = persons.concat(newPerson)


    res.json(newPerson)
    */
})


app.put("/api/persons/:id", (req, res, next) => {
    const updatedPerson = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators: true  })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})



const unknownEndpoint = (req, res, next) => {
    res.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === "CastError") {
        return res.status(400).send({ error: 'malformed id' })
    } else if ( error.name === "ValidationError"){
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})