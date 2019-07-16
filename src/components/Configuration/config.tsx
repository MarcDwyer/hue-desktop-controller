import React, { Component } from 'react'
import { LightParent, ColorPayload, LightType } from '../Main/main'
import { SketchPicker, RGBColor } from 'react-color';
import { debounce } from 'lodash'
import { createPortal } from 'react-dom'
import { Spring } from 'react-spring/renderprops'
import './config.scss'

interface Props {
    selectedLight: number | null;
    lights: LightParent;
    setLight: Function;
    alterLight: Function;
}
export interface ColorPayload {
    hex: string;
    newrgb?: number[];
    rgb: RGBColor;
}
type State = {
    range: number;
}

class ColorPicker extends Component<Props, State>{
    private light: LightType | null;
    constructor(props: Props) {
        super(props)
        const { lights, selectedLight } = this.props
        this.sendColor = debounce(this.sendColor, 750)
        this.light = lights[selectedLight]
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
        this.props.alterLight(id, [rgb.r, rgb.g, rgb.b], "color")
    }
    render() {
        const { rgb } = this.light
        return createPortal(
            <div
                className="config-parent"
                onClick={(e) => {
                    //@ts-ignore
                    if (e.target.className !== "config-parent") return
                    this.props.setLight(null)

                }}
            >
                <Spring
                    to={{ opacity: 1, transform: "translateY(0%" }}
                    from={{ opacity: 0, transform: "translateY(-50%)" }}
                >
                    {(props) => {
                        return (
                            <div className="configuration" style={{ ...props }}>
                                <SketchPicker
                                    width="350px"
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
                            </div>
                        )
                    }}
                </Spring>
            </div>,
            document.querySelector('#root')
        )
    }
}

export default ColorPicker