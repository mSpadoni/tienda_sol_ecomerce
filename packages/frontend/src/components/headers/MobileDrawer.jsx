import React from "react";
import propTypes from "prop-types";

const MobileDrawer = ({ isOpen, onClose, children, id, ariaLabel }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
        role="presentation"
      />
      <div
        className="drawer-menu"
        id={id}
        role="navigation"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </>
  );
};

export default MobileDrawer;

MobileDrawer.propTypes = {
  isOpen: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  children: propTypes.node.isRequired,
  id: propTypes.string,
  ariaLabel: propTypes.string,
};
