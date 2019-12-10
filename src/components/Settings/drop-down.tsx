import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../../actions/theme_actions";

import Button from "@material-ui/core/Button";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import Switch from "react-switch";

import { ReduxeStore } from "../../reducers";

type IProps = {
  open: boolean;
  setOpen: (chng: boolean) => void;
};

const Dropdown = (props: IProps) => {
  const { open, setOpen } = props;
  const btnRef = useRef<HTMLButtonElement>(null);
  const { theme, isDark } = useSelector(
    (state: ReduxeStore) => state.themeData
  );
  const dispatch = useDispatch();

  return (
    <div className="drop-div">
      <Button
        ref={btnRef}
        style={{ color: theme.color }}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        settings
      </Button>
      <Popper
        open={open}
        role={undefined}
        transition
        disablePortal
        anchorEl={btnRef.current}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom"
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList
                  style={{
                    backgroundColor: theme.navColor,
                    color: theme.color
                  }}
                  onKeyDown={() => console.log("yett")}
                  id="menu-list-grow"
                >
                  <div className="sub-menu">
                    <div className="dark-mode menu-item">
                      <span>Dark mode?</span>
                      <Switch
                        className="switch"
                        checked={isDark}
                        onChange={() => dispatch(changeTheme(!isDark))}
                        value="checkedA"
                        onColor="#7d53cd"
                        uncheckedIcon={false}
                        checkedIcon={false}
                        height={20}
                        width={40}
                      />
                    </div>
                    {/* <div className="menu-item link">
                      <Link to="/settings">settings</Link>
                    </div> */}
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default Dropdown;
