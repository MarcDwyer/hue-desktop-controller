import React, { useState, useEffect } from 'react'
import { Bridge, ErrorMessage } from '../Main/main'
import { ipcRenderer } from 'electron'

import './create.scss'

interface Props {
    bridge: Bridge;
    error: ErrorMessage | null;
}

const CreateUser = (props: Props) => {
    const [msg, setMsg] = useState<string>("Press the button on your Hue Bridge then click connect")
    const [status, setStatus] = useState<boolean>(false)

    useEffect(() => {
        let statusTimer;
        if (status) {
            statusTimer = setTimeout(() => setStatus(false), 550)
        }
        return () => { if (statusTimer) {clearTimeout(statusTimer)} }
    }, [status])

    return (
        <div className="create-div">
            <h2 className="set-bridge-message">{props.error ? props.error.message : msg}</h2>
            <button
            disabled={status}
            onClick={async() => {
                setStatus(true)
                ipcRenderer.send('get-new-bridge')
            }}
            >
                {!status ? "Connect" : "Waiting..."}
            </button>
        </div>
    )
}

export default CreateUser