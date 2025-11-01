import React from 'react'
import './AccomodationSearchBar.css';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { Button, TextField } from '@mui/material';

const AccomodationSearchBar = (filtrarProductos) => {

  const [searchText, setSearchText] = useState("");

  return (
    <div className="accommodation-search">
      <div className='search-field'>
        <div className='input-wrapper'>
          {/* <FaMapMarkerAlt className='search-icon' /> */}
          <FaSearch className='search-icon' />

          <TextField
            value={searchText}
            onChange={(e) => {setSearchText(e.target.value)}}
            fullWidth
            variant="standard"
            placeholder="Buscar productos..."
          />
        </div>
      </div>
      
      <Button variant="outlined" onClick={() => filtrarProductos(searchText)}>
        Buscar
      </Button>
      {/* <button className='search-button'>
        <FaSearch className='button-icon' />
        Buscar
      </button> */}
    </div>
  )
}

export default AccomodationSearchBar