//command-line interface for mongoDB with mongoose

const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log('Please provide password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://alphabet:${password}@cluster0.xwzbwfe.mongodb.net/phonebook?retryWrites=true&w=majority`


mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5){ //if user has provided 3 additional arguments - password, name and phone number 

    const person = new Person({
        name: name,
        number: number
    })
    
    person.save().then(r=>{
        console.log(`added ${name}, number ${number} to the phonebook`)
        mongoose.connection.close()

    })
    
} else if (process.argv.length === 3){ //if user has only provided password

    Person.find({}).then(result=>{
        console.log("phonebook:")
        result.forEach(person=>{
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })

} else {
    mongoose.connection.close()
    console.log('Wrong number of arguments. Either provide a password, or a password, name and number')
}

