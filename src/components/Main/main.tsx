import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import Light from '../Light/light'
import CreateUser from '../Create-User/create'
import ColorPicker from '../Configuration/config'
import './main.scss'
import { ColorPayload } from '../Configuration/config'

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
    bridge: Bridge | null;
    electronSet: boolean;
}
export type Bridge = {
    host: string;
    user: string;
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
class Main extends Component<{}, State> {
    public ipcRender: any;
    constructor(props) {
        super(props);
        this.setListeners()
        const bridge = localStorage.getItem("bridge") ? JSON.parse(localStorage.getItem("bridge")) : null
        this.state = {
            lights: null,
            bridge,
            selectedLight: null,
            electronSet: false
        }
    }
    componentDidMount() {
        if (this.state.bridge) this.giveElectronBridge()
    }
    componentDidUpdate(prevProps, prevState: State) {
        if (prevState.electronSet !== this.state.electronSet) {
            ipcRenderer.send('give-lights')
        } else if (prevState.bridge !== this.state.bridge) {
            this.giveElectronBridge()
        }
    }
    render() {
        const { lights, selectedLight } = this.state
        console.log(this.state)
        return (
            <div className="main container" >
                {!this.state.bridge && (
                    <CreateUser
                        setBridge={this.setBridge}
                        bridge={this.state.bridge}
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
                                            sendChangeToNode={this.sendChangeToNode}

                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
                {selectedLight && (
                    <ColorPicker
                        selectedLight={this.state.selectedLight}
                        lights={this.state.lights}
                        setLight={this.setSelectedLight}
                        sendChangeToNode={this.sendChangeToNode}
                    />
                )}
            </div >
        )
    }
    setListeners = () => {
        ipcRenderer.on('get-bridge', (e, args: Bridge) => {
            localStorage.setItem("bridge", JSON.stringify(args))
            this.setState({ bridge: args })
        })
        ipcRenderer.on('light-data', (e, lights: LightParent) => {
            this.setState({ lights })
        })
        ipcRenderer.on('is-set', (evt, isSet) => {
            this.setState({ electronSet: true })
        })
    }
    giveElectronBridge = () => {
        ipcRenderer.send('set-node-bridge', this.state.bridge)
    }
    setSelectedLight = (key: number | null) => {
        this.setState({ selectedLight: key })
    }
    sendChangeToNode = (id: number, data: any, method?: string) => {
        console.log({id, data, method})
        ipcRenderer.send(method, {id, data})
        this.updateLight(id, data, method)
    }
    updateLight = (id: number, data?: any, method?: string) => {
        const shallow: LightParent = this.state.lights
        const updateLight = shallow[id]
        switch (method) {
            case "color-change":
                updateLight.rgb = data
                break;
            case "brightness-change":
                updateLight.state.bri = data
                break;
            case "power-change":
                if (updateLight.state.on === !data) return
                updateLight.state.on = !data
        }
        this.setState({ lights: shallow })
    }
    setBridge = (bridge: Bridge) => {
        localStorage.setItem("bridge", JSON.stringify(bridge))
        this.setState({ bridge })
    }
}

export default Main