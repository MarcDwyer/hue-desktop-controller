import React, { Component } from 'react'
import { LightParent, ColorPayload, LightType } from '../Main/main'
import { SketchPicker, RGBColor } from 'react-color';
import { debounce } from 'lodash'
import { createPortal } from 'react-dom'


import './config.scss'

interface Props {
    selectedLight: number | null;
    lights: LightParent;
    setLight: Function;
    sendChangeToNode: Function;
}
export interface ColorPayload {
    hex: string;
    newrgb?: number[];
    rgb: RGBColor;
}

class ColorPicker extends Component<Props, {}>{
    private light: LightType | null;
    constructor(props: Props) {
        super(props)
        const { lights, selectedLight } = this.props
        this.sendColor = debounce(this.sendColor, 750)
        this.light = selectedLight ? lights[selectedLight] : null
        this.state = {
            range: this.light ? this.light.state.bri : 0
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { lights, selectedLight } = this.props
        if (prevProps.selectedLight !== this.props.selectedLight && typeof selectedLight === 'number') {
            this.light = lights[selectedLight]
            this.setState({ range: lights[selectedLight].state.bri })
        }
    }
    sendColor = (id: number, rgb: RGBColor) => {
        this.props.sendChangeToNode(id, [rgb.r, rgb.g, rgb.b], "color-change")
    }
    render() {
        const { setLight } = this.props
        if (this.light && !this.light.rgb) return null
        return createPortal(
            <div
                className="config-parent"
                onClick={(e) => {
                    //@ts-ignore
                    if (e.target.className !== "config-parent") return
                    setLight(null)

                }}
            >
                <div className="configuration">
                    {this.light && this.light.rgb && (() => {
                        const { rgb } = this.light
                        return (
                            (
                                <SketchPicker
                                    width="50%"
                                    color={{
                                        r: rgb[0],
                                        g: rgb[1],
                                        b: rgb[2]
                                    }}
                                    onChangeComplete={(color) => {
                                        if (!this.light) return
                                        this.sendColor(this.light.id, color.rgb)
                                    }}
                                />
                            )
                        )
                    })()}
                </div>
            </div>,
            document.querySelector('#root')
        )
    }
}

export default ColorPicker