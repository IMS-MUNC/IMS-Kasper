// FINAL
// import React, { useState, useEffect } from "react";
// import { useSettings } from "../../Context/purchase/PurchaseContext";

// const Settings = () => {
//     const { settings, updateSettings } = useSettings();
//     const [localSettings, setLocalSettings] = useState(settings);

//     useEffect(() => {
//         setLocalSettings(settings);
//     }, [settings]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setLocalSettings((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSave = () => {
//         updateSettings(localSettings);
//     };

//     return (
//         <div className="container mt-4">
//             <h4>Settings</h4>
//             <div className="mb-3">
//                 <label>Currency</label>
//                 <select
//                     name="currencyCode"
//                     className="form-control"
//                     value={localSettings.currencyCode}
//                     onChange={(e) => {
//                         const symbolMap = { INR: "₹", USD: "$", EUR: "€", AED: "AED" };
//                         setLocalSettings({
//                             ...localSettings,
//                             currencyCode: e.target.value,
//                             currencySymbol: symbolMap[e.target.value],
//                         });
//                     }}
//                 >
//                     <option value="INR">INR (₹)</option>
//                     <option value="USD">USD ($)</option>
//                     <option value="EUR">EUR (€)</option>
//                     <option value="AED">AED (AED)</option>
//                 </select>
//             </div>

//             <div className="mb-3">
//                 <label>Percentage Symbol</label>
//                 <input
//                     type="text"
//                     name="percentageSymbol"
//                     className="form-control"
//                     value={localSettings.percentageSymbol}
//                     onChange={handleChange}
//                 />
//             </div>

//             <button className="btn btn-primary" onClick={handleSave}>
//                 Save Settings
//             </button>
//         </div>
//     );
// };

// export default Settings;

import React, { useState, useEffect } from "react";
import { useSettings } from "../../Context/purchase/PurchaseContext";

