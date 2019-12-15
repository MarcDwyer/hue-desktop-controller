import React, { useState, useCallback } from "react";

import Dropdown from "./drop-down";

import "./navbar.scss";

const Navbar = React.memo(() => {
  const [toggle, setToggle] = useState<boolean>(false);
  console.log("navbar");
  const handleToggle = useCallback((chng: boolean) => setToggle(chng), [
    toggle
  ]);
  return (
    <nav>
      <Dropdown open={toggle} setOpen={handleToggle} />
    </nav>
  );
});

export default Navbar;
