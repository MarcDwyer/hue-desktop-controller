import React, { useState, useEffect } from 'react'
import { BridgeData } from '../Main/main'
import { nupnpSearch } from 'node-hue-api'
import { HueApi } from 'node-hue-api'
import './create.scss'

interface Props {
    bridge: BridgeData;
    setHueBridge: Function;
}

const CreateUser = (props: Props) => {
    const [msg, setMsg] = useState<string>("Press the button on your Hue Bridge then click connect")
    const [status, setStatus] = useState<boolean>(false)
    const api = new HueApi()

    useEffect(() => {
        let statusTimer;
        if (status) {
            statusTimer = setTimeout(() => setStatus(false), 550)
        }
        return () => { if (statusTimer) { clearTimeout(statusTimer) } }
    }, [status])
    return (
        <div className="create-div">
            <h2 className="set-bridge-message">{msg}</h2>
            <button
                disabled={status}
                onClick={async () => {
                    setStatus(true)
                    try {
                        const [bridgeData] = await nupnpSearch()
                        const user = await api.registerUser(bridgeData.ipaddress, 'hue-controller2')
                        const bData = { user, host: bridgeData.ipaddress }
                        localStorage.setItem("bridgeData", JSON.stringify(bData))
                        props.setHueBridge(bData)
                    } catch (err) {
                        console.log(err)
                        setMsg('Link button not pressed! ')
                    }
                }}
            >
                {!status ? "Connect" : "Waiting..."}
            </button>
        </div>
    )
}

export default CreateUser