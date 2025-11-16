import React from "react";
import "./AccomodationSearchBar.css";
import { FaSearch } from "react-icons/fa";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

const AccomodationSearchBar = ({ filtrarProductos }) => {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="accommodation-search" role="search">
      <div className="search-field">
        <div className="input-wrapper">
          <FaSearch className="search-icon" aria-hidden="true" />

          <TextField
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            fullWidth
            variant="standard"
            placeholder="Buscar productos..."
            aria-label="Buscar productos por título"
          />
        </div>
      </div>

      <Button
        variant="outlined"
        onClick={() => filtrarProductos(searchText)}
        aria-label="Ejecutar búsqueda de productos"
      >
        <FaSearch className="button-icon" aria-hidden="true" />
        Buscar
      </Button>
    </div>
  );
};

export default AccomodationSearchBar;

AccomodationSearchBar.propTypes = {
  filtrarProductos: PropTypes.func,
};
