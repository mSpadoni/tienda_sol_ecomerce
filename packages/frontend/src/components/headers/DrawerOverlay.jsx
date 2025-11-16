import React from "react";
import PropTypes from "prop-types";

const DrawerOverlay = ({ onClick }) => (
  <div
    className="drawer-overlay"
    onClick={onClick}
    aria-hidden="true"
    role="presentation"
  />
);

export default DrawerOverlay;

DrawerOverlay.propTypes = {
  onClick: PropTypes.func.isRequired,
};
