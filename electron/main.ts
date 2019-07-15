import { app, BrowserWindow, ipcMain } from 'electron'
import { LightListeners } from './lights'
import * as hue from 'node-hue-api'
import * as path from 'path'
const isDev = require("electron-is-dev");



export let HueBridge = new hue.HueApi()

interface Bridge {
    host: string;
    user: string;
}

ipcMain.on('get-new-bridge', async (e) => {
    try {
        const bridge = await hue.nupnpSearch()
        const { ipaddress } = bridge[0]
        const user = await HueBridge.registerUser(ipaddress, 'hue-controller')
        e.reply('get-bridge', { host: ipaddress, user })
    } catch (err) {
        e.reply("bridge-error", err)
    }
})
ipcMain.on('set-node-bridge', (evt, args: Bridge) => {
    HueBridge = new hue.HueApi(args.host, args.user)
    evt.reply("is-set", true)
})
ipcMain.on('set-node-bridge', (evt, args) => {
    HueBridge = new hue.HueApi(args.host, args.user)
})
LightListeners()

let mainWindow
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        },
        backgroundColor: "#303133",
        autoHideMenuBar: true
    });
    mainWindow.loadURL(
        isDev ?
            "http://localhost:3000" :
            `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
})
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});