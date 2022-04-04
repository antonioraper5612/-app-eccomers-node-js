
const { db } = require('./util/database')
const { initModels } = require('./util/initModels')

const { app } = require('./app')


initModels()

db.sync().then(() => {
    console.log("database corriendo")

}).catch((error) => console.log(error))


const PORT = 4000

app.listen(PORT, () => {
    console.log(`Server Corriendo en puerto ${PORT}`)
})
