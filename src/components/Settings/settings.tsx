import React, { useState, useCallback } from "react";

import { useDispatch } from "react-redux";

import Dropdown from "./drop-down";

import "./settings.scss";

const Navbar = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleToggle = useCallback((chng: boolean) => setToggle(chng), [
    toggle
  ]);
  return (
    <nav style={{}}>
      <Dropdown open={toggle} setOpen={handleToggle} />
    </nav>
  );
};

export default Navbar;
