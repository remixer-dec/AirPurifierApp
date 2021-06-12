var cfg = require('./config')
var miio = require('miio');
var ws = require("nodejs-websocket")

miio.device({
        address: cfg.ip,
        token: cfg.token
    })
    .then(device => {
        console.log('Connected to', device);
        initServer(device)
    })
    .catch(err => console.error(err));

var device = false

function initServer(d) {
    device = d
    var server = ws.createServer(function(conn) {
        conn.on('error', function(err) {
            if (err.code !== 'ECONNRESET') {
                // Ignore ECONNRESET and re throw anything else
                throw err
            }
        })
        conn.on("text", function(str) {
            console.log("Received " + str)
            parseCommand(str).then(reply => {
                if (reply) {
                    conn.sendText(reply)
                }
            })
        })
    }).listen(cfg.serverport, cfg.serverhost)
}

async function parseCommand(txt) {
    cmd = txt.split(':')
    switch (cmd[0]) {
        case "on":
            device.turnOn()
        break;
        case "off":
            device.turnOff()
        break;
        case "setMode":
            device.setMode(cmd[1])
        break;
        case "setLevel":
            device.setFavoriteLevel(parseInt(cmd[1]))
            if (device.getState('mode') != 'favorite') device.setMode('favorite')
        break;
        case "getState":
            return JSON.stringify(await device.state())
        break;
        case "setBuzzer":
            device.setBuzzer(cmd[1] === "1")
        break;
    }
    return false
}