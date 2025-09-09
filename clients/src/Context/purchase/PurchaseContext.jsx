import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../pages/config/config";

const SettingsContext = createContext();
const token = localStorage.getItem("token");

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        currencySymbol: "₹",
        currencyCode: "INR",
        percentageSymbol: "%",
        conversionRates: {},
    });

    useEffect(() => {
        (async () => {
            const res = await axios.get(`${BASE_URL}/api/settings/get`,{
                 headers: {
        Authorization: `Bearer ${token}`,
      },
            });
            setSettings(res.data);
        })();
    }, []);

    const updateSettings = async (newSettings) => {
        const res = await axios.put(`${BASE_URL}/api/settings/update`, newSettings,{
             headers: {
        Authorization: `Bearer ${token}`,
      },
        });
        setSettings(res.data);
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);




// // src/context/SettingsContext.jsx
// import React, { createContext, useContext, useState } from "react";

// const SettingsContext = createContext();

// export const SettingsProvider = ({ children }) => {
//     const [settings, setSettings] = useState({
//         currencySymbol: "₹",
//         percentageSymbol: "%",
//     });

//     return (
//         <SettingsContext.Provider value={{ settings, setSettings }}>
//             {children}
//         </SettingsContext.Provider>
//     );
// };

// export const useSettings = () => useContext(SettingsContext);
