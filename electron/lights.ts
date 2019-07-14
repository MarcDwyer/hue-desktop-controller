
import { ipcMain } from 'electron'
import { HueBridge } from './main'
import { xyBriToRgb, RGBtoXY } from '../Methods/methods'
import { lightState } from 'node-hue-api'

interface LightData {
    [lights: string]: Light[];
}
interface Light {
    id: string;
    name: string;
    type: string;
    modelid: string;
    manufacturername: string;
    uniqueid: string;
    swversion: number;
    state: State;
}
interface State {
    on: boolean;
    bri: number;
    hue?: number;
    sat?: number;
    effect?: string;
    xy?: number[];
    alert: string;
    colormode?: string;
    reachable: boolean;
}
interface SentLight {
    id: number;
    rgb?: number[];
    name: string;
    state: State;
    type: string;
}
interface PayloadChange {
    id: number;
    data: any;
}
export const LightListeners = () => {
    let state = lightState.create();

    ipcMain.on('give-lights', async (evt: any) => {
        try {
            const lightData = await HueBridge.lights()
            const { lights } = lightData
            const payload = lights.map(item => {
                const { state } = item
                const rgb = item.state.xy ? xyBriToRgb(state.xy[0], state.xy[1], item.state.bri) : null
                return {
                    id: parseInt(item.id),
                    name: item.name,
                    state: item.state,
                    rgb,
                    type: item.type
                }
            }).reduce((obj, item) => {
                obj[item.id] = item
                return obj
            }, {})

            console.log(payload)
            evt.reply('light-data', payload)
        } catch (err) {
            console.log(err)
        }

    })

    ipcMain.on('color-change', (e, p: PayloadChange) => {
        const [x, y] = RGBtoXY(p.data[0], p.data[1], p.data[2])
        HueBridge.setLightState(p.id, state.xy(x, y))
    })

    ipcMain.on('brightness-change', (e, p: PayloadChange) => {
        HueBridge.setLightState(p.id, state.bri(p.data))
    })
    ipcMain.on('power-change', (e, p: PayloadChange) => {
        HueBridge.setLightState(p.id, p.data ? state.turnOff() : state.turnOn())
    })
}
