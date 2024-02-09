// StateContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context
const StateContext = createContext();

// Create a provider component
export const StateProvider = ({ children }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({
        client: '',
        gstin: '',
        status: '',
        password: ''
    });

    return (
        <StateContext.Provider value={{ showPopup, setShowPopup, popupData, setPopupData }}>
            {children}
        </StateContext.Provider>
    );
};

// Custom hook to use the state and methods
export const useStateContext = () => useContext(StateContext);
