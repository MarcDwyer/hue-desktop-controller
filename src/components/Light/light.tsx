import React, { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MdModeEdit } from "react-icons/md";
import Switch from "@material-ui/core/Switch";
import { useDispatch } from "react-redux";
import "./light.scss";
import { MyLight } from "../../reducers/bridge_reducer";
import {
  updateSelected,
  brightChange,
  powerChange
} from "../../actions/light_actions";

interface Props {
  index: number;
  light: MyLight;
}
const checkRgb = (rgb: number[]): boolean => {
  let count = 0;
  for (const val of rgb) {
    if (val > 165) count++;
  }
  return count >= 2;
};

const getStyles = (light: MyLight): Object => {
  let styles: Object = {};
  if (light.state.rgb) {
    const { rgb } = light.state;
    if (light.state.on) {
      styles["backgroundColor"] = `rgb(${rgb.join(",")})`;
      if (checkRgb(rgb)) {
        styles["color"] = "black";
      }
    } else {
      styles["backgroundColor"] = `#2B2C2D`;
    }
  } else {
    if (light.state.on) styles["backgroundColor"] = `#BEBEBE`;
  }

  return styles;
};
type State = {
  range: number;
  name: string;
  disabled: boolean;
};
const Light = (props: Props) => {
  const { light } = props;
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    range: light.state.bri,
    name: light.name,
    disabled: true
  });
  const { range, name, disabled } = state;
  const prevRange = useRef<number>(range);
  const [sendBright] = useDebouncedCallback(() => {
    dispatch(brightChange(props.index, range));
  }, 450);
  useEffect(() => {
    if (prevRange.current !== range) {
      prevRange.current = range;
      sendBright();
    }
  }, [range]);
  const lightStyle = getStyles(light);
  const stateSetter = (key: string, value: any) =>
    setState(state => ({ ...state, [key]: value }));
  return (
    <div className="light-parent" style={{ ...lightStyle, cursor: "pointer" }}>
      <Switch
        checked={light.state.on}
        onChange={e => dispatch(powerChange(props.index, !e.target.checked))}
        value="checkedA"
        color="primary"
        inputProps={{ "aria-label": "secondary checkbox" }}
      />
      <div
        className="text"
        style={light.rgb ? { cursor: "pointer" } : {}}
        onClick={() => dispatch(updateSelected(props.index))}
      >
        {!disabled && (
          <div
            className={`hideme ${!disabled ? "disabled" : ""}`}
            onClick={e => {
              e.stopPropagation();
              stateSetter("disabled", true);
            }}
          ></div>
        )}
        <div className={`name ${!disabled ? "activated-div" : ""}`}>
          <MdModeEdit
            size="24px"
            onClick={e => {
              e.stopPropagation();
              if (!disabled) {
                return;
              }
              setState(state => ({ ...state, disabled: false }));
            }}
          />
          <input
            value={name}
            type="text"
            size={name.length}
            disabled={disabled}
            className={!disabled ? "activated-input" : ""}
            onClick={e => e.stopPropagation()}
            onChange={e => stateSetter("name", e.target.value)}
          />
        </div>
      </div>
      <div className="range-content">
        <input
          type="range"
          min={0}
          max={254}
          value={range}
          onChange={e => stateSetter("range", e.target.value)}
        />
      </div>
    </div>
  );
};

export default Light;
