/* -----------------------------------------------------------
   src/components/RackSettingsModal.jsx
----------------------------------------------------------- */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../pages/config/config";

const RackSettingsModal = ({ onClose }) => {
    /* ------- master lists ------- */
    const [warehouses, setWarehouses] = useState([]);
    const [selectedId, setSelectedId] = useState("");

    /* ------- racks of selected warehouse ------- */
    const [racks, setRacks] = useState([]);
    const [mergeSel, setMergeSel] = useState([]);
    const [editRack, setEditRack] = useState(null);
    const token = localStorage.getItem("token");

    /* --------- 1. load all warehouses for dropdown --------- */
    useEffect(() => {
        const loadList = async () => {
            const res = await axios.get(`${BASE_URL}/api/warehouse`,{
                          Authorization: `Bearer ${token}`,

            });
            setWarehouses(res.data.data);
        };
        loadList();
    }, []);

    /* --------- 2. load racks for chosen warehouse --------- */
    useEffect(() => {
        if (!selectedId) return;
        const loadRacks = async () => {
            const { data } = await axios.get(`${BASE_URL}/api/warehouse/${selectedId}`,{
               headers: {
          Authorization: `Bearer ${token}`,
        }, 
            });
            setRacks(data.warehouse.racks);
        };
        loadRacks();
    }, [selectedId]);

    console.log(selectedId);


    /* ------------- merge selected racks ------------- */
    const handleMerge = async () => {
        if (mergeSel.length < 2) return toast.info("Select at least 2 racks");
        await axios.patch(`${BASE_URL}/api/warehouse/${selectedId}/merge-racks`, {
            rackLabels: mergeSel,
            headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        toast.success("Merged");
        setMergeSel([]);
        // reload racks
        const { data } = await axios.get(`${BASE_URL}/api/warehouse/${selectedId}`,{
            headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        setRacks(data.warehouse.racks);
        window.dispatchEvent(new Event("warehouse-updated"));
    };

    /* ------------- save edited rack ------------- */
    const saveRack = async () => {
        await axios.put(`${BASE_URL}/api/warehouse/${selectedId}/update-rack`, editRack,{
            headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        toast.success("Saved");
        setEditRack(null);
        const { data } = await axios.get(`${BASE_URL}/api/warehouse/${selectedId}`,{
            headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        setRacks(data.warehouse.racks);
        window.dispatchEvent(new Event("warehouse-updated"));
    };

    return (
        <div
            className="modal fade show d-block"
            style={{ background: "rgba(0,0,0,.5)" }}
        >
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Rack Settings</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>                    </div>

                    <div className="modal-body">
                        {/* -------- warehouse picker -------- */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Select Warehouse
                            </label>
                            <select
                                className="form-select"
                                value={selectedId}
                                onChange={(e) => {
                                    setSelectedId(e.target.value);
                                    setMergeSel([]);
                                    setEditRack(null);
                                }}
                            >
                                <option value="">-- choose --</option>
                                {warehouses.map((w) => (
                                    <option key={w._id} value={w._id}>
                                        {w.warehouseName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* -------- rack table -------- */}
                        {selectedId && (
                            <>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th />
                                            <th>Rack</th>
                                            <th>Levels</th>
                                            <th>Cap.</th>
                                            <th>Barcodes</th>
                                            <th>Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {racks.map((r) => (
                                            <tr key={r.rackLabel}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={mergeSel.includes(r.rackLabel)}
                                                        onChange={(e) =>
                                                            setMergeSel((prev) =>
                                                                e.target.checked
                                                                    ? [...prev, r.rackLabel]
                                                                    : prev.filter((x) => x !== r.rackLabel)
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>{r.rackLabel}</td>
                                                <td>{r.shelfLevels}</td>
                                                <td>{r.capacity}</td>
                                                <td>{r.levels.length}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() =>
                                                            setEditRack(JSON.parse(JSON.stringify(r)))
                                                        }
                                                    >
                                                        Configure
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <button className="btn btn-warning mb-3" onClick={handleMerge}>
                                    Merge Selected
                                </button>

                                {/* -------- edit drawer -------- */}
                                {editRack && (
                                    <div className="border p-3">
                                        <h6>
                                            Edit <strong>{editRack.rackLabel}</strong>
                                        </h6>
                                        {editRack.levels.map((lvl, idx) => (
                                            <div className="mb-2" key={lvl.level}>
                                                <label>Level {lvl.level} barcode</label>
                                                <input
                                                    className="form-control"
                                                    value={lvl.barcode}
                                                    onChange={(e) =>
                                                        setEditRack((prev) => {
                                                            const copy = { ...prev };
                                                            copy.levels[idx].barcode = e.target.value;
                                                            return copy;
                                                        })
                                                    }
                                                />
                                            </div>
                                        ))}
                                        <button className="btn btn-success me-2" onClick={saveRack}>
                                            Save
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setEditRack(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RackSettingsModal;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import BASE_URL from "../../pages/config/config";

// const RackSettings = ({ warehouseId, onClose }) => {
//     const [racks, setRacks] = useState([]);
//     const [sel, setSel] = useState([]);           // for merge
//     const [editRack, setEditRack] = useState(null);


//     console.log(racks);



//     const load = async () => {
//         const { data } = await axios.get(`${BASE_URL}/api/warehouse/${warehouseId}`);
//         setRacks(data.warehouse.racks);
//     };
//     useEffect(() => { load(); }, [warehouseId]);

//     /* merge */
//     const merge = async () => {
//         if (sel.length < 2) return toast.info("Select ≥2 racks");
//         await axios.patch(`${BASE_URL}/api/warehouse/${warehouseId}/merge-racks`, { rackLabels: sel });
//         toast.success("Merged");
//         setSel([]); await load(); window.dispatchEvent(new Event("warehouse-updated"));
//     };
//     /* save single rack */
//     const save = async () => {
//         await axios.put(`${BASE_URL}/api/warehouse/${warehouseId}/update-rack`, editRack);
//         toast.success("Saved"); setEditRack(null); await load(); window.dispatchEvent(new Event("warehouse-updated"));
//     };

//     return (
//         <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.4)" }}>
//             <div className="modal-dialog modal-xl modal-dialog-centered">
//                 <div className="modal-content">
//                     <div className="modal-header"><h5>Rack Settings</h5>
//                         <button className="btn-close" onClick={onClose} /></div>
//                     <div className="modal-body">
//                         <table className="table table-bordered">
//                             <thead><tr><th /><th>Rack</th><th>Levels</th><th>Cap.</th><th>Barcodes</th><th>Edit</th></tr></thead>
//                             <tbody>{racks.map(r => (
//                                 <tr key={r.rackLabel}>
//                                     <td><input type="checkbox" checked={sel.includes(r.rackLabel)}
//                                         onChange={e => setSel(p => e.target.checked ? [...p, r.rackLabel] : p.filter(x => x !== r.rackLabel))} /></td>
//                                     <td>{r.rackLabel}</td><td>{r.shelfLevels}</td><td>{r.capacity}</td><td>{r.levels.length}</td>
//                                     <td><button className="btn btn-sm btn-outline-primary" onClick={() => setEditRack(JSON.parse(JSON.stringify(r)))}>Configure</button></td>
//                                 </tr>))}</tbody>
//                         </table>
//                         <button className="btn btn-warning" onClick={merge}>Merge Selected</button>

//                         {editRack && (
//                             <div className="border p-3 mt-4">
//                                 <h6>Edit <strong>{editRack.rackLabel}</strong></h6>
//                                 {editRack.levels.map((l, i) => (
//                                     <div className="mb-2" key={l.level}>
//                                         <label>Level {l.level} barcode</label>
//                                         <input className="form-control" value={l.barcode}
//                                             onChange={e => {
//                                                 const v = e.target.value;
//                                                 setEditRack(prev => { const c = { ...prev }; c.levels[i].barcode = v; return c; });
//                                             }} />
//                                     </div>))}
//                                 <button className="btn btn-success me-2" onClick={save}>Save</button>
//                                 <button className="btn btn-secondary" onClick={() => setEditRack(null)}>Cancel</button>
//                             </div>)}
//                     </div>
//                 </div>
//             </div>
//         </div>);
// };
// export default RackSettings;
