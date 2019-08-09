import React, { Component } from 'react'
import { xyBriToRgb, RGBtoXY } from '../../Methods/methods'
import Light from '../Light/light'
import CreateUser from '../Create-User/create'
import ColorPicker from '../Configuration/config'
import * as hue from 'node-hue-api'
import './main.scss'

export type LightParent = {
    [id: number]: LightType;
}
export interface LightType {
    id: number;
    name: string;
    state: LightConfig;
    rgb?: number[];
    xy?: number[];
    type: string;
}

interface LightConfig {
    alert: string;
    bri: number;
    colormode?: string;
    on: boolean;
    ct?: number;
    effect?: string;
    hue?: number;
    reachable?: boolean;
    sat?: number;
    xy?: number[];
}
export interface BrightnessPayload {
    bright: number;
    id: number;
}
type State = {
    lights: LightParent | null;
    selectedLight: number | null;
    hueBridge: hue.HueApi | null;
    bridgeData: BridgeData | null;
    error: Error | null;
}
export type BridgeData = {
    user: string;
    host: string;
}
export type ColorPayload = {
    id: number;
    color: HSL;
}
export interface HSL {
    h: number;
    s: number;
    l: number;
}
export type ErrorMessage = {
    message: string;
    type: number;
}
class Main extends Component<{}, State> {
    constructor(props) {
        super(props);
        const bridgeData = localStorage.getItem("bridgeData") ? JSON.parse(localStorage.getItem("bridgeData")) : null
        this.state = {
            lights: null,
            bridgeData,
            selectedLight: null,
            hueBridge: null,
            error: null
        }
    }
    componentDidMount() {
        if (this.state.bridgeData) {
            this.setHueBridge()
        }
    }
    render() {
        const { lights, selectedLight } = this.state
        return (
            <div className="main container" >
                {!this.state.bridgeData && (
                    <CreateUser
                        bridge={this.state.bridgeData}
                        setHueBridge={this.setHueBridge}
                    />
                )}
                {lights && (
                    <div className="authenticated">
                        <div className="light-grid">
                            <div className="subdiv">
                                {Object.values(lights).map(i => {
                                    return (
                                        <Light
                                            light={i}
                                            setLight={this.setSelectedLight}
                                            selectedLight={selectedLight} key={i.name}
                                            alterLight={this.alterLight}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
                {lights && selectedLight && lights[selectedLight] && lights[selectedLight].rgb && (
                    <ColorPicker
                        selectedLight={this.state.selectedLight}
                        lights={this.state.lights}
                        setLight={this.setSelectedLight}
                        alterLight={this.alterLight}
                    />
                )}
            </div >
        )
    }
    setSelectedLight = (key: number | null) => {
        this.setState({ selectedLight: key })
    }
    alterLight = async (id: number, data: any, method: string) => {
        const { hueBridge } = this.state
        let 
        state = hue.lightState.create(), 
        isSet;

        try {
            switch (method) {
                case "color":
                    const [x, y] = RGBtoXY(data[0], data[1], data[2])
                    isSet = await hueBridge.setLightState(id, state.xy(x, y))
                    break
                case "brightness":
                    isSet = await hueBridge.setLightState(id, state.bri(data))
                    break;
                case "power":
                    isSet = await hueBridge.setLightState(id, data ? state.on() : state.off())
                    break;
                case "newName":
                    isSet = await hueBridge.setLightName(id, data)
            }
            if (!isSet) throw Error("Error changing light!")
            this.updateLight(id, data, method)
        } catch (err) {
            if (err.message) this.setState({ error: err })
        }
    }
    // updates the light values based on client input
    updateLight = (id: number, data?: any, method?: string) => {
        const shallow: LightParent = this.state.lights
        const updateLight = shallow[id]
        switch (method) {
            case "color":
                updateLight.rgb = data
                break;
            case "brightness":
                updateLight.state.bri = data
                break;
            case "power":
                if (updateLight.state.on === data) return
                updateLight.state.on = data
                break;
            case "newName":
                updateLight.name = data
        }
        this.setState({ lights: shallow })
    }

    // set the Hue Bridge Data in State
    setHueBridge = (hueData?: BridgeData) => {
        if (hueData) {
            this.setState({ hueBridge: new hue.HueApi(hueData.host, hueData.user), bridgeData: hueData }, () => this.getLights())
            return
        } else if (this.state.bridgeData) {
            const { bridgeData } = this.state
            this.setState({ hueBridge: new hue.HueApi(bridgeData.host, bridgeData.user) }, () => this.getLights())
        }
    }
    // Gets all the lights when bridge connection has been established
    getLights = async () => {
        const { hueBridge } = this.state
        try {
            const { lights } = await hueBridge.lights()
            const lightData = lights.map(light => {
                return {
                    id: light.id,
                    name: light.name,
                    state: light.state,
                    rgb: light.state.xy ? xyBriToRgb(light.state.xy[0], light.state.xy[1], light.state.bri) : null,
                    type: light.type
                }
            }).reduce((obj, item) => {
                obj[item.id] = item
                return obj
            }, {})
            this.setState({ lights: lightData })
        } catch (err) {
            console.log(err)
        }
    }
}

export default Main