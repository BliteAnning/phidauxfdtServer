import express from 'express'
import donateRouter from './Routes/donateRouter.js'
import cors from 'cors' 
import 'dotenv/config'
import {connectDB} from './Config/db.js'

//app config
const app = express()
const PORT = process.env.PORT


//database connection
connectDB()

//middleware
app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

//API endpoints
app.get('/', (req, res) => {
    res.send('API is running...')
})
app.use('/api', donateRouter)
