import React, { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { LightType } from '../Main/main'
import { MdModeEdit } from 'react-icons/md'
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
    disabled: boolean;
    newName: string;
}


function useDebounce(value, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay] // Only re-call effect if value or delay changes
    );

    return debouncedValue;
}


class Light extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props);
        const { light } = this.props
        this.sendBright = debounce(this.sendBright, 450)
        this.state = {
            range: light.state.bri,
            disabled: true,
            newName: this.props.light.name
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
        return count >= 2
    }
    submitName = () => {
        const { light, alterLight } = this.props
        if (light.name === this.state.newName) {
            this.setState({ disabled: true })
            return
        }
        this.setState({ disabled: true }, () => alterLight(light.id, this.state.newName, "newName"))
    }
    render() {
        const { light, setLight } = this.props
        const { disabled, newName } = this.state

        return (
            <div
                className='light-parent'
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
                    style={light.rgb ? { cursor: 'pointer' } : {}}
                    onClick={(e: any): void => {
                        setLight(light.id)
                    }}
                >
                    {!disabled && (
                        <div className={`hideme ${!disabled ? 'disabled' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                this.submitName()
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
                                    this.submitName()
                                    return
                                }
                                this.setState({ disabled: !disabled })

                            }}
                        />
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            this.submitName()
                        }}>
                            <input
                                value={newName}
                                type="text"
                                size={newName.length}
                                disabled={disabled}
                                className={!disabled ? "activated-input" : ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => this.setState({ newName: e.target.value })}
                            />
                        </form>
                    </div>
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