import express from 'express'
import mongoose from 'mongoose'
import router from './routes/index.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use('/api', router)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => {
            console.log('Server started on port ' + PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()  