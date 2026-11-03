import fs from 'fs' //this whole file shows how to create CSV in JS 
import path from 'path' //builds file path that works in any windows/mac/linux
import dotenv from 'dotenv'
//same as const fs = require('fs')
dotenv.config()
//need to save data in a CSV file
const DATA_DIR = path.join(import.meta.dirname, 'data')
fs.mkdirSync(DATA_DIR, { recursive: true })
//will be updated every time the API is called
const WEATHER_FILE = path.join(DATA_DIR, 'weather.json')
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv')
//weather log is going to keep running history
export async function fetchWeather(){
    const apiKey = process.env.WEATHER_API_KEY
    const city = process.env.CITY
    const url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

    try {
        const response = await fetch(url)
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        const nowUTC= new Date().toISOString() //know the exact time we're catching weather info
        data._last_updated_utc = nowUTC //need to convert to JS object
        fs.writeFileSync(WEATHER_FILE, JSON.stringify(data, null, 2))
        
        if(!fs.existsSync(LOG_FILE)){ // \n means new line
            fs.writeFileSync(LOG_FILE, `timestamp,city,temperature,description\n`) //new CSV file no spaces allowed
        }
        const logEntry = `${nowUTC},${city},${data.main.temp},${data.weather[0].description}\n`
        fs.appendFileSync(LOG_FILE, logEntry)

        console.log(`Weather data updated for ${city} at ${nowUTC}`)
    } catch (err) {
        console.error(`Error fetching weather:, ${err}`)
    }
}

fetchWeather()