const Settings = () => {
    const { settings, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState(settings || {});
    const token = localStorage.getItem("token");

    useEffect(() => {
        setLocalSettings(settings || {});
    }, [settings]);

    const symbolMap = {
        INR: "₹",
        USD: "$",
        EUR: "€",
        AED: "AED",
        GBP: "£",
        CAD: "C$",
        AUD: "A$",
        JPY: "¥",
        CNY: "¥",
    };

    const handleCurrencyChange = async (e) => {
        const newCurrencyCode = e.target.value;
        const symbolMap = {
            INR: "₹",
            USD: "$",
            EUR: "€",
            AED: "AED",
            GBP: "£",
            CAD: "C$",
            AUD: "A$",
            JPY: "¥",
            CNY: "¥",
        };

        // 1) Immediately update currencyCode and symbol to reflect in UI
        setLocalSettings((prev) => ({
            ...prev,
            currencyCode: newCurrencyCode,
            currencySymbol: symbolMap[newCurrencyCode] || newCurrencyCode,
        }));

        // 2) Fetch conversion rate asynchronously and update it when ready
        try {
            const res = await fetch(
                `https://api.exchangerate.host/convert?from=${localSettings.currencyCode || "INR"}&to=${newCurrencyCode}`
            );
            const data = await res.json();

            if (data.result) {
                setLocalSettings((prev) => ({
                    ...prev,
                    conversionRate: parseFloat(data.result).toFixed(4),
                }));
            }
        } catch (error) {
            console.error("Failed to fetch conversion rate:", error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Ensure conversionRate is number before sending
        const payload = {
            ...localSettings,
            conversionRate: parseFloat(localSettings.conversionRate) || 1,
            percentageSymbol: localSettings.percentageSymbol || "%",
            currencySymbol: localSettings.currencySymbol || "₹",
            currencyCode: localSettings.currencyCode || "INR",
        };

        updateSettings(payload);
    };

    return (
        <div className="container mt-4">
            <h4>Global Settings</h4>

            <div className="mb-3">
                <label>Currency</label>
                <select
                    name="currencyCode"
                    className="form-control"
                    value={localSettings.currencyCode || "INR"}
                    onChange={handleCurrencyChange}
                >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AED">AED</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CNY">CNY (¥)</option>
                </select>
            </div>

            <div className="mb-3">
                <label>Percentage Symbol</label>
                <input
                    type="text"
                    name="percentageSymbol"
                    className="form-control"
                    value={localSettings.percentageSymbol || "%"}
                    onChange={handleChange}
                />
            </div>

            {localSettings.conversionRate && (
                <div className="mb-3">
                    <strong>Conversion Rate:</strong> 1 {settings.currencyCode || "INR"} = {localSettings.conversionRate} {localSettings.currencyCode}
                </div>
            )}

            <button className="btn btn-primary" onClick={handleSave}>
                Save Settings
            </button>
        </div>
    );
};

export default Settings;

// MID FINAL
// import React, { useState, useEffect } from "react";
// import { useSettings } from "../../Context/purchase/PurchaseContext";

// const Settings = () => {
//     const { settings, updateSettings } = useSettings();
//     const [localSettings, setLocalSettings] = useState(settings);

//     useEffect(() => {
//         setLocalSettings(settings);
//     }, [settings]);

//     // const handleCurrencyChange = async (e) => {
//     //     const currencyCode = e.target.value;
//     //     const symbolMap = {
//     //         INR: "₹",
//     //         USD: "$",
//     //         EUR: "€",
//     //         AED: "AED",
//     //         GBP: "£",
//     //         CAD: "C$",
//     //         AUD: "A$",
//     //         JPY: "¥",
//     //         CNY: "¥",
//     //     };

//     //     try {
//     //         const res = await fetch(
//     //             `https://api.exchangerate.host/convert?from=${settings.currencyCode}&to=${currencyCode}`
//     //         );
//     //         const data = await res.json();

//     //         if (data.result) {
//     //             setLocalSettings((prev) => ({
//     //                 ...prev,
//     //                 currencyCode,
//     //                 currencySymbol: symbolMap[currencyCode] || currencyCode,
//     //                 conversionRate: data.result.toFixed(4),
//     //             }));
//     //         }
//     //     } catch (error) {
//     //         console.error("Failed to fetch conversion rate:", error);
//     //     }
//     // };
//     const handleCurrencyChange = async (e) => {
//         const newCurrencyCode = e.target.value;

//         const symbolMap = {
//             INR: "₹",
//             USD: "$",
//             EUR: "€",
//             AED: "AED",
//             GBP: "£",
//             CAD: "C$",
//             AUD: "A$",
//             JPY: "¥",
//             CNY: "¥",
//         };

//         try {
//             const res = await fetch(
//                 `https://api.exchangerate.host/convert?from=${localSettings.currencyCode}&to=${newCurrencyCode}`
//             );
//             const data = await res.json();

//             if (data.result) {
//                 setLocalSettings((prev) => ({
//                     ...prev,
//                     currencyCode: newCurrencyCode,
//                     currencySymbol: symbolMap[newCurrencyCode] || newCurrencyCode,
//                     conversionRate: parseFloat(data.result.toFixed(4)),
//                 }));
//             }
//         } catch (error) {
//             console.error("Failed to fetch conversion rate:", error);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setLocalSettings((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSave = () => {
//         updateSettings({
//             ...localSettings,
//             currencySymbol: localSettings.currencySymbol || "₹",
//             percentageSymbol: localSettings.percentageSymbol || "%",
//             conversionRate: localSettings.conversionRate || 1,
//         });
//     };


//     return (
//         <div className="container mt-4">
//             <h4>Global Settings</h4>
//             <div className="mb-3">
//                 <label>Currency</label>
//                 <select
//                     name="currencyCode"
//                     className="form-control"
//                     value={localSettings.currencyCode || "INR"}
//                     onChange={handleCurrencyChange}
//                 >
//                     <option value="INR">INR (₹)</option>
//                     <option value="USD">USD ($)</option>
//                     <option value="EUR">EUR (€)</option>
//                     <option value="AED">AED</option>
//                     <option value="GBP">GBP (£)</option>
//                     <option value="CAD">CAD (C$)</option>
//                     <option value="AUD">AUD (A$)</option>
//                     <option value="JPY">JPY (¥)</option>
//                     <option value="CNY">CNY (¥)</option>
//                 </select>
//             </div>

//             <div className="mb-3">
//                 <label>Percentage Symbol</label>
//                 <input
//                     type="text"
//                     name="percentageSymbol"
//                     className="form-control"
//                     value={localSettings.percentageSymbol || "%"}
//                     onChange={handleChange}
//                 />
//             </div>

//             {localSettings.conversionRate && (
//                 <div className="mb-3">
//                     <strong>Conversion Rate:</strong> 1 {settings.currencyCode} = {localSettings.conversionRate} {localSettings.currencyCode}
//                 </div>
//             )}

//             <button className="btn btn-primary" onClick={handleSave}>
//                 Save Settings
//             </button>
//         </div>
//     );
// };

// export default Settings;



// // src/pages/Settings.jsx
// import React from "react";
// import { useSettings } from "../../Context/purchase/PurchaseContext";

// const PurchaseSettings = () => {
//     const { settings, setSettings } = useSettings();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSettings((prev) => ({ ...prev, [name]: value }));
//     };

//     return (
//         <div className="container mt-4">
//             <h4>Global Settings</h4>
//             <div className="form-group mb-3">
//                 <label>Currency</label>
//                 <select
//                     name="currencySymbol"
//                     className="form-control"
//                     value={settings.currencySymbol}
//                     onChange={handleChange}
//                 >
//                     <option value="₹">INR (₹)</option>
//                     <option value="$">USD ($)</option>
//                     <option value="€">EUR (€)</option>
//                     <option value="AED">AED</option>
//                 </select>
//             </div>

//             <div className="form-group mb-3">
//                 <label>Percentage Symbol</label>
//                 <input
//                     type="text"
//                     className="form-control"
//                     name="percentageSymbol"
//                     value={settings.percentageSymbol}
//                     onChange={handleChange}
//                 />
//             </div>
//         </div>
//     );
// };

// export default PurchaseSettings;


