import React, { useEffect, useState } from 'react';
// import "../../styles/style.css";
import { TbSettings } from 'react-icons/tb';
import sidebarBg1 from "../../assets/img/theme/bg-01.jpg";
import { setThemeColor, restoreThemeColor } from '../../utils/setThemeColor';
import sidebarBg2 from "../../assets/img/theme/bg-02.jpg";
import sidebarBg3 from "../../assets/img/theme/bg-03.jpg";
import sidebarBg4 from "../../assets/img/theme/bg-04.jpg";
import sidebarBg5 from "../../assets/img/theme/bg-05.jpg";
import sidebarBg6 from "../../assets/img/theme/bg-06.jpg";
import ThemeColorPicker from './colorPicker/ThemeColorPicker';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Default from '../../assets/img/theme/icon/default.svg';
import Mini from '../../assets/img/theme/icon/mini.svg';
import TwoColumn from '../../assets/img/theme/icon/two-Column.svg';
import Horizontal from '../../assets/img/theme/icon/horizontal.svg';
import Detached from '../../assets/img/theme/icon/detached.svg';
import RTL from '../../assets/img/theme/icon/rtl.svg';
import WithoutHeader from '../../assets/img/theme/icon/without-header.svg';

const ThemeCustomizer = () => {
    useEffect(() => {
        // Apply the saved theme settings from local storage
        const html = document.querySelector('html');
        html.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
        html.setAttribute('data-sidebar', localStorage.getItem('sidebarTheme') || 'light');
        html.setAttribute('data-color', localStorage.getItem('color') || 'primary');
        html.setAttribute('data-topbar', localStorage.getItem('topbar') || 'white');
        html.setAttribute('data-layout', localStorage.getItem('layout') || 'default');
        html.setAttribute('data-width', localStorage.getItem('width') || 'fluid');
        // Sidebar background image
        if (localStorage.getItem('sidebarBg')) {
            document.body.setAttribute('data-sidebarbg', localStorage.getItem('sidebarBg'));
        } else {
            document.body.removeAttribute('data-sidebarbg');
        }
        // Restore custom theme color if set
        restoreThemeColor();
    }, []);

    // Handler functions for theme changes
    const handleThemeChange = (e) => {
        const value = e.target.value;
        document.documentElement.setAttribute('data-theme', value);
        localStorage.setItem('theme', value);
    };

    const handleSidebarChange = (e) => {
        const value = e.target.value;
        document.documentElement.setAttribute('data-sidebar', value);
        localStorage.setItem('sidebarTheme', value);
    };

    const [themeColor, setThemeColor] = useState(localStorage.getItem('color') || 'info');
    const [layout, setLayout] = useState(localStorage.getItem('layout') || 'default');

    const handleColorChange = (e) => {
        const value = e.target.value;
        setThemeColor(value);
        document.documentElement.setAttribute('data-color', value);
        localStorage.setItem('color', value);
        // If a preset color is picked, remove custom color
        if (value !== 'all') {
            localStorage.removeItem('customThemeColor');
            setThemeColor(value); // setThemeColor utility updates CSS variable
        }
    };

    // Ensure radio reflects current themeColor and layout on mount and when localStorage changes
    useEffect(() => {
        const storedColor = localStorage.getItem('color') || 'info';
        setThemeColor(storedColor);
        document.documentElement.setAttribute('data-color', storedColor);
        const storedLayout = localStorage.getItem('layout') || 'default';
        setLayout(storedLayout);
        document.documentElement.setAttribute('data-layout', storedLayout);
    }, []);

    const handleLayoutChange = (e) => {
        const value = e.target.value;
        setLayout(value);
        document.documentElement.setAttribute('data-layout', value);
        localStorage.setItem('layout', value);
        // Mini sidebar toggle
        if (value === 'mini') {
            document.body.classList.add('mini-sidebar');
        } else {
            document.body.classList.remove('mini-sidebar');
        }
    };

    const handleTopbarChange = (e) => {
        const value = e.target.value;
        document.documentElement.setAttribute('data-topbar', value);
        localStorage.setItem('topbar', value);
    };

    const handleWidthChange = (e) => {
        const value = e.target.value;
        document.documentElement.setAttribute('data-width', value);
        localStorage.setItem('width', value);
    };

    const handleReset = (e) => {
        e.preventDefault();
        // localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="sidebar-contact">
            <div className="toggle-theme" data-bs-toggle="offcanvas" data-bs-target="#theme-setting">
                <TbSettings />

            </div>
            <div className="sidebar-themesettings offcanvas offcanvas-end" id="theme-setting">
                <div className="offcanvas-header d-flex align-items-center justify-content-between bg-dark">
                    <div>
                        <h3 className="mb-1 text-white">Theme Customizer</h3>
                        <p className="text-light">Choose your themes & layouts etc.</p>
                    </div>
                    <a href="#" className="custom-btn-close d-flex align-items-center justify-content-center text-white" data-bs-dismiss="offcanvas">
                        <i className="ti ti-x"></i>
                    </a>
                </div>
                <div className="themecard-body offcanvas-body">
                    <div className="accordion accordion-customicon1 accordions-items-seperate" id="settingtheme">
                        {/* Layout Selection */}
                        <div className="accordion-item border px-3 layout-select">
                            <h2 className="accordion-header">
                                <button className="accordion-button text-dark bg-transparent fs-16 px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#layoutsetting" aria-expanded="true">
                                    Select Layouts
                                </button>
                            </h2>
                            <div id="layoutsetting" className="accordion-collapse collapse show">
                                <div className="accordion-body border-top px-0 py-3">
                                    <div className="row gx-3">
                                        {/* Default Layout */}
                                        <div className="col-4">
                                            <div className="theme-layout mb-3">
                                                <input type="radio" name="LayoutTheme" id="defaultLayout" value="default" checked={layout === 'default'} onChange={handleLayoutChange} />
                                                <label htmlFor="defaultLayout">
                                                    <span className="d-block mb-2 layout-img">
                                                        <img src={Default} alt="img" />
                                                    </span>
                                                    <span className="layout-type">Default</span>
                                                </label>
                                            </div>
                                        </div>
                                        {/* Mini Layout */}
                                        <div className="col-4">
                                            <div className="theme-layout mb-3">
                                                <input type="radio" name="LayoutTheme" id="miniLayout" value="mini" checked={layout === 'mini'} onChange={handleLayoutChange} />
                                                <label htmlFor="miniLayout">
                                                    <span className="d-block mb-2 layout-img">
                                                        <img src={Mini} alt="img" />
                                                    </span>
                                                    <span className="layout-type">Mini</span>
                                                </label>
                                            </div>
                                        </div>
                                        {/* Two Column Layout */}
                                        <div className="col-4">
                                            <div className="theme-layout mb-3">
                                                <input type="radio" name="LayoutTheme" id="twocolumnLayout" value="twocolumn" checked={layout === 'twocolumn'} onChange={handleLayoutChange} />
                                                <label htmlFor="twocolumnLayout">
                                                    <span className="d-block mb-2 layout-img">
                                                        <img src={TwoColumn} alt="img" />
                                                    </span>
                                                    <span className="layout-type">Two Column</span>
                                                </label>
                                            </div>
                                        </div>
                                        {/* Horizontal Layout */}
                                        <div className="col-4">
                                            <div className="theme-layout mb-3">
                                                <input type="radio" name="LayoutTheme" id="horizontalLayout" value="horizontal" checked={layout === 'horizontal'} onChange={handleLayoutChange} />
                                                <label htmlFor="horizontalLayout">
                                                    <span className="d-block mb-2 layout-img">
                                                        <img src={Horizontal} alt="img" />
                                                    </span>
                                                    <span className="layout-type">Horizontal</span>
                                                </label>
                                            </div>
                                        </div>
                                        {/* Detached Layout */}
                                        <div className="col-4">
                                            <div className="theme-layout mb-3">
                                                <input type="radio" name="LayoutTheme" id="detachedLayout" value="detached" checked={layout === 'detached'} onChange={handleLayoutChange} />
                                                <label htmlFor="detachedLayout">
                                                    <span className="d-block mb-2 layout-img">
                                                        <img src={Detached} alt="img" />
                                                    </span>
                                                    <span className="layout-type">Detached</span>
                                                </label>
                                            </div>
                                        </div>
                                        {/* Without Header Layout */}
                                        <div className="col-4">
                                            <div className="theme-layout mb-3">
                                                <input type="radio" name="LayoutTheme" id="without-headerLayout" value="without-header" checked={layout === 'without-header'} onChange={handleLayoutChange} />
                                                <label htmlFor="without-headerLayout">
                                                    <span className="d-block mb-2 layout-img">
                                                        <img src={WithoutHeader} alt="img" />
                                                    </span>
                                                    <span className="layout-type">Without Header</span>
                                                </label>
                                            </div>
                                        </div>
                                        {/* RTL Layout (link) */}
                                        <div className="col-4">
                                            <a href="#" className="theme-layout mb-3">
                                                <span className="d-block mb-2 layout-img">
                                                    <img src={RTL} alt="img" />
                                                </span>
                                                <span className="layout-type d-block">RTL</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Layout Width */}
                        <div className="accordion-item border px-3 layout-select">
                            <h2 className="accordion-header">
                                <button className="accordion-button text-dark fs-16 bg-transparent px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarsetting" aria-expanded="true">
                                    Layout Width
                                </button>
                            </h2>
                            <div id="sidebarsetting" className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="theme-width m-1 me-2">
                                            <input type="radio" name="width" id="fluidWidth" value="fluid" defaultChecked onChange={handleWidthChange} />
                                            <label htmlFor="fluidWidth" className="d-block rounded fs-12">
                                                <i className="ti ti-layout-list me-1"></i>
                                                Fluid Layout
                                            </label>
                                        </div>
                                        <div className="theme-width m-1">
                                            <input type="radio" name="width" id="boxWidth" value="box" onChange={handleWidthChange} />
                                            <label htmlFor="boxWidth" className="d-block rounded fs-12">
                                                <i className="ti ti-layout-distribute-horizontal me-1"></i>
                                                Boxed Layout
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Theme Colors */}
                        <div className="accordion-item border px-3 layout-select">
                            <h2 className="accordion-header">
                                <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#themecolorsettings" aria-expanded="true">
                                    Theme Colors
                                </button>
                            </h2>
                            <div id="themecolorsettings" className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 py-3 border-top">
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="theme-colorselect m-1 me-3">
                                            <input type="radio" name="color" id="primaryThemeColor" value="primary" checked={themeColor === 'primary'} onChange={handleColorChange} />
                                            <label htmlFor="primaryThemeColor" className="d-block bg-primary mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="color" id="secondaryThemeColor" value="secondary" checked={themeColor === 'secondary'} onChange={handleColorChange} />
                                            <label htmlFor="secondaryThemeColor" className="d-block bg-secondary mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="color" id="successThemeColor" value="success" checked={themeColor === 'success'} onChange={handleColorChange} />
                                            <label htmlFor="successThemeColor" className="d-block bg-success mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="color" id="dangerThemeColor" value="danger" checked={themeColor === 'danger'} onChange={handleColorChange} />
                                            <label htmlFor="dangerThemeColor" className="d-block bg-danger mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="color" id="warningThemeColor" value="warning" checked={themeColor === 'warning'} onChange={handleColorChange} />
                                            <label htmlFor="warningThemeColor" className="d-block bg-warning mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="color" id="infoThemeColor" value="info" checked={themeColor === 'info'} onChange={handleColorChange} />
                                            <label htmlFor="infoThemeColor" className="d-block bg-info mb-2"></label>
                                        </div>
                                        {/* Color picker for custom theme color */}
                                        <div className="theme-colorselect mt-0 mb-2">
                                            <ThemeColorPicker type="theme" onPick={(color) => {
                                                setThemeColor('all');
                                                document.documentElement.setAttribute('data-color', 'all');
                                                localStorage.setItem('color', 'all');
                                                localStorage.setItem('customThemeColor', color);
                                                setThemeColor(color); // setThemeColor utility updates CSS variable
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Top Bar Color */}
                        <div className="accordion-item border px-3">
                            <h2 className="accordion-header">
                                <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#topbarsetting" aria-expanded="true">
                                    Top Bar Color
                                </button>
                            </h2>
                            <div id="topbarsetting" className="accordion-collapse collapse show">
                                <div className="accordion-body pb-1 px-0 py-3 border-top">
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
                                            <input type="radio" name="topbar" id="whiteTopbar" value="white" defaultChecked onChange={handleTopbarChange} />
                                            <label htmlFor="whiteTopbar" className="bg-white"></label>
                                        </div>
                                        <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
                                            <input type="radio" name="topbar" id="darkaquaTopbar" value="topbarcolorone" onChange={handleTopbarChange} />
                                            <label htmlFor="darkaquaTopbar" className="bg-sidebar-color-1"></label>
                                        </div>
                                        <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
                                            <input type="radio" name="topbar" id="whiterockTopbar" value="topbarcolortwo" onChange={handleTopbarChange} />
                                            <label htmlFor="whiterockTopbar" className="bg-sidebar-color-2"></label>
                                        </div>
                                        <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
                                            <input type="radio" name="topbar" id="rockblueTopbar" value="topbarcolorthree" onChange={handleTopbarChange} />
                                            <label htmlFor="rockblueTopbar" className="bg-sidebar-color-3"></label>
                                        </div>
                                        <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
                                            <input type="radio" name="topbar" id="bluehazeTopbar" value="topbarcolorfour" onChange={handleTopbarChange} />
                                            <label htmlFor="bluehazeTopbar" className="bg-sidebar-color-4"></label>
                                        </div>
                                        <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
                                            <input type="radio" name="topbar" id="topbar-color-5" value="topbarcolorfive" onChange={handleTopbarChange} />
                                            <label htmlFor="topbar-color-5" className="bg-sidebar-color-5"></label>
                                        </div>
                                        <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
                                            <input type="radio" name="topbar" id="topbar-color-6" value="topbarcolorsix" onChange={handleTopbarChange} />
                                            <label htmlFor="topbar-color-6" className="bg-sidebar-color-6"></label>
                                        </div>
                                        {/* Color picker for topbar */}
                                        <div className="theme-colorselect theme-colorselect-rounded mb-3 mt-0">
                                            <ThemeColorPicker />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Sidebar Color */}
                        <div className="accordion-item border px-3 layout-select">
                            <h2 className="accordion-header">
                                <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarcolor" aria-expanded="true">
                                    Sidebar Color
                                </button>
                            </h2>
                            <div id="sidebarcolor" className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 py-3 border-top">
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="theme-colorselect m-1 me-3">
                                            <input type="radio" name="sidebar" id="lightSidebar" value="light" defaultChecked onChange={handleSidebarChange} />
                                            <label htmlFor="lightSidebar" className="d-block mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="sidebar" id="bgcolorSidebar" value="sidebarcolorone" onChange={handleSidebarChange} />
                                            <label htmlFor="bgcolorSidebar" className="d-block bg-sidebar-color-1 mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="sidebar" id="bgcolor2Sidebar" value="sidebarcolortwo" onChange={handleSidebarChange} />
                                            <label htmlFor="bgcolor2Sidebar" className="d-block bg-sidebar-color-2 mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="sidebar" id="bgcolor3Sidebar" value="sidebarcolorthree" onChange={handleSidebarChange} />
                                            <label htmlFor="bgcolor3Sidebar" className="d-block bg-sidebar-color-3 mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="sidebar" id="bgcolor4Sidebar" value="sidebarcolorfour" onChange={handleSidebarChange} />
                                            <label htmlFor="bgcolor4Sidebar" className="d-block bg-sidebar-color-4 mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="sidebar" id="bgcolor5Sidebar" value="sidebarcolorfive" onChange={handleSidebarChange} />
                                            <label htmlFor="bgcolor5Sidebar" className="d-block bg-sidebar-color-5 mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="sidebar" id="bgcolor6Sidebar" value="sidebarcolorsix" onChange={handleSidebarChange} />
                                            <label htmlFor="bgcolor6Sidebar" className="d-block bg-sidebar-color-6 mb-2"></label>
                                        </div>
                                        {/* Color picker for sidebar */}
                                        <div className="theme-colorselect mt-0 mb-2">
                                            <ThemeColorPicker />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Theme Colors */}
                        {/* <div className="accordion-item border px-3 layout-select">
                            <h2 className="accordion-header">
                                <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#themecolorsettings" aria-expanded="true">
                                    Theme Colors
                                </button>
                            </h2>
                            <div id="themecolorsettings" className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 py-3 border-top">
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="theme-colorselect m-1 me-3">
                                            <input type="radio" name="color" id="primaryThemeColor" value="primary" defaultChecked onChange={handleColorChange} />
                                            <label htmlFor="primaryThemeColor" className="d-block bg-primary mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="color" id="secondaryThemeColor" value="secondary" onChange={handleColorChange} />
                                            <label htmlFor="secondaryThemeColor" className="d-block bg-secondary mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="color" id="successThemeColor" value="success" onChange={handleColorChange} />
                                            <label htmlFor="successThemeColor" className="d-block bg-success mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="color" id="dangerThemeColor" value="danger" onChange={handleColorChange} />
                                            <label htmlFor="dangerThemeColor" className="d-block bg-danger mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="color" id="warningThemeColor" value="warning" onChange={handleColorChange} />
                                            <label htmlFor="warningThemeColor" className="d-block bg-warning mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect me-3">
                                            <input type="radio" name="color" id="infoThemeColor" value="info" onChange={handleColorChange} />
                                            <label htmlFor="infoThemeColor" className="d-block bg-info mb-2"></label>
                                        </div>
                                        <div className="theme-colorselect mt-0 mb-2">
                                            <ThemeColorPicker />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* Sidebar Background */}
                        {/* <div className="accordion-item border px-3 layout-select">
                            <h2 className="accordion-header">
                                <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarbgsetting" aria-expanded="true">
                                    Sidebar Background
                                </button>
                            </h2>
                            <div id="sidebarbgsetting" className="accordion-collapse collapse show">
                                <div className="accordion-body pb-1 px-0 py-3 border-top">
                                    <div className="d-flex align-items-center flex-wrap">
                                        {[sidebarBg1, sidebarBg2, sidebarBg3, sidebarBg4, sidebarBg5, sidebarBg6].map((img, idx) => (
                                            <div className="theme-sidebarbg me-3 mb-3" key={idx}>
                                                <input
                                                    type="radio"
                                                    name="sidebarbg"
                                                    id={`sidebarBg${idx + 1}`}
                                                    value={`sidebarbg${idx + 1}`}
                                                    checked={localStorage.getItem('sidebarBg') === `sidebarbg${idx + 1}`}
                                                    onChange={() => {
                                                        document.body.setAttribute('data-sidebarbg', `sidebarbg${idx + 1}`);
                                                        localStorage.setItem('sidebarBg', `sidebarbg${idx + 1}`);
                                                    }}
                                                />
                                                <label htmlFor={`sidebarBg${idx + 1}`} className="d-block rounded">
                                                    <img src={img} alt="img" className="rounded" />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* Theme Mode */}
                        <div className="accordion-item border px-3">
                            <h2 className="accordion-header">
                                <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#modesetting" aria-expanded="true">
                                    Theme Mode
                                </button>
                            </h2>
                            <div id="modesetting" className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 py3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="theme-mode flex-fill text-center w-100 me-3">
                                            <input type="radio" name="theme" id="lightTheme" value="light" defaultChecked onChange={handleThemeChange} />
                                            <label htmlFor="lightTheme" className="rounded fw-medium w-100">
                                                <span className="d-inline-flex rounded me-2"><i className="ti ti-sun-filled"></i></span>Light
                                            </label>
                                        </div>
                                        <div className="theme-mode flex-fill text-center w-100 me-3">
                                            <input type="radio" name="theme" id="darkTheme" value="dark" onChange={handleThemeChange} />
                                            <label htmlFor="darkTheme" className="rounded fw-medium w-100">
                                                <span className="d-inline-flex rounded me-2"><i className="ti ti-moon-filled"></i></span>Dark
                                            </label>
                                        </div>
                                        <div className="theme-mode flex-fill w-100 text-center">
                                            <input type="radio" name="theme" id="systemTheme" value="system" onChange={handleThemeChange} />
                                            <label htmlFor="systemTheme" className="rounded fw-medium w-100">
                                                <span className="d-inline-flex rounded me-2"><i className="ti ti-device-laptop"></i></span>System
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Add more sections as needed, following the same pattern */}
                    </div>
                </div>
                <div className="p-3 pt-0">
                    <div className="row gx-3">
                        <div className="col-6">
                            <a href="#" id="resetbutton" className="btn btn-light close-theme w-100" onClick={handleReset}>
                                <i className="ti ti-restore me-1"></i>Reset
                            </a>
                        </div>
                        {/* <div className="col-6">
                            <a href="#" className="btn btn-primary w-100" data-bs-dismiss="offcanvas">
                                <i className="ti ti-shopping-cart-plus me-1"></i>Buy Product
                            </a>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

// const ThemeCustomizer = () => {
//     useEffect(() => {
//         // Apply the saved theme settings from local storage
//         document.querySelector('html').setAttribute('data-theme', localStorage.getItem('theme') || 'light');
//         document.querySelector('html').setAttribute('data-sidebar', localStorage.getItem('sidebarTheme') || 'light');
//         document.querySelector('html').setAttribute('data-color', localStorage.getItem('color') || 'primary');
//         document.querySelector('html').setAttribute('data-topbar', localStorage.getItem('topbar') || 'white');
//         document.querySelector('html').setAttribute('data-layout', localStorage.getItem('layout') || 'default');
//         document.querySelector('html').setAttribute('data-width', localStorage.getItem('width') || 'fluid');
//     }, []);

//     // Handler functions for theme changes
//     const handleThemeChange = (e) => {
//         const value = e.target.value;
//         document.documentElement.setAttribute('data-theme', value);
//         localStorage.setItem('theme', value);
//     };

//     const handleSidebarChange = (e) => {
//         const value = e.target.value;
//         document.documentElement.setAttribute('data-sidebar', value);
//         localStorage.setItem('sidebarTheme', value);
//     };

//     const handleColorChange = (e) => {
//         const value = e.target.value;
//         document.documentElement.setAttribute('data-color', value);
//         localStorage.setItem('color', value);
//     };

//     const handleLayoutChange = (e) => {
//         const value = e.target.value;
//         document.documentElement.setAttribute('data-layout', value);
//         localStorage.setItem('layout', value);
//     };

//     const handleTopbarChange = (e) => {
//         const value = e.target.value;
//         document.documentElement.setAttribute('data-topbar', value);
//         localStorage.setItem('topbar', value);
//     };

//     const handleWidthChange = (e) => {
//         const value = e.target.value;
//         document.documentElement.setAttribute('data-width', value);
//         localStorage.setItem('width', value);
//     };

//     const handleReset = (e) => {
//         e.preventDefault();
//         localStorage.clear();
//         window.location.reload();
//     };

//     return (
//         <div className="sidebar-contact">
//             <div className="toggle-theme spin-icon" data-bs-toggle="offcanvas" data-bs-target="#theme-setting" >
//                 <TbSettings />
//             </div>
//             <div className="sidebar-themesettings offcanvas offcanvas-end" id="theme-setting">
//                 <div className="offcanvas-header d-flex align-items-center justify-content-between bg-dark">
//                     <div>
//                         <h3 className="mb-1 text-white">Theme Customizer</h3>
//                         <p className="text-light">Choose your themes & layouts etc.</p>
//                     </div>
//                     <a href="#" className="custom-btn-close d-flex align-items-center justify-content-center text-white" data-bs-dismiss="offcanvas">
//                         <IoIosCloseCircleOutline />
//                     </a>
//                 </div>
//                 <div className="themecard-body offcanvas-body">
//                     <div className="accordion accordion-customicon1 accordions-items-seperate" id="settingtheme">
//                         {/* Layout Selection */}
//                         <div className="accordion-item border px-3 layout-select">
//                             <h2 className="accordion-header">
//                                 <button className="accordion-button text-dark bg-transparent fs-16 px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#layoutsetting" aria-expanded="true">
//                                     Select Layouts
//                                 </button>
//                             </h2>
//                             <div id="layoutsetting" className="accordion-collapse collapse show">
//                                 <div className="accordion-body border-top px-0 py-3">
//                                     <div className="row gx-3">
//                                         {/* Default Layout */}
//                                         <div className="col-4">
//                                             <div className="theme-layout mb-3">
//                                                 <input type="radio" name="LayoutTheme" id="defaultLayout" value="default" defaultChecked onChange={handleLayoutChange} />
//                                                 <label htmlFor="defaultLayout">
//                                                     <span className="d-block mb-2 layout-img">
//                                                         <img src={Default} alt="img" />
//                                                     </span>
//                                                     <span className="layout-type">Default</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                         {/* Mini Layout */}
//                                         <div className="col-4">
//                                             <div className="theme-layout mb-3">
//                                                 <input type="radio" name="LayoutTheme" id="miniLayout" value="mini" onChange={handleLayoutChange} />
//                                                 <label htmlFor="miniLayout">
//                                                     <span className="d-block mb-2 layout-img">
//                                                         <img src={Mini} alt="img" />
//                                                     </span>
//                                                     <span className="layout-type">Mini</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                         {/* Two Column Layout */}
//                                         <div className="col-4">
//                                             <div className="theme-layout mb-3">
//                                                 <input type="radio" name="LayoutTheme" id="twocolumnLayout" value="twocolumn" onChange={handleLayoutChange} />
//                                                 <label htmlFor="twocolumnLayout">
//                                                     <span className="d-block mb-2 layout-img">
//                                                         <img src={TwoColumn} alt="img" />
//                                                     </span>
//                                                     <span className="layout-type">Two Column</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                         {/* Horizontal Layout */}
//                                         <div className="col-4">
//                                             <div className="theme-layout mb-3">
//                                                 <input type="radio" name="LayoutTheme" id="horizontalLayout" value="horizontal" onChange={handleLayoutChange} />
//                                                 <label htmlFor="horizontalLayout">
//                                                     <span className="d-block mb-2 layout-img">
//                                                         <img src={Horizontal} alt="img" />
//                                                     </span>
//                                                     <span className="layout-type">Horizontal</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                         {/* Detached Layout */}
//                                         <div className="col-4">
//                                             <div className="theme-layout mb-3">
//                                                 <input type="radio" name="LayoutTheme" id="detachedLayout" value="detached" onChange={handleLayoutChange} />
//                                                 <label htmlFor="detachedLayout">
//                                                     <span className="d-block mb-2 layout-img">
//                                                         <img src={Detached} alt="img" />
//                                                     </span>
//                                                     <span className="layout-type">Detached</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                         {/* Without Header Layout */}
//                                         <div className="col-4">
//                                             <div className="theme-layout mb-3">
//                                                 <input type="radio" name="LayoutTheme" id="without-headerLayout" value="without-header" onChange={handleLayoutChange} />
//                                                 <label htmlFor="without-headerLayout">
//                                                     <span className="d-block mb-2 layout-img">
//                                                         <img src={WithoutHeader} alt="img" />
//                                                     </span>
//                                                     <span className="layout-type">Without Header</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                         {/* RTL Layout (link) */}
//                                         <div className="col-4">
//                                             <a href="layout-rtl.html" className="theme-layout mb-3">
//                                                 <span className="d-block mb-2 layout-img">
//                                                     <img src={RTL} alt="img" />
//                                                 </span>
//                                                 <span className="layout-type d-block">RTL</span>
//                                             </a>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Layout Width */}
//                         <div className="accordion-item border px-3 layout-select">
//                             <h2 className="accordion-header">
//                                 <button className="accordion-button text-dark fs-16 bg-transparent px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarsetting" aria-expanded="true">
//                                     Layout Width
//                                 </button>
//                             </h2>
//                             <div id="sidebarsetting" className="accordion-collapse collapse show">
//                                 <div className="accordion-body px-0 py-3 border-top">
//                                     <div className="d-flex align-items-center">
//                                         <div className="theme-width m-1 me-2">
//                                             <input type="radio" name="width" id="fluidWidth" value="fluid" defaultChecked onChange={handleWidthChange} />
//                                             <label htmlFor="fluidWidth" className="d-block rounded fs-12">
//                                                 <i className="ti ti-layout-list me-1"></i>
//                                                 Fluid Layout
//                                             </label>
//                                         </div>
//                                         <div className="theme-width m-1">
//                                             <input type="radio" name="width" id="boxWidth" value="box" onChange={handleWidthChange} />
//                                             <label htmlFor="boxWidth" className="d-block rounded fs-12">
//                                                 <i className="ti ti-layout-distribute-horizontal me-1"></i>
//                                                 Boxed Layout
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Theme Colors */}
//                         <div className="accordion-item border px-3">
//                             <h2 className="accordion-header">
//                                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#themecolorsettings" aria-expanded="true">
//                                     Theme Colors
//                                 </button>
//                             </h2>
//                             <div id="themecolorsettings" className="accordion-collapse collapse show">
//                                 <div className="accordion-body pb-1 px-0 py-3 border-top">
//                                     <div className="d-flex align-items-center flex-wrap">
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="themeColor" id="primaryThemeColor" value="primary" defaultChecked={localStorage.getItem('color') === null || localStorage.getItem('color') === 'primary'} onChange={handleColorChange} />
//                                             <label htmlFor="primaryThemeColor" className="bg-primary"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="themeColor" id="successThemeColor" value="success" checked={localStorage.getItem('color') === 'success'} onChange={handleColorChange} />
//                                             <label htmlFor="successThemeColor" className="bg-success"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="themeColor" id="dangerThemeColor" value="danger" checked={localStorage.getItem('color') === 'danger'} onChange={handleColorChange} />
//                                             <label htmlFor="dangerThemeColor" className="bg-danger"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="themeColor" id="infoThemeColor" value="info" checked={localStorage.getItem('color') === 'info'} onChange={handleColorChange} />
//                                             <label htmlFor="infoThemeColor" className="bg-info"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="themeColor" id="warningThemeColor" value="warning" checked={localStorage.getItem('color') === 'warning'} onChange={handleColorChange} />
//                                             <label htmlFor="warningThemeColor" className="bg-warning"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="themeColor" id="purpleThemeColor" value="purple" checked={localStorage.getItem('color') === 'purple'} onChange={handleColorChange} />
//                                             <label htmlFor="purpleThemeColor" className="bg-purple"></label>
//                                         </div>
//                                         {/* Color picker for custom theme color */}
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 mt-0">
//                                             <ThemeColorPicker type="theme" onPick={(color) => {
//                                                 document.documentElement.setAttribute('data-color', 'all');
//                                                 localStorage.setItem('color', 'all');
//                                                 localStorage.setItem('customThemeColor', color);
//                                             }} />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Top Bar Color */}
//                         <div className="accordion-item border px-3">
//                             <h2 className="accordion-header">
//                                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#topbarsetting" aria-expanded="true">
//                                     Top Bar Color
//                                 </button>
//                             </h2>
//                             <div id="topbarsetting" className="accordion-collapse collapse show">
//                                 <div className="accordion-body pb-1 px-0 py-3 border-top">
//                                     <div className="d-flex align-items-center flex-wrap">
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="topbar" id="whiteTopbar" value="white" defaultChecked onChange={handleTopbarChange} />
//                                             <label htmlFor="whiteTopbar" className="bg-white"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="topbar" id="darkaquaTopbar" value="topbarcolorone" onChange={handleTopbarChange} />
//                                             <label htmlFor="darkaquaTopbar" className="bg-sidebar-color-1"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="topbar" id="whiterockTopbar" value="topbarcolortwo" onChange={handleTopbarChange} />
//                                             <label htmlFor="whiterockTopbar" className="bg-sidebar-color-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="topbar" id="rockblueTopbar" value="topbarcolorthree" onChange={handleTopbarChange} />
//                                             <label htmlFor="rockblueTopbar" className="bg-sidebar-color-3"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="topbar" id="bluehazeTopbar" value="topbarcolorfour" onChange={handleTopbarChange} />
//                                             <label htmlFor="bluehazeTopbar" className="bg-sidebar-color-4"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="topbar" id="topbar-color-5" value="topbarcolorfive" onChange={handleTopbarChange} />
//                                             <label htmlFor="topbar-color-5" className="bg-sidebar-color-5"></label>
//                                         </div>
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                                             <input type="radio" name="topbar" id="topbar-color-6" value="topbarcolorsix" onChange={handleTopbarChange} />
//                                             <label htmlFor="topbar-color-6" className="bg-sidebar-color-6"></label>
//                                         </div>
//                                         {/* Color picker for topbar */}
//                                         <div className="theme-colorselect theme-colorselect-rounded mb-3 mt-0">
//                                             <ThemeColorPicker />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Sidebar Color */}
//                         <div className="accordion-item border px-3 layout-select">
//                             <h2 className="accordion-header">
//                                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarcolor" aria-expanded="true">
//                                     Sidebar Color
//                                 </button>
//                             </h2>
//                             <div id="sidebarcolor" className="accordion-collapse collapse show">
//                                 <div className="accordion-body px-0 py-3 border-top">
//                                     <div className="d-flex align-items-center flex-wrap">
//                                         <div className="theme-colorselect m-1 me-3">
//                                             <input type="radio" name="sidebar" id="lightSidebar" value="light" defaultChecked onChange={handleSidebarChange} />
//                                             <label htmlFor="lightSidebar" className="d-block mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="sidebar" id="bgcolorSidebar" value="sidebarcolorone" onChange={handleSidebarChange} />
//                                             <label htmlFor="bgcolorSidebar" className="d-block bg-sidebar-color-1 mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="sidebar" id="bgcolor2Sidebar" value="sidebarcolortwo" onChange={handleSidebarChange} />
//                                             <label htmlFor="bgcolor2Sidebar" className="d-block bg-sidebar-color-2 mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="sidebar" id="bgcolor3Sidebar" value="sidebarcolorthree" onChange={handleSidebarChange} />
//                                             <label htmlFor="bgcolor3Sidebar" className="d-block bg-sidebar-color-3 mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="sidebar" id="bgcolor4Sidebar" value="sidebarcolorfour" onChange={handleSidebarChange} />
//                                             <label htmlFor="bgcolor4Sidebar" className="d-block bg-sidebar-color-4 mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="sidebar" id="bgcolor5Sidebar" value="sidebarcolorfive" onChange={handleSidebarChange} />
//                                             <label htmlFor="bgcolor5Sidebar" className="d-block bg-sidebar-color-5 mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="sidebar" id="bgcolor6Sidebar" value="sidebarcolorsix" onChange={handleSidebarChange} />
//                                             <label htmlFor="bgcolor6Sidebar" className="d-block bg-sidebar-color-6 mb-2"></label>
//                                         </div>
//                                         {/* Color picker for sidebar */}
//                                         <div className="theme-colorselect mt-0 mb-2">
//                                             <ThemeColorPicker />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Theme Colors */}
//                         <div className="accordion-item border px-3 layout-select">
//                             <h2 className="accordion-header">
//                                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#themecolorsettings" aria-expanded="true">
//                                     Theme Colors
//                                 </button>
//                             </h2>
//                             <div id="themecolorsettings" className="accordion-collapse collapse show">
//                                 <div className="accordion-body px-0 py-3 border-top">
//                                     <div className="d-flex align-items-center flex-wrap">
//                                         <div className="theme-colorselect m-1 me-3">
//                                             <input type="radio" name="color" id="primaryThemeColor" value="primary" defaultChecked onChange={handleColorChange} />
//                                             <label htmlFor="primaryThemeColor" className="d-block bg-primary mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="color" id="secondaryThemeColor" value="secondary" onChange={handleColorChange} />
//                                             <label htmlFor="secondaryThemeColor" className="d-block bg-secondary mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="color" id="successThemeColor" value="success" onChange={handleColorChange} />
//                                             <label htmlFor="successThemeColor" className="d-block bg-success mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="color" id="dangerThemeColor" value="danger" onChange={handleColorChange} />
//                                             <label htmlFor="dangerThemeColor" className="d-block bg-danger mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="color" id="warningThemeColor" value="warning" onChange={handleColorChange} />
//                                             <label htmlFor="warningThemeColor" className="d-block bg-warning mb-2"></label>
//                                         </div>
//                                         <div className="theme-colorselect me-3">
//                                             <input type="radio" name="color" id="infoThemeColor" value="info" onChange={handleColorChange} />
//                                             <label htmlFor="infoThemeColor" className="d-block bg-info mb-2"></label>
//                                         </div>
//                                         {/* Color picker for custom theme color */}
//                                         <div className="theme-colorselect mt-0 mb-2">
//                                             <ThemeColorPicker />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Sidebar Background */}
//                         <div className="accordion-item border px-3 layout-select">
//                             <h2 className="accordion-header">
//                                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarbgsetting" aria-expanded="true">
//                                     Sidebar Background
//                                 </button>
//                             </h2>
//                             <div id="sidebarbgsetting" className="accordion-collapse collapse show">
//                                 <div className="accordion-body pb-1 px-0 py-3 border-top">
//                                     <div className="d-flex align-items-center flex-wrap">
//                                         {[sidebarBg1, sidebarBg2, sidebarBg3, sidebarBg4, sidebarBg5, sidebarBg6].map((img, idx) => (
//                                             <div className="theme-sidebarbg me-3 mb-3" key={idx}>
//                                                 <input
//                                                     type="radio"
//                                                     name="sidebarbg"
//                                                     id={`sidebarBg${idx + 1}`}
//                                                     value={`sidebarbg${idx + 1}`}
//                                                     defaultChecked={idx === 0}
//                                                     onChange={() => {
//                                                         document.body.setAttribute('data-sidebarbg', `sidebarbg${idx + 1}`);
//                                                         localStorage.setItem('sidebarBg', `sidebarbg${idx + 1}`);
//                                                     }}
//                                                 />
//                                                 <label htmlFor={`sidebarBg${idx + 1}`} className="d-block rounded">
//                                                     <img src={img} alt="img" className="rounded" />
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Theme Mode */}
//                         <div className="accordion-item border px-3">
//                             <h2 className="accordion-header">
//                                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#modesetting" aria-expanded="true">
//                                     Theme Mode
//                                 </button>
//                             </h2>
//                             <div id="modesetting" className="accordion-collapse collapse show">
//                                 <div className="accordion-body px-0 py3 border-top">
//                                     <div className="d-flex align-items-center">
//                                         <div className="theme-mode flex-fill text-center w-100 me-3">
//                                             <input type="radio" name="theme" id="lightTheme" value="light" defaultChecked onChange={handleThemeChange} />
//                                             <label htmlFor="lightTheme" className="rounded fw-medium w-100">
//                                                 <span className="d-inline-flex rounded me-2"><i className="ti ti-sun-filled"></i></span>Light
//                                             </label>
//                                         </div>
//                                         <div className="theme-mode flex-fill text-center w-100 me-3">
//                                             <input type="radio" name="theme" id="darkTheme" value="dark" onChange={handleThemeChange} />
//                                             <label htmlFor="darkTheme" className="rounded fw-medium w-100">
//                                                 <span className="d-inline-flex rounded me-2"><i className="ti ti-moon-filled"></i></span>Dark
//                                             </label>
//                                         </div>
//                                         <div className="theme-mode flex-fill w-100 text-center">
//                                             <input type="radio" name="theme" id="systemTheme" value="system" onChange={handleThemeChange} />
//                                             <label htmlFor="systemTheme" className="rounded fw-medium w-100">
//                                                 <span className="d-inline-flex rounded me-2"><i className="ti ti-device-laptop"></i></span>System
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Add more sections as needed, following the same pattern */}
//                     </div>
//                 </div>
//                 <div className="p-3 pt-0">
//                     <div className="row gx-3">
//                         <div className="col-6">
//                             <a href="#" id="resetbutton" className="btn btn-light close-theme w-100" onClick={handleReset}>
//                                 <i className="ti ti-restore me-1"></i>Reset
//                             </a>
//                         </div>
//                         {/* <div className="col-6">
//               <a href="#" className="btn btn-primary w-100" data-bs-dismiss="offcanvas">
//                 <i className="ti ti-shopping-cart-plus me-1"></i>Buy Product
//               </a>
//             </div> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

export default ThemeCustomizer;





