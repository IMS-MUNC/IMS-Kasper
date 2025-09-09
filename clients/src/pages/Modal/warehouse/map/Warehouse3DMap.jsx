// Warehouse3DBuilder.jsx
// import React, { useRef, useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Html } from "@react-three/drei";

// const BoxZone = ({ zone, onClick, onHover }) => {
//     const [hovered, setHovered] = useState(false);
//     const meshRef = useRef();

//     return (
//         <mesh
//             ref={meshRef}
//             position={[zone.x, zone.y, zone.z]}
//             onPointerOver={() => {
//                 setHovered(true);
//                 onHover(zone);
//             }}
//             onPointerOut={() => {
//                 setHovered(false);
//                 onHover(null);
//             }}
//             onClick={() => onClick(zone)}
//         >
//             <boxGeometry args={[zone.width, zone.height, zone.depth]} />
//             <meshStandardMaterial color={hovered ? "orange" : "skyblue"} />
//             {hovered && (
//                 <Html center>
//                     <div
//                         style={{
//                             background: "white",
//                             padding: "4px 8px",
//                             borderRadius: "5px",
//                             fontSize: "12px",
//                             border: "1px solid #ccc",
//                             boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
//                         }}
//                     >
//                         {zone.id}
//                     </div>
//                 </Html>
//             )}
//         </mesh>
//     );
// };

// const Warehouse3DBuilder = () => {
//     const [layout, setLayout] = useState([]);
//     const [hoverZone, setHoverZone] = useState(null);

//     const handleUpload = (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             try {
//                 const json = JSON.parse(event.target.result);
//                 setLayout(json);
//             } catch (err) {
//                 alert("Invalid JSON format");
//             }
//         };
//         reader.readAsText(file);
//     };

//     return (
//         <div style={{ height: "100%", width: "100%", position: "relative" }}>
//             <input
//                 type="file"
//                 accept="application/json"
//                 onChange={handleUpload}
//                 style={{ position: "absolute", zIndex: 10, margin: 10 }}
//             />

//             {hoverZone && (
//                 <div
//                     style={{
//                         position: "absolute",
//                         top: 50,
//                         left: 10,
//                         padding: "6px 10px",
//                         background: "white",
//                         border: "1px solid #ccc",
//                         borderRadius: "5px",
//                         zIndex: 10,
//                     }}
//                 >
//                     <strong>Hovered Zone:</strong> {hoverZone.id}
//                 </div>
//             )}

//             <Canvas camera={{ position: [10, 15, 20], fov: 45 }} shadows>
//                 <ambientLight intensity={0.5} />
//                 <directionalLight position={[10, 10, 10]} intensity={1} />
//                 <OrbitControls />
//                 <gridHelper args={[50, 50, "white", "gray"]} />

//                 {layout.map((zone, index) => (
//                     <BoxZone
//                         key={index}
//                         zone={zone}
//                         onClick={(z) => console.log("Clicked:", z)}
//                         onHover={setHoverZone}
//                     />
//                 ))}
//             </Canvas>
//         </div>
//     );
// };

// export default Warehouse3DBuilder;

// Warehouse3DBuilder.jsx — updated for drei@10.5.0 & fiber@9.2.0
import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

const BoxZone = ({ zone, onClick, onHover }) => {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef();

    return (
        <mesh
            ref={meshRef}
            position={[zone.x, zone.y, zone.z]}
            onPointerOver={() => {
                setHovered(true);
                onHover(zone);
            }}
            onPointerOut={() => {
                setHovered(false);
                onHover(null);
            }}
            onClick={() => onClick(zone)}
        >
            <boxGeometry args={[zone.width, zone.height, zone.depth]} />
            <meshStandardMaterial color={hovered ? "orange" : "skyblue"} />
            {hovered && (
                <Html center>
                    <div
                        style={{
                            background: "white",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            fontSize: "12px",
                            border: "1px solid #ccc",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        }}
                    >
                        {zone.id}
                    </div>
                </Html>
            )}
        </mesh>
    );
};

const Warehouse3DBuilder = () => {
    const [layout, setLayout] = useState([]);
    const [hoverZone, setHoverZone] = useState(null);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                setLayout(json);
            } catch (err) {
                alert("Invalid JSON format");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
            <input
                type="file"
                accept="application/json"
                onChange={handleUpload}
                style={{ position: "absolute", zIndex: 10, margin: 10 }}
            />

            {hoverZone && (
                <div
                    style={{
                        position: "absolute",
                        top: 50,
                        left: 10,
                        padding: "6px 10px",
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        zIndex: 10,
                    }}
                >
                    <strong>Hovered Zone:</strong> {hoverZone.id}
                </div>
            )}

            <Canvas camera={{ position: [10, 15, 20], fov: 45 }} shadows>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                <OrbitControls makeDefault enableZoom enableRotate enablePan />

                <gridHelper args={[50, 50, "white", "gray"]} />

                {layout.map((zone, index) => (
                    <BoxZone
                        key={index}
                        zone={zone}
                        onClick={(z) => console.log("Clicked:", z)}
                        onHover={setHoverZone}
                    />
                ))}
            </Canvas>
        </div>
    );
};

export default Warehouse3DBuilder;



// import React from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, GridHelper } from "@react-three/drei";

// const Box = ({ position }) => {
//     return (
//         <mesh position={position}>
//             <boxGeometry args={[2, 2, 2]} />
//             <meshStandardMaterial color="#4a90e2" />
//         </mesh>
//     );
// };

// const Warehouse3DMap = ({ space }) => {
//     const boxCount = Math.floor(space / 50);
//     const rows = Math.ceil(Math.sqrt(boxCount));
//     const cols = rows;

//     const positions = [];
//     for (let i = 0; i < boxCount; i++) {
//         const row = Math.floor(i / cols);
//         const col = i % cols;
//         positions.push([col * 3, 1, row * 3]); // spacing between boxes
//     }

//     return (
//         <Canvas camera={{ position: [10, 15, 20], fov: 40 }}>
//             <ambientLight intensity={0.5} />
//             <directionalLight position={[5, 10, 7]} intensity={1} />
//             <OrbitControls />
//             <GridHelper args={[100, 20]} />
//             {positions.map((pos, idx) => (
//                 <Box key={idx} position={pos} />
//             ))}
//         </Canvas>
//     );
// };

// export default Warehouse3DMap;
