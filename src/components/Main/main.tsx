import React, { useState, useEffect } from 'react'
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

const Main: React.FC = () => {
    const [bridgeData, setbridgeData] = useState<BridgeData | null>(JSON.parse(localStorage.getItem("bridgeData")))
    const [selected, setSelected] = useState<number | null>(null)
    const [hueBridge, setHueBridge] = useState<hue.HueApi | null>(null)
    const [lights, setLights] = useState<LightParent | null>(null)


    const updateLight = (id: number, data?: any, method?: string) => {
        const shallow: LightParent = {...lights}
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
        setLights(shallow)
    }


    const alterLight = async (id: number, data: any, method: string) => {
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
            updateLight(id, data, method)
        } catch (err) {
            console.log(err)
        }
    }

    // Gets all the lights when bridge connection has been established
    const getLights = async () => {
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
            setLights(lightData)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (bridgeData && !hueBridge) {
            setHueBridge(new hue.HueApi(bridgeData.host, bridgeData.user))
        }
    }, [bridgeData])

    useEffect(() => {
        if (!lights && hueBridge) {
            getLights()
        }
    }, [hueBridge])

    return (
        <div className="main container" >
            {!bridgeData && (
                <CreateUser
                    setbridgeData={setbridgeData}
                />
            )}
            {lights && (
                <div className="authenticated">
                    <div className="light-grid">
                        <div className="subdiv">
                            {Object.values(lights).map(i => {
                                return (
                                    <Light
                                        key={i.id}
                                        light={i}
                                        setLight={setSelected}
                                        alterLight={alterLight}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
            {lights && selected && lights[selected] && lights[selected].rgb && (
                <ColorPicker
                    selectedLight={selected}
                    lights={lights}
                    setLight={setSelected}
                    alterLight={alterLight}
                />
            )}
        </div >
    )
}

export default Main