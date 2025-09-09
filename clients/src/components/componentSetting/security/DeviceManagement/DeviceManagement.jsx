import React, { useEffect, useState } from 'react'
import "../DeviceManagement/DeviceManagement.css"
import axios from "axios";
import { MdDelete } from 'react-icons/md';
import BASE_URL from '../../../../pages/config/config';

const DeviceManagement = ({ isOpen, onClose, userId }) => {
    const [devices, setDevices] = useState([])
const token = localStorage.getItem("token");

    const fetchDevices = async () => {
        const res = await axios.get(`${BASE_URL}/api/devices/${userId}`,{
              headers: {
        Authorization: `Bearer ${token}`,
      },
        })
        setDevices(res.data.devices)
        console.log('resdevicemanagement', res.data.devices)
    };

    const handleDelete = async (id) => {
        await axios.delete(`${BASE_URL}/api/devices/${id}`,{
              headers: {
        Authorization: `Bearer ${token}`,
      },
        })
        fetchDevices();
    }

    useEffect(() => {
        if (isOpen) {
            console.log("Fetching devices for userId:", userId);
            fetchDevices();
        }
    }, [isOpen])

    if (!isOpen) return null;
    return (
        <div className='devicemanagemodal-overlay'>
            <div className="devicemanagemodal-box">
                <div className="devicemanagemodal-header">
                    <h3 className='devicemanagemodal-heading'>Device Management</h3>
                    <button className='devicemanageclosebtn' onClick={onClose}>x</button>
                </div>
                <table className='devicemanagetable'>
                    <thead className='devicemanagethead'>
                        <tr className='devicemanagetr'>
                            <th className='devicemanagetr'>Device</th>
                            <th className='devicemanageth'>Date</th>
                            <th className='devicemanageth'>Location</th>
                            <th className='devicemanageth'>IP Address</th>
                            <th className='devicemanageth'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='devicemanagetbody'>
                        {Array.isArray(devices) && devices.map((device) => (
                            <tr className='devicemanagetr' key={device._id}>
                                <td className='devicemanagetd'>{device.device}</td>
                                <td className='devicemanagetd'>{new Date(device.loginTime).toLocaleString("en-GB", {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                })}</td>
                                <td className='devicemanagetd'>{device.latitude && device.longitude ? `${device.latitude.toFixed(3)}, ${device.longitude.toFixed(3)}` : device.location || "N/A"}</td>
                                <td className='devicemanagetd'>{device.ipAddress === "::1" ? "127.0.0.1" : device.ipAddress}</td>
                                <td className='devicemanagetd'>
                                    <button className='devicemanagebtn' onClick={() => handleDelete(device._id)}><MdDelete/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DeviceManagement;
