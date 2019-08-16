import React, { useState, useRef } from 'react'
import { BridgeData } from '../Main/main'
import { nupnpSearch } from 'node-hue-api'
import { HueApi } from 'node-hue-api'
import { BeatLoader } from 'react-spinners'
import { css } from '@emotion/core';
import { useSpring, animated } from 'react-spring'

import './create.scss'

import HueImage from  '../../images/bridge-button.png'

interface Props {
    bridge: BridgeData;
    setHueBridge: Function;
}

const CreateUser = (props: Props) => {
    const newMsg = useRef<string>("Press the Link button on your hue bridge then click connect")
    const [status, setStatus] = useState<boolean>(false)
    const api = new HueApi()

    const loader = css`
        margin: 25px auto auto auto;
    `

    const createDiv = useSpring({
        opacity: 1,
        from: { opacity: 0 }
    })
    return (
        <animated.div className="create-div" style={createDiv}>
            <div className="inner-content">
                <h2 className="set-bridge-message">{newMsg && newMsg.current && (newMsg.current)}</h2>
                <img 
                src={HueImage}
                alt="bridge"
                />
                {status ? (
                    <BeatLoader
                        color="#eee"
                        css={loader}
                    />
                ) : (
                        <button
                            disabled={status}
                            onClick={
                                async () => {
                                    setStatus(true)
                                    try {
                                        const [bridgeData] = await nupnpSearch()
                                        const user = await api.registerUser(bridgeData.ipaddress, 'hue-controller2')
                                        const bData = { user, host: bridgeData.ipaddress }
                                        localStorage.setItem("bridgeData", JSON.stringify(bData))
                                        props.setHueBridge(bData)
                                    } catch (err) {
                                        setStatus(false)
                                        newMsg.current = 'Link button not pressed! Try again'
                                    }
                                }}
                        >
                            Connect
            </button>
                    )
                }
            </div>
        </animated.div>
    )
}

export default CreateUser