async function loadWeather(){
    try {
        const res = await fetch('/api/weather') //from our app.js get function
        const weather = await res.json()

        document.getElementById('weather').innerHTML=`
        <h2>${weather.name} </h2>
        <p>Temperature ${weather.main.temp}</p>
        <p> Condition: ${weather.weather[0].description} </p>` //coming from fetchWeather.js 

    } catch (err) {
        document.getElementById('weather').innerHTML='<p>Failed to load weather data.</p>'
        console.error(err)
    }
}


//show weather over time/information over time using Plotly
async function loadChart(){
    try {
        const res = await fetch('/api/weather-log')
        const { timestamps, temps } = await res.json()
        const trace = {
            x: timestamps,
            y: temps,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: 'pink'
            }
        }
        const layout = {
            title: 'Temperature Over Time', //all plots must have a title
            xaxis: {title:'Date', type: 'date'},
            yaxis: {title:'Temperature (c)'},
            showlegend: true,
            legend: { orientation: 'h', x:0, y: 1.1} //where legend should be displayed on the graph
        }
        Plotly.newPlot('chart', [trace], layout)
    } catch(err) {
        console.error('Failed to load chart', err)
    }
}
loadWeather()
loadChart()