// import React, { useState } from "react";

// const invoiceTemplates = [
//   {
//     img: "assets/img/invoice/general-invoice-31.svg",
//     link: "general-invoice-1.html",
//     name: "General Invoice 1",
//     modal: "#invoice_view_1",
//   },
//   {
//     img: "assets/img/invoice/general-invoice-32.svg",
//     link: "general-invoice-2.html",
//     name: "General Invoice 2",
//     modal: "#invoice_view_2",
//   },
//   {
//     img: "assets/img/invoice/general-invoice-33.svg",
//     link: "general-invoice-3.html",
//     name: "General Invoice 3",
//     modal: "#invoice_view_3",
//   },
//   {
//     img: "assets/img/invoice/general-invoice-34.svg",
//     link: "general-invoice-4.html",
//     name: "General Invoice 4",
//     modal: "#invoice_view_4",
//   },
//   {
//     img: "assets/img/invoice/general-invoice-35.svg",
//     link: "general-invoice-5.html",
//     name: "General Invoice 5",
//     modal: "#invoice_view_5",
//   },
//   {
//     img: "assets/img/invoice/general-invoice-36.svg",
//     link: "general-invoice-6.html",
//     name: "General Invoice 6",
//     modal: "#invoice_view_6",
//   },
//   {
//     img: "assets/img/invoice/general-invoice-37.svg",
//     link: "general-invoice-7.html",
//     name: "General Invoice 7",
//     modal: "#invoice_view_7",
//   },
//   {
//     img: "assets/img/invoice/general-invoice-38.svg",
//     link: "general-invoice-8.html",
//     name: "General Invoice 8",
//     modal: "#invoice_view_8",
//   },
//   {
//     img: "assets/img/invoice/general-invoice-39.svg",
//     link: "general-invoice-9.html",
//     name: "General Invoice 9",
//     modal: "#invoice_view_9",
//   },
//   {
//     img: "assets/img/invoice/general-invoice-40.svg",
//     link: "general-invoice-10.html",
//     name: "General Invoice 10",
//     modal: "#invoice_view_10",
//   },
// ];

// export default function InvoiceTemplate() {
//   const [activeIndex, setActiveIndex] = useState(null);

//   return (
//     <div className="row gx-3">
//       {invoiceTemplates.map((template, idx) => (
//         <div className="col-md-3" key={template.name}>
//           <div
//             className={`card invoice-template${activeIndex === idx ? " active" : ""}`}
//             onClick={() => setActiveIndex(idx)}
//           >
//             <div className="card-body p-2">
//               <div className="invoice-img">
//                 <a href="#">
//                   <img className="w-100" src={template.img} alt="invoice" />
//                 </a>
//                 <a
//                   href="#"
//                   className="invoice-view-icon"
//                   data-bs-toggle="modal"
//                   data-bs-target={template.modal}
//                 >
//                   <i className="isax isax-eye"></i>
//                 </a>
//               </div>
//               <div className="d-flex justify-content-between align-items-center">
//                 <a href={template.link}>{template.name}</a>
//                 <a
//                   href="javascript:void(0);"
//                   className="invoice-star d-flex align-items-center justify-content-center"
//                 >
//                   <i className="isax isax-star"></i>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const invoiceTabs = [
    { id: "invoice_tab", label: "Invoice" },
    { id: "purchases_tab", label: "Purchases" },
    { id: "receipt_tab", label: "Receipt" },
];

