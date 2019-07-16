import React, { Component } from 'react'
import { debounce } from 'lodash'
import { LightType } from '../Main/main'
import Switch from '@material-ui/core/Switch';

import './light.scss'


interface Props {
    light: LightType;
    setLight: Function;
    selectedLight: number;
    alterLight: Function;
}
interface State {
    range: number;
}
class Light extends Component<Props, State> {
    constructor(props) {
        super(props);
        const { light } = this.props
        this.sendBright = debounce(this.sendBright, 450)
        this.state = {
            range: light.state.bri
        }
    }
    sendBright = (id: number, brightness: number) => {
        this.props.alterLight(id, brightness, "brightness")
    }
    getStyles = (): Object => {
        const { light } = this.props
        let styles = {}
        if (light.rgb) {
            if (light.state.on) {
                styles["backgroundColor"] = `rgb(${light.rgb.join(',')})`
                if (this.checkRgb(light.rgb)) {
                    styles["color"] = 'black'
                }
            } else {
                styles["backgroundColor"] = `#2B2C2D`
            }
        } else {
            if (light.state.on) {
                styles["backgroundColor"] = `#BEBEBE`
            }
        }
        return styles
    }
    checkRgb(rgb: number[]): boolean {
        let count = 0
        for (let x = 0; x < rgb.length; x++) {
            if (rgb[x] > 165) count++
        }
        return count >= 2 ? true : false
    }
    render() {
        const { light, setLight } = this.props
        // this.props.sendPowerChangetoHub(light.id)
        return (
            <div
                className="light-parent"
                style={this.getStyles()}
            >
                <Switch
                    checked={light.state.on}
                    onChange={() => this.props.alterLight(light.id, !light.state.on, "power")}
                    value="checkedA"
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <div
                    className='text'
                    onClick={() => {
                        setLight(light.id)
                    }}
                >
                    <span>{light.name}, {light.id}</span>
                </div>
                <div className="range-content">
                    <input
                        type="range"
                        min={0}
                        max={254}
                        value={this.state.range}
                        onChange={(e) => {
                            const bright = parseInt(e.target.value)
                            this.setState({ range: bright }, () => {
                                this.sendBright(light.id, this.state.range)
                            })
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default Light