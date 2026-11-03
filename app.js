//runs our web server and exports weather data to our browser, will use express
import express from 'express'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT

const DATA_DIR = path.join(import.meta.dirname, 'data')
const WEATHER_FILE = path.join(DATA_DIR, 'weather.json')
const LOG_FILE=path.join(DATA_DIR, 'weather_log.csv')

app.use(express.static(path.join(import.meta.dirname, 'public')))

app.get('/api/weather', (req, res) => {
    try {
        const weatherData = JSON.parse(fs.readFileSync(WEATHER_FILE, 'utf-8'))
        res.json(weatherData)
    } catch {
        res.status(404).json({error: 'No weather data available'})

    }
})
//to show the information throughout the day/week so needs to use fs to read file
app.get('/api/weather-log', (req, res) => {
    try { 
        const lines = fs.readFileSync(LOG_FILE, 'utf-8').trim().split('\n') //gets rid of white spaces and splits into an array of lines AND save inside variable 'lines'
        const timestamps = []
        const temps = []

        for (const line of lines.slice(1)){ //slice 1 skips 1st line = header (the timestamp, city, temp and desc)
            const [timestamp, , temperature] = line.split(',') // splits line into individual values, skipping city so has to be empty
            if (timestamp && temperature) { //if they both exist
                timestamps.push(timestamp) //push values into the 2 arrays e.g. has only date/hour
                temps.push(parseFloat(temperature)) //push values into temperature. parseFloat converts string into a number we can use
            }
        }
        res.json({ timestamps, temps})
    } catch {
        res.status(404).json({error: 'No weather log available'})
    }
})
app.listen(PORT, ()=> {
    console.log(`Server running on PORT: ${PORT}`)
})