const invoiceCards = {
    invoice_tab: [
        {
            img: "assets/img/invoice/general-invoice-31.svg",
            link: "general-invoice-1.html",
            name: "General Invoice 1",
            modal: "#invoice_view_1",
        },
        {
            img: "assets/img/invoice/general-invoice-32.svg",
            link: "general-invoice-2.html",
            name: "General Invoice 2",
            modal: "#invoice_view_2",
        },
        {
            img: "assets/img/invoice/general-invoice-33.svg",
            link: "general-invoice-3.html",
            name: "General Invoice 3",
            modal: "#invoice_view_3",
        },
        {
            img: "assets/img/invoice/general-invoice-34.svg",
            link: "general-invoice-4.html",
            name: "General Invoice 4",
            modal: "#invoice_view_4",
        },
        {
            img: "assets/img/invoice/general-invoice-35.svg",
            link: "invoice7",
            name: "General Invoice 5",
            modal: "#invoice_view_5",
        },
        {
            img: "assets/img/invoice/general-invoice-36.svg",
            link: "general-invoice-6.html",
            name: "General Invoice 6",
            modal: "#invoice_view_6",
        },
        {
            img: "assets/img/invoice/general-invoice-37.svg",
            link: "general-invoice-7.html",
            name: "General Invoice 7",
            modal: "#invoice_view_7",
        },
        {
            img: "assets/img/invoice/general-invoice-38.svg",
            link: "general-invoice-8.html",
            name: "General Invoice 8",
            modal: "#invoice_view_8",
        },
        {
            img: "assets/img/invoice/general-invoice-39.svg",
            link: "general-invoice-9.html",
            name: "General Invoice 9",
            modal: "#invoice_view_9",
        },
        {
            img: "assets/img/invoice/general-invoice-40.svg",
            link: "general-invoice-10.html",
            name: "General Invoice 10",
            modal: "#invoice_view_10",
        },
    ],
    purchases_tab: [
        {
            img: "assets/img/invoice/general-invoice-41.svg",
            link: "bus-booking-invoice.html",
            name: "Bus Booking",
            modal: "#invoice_view11",
        },
        {
            img: "assets/img/invoice/general-invoice-42.svg",
            link: "car-booking-invoice.html",
            name: "Car Booking",
            modal: "#invoice_view_12",
        },
        {
            img: "assets/img/invoice/general-invoice-43.svg",
            link: "coffee-shop-invoice.html",
            name: "Coffee Shop",
            modal: "#invoice_view_13",
        },
        {
            img: "assets/img/invoice/general-invoice-44.svg",
            link: "domain-hosting-invoice.html",
            name: "Domain & Hosting",
            modal: "#invoice_view_14",
        },
        {
            img: "assets/img/invoice/general-invoice-45.svg",
            link: "ecommerce-invoice.html",
            name: "Ecommerce",
            modal: "#invoice_view_15",
        },
        {
            img: "assets/img/invoice/general-invoice-46.svg",
            link: "fitness-center-invoice.html",
            name: "Fitness",
            modal: "#invoice_view_16",
        },
        {
            img: "assets/img/invoice/general-invoice-47.svg",
            link: "flight-booking-invoice.html",
            name: "Dream Flights",
            modal: "#invoice_view_17",
        },
        {
            img: "assets/img/invoice/general-invoice-48.svg",
            link: "hotel-booking-invoice.html",
            name: "Hotel Booking",
            modal: "#invoice_view_18",
        },
        {
            img: "assets/img/invoice/general-invoice-49.svg",
            link: "internet-billing-invoice.html",
            name: "Internet Billing",
            modal: "#invoice_view_19",
        },
        {
            img: "assets/img/invoice/general-invoice-50.svg",
            link: "invoice-medical.html",
            name: "Medical",
            modal: "#invoice_view_20",
        },
        {
            img: "assets/img/invoice/general-invoice-51.svg",
            link: "money-exchange-invoice.html",
            name: "Money Exchange",
            modal: "#invoice_view_21",
        },
        {
            img: "assets/img/invoice/general-invoice-52.svg",
            link: "movie-ticket-booking-invoice.html",
            name: "Movie Ticket",
            modal: "#invoice_view_22",
        },
        {
            img: "assets/img/invoice/general-invoice-53.svg",
            link: "restaurants-invoice.html",
            name: "Restaurant",
            modal: "#invoice_view_23",
        },
        {
            img: "assets/img/invoice/general-invoice-54.svg",
            link: "student-billing-invoice.html",
            name: "Student Billing",
            modal: "#invoice_view_24",
        },
        {
            img: "assets/img/invoice/general-invoice-55.svg",
            link: "train-ticket-invoice.html",
            name: "Train Ticket",
            modal: "#invoice_view_25",
        },
    ],
    receipt_tab: [
        {
            img: "assets/img/invoice/general-invoice-56.svg",
            link: "receipt-invoice-1.html",
            name: "Receipt Invoice 1",
            modal: "#invoice_view_26",
        },
        {
            img: "assets/img/invoice/general-invoice-57.svg",
            link: "receipt-invoice-2.html",
            name: "Receipt Invoice 2",
            modal: "#invoice_view_27",
        },
        {
            img: "assets/img/invoice/general-invoice-58.svg",
            link: "receipt-invoice-3.html",
            name: "Receipt Invoice 3",
            modal: "#invoice_view_28",
        },
        {
            img: "assets/img/invoice/general-invoice-59.svg",
            link: "receipt-invoice-4.html",
            name: "Receipt Invoice 4",
            modal: "#invoice_view_29",
        },
    ],
};

export default function InvoiceTemplates() {
    const [activeTab, setActiveTab] = useState("invoice_tab");
    const [activeCard, setActiveCard] = useState(null);
    // Import useNavigate from react-router-dom
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="mb-3">
                    <div className="pb-3 border-bottom mb-3">
                        <h6 className="mb-0">Invoice Templates</h6>
                    </div>
                    <ul className="nav nav-tabs nav-bordered mb-3">
                        {invoiceTabs.map((tab) => (
                            <li className="nav-item" key={tab.id}>
                                <a
                                    className={`nav-link${activeTab === tab.id ? " active" : ""}`}
                                    href="#"
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="tab-content">
                        {invoiceTabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`tab-pane${activeTab === tab.id ? " active" : ""}`}
                                id={tab.id}
                            >
                                <div className="row gx-3">
                                    {invoiceCards[tab.id].map((card, idx) => (
                                        <div className="col-md-3" key={card.name}>
                                            <div
                                                className={`card invoice-template${activeCard === card.name ? " active" : ""}`}
                                                onClick={() => {
                                                    setActiveCard(card.name);
                                                    // If General Invoice 7 is clicked, navigate to /invoice7
                                                    if (card.name === "General Invoice 7") {
                                                        navigate("/invoice7");
                                                    }
                                                }}
                                            >
                                                <div className="card-body p-2">
                                                    <div className="invoice-img">
                                                        <a href="#">
                                                            <img className="w-100" src={card.img} alt="invoice" />
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="invoice-view-icon"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={card.modal}
                                                        >
                                                            <i className="isax isax-eye"></i>
                                                        </a>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <a href={card.link}>{card.name}</a>
                                                        <a
                                                            href="javascript:void(0);"
                                                            className="invoice-star d-flex align-items-center justify-content-center"
                                                        >
                                                            <i className="isax isax-star"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="footer d-sm-flex align-items-center justify-content-between bg-white py-2 px-4 border-top">
                <p className="text-dark mb-0">
                    &copy; 2025 <a href="#" className="link-primary">Kanakku</a>, All Rights Reserved
                </p>
                <p className="text-dark">Version : 1.3.8</p>
            </div>
        </div>
    );
}