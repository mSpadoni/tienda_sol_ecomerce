import React from "react";
import PropTypes from "prop-types";
import { FaEllipsisV } from "react-icons/fa";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const AuthMenu = ({
  children,
  authRef,
  isAuthenticated,
  onRegistrar,
  onLogin,
  onLogout,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRegistrar = () => {
    onRegistrar();
    handleClose();
  };

  const handleLogin = () => {
    onLogin();
    handleClose();
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  return (
    <div className="auth-wrapper" ref={authRef}>
      <IconButton
        className="auth-menu-button"
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl)}
        aria-label={
          Boolean(anchorEl) ? "Cerrar menú de cuenta" : "Abrir menú de cuenta"
        }
        size="large"
      >
        {children ? children : <MoreVertIcon />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {!isAuthenticated ? (
          <>
            <MenuItem onClick={handleRegistrar}>Creá tu cuenta</MenuItem>
            <MenuItem onClick={handleLogin}>Ingresá</MenuItem>
          </>
        ) : (
          <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default AuthMenu;

AuthMenu.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  authRef: PropTypes.object.isRequired,
  toggleAuthMenu: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onRegistrar: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};
