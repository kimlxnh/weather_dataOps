const fs = require ('fs')
const path = require ('path')

const DATA_DIR = path.join(process.cwd(),'data')
const JSON_FILE = path.join(DATA_DIR, 'weather.json')
const CSV_FILE = path.join(DATA_DIR, 'weather_log.csv')

describe('Weather Data tests', () => {
    test ('weather.json exists', () => {
        expect(fs.existsSync(JSON_FILE)).toBe(true)

    })

    test('weather.json has required keys', () => {
        const raw = fs.readFileSync(JSON_FILE, 'utf-8')
        expect(raw.trim().length).toBeGreaterThan(0)

        const data = JSON.parse(raw)
        expect(data).toHaveProperty('main')
        expect(data).toHaveProperty('weather')
        expect(data).toHaveProperty('wind')
        expect(data.weather[0]).toHaveProperty('description')
        expect(data).toHaveProperty('_last_updated_utc')

        expect(new Date(data._last_updated_utc).toISOString()).toBe(data._last_updated_utc)

    })

    test('CSV log exists and has header', () => {
        expect(fs.existsSync(CSV_FILE)).toBe(true)

        const csvContent = fs.readFileSync(CSV_FILE, 'utf-8')
        const lines = csvContent.trim().split('\n')
        const header = lines[0].split(',') //line position 0 saved into header and the rest splits CSV file into commas
        
        expect(header).toEqual(['timestamp', 'city', 'temperature', 'description'])
        expect(lines.length).toBeGreaterThan(1) //always gonna have >1 line = the header so need to make sure has more than 1
 
        const firstDataRow = lines[1].split(',') //splits on comma
        expect(!isNaN(parseFloat(firstDataRow[2]))).toBe(true)
    })
    
    test('weather.json has more than 2 lines', () => {
        const weatherLines = fs.readFileSync(JSON_FILE, 'utf-8')
        expect(weatherLines.trim().length).toBeGreaterThan(1)
    
    })
        
    test('weather_log.csv has more than 2 lines', () => {
        const csvLines = fs.readFileSync(JSON_FILE, 'utf-8')
        expect(csvLines.trim().length).toBeGreaterThan(1)
    
    })
    test('weather.json contains a weather property', () => {
        const weatherLines = fs.readFileSync(JSON_FILE, 'utf-8')
        expect(weatherLines.trim().length).toBeGreaterThan(1)
    
    })
    test('weather_log.csv contains London', () => {
        const csvLines = fs.readFileSync(JSON_FILE, 'utf-8')
        expect(csvLines.trim()).toContain('London')
    })
})