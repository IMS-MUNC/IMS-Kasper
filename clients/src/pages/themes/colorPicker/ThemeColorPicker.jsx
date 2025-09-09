import React, { useEffect, useRef } from 'react';
// You must install Pickr: npm install @simonwep/pickr
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/nano.min.css';

const ThemeColorPicker = () => {
    const pickrPrimaryRef = useRef(null);
    const pickrBackgroundRef = useRef(null);
    const pickrTopbarRef = useRef(null);
    const pickrInstances = useRef([]);

    

    useEffect(() => {
        // Helper to create a Pickr instance
        const createPickr = (el, defaultColor, cssVar, localStorageKey, removeKey) => {
            // Only create Pickr if the element is attached to the DOM
            if (!el || !el.parentNode) return null;
            return Pickr.create({
                el,
                theme: 'nano',
                default: defaultColor,
                components: {
                    preview: true,
                    opacity: false,
                    hue: true,
                    interaction: {
                        hex: false,
                        rgba: true,
                        hsva: false,
                        input: true,
                        clear: false,
                        save: false,
                    },
                },
            }).on('changestop', (source, instance) => {
                const color = instance.getColor().toRGBA();
                document.documentElement.style.setProperty(cssVar, `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}`);
                localStorage.setItem(localStorageKey, `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}`);
                if (removeKey) localStorage.removeItem(removeKey);
            });
        };

        // Clean up any previous Pickr instances
        pickrInstances.current.forEach(p => { try { p.destroyAndRemove(); } catch { } });
        pickrInstances.current = [];

        // Primary color picker
        if (pickrPrimaryRef.current && pickrPrimaryRef.current.parentNode) {
            const p = createPickr(pickrPrimaryRef.current, '#546dfe', '--primary-rgb', 'primaryRGB', 'color');
            if (p) pickrInstances.current.push(p);
        }
        // Sidebar background color picker
        if (pickrBackgroundRef.current && pickrBackgroundRef.current.parentNode) {
            const p = createPickr(pickrBackgroundRef.current, '#546dfe', '--sidebar-rgb', 'sidebarRGB', 'sidebarTheme');
            if (p) pickrInstances.current.push(p);
        }
        // Topbar color picker
        if (pickrTopbarRef.current && pickrTopbarRef.current.parentNode) {
            const p = createPickr(pickrTopbarRef.current, '#546dfe', '--topbar-rgb', 'topbarRGB', 'topbar');
            if (p) pickrInstances.current.push(p);
        }

        // Restore from localStorage
        if (localStorage.primaryRGB) {
            document.documentElement.style.setProperty('--primary-rgb', localStorage.primaryRGB);
        }
        if (localStorage.sidebarRGB) {
            document.documentElement.style.setProperty('--sidebar-rgb', localStorage.sidebarRGB);
        }
        if (localStorage.topbarRGB) {
            document.documentElement.style.setProperty('--topbar-rgb', localStorage.topbarRGB);
        }

        // Cleanup on unmount
        return () => {
            pickrInstances.current.forEach(p => { try { p.destroyAndRemove(); } catch { } });
            pickrInstances.current = [];
        };
    }, []);

    // Handlers to set data attributes and uncheck radios
    const handlePrimaryClick = () => {
        document.documentElement.setAttribute('data-color', 'all');
        document.querySelectorAll('input[name="color"]').forEach(r => (r.checked = false));
    };
    const handleSidebarClick = () => {
        document.documentElement.setAttribute('data-sidebar', 'all');
        document.querySelectorAll('input[name="sidebar"]').forEach(r => (r.checked = false));
    };
    const handleTopbarClick = () => {
        document.documentElement.setAttribute('data-topbar', 'all');
        document.querySelectorAll('input[name="topbar"]').forEach(r => (r.checked = false));
    };

    return (
        <>
            <div className="theme-colorsset mb-2">
                <div ref={pickrPrimaryRef} className="pickr-container-primary" onClick={handlePrimaryClick}></div>
            </div>
            <div className="theme-colorselect mt-0 mb-2">
                <div ref={pickrBackgroundRef} className="pickr-container-background" onClick={handleSidebarClick}></div>
            </div>
            <div className="theme-colorselect theme-colorselect-rounded mb-3 mt-0">
                <div ref={pickrTopbarRef} className="pickr-topbar" onClick={handleTopbarClick}></div>
            </div>
        </>
    );
};

export default ThemeColorPicker;