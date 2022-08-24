const mongoose = require("mongoose")

//process.argv.forEach(arg => console.log(arg))

if (process.argv.length < 3) {
    console.log("Usage: node mongo.js PSWD (name) (number)")
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fsdb:${password}@cluster0.pij4dc6.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model("Person", personSchema)

if (name && number) {
    // addind a new number to DB
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(() => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    // listing numbers in DB
    console.log("Phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}