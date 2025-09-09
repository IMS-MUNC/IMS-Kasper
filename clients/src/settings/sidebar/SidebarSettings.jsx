// src/components/SidebarSettings.jsx
import React from "react";
import { useLayout } from "../../Context/sidetoggle/LayoutContext";

const SidebarSettings = () => {
    const { layout, changeLayout } = useLayout();

    return (
        <div className="sidebar-settings p-3">
            <h5>Sidebar Layout</h5>
            <select
                className="form-select mt-2"
                value={layout}
                onChange={(e) => changeLayout(e.target.value)}
            >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
                <option value="two-column">Two Column</option>
            </select>
        </div>
    );
};

export default SidebarSettings;
