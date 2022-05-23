const express = require("express")
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('postBody', function (req, res) {
    if(req.method === 'POST'){
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
    res.json(persons)
})

app.get("/api/info", (req, res) => {
    const infoStr = `Phonebook has info for ${persons.length} people`
    const timestamp = new Date()
    const result = infoStr + "<br><br>" + timestamp
    res.send(result + timestamp)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(e => e.id === id)
    console.log(person)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(e => e.id !== id)
    res.status(204).end()
})


app.post("/api/persons/", (req, res) => {
    const body = req.body

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

    //fix for returning json:
    //res.status(204).end()
    res.json(newPerson)

})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})