var WSIP = "ws://127.0.0.1:42042"
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    console.log('loaded')
    navigator.serviceWorker.register('./sw.js');
  });
}
var app = new Vue({
  el: '#app',
  data: {
    d:{
        temp: 0,
        hum: 0,
        qua: 0
    },
    isOff: false,
    isAuto: false,
    isSleeping: false,
    isSoundOn: false,
    isOnline: true,
    isConnected: true,
    fvl: localStorage['fvl'] ? 1 * localStorage['fvl'] : 10
  }
})

var tabs = new Vue({el: '#tabs', data: {tab: 0}})

window.addEventListener('online', function(){ app.isOnline = true });
window.addEventListener('offline', function(){ app.isOnline = false });

function toggleBuzzer(){
    ws.send(app.isSoundOn ? "setBuzzer:0" : "setBuzzer:1")
    app.isSoundOn = !app.isSoundOn
}
function togglePower(){
    ws.send(app.isOff ? "on" : "off")
    app.isOff = !app.isOff
}
function toggleAuto(){
    ws.send(app.isAuto ? "setMode:favorite" : "setMode:auto")
    app.isAuto = !app.isAuto
    app.isSleeping = false
    app.isOff = app.isOff ? !app.isOff : app.isOff
}
function toggleSleep(){
    ws.send(app.isSleeping ? "setMode:favorite" : "setMode:silent")
    app.isSleeping = !app.isSleeping
    app.isAuto = false
    app.isOff = app.isOff ? !app.isOff : app.isOff
}

function setFL(e){
    app.fvl = 1 * e.target.value
    localStorage['fvl'] = app.fvl
    ws.send("setLevel:" + app.fvl)
    app.isOff = app.isOff ? !app.isOff : app.isOff
}

function updateState(state){
    app.isOff = !state.power
    app.isAuto = state.mode === "auto"
    app.isSleeping = state.mode === "silent"
    app.d.temp = state.temperature.value
    app.d.hum = state.relativeHumidity
    app.d.qua = state['pm2.5']
    app.isSoundOn = state.buzzer
    dss.l.push(new Date().toLocaleTimeString())
    dss.t.push(app.d.temp)
    dss.h.push(app.d.hum)
    dss.q.push(app.d.qua)
    maxArrayCheck()
    if(tempChart){
        tempChart.update()
    }
}

function connectWS(ip){
    var ws = new WebSocket(WSIP)
    ws.onopen = function(){
        app.isConnected = true
        setTimeout(function(){ws.send('getState')},10)
    }
    ws.onmessage = function(event){
        console.log(event.data)
        updateState(JSON.parse(event.data))
    }
    ws.onerror = ws.onclose = function(){
        app.isConnected = false
    }
    return ws
}

var ws
ws = connectWS(localStorage['customip'] || WSIP)

function askWSServer(){
    var s = prompt('WS Server', localStorage['customip'] || WSIP)
    if(s){
        localStorage['customip'] = s
        connectWS(s)
    }
}

function switchTab(n){
    tabs.tab = n
    app.$el.style.transform = 'translateX(' + -n * 101 + "%)"
}

var ctx = HChart.getContext('2d');
var dss = {
    l: [],
    t: [],
    q: [],
    h: []
}

function maxArrayCheck(){
    if(dss.l.length > 20){
        dss.l.shift()
        dss.t.shift()
        dss.q.shift()
        dss.h.shift()
    }
}
var tempChart = renderChart(ctx, dss.l,[
    {label: 'Humidity', data: dss.h, hex: '#4FC3F7', rgb: '79,195,247'},
    {label: 'Temperature', data: dss.t, hex: '#4CAF50', rgb: '76,175,80'},
    {label: 'PM2.5', data: dss.q, hex: '#FF7043', rgb: '255,112,67'},
])

function dsStyleGen(ds){
    var grad = ctx.createLinearGradient(0, 22, 0, 50);
    grad.addColorStop(0, 'rgba(' + ds.rgb + ', 0)');
    grad.addColorStop(1, 'rgba(' + ds.rgb + ',.4');
    return {
      label: ds.label,
      data: ds.data,
      borderColor: ds.hex,
      fill: true,
      backgroundColor: grad,
      borderWidth: 2,
      scaleFontColor:'#FFF',
      defaultFontColor: '#FFF',
      pointBackgroundColor: ds.hex,
      pointBorderColor: "#FFF",
      pointBorderWidth: 2,
      pointHoverBorderWidth: 1,
      pointHoverRadius: 4,
      pointRadius: 4,
      borderWidth: 1
    }
}

function renderChart(ctx, titles, datasets){
    var dsa = []
    for(var d in datasets){
        dsa.push(dsStyleGen(datasets[d]))
    }
    return new Chart(ctx, {
       type: 'line',
       data: {
         labels: titles,
         datasets: dsa
       },
       options: {
         maintainAspectRatio: false,
         layout: {
           padding: {
             bottom: 15,
             left: 0,
             right: 0,
             top: 15
           }
         }
       }
   });
}

setInterval(function(){ws.send('getState')},30000)
