import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationButton = ({ onClick }) => {
  return (
    <Link
      to="/notificaciones"
      onClick={onClick}
      role="button"
      aria-label="Ver notificaciones"
      style={{ textDecoration: "none", display: "flex" }}
    >
      <IconButton aria-label="Ver notificaciones" size="large">
        <NotificationsIcon
          sx={{
            color: "#fffefeff",
            fontSize: 27,
            transition: "0.3s",
            "&:hover": {
              transform: "scale(1.3)",
            },
          }}
        />
      </IconButton>
    </Link>
  );
};

NotificationButton.propTypes = {
  onClick: PropTypes.func,
};

export default NotificationButton;
