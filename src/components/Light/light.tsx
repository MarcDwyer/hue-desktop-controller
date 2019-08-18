import React, { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { LightType } from '../Main/main'
import { MdModeEdit } from 'react-icons/md'
import Switch from '@material-ui/core/Switch';

import './light.scss'

interface Props {
    light: LightType;
    setLight: Function;
    alterLight: Function;
}
const checkRgb = (rgb: number[]): boolean => {
    let count = 0
    for (let x = 0, len = rgb.length; x < len; x++) {
        if (rgb[x] > 165) count++
    }
    return count >= 2
}

const useStyles = (light: LightType): Object[] => {
    const [style, setStyle] = useState<Object>({})
    let strRgb = light.rgb ? JSON.stringify(light.rgb) : null
    useEffect(() => {
        let styles: Object = {}
        if (light.rgb) {
            if (light.state.on) {
                styles["backgroundColor"] = `rgb(${light.rgb.join(',')})`
                if (checkRgb(light.rgb)) {
                    styles["color"] = 'black'
                }
            } else {
                styles["backgroundColor"] = `#2B2C2D`
            }
        } else {
            if (light.state.on) styles["backgroundColor"] = `#BEBEBE`
        }
        setStyle(styles)
    }, [strRgb, light.state.on])
    return [style]
}
const Light = (props: Props) => {
    const { light, setLight } = props
    const [range, setRange] = useState<number>(light.state.bri)
    const [disabled, setDisabled] = useState<boolean>(true)
    const [name, setName] = useState<string>(light.name)

    const [sendBright] = useDebouncedCallback((id: number, brightness: number) => {
        props.alterLight(id, brightness, "brightness")
    }, 450)

    const [submitName] = useDebouncedCallback(() => {
        if (light.name === name) return
        props.alterLight(light.id, name, "newName")
    }, 450)

    const [styleObj] = useStyles(light)

    useEffect(() => {
        sendBright(light.id, range)
    }, [range])

    useEffect(() => {
        submitName()
    }, [name])
    return (
        <div
            className='light-parent'
            style={styleObj}
        >
            <Switch
                checked={light.state.on}
                onChange={() => props.alterLight(light.id, !light.state.on, "power")}
                value="checkedA"
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            <div
                className='text'
                style={light.rgb ? { cursor: 'pointer' } : {}}
                onClick={(e: any) => setLight(light.id)}
            >
                {!disabled && (
                    <div className={`hideme ${!disabled ? 'disabled' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation()
                            setDisabled(true)
                        }}
                    ></div>
                )}
                <div className={`name ${!disabled ? 'activated-div' : ''}`}
                >
                    <MdModeEdit
                        size="24px"
                        onClick={(e) => {
                            e.stopPropagation()
                            if (!disabled) {
                                return
                            }
                            setDisabled(false)
                        }}
                    />
                    <input
                        value={name}
                        type="text"
                        size={name.length}
                        disabled={disabled}
                        className={!disabled ? "activated-input" : ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>
            <div className="range-content">
                <input
                    type="range"
                    min={0}
                    max={254}
                    value={range}
                    onChange={(e) => setRange(parseInt(e.target.value))}
                />
            </div>
        </div>
    )
}

export default Light