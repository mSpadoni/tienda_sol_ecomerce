// KeycloakProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";


const VisibleContext = createContext();
export const useVisible = () => useContext(VisibleContext);


export const VisibleProvider = ({ children }) => {
   const [isVisible,setVisible]=useState(true)

   const ponerInvisible=()=>setVisible(false)

    const ponerVisible=()=>setVisible(true)
  return (
    <VisibleContext.Provider value={{isVisible,ponerInvisible,ponerVisible }}>
      {children}
    </VisibleContext.Provider>
  );
};

VisibleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
