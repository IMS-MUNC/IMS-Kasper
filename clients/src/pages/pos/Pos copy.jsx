//packages
import React, { useEffect, useRef, useState } from 'react'
import { Country, State, City } from "country-state-city";
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//host
import BASE_URL from "../../pages/config/config";
import axios from "axios";

//icons
import { IoSearch } from "react-icons/io5";
import { SlHandbag , SlBag } from "react-icons/sl";
import { GoPersonAdd } from "react-icons/go";
import { RiDeleteBinLine,RiArrowUpWideLine,RiArrowDownWideLine } from "react-icons/ri";
import { BsPersonSquare } from "react-icons/bs";
import { FaRegHandPaper } from "react-icons/fa";
import { LuScanLine } from "react-icons/lu";
import { AiOutlineTransaction,AiOutlineRetweet } from "react-icons/ai";
import { CgSortAz } from "react-icons/cg";
import { TbArrowsSort } from "react-icons/tb";
import { IoIosSearch, IoIosArrowBack , IoIosArrowForward } from "react-icons/io";
import { MdPrint } from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { PiBagThin,PiShoppingBagThin } from "react-icons/pi";

//images
import PaymentDone from '../../assets/img/payment-done.png';
import Upi from '../../assets/img/upi.png';
import Banks from '../../assets/img/banks.png';

function Pos() {

    const [searchdrop, setSearchDrop] = useState(false);
    const handleSearchDropChange = () => {
        setSearchDrop(true);
    }

    const [categoryValue, setCategoryValue] = useState('');
    const handleCategoryChange = (e) => {
        setCategoryValue(e.target.value);
    };

    const [socketValue, setSocketValue] = useState('');
    const handleSocketChange = (e) => {
        setSocketValue(e.target.value);
    };

    const [warehouseValue, setWarehouseValue] = useState('');
    const handleWarehouseChange = (e) => {
        setWarehouseValue(e.target.value);
    };

    const [exprationValue, setExprationValue] = useState('');
    const handleExprationChange = (e) => {
        setExprationValue(e.target.value);
    };

    const handleClear = () => {
        setSearchDrop(false);
        setCategoryValue('');
        setSocketValue('');
        setWarehouseValue('');
        setExprationValue('');
    };

  //customer popup-------------------------------------------------------------------------------------------------------------
  const [popup, setPopup] = useState(false);
  const formRef = useRef(null);
  const handlePopupChange = () => {
    setPopup(!popup);
  }
  const closeForm = () => {
    setPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        closeForm();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //cash popup------------------------------------------------------------------------------------------------------------------
  const [cashpopup, setCashPopup] = useState(false);
  const CashRef = useRef(null);
  const handleCashPopupChange = () => {
    setCashPopup(!cashpopup);
  }
  const closeCash = () => {
    setCashPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (CashRef.current && !CashRef.current.contains(event.target)) {
        closeCash();
      }
    };
    
  const handleKeyDown = (event) => {
    if (event.key === "F1") {
      event.preventDefault();
      setCashPopup((prev) => !prev);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

//bag popup-------------------------------------------------------------------------------------------------------------------
  const [bagpopup, setBagPopup] = useState(false);
  const BagRef = useRef(null);
  const handleBagPopupChange = () => {
    setBagPopup(!bagpopup);
  }
  const closeBag = () => {
    setBagPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (BagRef.current && !BagRef.current.contains(event.target)) {
        closeBag();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //card popup-----------------------------------------------------------------------------------------------------------------------
  const [cardpopup, setCardPopup] = useState(false);
  const CardRef = useRef(null);
  const handleCardPopupChange = () => {
    setCardPopup(!cardpopup);
  }
  const closeCard = () => {
    setCardPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (CardRef.current && !CardRef.current.contains(event.target)) {
        closeCard();
      }
    };
    
  const handleKeyDown = (event) => {
    if (event.key === "F2") {
      event.preventDefault();
      setCardPopup((prev) => !prev);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

//upi popup--------------------------------------------------------------------------------------------------------------------------
  const [upipopup, setUpiPopup] = useState(false);
  const UpiRef = useRef(null);
  const handleUpiPopupChange = () => {
    setUpiPopup(!upipopup);
  }
  const closeUpi = () => {
    setUpiPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (UpiRef.current && !UpiRef.current.contains(event.target)) {
        closeUpi();
      }
    };
    
  const handleKeyDown = (event) => {
    if (event.key === "F3") {
      event.preventDefault();
      setUpiPopup((prev) => !prev);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

//transaction popup---------------------------------------------------------------------------------------------------------------
  const [transactionpopup, setTransactionPopup] = useState(false);
  const TransactionRef = useRef(null);
  const handleTransactionPopupChange = () => {
    setTransactionPopup(!transactionpopup);
  }
  const closeTransaction = () => {
    setTransactionPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (TransactionRef.current && !TransactionRef.current.contains(event.target)) {
        closeTransaction();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

//add customer popup--------------------------------------------------------------------------------------------------------------
  const [addcustomerpopup, setAddCustomerPopup] = useState(false);
  const AddCustomerRef = useRef(null);
  const handleAddCustomerPopupChange = () => {
    setAddCustomerPopup(!addcustomerpopup);
  }
  const closeAddCustomer = () => {
    setAddCustomerPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (AddCustomerRef.current && !AddCustomerRef.current.contains(event.target)) {
        closeAddCustomer();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

//discount popup--------------------------------------------------------------------------------------------------------------------
  const [discountpopup, setDiscountPopup] = useState(false);
  const [selectedItemForDiscount, setSelectedItemForDiscount] = useState(null);
  const [discountQuantity, setDiscountQuantity] = useState(1);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountFixed, setDiscountFixed] = useState(0);
  const [discountType, setDiscountType] = useState('Fixed');
  
  const DiscountRef = useRef(null);
  const handleProductDiscountClick = (item) => {
    // setSelectedItemForDiscount(item);
    const product = products.find(p => p._id === item._id); // Find the product in the products array
  setSelectedItemForDiscount({
    ...item,
    availableQuantity: product ? product.quantity : 0, // Store the available quantity
  });
    setDiscountQuantity(item.quantity);
    setDiscountPercentage(item.discountType === 'Percentage' ? item.discountValue : 0);
    setDiscountFixed(item.discountType === 'Fixed' ? item.discountValue : 0);
    setDiscountType(item.discountType || 'Fixed');
    setDiscountPopup(true);
  }
  const closeDiscount = () => {
    setDiscountPopup(false);
    setSelectedItemForDiscount(null);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      setDiscountQuantity(newQuantity);
    }
  };

  const handleDiscountPercentageChange = (value) => {
    setDiscountPercentage(Number(value) || 0);
    setDiscountType('Percentage');
  };

  const handleDiscountFixedChange = (value) => {
    setDiscountFixed(Number(value) || 0);
    setDiscountType('Fixed');
  };

  const applyDiscountChanges = () => {
    if (selectedItemForDiscount) {
      const updatedItems = selectedItems.map(item => 
        item._id === selectedItemForDiscount._id 
          ? {
              ...item,
              quantity: discountQuantity,
              discountValue: discountType === 'Percentage' ? discountPercentage : discountFixed,
              discountType: discountType,
              totalPrice: discountQuantity * item.sellingPrice,
              totalTax: (item.tax * discountQuantity * item.sellingPrice) / 100,
              totalDiscount: discountType === 'Percentage' 
                ? (discountQuantity * item.sellingPrice * discountPercentage) / 100
                : discountFixed * discountQuantity
            }
          : item
      );
      setSelectedItems(updatedItems);
      closeDiscount();
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (DiscountRef.current && !DiscountRef.current.contains(event.target)) {
        closeDiscount();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

//payment done popup-------------------------------------------------------------------------------------------------------
  const [paymentpopup, setPaymentPopup] = useState(false);
  const PaymentRef = useRef(null);
  const handlePaymentPopupChange = () => {
    setPaymentPopup(!paymentpopup);
  }
  const closePayment = () => {
    setPaymentPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (PaymentRef.current && !PaymentRef.current.contains(event.target)) {
        closePayment();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

//fetch products details---------------------------------------------------------------------------------------------------------
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [activeTabs, setActiveTabs] = useState({});
  
// Search functionality
 
  const [productSearchQuery, setProductSearchQuery] = useState('')

  const [transactionSearchQuery, setTransactionSearchQuery] = useState('');
      // Product search functionality
  const handleProductSearch = (query) => {
    setProductSearchQuery(query);
    
    if (!query.trim()) {
      setProducts(allProducts);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filteredProducts = allProducts.filter(product => {
      return (
        product.productName?.toLowerCase().includes(searchTerm) ||
        (product.brand && typeof product.brand === 'object' && product.brand.name?.toLowerCase().includes(searchTerm)) ||
        (product.brand && typeof product.brand === 'string' && product.brand.toLowerCase().includes(searchTerm)) ||
        product.seoTitle?.toLowerCase().includes(searchTerm) ||
        product.seoDescription?.toLowerCase().includes(searchTerm) ||
        (product.category && typeof product.category === 'object' && product.category.name?.toLowerCase().includes(searchTerm)) ||
        (product.category && typeof product.category === 'string' && product.category.toLowerCase().includes(searchTerm)) ||
        (product.subcategory && typeof product.subcategory === 'object' && product.subcategory.name?.toLowerCase().includes(searchTerm)) ||
        (product.subcategory && typeof product.subcategory === 'string' && product.subcategory.toLowerCase().includes(searchTerm))
      );
    });
    
    setProducts(filteredProducts);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        // Access the products array from the response object
        const productsData = res.data.products || res.data || [];
        setProducts(productsData);
        setAllProducts(productsData); // Store all products
        // console.log("Products right:", productsData);
        // Log first product to see image structure
        if (productsData.length > 0) {
          // console.log("First product structure:", productsData[0]);
          // console.log("First product images:", productsData[0].images);
        }
        // Initialize all to "general"
        const initialTabs = productsData.reduce((acc, product) => {
          acc[product._id] = "general";
          return acc;
        }, {});
        setActiveTabs(initialTabs);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);
  

//fetch category of products----------------------------------------------------------------------------------------------------
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/category/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  // Category filtering functionality
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    if (selectedCategory && selectedCategory._id === category._id) {
      // If same category is clicked again, show all products
      setSelectedCategory(null);
      setProducts(allProducts);
    } else {
      // Filter products by selected category
      setSelectedCategory(category);
      const filteredProducts = allProducts.filter(product => 
        product.category && product.category._id === category._id
      );
      setProducts(filteredProducts);
    }
  };

  const handleAllItemsClick = () => {
    setSelectedCategory(null);
    setProducts(allProducts);
  };


// Product selection and cart functionality---------------------------------------------------------------------------------
  const [selectedItems, setSelectedItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [roundedAmount, setRoundedAmount] = useState(0);
  const [totalTax, setTotalTax] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [bagCharge, setBagCharge] = useState(0);
  const [posSales, setPosSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const handleProductClick = (product) => {
    const existingItemIndex = selectedItems.findIndex(item => item._id === product._id);
    
    if (existingItemIndex !== -1) {
      // Product already exists, increment quantity
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].sellingPrice;
      updatedItems[existingItemIndex].totalDiscount = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].discountValue;
      updatedItems[existingItemIndex].totalTax = (updatedItems[existingItemIndex].sellingPrice * updatedItems[existingItemIndex].tax * updatedItems[existingItemIndex].quantity) / 100;
      setSelectedItems(updatedItems);
    } else {
      // Add new product to cart
      const newItem = {
        ...product,
        quantity: 1,
        totalPrice: product.sellingPrice,
        totalDiscount: product.discountValue,
        totalTax: (product.sellingPrice * product.tax) / 100,
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      setSelectedItems(selectedItems.filter(item => item._id !== itemId));
    } else {
      const updatedItems = selectedItems.map(item => 
        item._id === itemId 
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.sellingPrice, totalTax: (item.tax * newQuantity * item.sellingPrice)/100, totalDiscount: newQuantity * item.discountValue }
          : item
      );
      setSelectedItems(updatedItems);
    }
  };

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item._id !== itemId));
  };

  // Calculate totals whenever selectedItems changes
  useEffect(() => {
    const subtotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = selectedItems.reduce((sum, item) => sum + item.totalDiscount, 0);
    const tax = selectedItems.reduce((sum, item) => sum + item.totalTax, 0);
    const items = selectedItems.length;
    const quantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    setSubTotal(subtotal)
    setDiscount(discount)
    setTotalTax(tax);
    setTotalItems(items);
    setTotalQuantity(quantity);
    
    const calculatedTotal = (subtotal - discount) + tax + bagCharge;
    setTotalAmount(calculatedTotal);
    
    // Calculate rounded amount based on decimal part
    const decimalPart = calculatedTotal - Math.floor(calculatedTotal);
    if (decimalPart <= 0.49) {
      setRoundedAmount(Math.floor(calculatedTotal));
    } else {
      setRoundedAmount(Math.ceil(calculatedTotal));
    }
  }, [selectedItems, bagCharge]);

const [amountReceived, setAmountReceived] = useState("");

const changeToReturn = Math.max((Number(amountReceived) || 0) - roundedAmount, 0);
const dueAmount = Math.max(roundedAmount - (Number(amountReceived) || 0), 0);

//bill details up down arrow-----------------------------------------------------------------------------------------------------
  const [updown, setUpdown] = useState(false);
  const handleUpDown = (value) => {
    setUpdown(value)
  };

//opt structure-----------------------------------------------------------------------------------------------------------------
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const [otp, setOtp] = useState(["", "", "", ""]);
  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < 5) {
        otpRefs[index + 1].current.focus();
      }

    }
  };

//customers selection--------------------------------------------------------------------------------------------------------------
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

const fetchCustomers = async () => {
  
  try {
    const res = await axios.get(`${BASE_URL}/api/customers`);
    setCustomers(res.data);
  } catch (err) {
    setCustomers([]);
  }
};

  useEffect(() => {
    fetchCustomers();
    fetchPosSales();
  }, []);

  // Customer search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Filter customers based on search query
    const filtered = customers.filter(customer => {
      const searchTerm = query.toLowerCase();
      return (
        customer.name?.toLowerCase().includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm) ||
        customer.phone?.toLowerCase().includes(searchTerm)
      );
    });

    setSearchResults(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery(customer.name || '');
    setShowDropdown(false);
    setPopup(false); // Close popup after selection
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

// Fetch sales transactions-------------------------------------------------------------------------------------------------
  const fetchPosSales = async (page = 1, searchQuery = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: page,
        limit: 10
      });
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery);
      }
      
      const response = await axios.get(`${BASE_URL}/api/pos-sales/transactions?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosSales(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalSales(response.data.pagination.totalSales);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching POS sales:', error);
    } finally {
      setLoading(false);
    }
  };

// Transaction search functionality
  const handleTransactionSearch = (query) => {
    setTransactionSearchQuery(query);
    fetchPosSales(1, query);
  };

// Create POS sale---------------------------------------------------------------------------------------------------------------------
  const createPosSale = async (paymentMethod, amountReceived = 0, changeReturned = 0) => {
    try {
      if (!selectedCustomer || selectedItems.length === 0) {
        alert('Please select a customer and items before proceeding');
        return;
      }

      // Ensure numeric values are numbers and map to correct property names
      const saleData = {
        customerId: selectedCustomer._id,
        items: selectedItems.map(item => ({
          productId: item._id,
          quantity: Number(item.quantity),
          sellingPrice: Number(item.sellingPrice),
          totalPrice: Number(item.totalPrice),
          discountValue: Number(item.totalDiscount || 0), // Map totalDiscount to discountValue
          discountType: 'Fixed', // Default to Fixed
          tax: Number(item.totalTax || 0) // Map totalTax to tax
        })),
        paymentMethod,
        amountReceived: Number(amountReceived || 0),
        changeReturned: Number(changeReturned || 0),
        bagCharge: Number(bagCharge || 0),
        subtotal: Number(subTotal || 0),
        discount: Number(discount || 0),
        tax: Number(totalTax || 0),
        totalAmount: Number(roundedAmount || 0)
      };

      console.log('Frontend sending sale data:', saleData);
      console.log('Data types:', {
        customerId: typeof saleData.customerId,
        itemsLength: saleData.items.length,
        paymentMethod: typeof saleData.paymentMethod,
        subtotal: typeof saleData.subtotal,
        totalAmount: typeof saleData.totalAmount
      });

      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/api/pos-sales/create`, saleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Clear cart and show payment success
        setSelectedItems([]);
        setSelectedCustomer(null);
        setBagCharge(0);
        setAmountReceived('');
        setSelectedSale(response.data.data);
        handlePaymentPopupChange();
        // Refresh transactions
        fetchPosSales(1, transactionSearchQuery);
      }
    } catch (error) {
      console.error('Error creating POS sale:', error);
      
      // Show detailed validation errors if available
      if (error.response?.data?.details) {
        const errorDetails = error.response.data.details;
        if (typeof errorDetails === 'object') {
          const errorMessages = Object.entries(errorDetails)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
          alert('Validation Error:\n' + errorMessages);
        } else {
          alert('Error creating sale: ' + errorDetails);
        }
      } else {
        alert('Error creating sale: ' + (error.response?.data?.message || error.message));
      }
    }
  };

// Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPosSales(newPage, transactionSearchQuery);
    }
  };

  //set address
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  
    useEffect(() => {
      setCountryList(Country.getAllCountries());
    }, []);
  
    useEffect(() => {
      if (selectedCountry) {
        setStateList(State.getStatesOfCountry(selectedCountry));
      }
    }, [selectedCountry]);
  
    useEffect(() => {
      if (selectedState) {
        setCityList(City.getCitiesOfState(selectedCountry, selectedState));
      }
    }, [selectedState]);

//company details-----------------------------------------------------------------------------------------------------------------

  const [companyData , setCompanyData] = useState({
    companyName: "",
    companyemail: "",
    companyphone: "",
    companyfax: "",
    companywebsite: "",
    companyaddress: "",
    companycountry: "",
    companystate: "",
    companycity: "",
    companypostalcode: "",
    gstin: "",
    cin: "",
    companydescription: "",
    upiId: "",
  });

  const fetchCompanyProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/companyprofile/get`);
      console.log("Fetched company profile data:", res.data);
      const profile = res.data.data;
      if (profile) {
        setCompanyData({
          companyName: profile.companyName || "",
          companyemail: profile.companyemail || "",
          companyphone: profile.companyphone || "",
          companyfax: profile.companyfax || "",
          companywebsite: profile.companywebsite || "",
          companyaddress: profile.companyaddress || "",
          companycountry: profile.companycountry || "",
          companystate: profile.companystate || "",
          companycity: profile.companycity || "",
          companypostalcode: profile.companypostalcode || "",
          gstin: profile.gstin || "",
          cin: profile.cin || "",
          companydescription: profile.companydescription || "",
          upiId: profile.upiId || "adityasng420.ak@okicici", //company upi id
        });

      }
    } catch (error) {
      toast.error("No existing company profile or error fetching it:", error);
    }
  };
  useEffect(() => {
    fetchCompanyProfile();
  }, []);

//upi qr code generation----------------------------------------------------------------------------------------------------------

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  
  async function generatePaymentQRCode(paymentData) {
        try {
            const qrCodeString = await QRCode.toDataURL(JSON.stringify(paymentData));
            // You can then display this qrCodeString (Data URL) in an <img> tag or save it as an image.
            console.log(qrCodeString);
        } catch (err) {
            console.error(err);
        }
    }
  useEffect(() => {
    if (companyData?.companyName && companyData?.upiId && roundedAmount > 0) {
      // Build UPI Payment String
      const upiString = `upi://pay?pa=${companyData.upiId}&pn=${encodeURIComponent(
        companyData.companyName
      )}&am=${roundedAmount}&cu=INR`;

      // Generate QR Code
      QRCode.toDataURL(upiString)
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
        });
    }
  }, [roundedAmount, companyData]);

//invoice popup----------------------------------------------------------------------------------------------------------------------

const [invoicepopup, setInvoicePopup] = useState(false);
const InvoiceRef = useRef(null);

  const handleInvoicePopupChange = () => {
    setInvoicePopup(!invoicepopup);
  }
  const closeInvoice = () => {
    setInvoicePopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (InvoiceRef.current && !InvoiceRef.current.contains(event.target)) {
        closeInvoice();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  
const totalDiscountinvoice = selectedSale?.items?.reduce(
  (acc, item) => acc + (item.discount || 0),
  0
);

const totalTaxinvoice = selectedSale?.items?.reduce(
  (acc, item) => acc + (item.tax || 0),
  0
);

//print and download invoice----------------------------------------------------------------------------------------------------------------------

const [isGenerating, setIsGenerating] = useState(false);

// Download PDF function
const handleDownloadPDF = async () => {
  if (isGenerating) return;
  
  // Ensure invoicepopup is open
  setInvoicePopup(true);

  // Wait for the DOM to update (small delay to ensure rendering)
  setTimeout(async () => {
    if (!InvoiceRef.current) {
      console.error('InvoiceRef is null or undefined');
      toast.error('Cannot generate PDF: Invoice content is not available');
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    const element = InvoiceRef.current;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297],
    });

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 70;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 5;
      doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 10;
      while (heightLeft > 0) {
        doc.addPage();
        position = heightLeft - imgHeight + 5;
        doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 10;
      }

      doc.save('invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF: ' + error.message);
    } finally {
      setIsGenerating(false);
      // Optionally close invoicepopup after generating
      setInvoicePopup(false);
    }
  }, 100); // Small delay to ensure DOM rendering
};

// Print Preview function
const handleInvoicePrint = async () => {
  if (isGenerating) return;

  // Ensure invoicepopup is open
  setInvoicePopup(true);

  // Wait for the DOM to update
  setTimeout(async () => {
    if (!InvoiceRef.current) {
      console.error('InvoiceRef is null or undefined');
      toast.error('Cannot print: Invoice content is not available');
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(InvoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice</title>
            <style>
              body {
                margin: 5mm;
                padding: 0;
                font-family: Arial, sans-serif;
                font-size: 10px;
                color: #333;
              }
              .invoice-container {
                max-width: 70mm;
                margin: 0 auto;
                background-color: #fff;
                padding: 5mm;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 5px;
                margin-bottom: 5px;
              }
              th, td {
                padding: 3px;
                text-align: left;
                font-size: 10px;
              }
              th {
                border-bottom: 1px solid #E1E1E1;
              }
              .text-right {
                text-align: right;
              }
              .text-center {
                text-align: center;
              }
              .section-title {
                font-size: 14px;
                font-weight: 600;
                margin-top: 5px;
              }
              .border-bottom {
                border-bottom: 1px solid #E1E1E1;
              }
              @media print {
                @page {
                  size: A5;
                  margin: 5mm;
                }
                .invoice-container {
                  box-shadow: none;
                  max-width: 70mm;
                }
                body {
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <img src="${imgData}" style="width: 100%; height: auto;" />
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Error generating print preview:', error);
      toast.error('Failed to generate print preview: ' + error.message);
    } finally {
      setIsGenerating(false);
      // Optionally close invoicepopup after printing
      setInvoicePopup(false);
    }
  }, 100); // Small delay to ensure DOM rendering
};

//add customers---------------------------------------------------------------------------------------------------------------

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch(`${BASE_URL}/api/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Customer saved successfully ✅");
      setForm({
        name: '',
        email: '',
        phone: '',
        status: true,
      });
  fetchCustomers(); 
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong ❌");
  } finally {
    setLoading(false);
  }
};

  return ( //page code starts from here-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    <div className='page-wrapper' style={{height:'100vh',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>

      {/* Add CSS for loading animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* search & cart */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid #ccc'}}>

        {/* search bar */}
        <div style={{width:'70%',display:'flex',alignItems:'center',borderRight:'1px solid #ccc',}}>
          <IoSearch style={{fontSize:'24px',marginLeft:'10px',color:'#C2C2C2'}} />
          <input 
            type="text" 
            placeholder="Search any product by its name, brand, category..." 
            value={productSearchQuery}
            onChange={(e) => handleProductSearch(e.target.value)}
            style={{width:'95%',padding:'8px',fontSize:'16px',border:'none',outline:'none',color:'#333'}} 
          />
        </div>

        {/* cart */}
        <div style={{width:'30%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0px 20px',}}>
          <div style={{fontSize:'20px',fontWeight:'600'}}>
            Cart
          </div>
          <div style={{display:'flex',gap:'15px',alignItems:'center'}}>
              <div 
                style={{
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  cursor:'pointer',
                  borderRight:'1px solid #ccc',
                  paddingRight:'15px',
                  backgroundColor: bagCharge > 0 ? '#E3F3FF' : 'transparent',
                  borderRadius: bagCharge > 0 ? '8px' : '0px',
                  padding: '5px 15px'
                }}
                onClick={handleBagPopupChange}
              >
              <SlHandbag/> 
              <span style={{fontSize:'10px'}}>Add Bag</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer',borderRight:'1px solid #ccc',paddingRight:'15px'}} onClick={handlePopupChange}>
              <GoPersonAdd/> 
              <span style={{fontSize:'10px'}} >Customer</span>
            </div>
            <div 
              style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                cursor:'pointer'
              }} 
              onClick={() => {
                setSelectedItems([]);
                setSelectedCustomer(null);
                setBagCharge(0);
                setAmountReceived('');
                setSearchQuery('');
                setSearchResults([]);
                setShowDropdown(false);
                // Reset totals
                setSubTotal(0);
                setTotalAmount(0);
                setRoundedAmount(0);
                setTotalTax(0);
                setTotalItems(0);
                setTotalQuantity(0);
                setDiscount(0);
                                    // Close all popups
                    setCashPopup(false);
                    setCardPopup(false);
                    setUpiPopup(false);
                    // Refresh transactions
                    fetchPosSales();
                    // Reset category filter
                    setSelectedCategory(null);
                    setProducts(allProducts);
                    // Reset updown state
                    setUpdown(false);
                    // Reset search drop state
                    setSearchDrop(false);
                    // Reset filter values
                    setCategoryValue('');
                    setSocketValue('');
                    setWarehouseValue('');
                    setExprationValue('');
                    // Reset OTP state
                    setOtp(['', '', '', '']);
                    // Reset address fields
                    setCountry('');
                    setState('');
                    setCity('');
                    setPinCode('');
                    setSelectedCountry('');
                    setSelectedState('');
                    setSelectedCity('');
                    // Reset form data
                    if (formRef.current) {
                      formRef.current.reset();
                    }
                    // Reset active tabs
                    const initialTabs = allProducts.reduce((acc, product) => {
                      acc[product._id] = "general";
                      return acc;
                    }, {});
                    setActiveTabs(initialTabs);
                    // Reset search query
                    setSearchQuery('');
                    // Reset search results
                    setSearchResults([]);
                    setShowDropdown(false);
                    // Reset popup states
                    setPopup(false);
                    setAddCustomerPopup(false);
                    setDiscountPopup(false);
                    // Reset transaction popup
                    setTransactionPopup(false);
                    // Reset selected sale
                    setSelectedSale(null);
                    // Reset current page
                    setCurrentPage(1);
                    // Reset total pages
                    setTotalPages(1);
                    // Reset total sales
                    setTotalSales(0);
                    // Reset loading state
                    setLoading(false);
                    // Reset pos sales
                    setPosSales([]);
                    // Reset amount received
                    setAmountReceived('');
                    // Reset search query
                    setSearchQuery('');
                    // Reset search results
                    setSearchResults([]);
                    setShowDropdown(false);
                    // Reset popup states
                    setPopup(false);
                    setAddCustomerPopup(false);
                    setDiscountPopup(false);
                    // Reset transaction popup
                    setTransactionPopup(false);
                    // Reset selected sale
                    setSelectedSale(null);
                    // Reset current page
                    setCurrentPage(1);
                    // Reset total pages
                    setTotalPages(1);
                    // Reset total sales
                    setTotalSales(0);
                    // Reset loading state
                    setLoading(false);
                    // Reset pos sales
                    setPosSales([]);
                    // Reset amount received
                    setAmountReceived('');
                  }}
            >
              <RiDeleteBinLine/>
              <span style={{fontSize:'10px'}}>Remove All</span>
            </div>
          </div>
        </div>

      </div>

      {/* pos area */}
      <div style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid white',borderBottom:'1px solid #ccc',borderRight:'1px solid #ccc',height:'83vh'}}>
        
        {/* products section */}
        <div style={{position:"relative",width:'100%',display:'flex',borderRight:'1px solid #ccc',}}>

            {/* category */}
            <div style={{padding:'10px 10px',borderRight:'1px solid #ccc',overflowY:'auto'}}>

              {/* all items*/}
              <div style={{lineHeight:'30px'}}>
                <span style={{color:'#676767'}}><b>All Items</b></span>
                <div 
                  style={{
                    display:'flex',
                    flexDirection:'column',
                    marginLeft:'10px',
                    borderLeft: selectedCategory === null ? '1px solid #0051CF' : '',
                    backgroundColor: selectedCategory === null ? '#F7F7F7' : 'transparent',
                    borderRadius:'8px',
                    padding:'2px 5px',
                    fontWeight:'600',
                    cursor:'pointer'
                  }}
                  onClick={handleAllItemsClick}
                >
                  All Items
                </div>
              </div>

              {/* categories */}
              <div style={{lineHeight:'30px',marginTop:'10px',marginBottom:'20px'}}>
                <span style={{color:'#676767'}}><b>Categories</b></span>
                <div style={{display:'flex',flexDirection:'column',marginLeft:'10px'}}>
                {categories.length === 0 ? (
                <span>No Category Available</span>
                ) : (
                  categories.map((category) => (
                  <span 
                    key={category._id}
                    style={{
                      cursor:'pointer',
                      padding:'2px 5px',
                      borderRadius:'8px',
                      borderLeft:  selectedCategory && selectedCategory._id === category._id ? '1px solid #0051CF' : '',
                      backgroundColor: selectedCategory && selectedCategory._id === category._id ? '#F7F7F7' : 'transparent',
                      fontWeight: selectedCategory && selectedCategory._id === category._id ? '600' : 'normal'
                    }}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.categoryName}
                  </span>
                  )))}
                </div>
              </div>
            </div>

            {/* item details card */}
            <div style={{width:'80%',backgroundColor:'#F7F7F7',height:'100%',overflowY:'auto'}}>
              
              {/* products */}
              <div style={{height:'74vh',marginTop:'20px',overflowY:'auto',padding:'0px 20px',}}>
              <div className='row gap-3' style={{gap:'25px',marginLeft:'40px',}}>
              
              
              {products.length === 0 ? (
                <span>No Product Available</span>
              ) : (
              products.map((product) => {
                // Check if this product is in cart and get its quantity
                const cartItem = selectedItems.find(item => item._id === product._id);
                const cartQuantity = cartItem ? cartItem.quantity : 0;
                
                return (
                <div 
                  key={product._id}
                  className='col-md-2 col-sm-3 col-4 gap-4 mb-3' 
                  style={{
                    border:'2px solid #E6E6E6',
                    backgroundColor:'white',
                    borderRadius:'16px',
                    padding:'10px',
                    cursor: product.quantity > 0 ? 'pointer' : 'not-allowed',
                    position:'relative'
                  }}
                  onClick={() => product.quantity > 0 && handleProductClick(product)}
                >
                  {/* Quantity Badge */}
                  {cartQuantity > 0 && (
                    <div style={{
                      position:'absolute',
                      top:'5px',
                      right:'5px',
                      backgroundColor:'#1368EC',
                      color:'white',
                      borderRadius:'50%',
                      width:'24px',
                      height:'24px',
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      fontSize:'12px',
                      fontWeight:'bold',
                      zIndex:1
                    }}>
                      {cartQuantity}
                    </div>
                  )}

                  <div style={{display:'flex',justifyContent:'center',backgroundColor:'white',width:'100%',height:'97px',alignItems:'center',borderRadius:'8px',overflow:'hidden'}}>
                    {product.images && product.images.length > 0 && product.images[0] ? (
                      <img
                        src={product.images[0].url || product.images[0]}
                        alt={product.productName}
                        style={{ 
                          height: "100%", 
                          width: "100%",
                          objectFit:'contain',
                          maxWidth:'100%',
                          maxHeight:'100%'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback icon when no image */}
                    <div style={{
                      display: product.images && product.images.length > 0 && product.images[0] ? 'none' : 'flex',
                      flexDirection:'column',
                      alignItems:'center',
                      justifyContent:'center',
                      color:'#ccc',
                      fontSize:'24px'
                    }}>
                      {/* <SlHandbag style={{fontSize:'40px',marginBottom:'5px'}}/> */}
                      <span style={{fontSize:'10px'}}>No Image</span>
                    </div>
                  </div>

                  <div>
                    <span style={{color:'#676767',fontSize:'10px'}}>{product.category?.categoryName}</span>
                  </div>

                  <div>
                    <span style={{fontSize:'14px'}}>{product.productName}</span>
                  </div>

                  <div style={{marginTop:'8px',marginBottom:'8px'}}>
                    <div style={{width:'100%',borderTop:'2px dotted #C2C2C2'}}></div>
                  </div>

                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontSize:'14px'}}>{product.quantity}{product.unit}</span>
                    <span style={{fontSize:'14px'}}>₹{product.sellingPrice}</span>
                  </div>

                </div>
              )}))}
              </div>
              </div>

              {/* footer */}
              <div style={{position:'absolute',bottom:'0px',backgroundColor:'#F1F1F1',padding:'10px',width:'80%',display:'flex',justifyContent:'space-around'}}>
                
                  <a href='/pos' target='_blank' style={{border:'1px solid #ccc',backgroundColor:'white',padding:'2px 10px',borderRadius:'8px',display:'flex',gap:'5px',alignItems:'center',cursor:'pointer',color:'black',textDecoration:'none',hover:{backgroundColor:'red'}}}>
                    <FaRegHandPaper/>
                    Hold
                  </a>
                  <div style={{border:'1px solid #ccc',backgroundColor:'white',padding:'2px 10px',borderRadius:'8px',display:'flex',gap:'5px',alignItems:'center',cursor:'pointer'}}>
                    <LuScanLine/>
                    Scan
                  </div>
                  {/* <div style={{border:'1px solid #ccc',backgroundColor:'white',padding:'2px 10px',borderRadius:'8px',display:'flex',gap:'5px',alignItems:'center',cursor:'pointer'}}>
                    <AiOutlineTransaction/>
                    Credit Scale
                  </div> */}
                  <div style={{border:'1px solid #ccc',backgroundColor:'white',padding:'2px 10px',borderRadius:'8px',display:'flex',gap:'5px',alignItems:'center',cursor:'pointer'}} onClick={handleTransactionPopupChange}>
                    <AiOutlineRetweet />
                    Transaction
                  </div>
                
              </div>

            </div>

        </div>
      
        {/* billing section */}
        <div style={{position:'relative',width:'30%',}}>
          
          {/* customer */}
          <div style={{display:'flex',width:'100%',padding:'10px 10px',gap:'10px',borderBottom:'1px solid #ccc',height:'70px',backgroundColor: selectedCustomer ? '#E3F3FF' : '',}}>
            {selectedCustomer ? (
            <>
            <div>
              <BsPersonSquare style={{fontSize:'50px'}}/>
            </div>
            </>
            ) : (
              <div></div>
            )}

            <div style={{flex:1}}>
              {selectedCustomer ? (
                <>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',}}>
                    <span style={{fontWeight:'600',color:'#333'}}>{selectedCustomer.name}</span>
                    <button 
                      onClick={handleClearCustomer}
                      style={{
                        background:'none',
                        border:'none',
                        color:'#dc3545',
                        cursor:'pointer',
                        fontSize:'12px',
                        padding:'2px 6px',
                        borderRadius:'4px'
                      }}
                      title="Clear customer"
                    >
                      ✕
                    </button>
                  </div>
                  <span style={{color:'#666'}}>
                    {selectedCustomer.phone || 'No Phone'}
                  </span>
                </>
              ) : (
                <>
                  <div style={{marginTop:'10px',}}>
                    <span style={{color:'#999',marginLeft:'10px'}}><i>No Customer Selected</i></span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* selected items details */}
          <div style={{flex:1,overflowY:'auto',padding:'10px',}}>
            <div style={{fontWeight:'600',color:'#333',marginBottom:'10px',fontSize:'16px'}}>
              Selected Items ({selectedItems.length})
            </div>
            
            {selectedItems.length === 0 ? (
              <div style={{color:'#999',padding:'20px'}}>
                <i>No items selected</i>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'8px',overflowY:'auto',maxHeight:'45vh'}}>
                {selectedItems.map((item) => (
                  <div 
                    key={item._id}
                    style={{
                      border:'1px solid #E6E6E6',
                      borderRadius:'8px',
                      padding:'10px',
                      backgroundColor:'white'
                    }}
                  >
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                      
                    <div style={{display:'flex',justifyContent:'center',backgroundColor:'white',width:'50px',height:'50px',alignItems:'center',borderRadius:'8px',overflow:'hidden',cursor:'pointer'}} onClick={() => handleProductDiscountClick(item)}>
                    {item.images && item.images.length > 0 && item.images[0] ? (
                      <img
                        src={item.images[0].url || item.images[0]}
                        alt={item.productName}
                        style={{ 
                          height: "100%", 
                          width: "100%",
                          objectFit:'contain',
                          maxWidth:'100%',
                          maxHeight:'100%'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback icon when no image */}
                    <div style={{
                      display: item.images && item.images.length > 0 && item.images[0] ? 'none' : 'flex',
                      flexDirection:'column',
                      alignItems:'center',
                      justifyContent:'center',
                      color:'#ccc',
                      fontSize:'24px'
                    }}>
                      {/* <SlHandbag style={{fontSize:'40px',marginBottom:'5px'}}/> */}
                      <span style={{fontSize:'10px'}}>No Image</span>
                    </div>
                  </div>

                      <div style={{flex:1,gap:'10px',display:'flex',flexDirection:'column',marginLeft:'10px',cursor:'pointer'}} onClick={() => handleProductDiscountClick(item)}>
                        <div style={{fontWeight:'600',fontSize:'14px',color:'#333'}}>
                          {item.productName}
                        </div>
                        <div style={{fontSize:'12px',marginTop:'-8px', display:'flex',gap:'20px'}}>
                          <div>
                            <span style={{color:'black'}}>Price: </span>
                            <span style={{color:'#666'}}>₹{item.sellingPrice} / {item.unit}</span>
                          </div>
                          <div>
                            <span style={{color:'black'}}>Discount: </span>
                            <span style={{color:'#666'}}>{item.discountType == 'Fixed' ? '₹':''} {item.discountValue} {item.discountType == 'Percentage' ? '%':''}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item._id)}
                        style={{
                          background:'none',
                          border:'none',
                          color:'#dc3545',
                          cursor:'pointer',
                          fontSize:'16px',
                          padding:'2px 6px',
                          borderRadius:'4px'
                        }}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}} onClick={() => handleProductDiscountClick(item)}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span style={{fontWeight:'600',color:'#666'}}>
                          Quantity: {item.quantity}
                        </span>
                      </div>
                      <div style={{fontWeight:'600',color:'#1368EC'}}>
                        ₹{item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* price */}
          <div style={{backgroundColor:'#F1F1F1',border:'1px solid #E6E6E6',borderTopLeftRadius:'16px',borderTopRightRadius:'16px',position:'absolute',bottom:'0px',width:'100%',padding:'10px'}}>

            {/* sales summary */}
            {updown && (
            <>
            <div style={{width:'100%',textAlign:'center',marginTop:'-5px',cursor:'pointer'}} onClick={() => handleUpDown(false)} >
              <span style={{color:'#676767',borderTop:'2px solid #676767',padding:'0px 10px'}}><RiArrowDownWideLine style={{color:'#676767'}} /></span>
            </div>
            <div style={{marginTop:'20px',marginBottom:'10px'}}>
            <div>
              <span style={{fontSize:'20px',fontWeight:'600'}}>Sales Summary</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',color:'#676767'}}>
              <span>Sub Total</span>
              <span>₹{subTotal.toFixed(2)}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',color:'#676767'}}>
              <div>Discount</div>
              <div style={{display:'flex',justifyContent:'space-around',gap:'20px'}}>
                <span>₹{discount}</span>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',color:'#676767'}}>
              <span>Tax</span>
              <span>₹{totalTax}</span>
            </div>
            {bagCharge > 0 && (
              <div style={{display:'flex',justifyContent:'space-between',color:'#676767'}}>
                <span>Bag Charge</span>
                <span>₹{bagCharge}</span>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',color:'#676767'}}>
              <span>Actual Amount</span>
              <span>₹{((subTotal - discount) + totalTax + bagCharge).toFixed(2)}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',color:'#676767'}}>
              <span>Round Off</span>
              <span>₹{roundedAmount}</span>
            </div>
            {/* {Math.abs(roundedAmount - totalAmount) > 0 && (
              <div style={{display:'flex',justifyContent:'space-between',color:'#676767',fontSize:'12px',fontStyle:'italic'}}>
                <span>Rounding Difference</span>
                <span>₹{(roundedAmount - totalAmount).toFixed(2)}</span>
              </div>
            )} */}
            </div>
            </>
            )}
            
            {!updown && (
            <>
            <div style={{width:'100%',textAlign:'center',marginTop:'-5px',cursor:'pointer'}} onClick={() => handleUpDown(true)}>
              <span style={{color:'#676767',borderTop:'2px solid #676767',padding:'0px 10px'}}><RiArrowUpWideLine  style={{color:'#676767'}}  /></span>
            </div>
            </>
            )}

            <div style={{display:'flex',justifyContent:'space-between',color:'#676767',marginTop:'10px',marginBottom:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-around',gap:'5px',alignItems:'center'}}>
                <span style={{color:'#1368EC',fontSize:'20px',fontWeight:'600'}}>Total</span>
                <span style={{fontSize:'15px',fontWeight:'500'}}>(items - {totalItems}, Qty - {totalQuantity})</span>
              </div>
              <span style={{color:'#1368EC',fontSize:'20px',fontWeight:'600'}}>₹{roundedAmount}</span>
            </div>


            <div 
              style={{
                display:'flex',
                justifyContent:'space-between',
                padding:'10px 15px',
                backgroundColor: (selectedCustomer && selectedItems.length > 0) ? '#1368EC' : '#ccc',
                borderRadius:'8px',
                color:'white',
                marginTop:'5px',
                cursor: (selectedCustomer && selectedItems.length > 0) ? 'pointer' : 'not-allowed'
              }} 
              onClick={(selectedCustomer && selectedItems.length > 0) ? handleCashPopupChange : undefined}
            >
              <span>Cash</span>
              <span>[F1]</span>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
              <div 
                style={{
                  display:'flex',
                  justifyContent:'space-between',
                  padding:'10px 15px',
                  backgroundColor:'white',
                  borderRadius:'10px',
                  border:'1px solid #E6E6E6',
                  width:'100%',
                  color: (selectedCustomer && selectedItems.length > 0) ? '#1368EC' : '#ccc',
                  cursor: (selectedCustomer && selectedItems.length > 0) ? 'pointer' : 'not-allowed',
                }} 
                onClick={(selectedCustomer && selectedItems.length > 0) ? handleCardPopupChange : undefined}
              >
                <span>Card</span>
                <span>[F2]</span>
              </div>
              <div 
                style={{
                  display:'flex',
                  justifyContent:'space-between',
                  padding:'10px 15px',
                  backgroundColor:'white',
                  borderRadius:'10px',
                  border:'1px solid #E6E6E6',
                  width:'100%',
                  color: (selectedCustomer && selectedItems.length > 0) ? '#1368EC' : '#ccc',
                  cursor: (selectedCustomer && selectedItems.length > 0) ? 'pointer' : 'not-allowed',
                }} 
                onClick={(selectedCustomer && selectedItems.length > 0) ? handleUpiPopupChange : undefined}
              >
                <span>UPI</span>
                <span>[F3]</span>
              </div>
            </div>

          </div>

        </div>

      </div>

{/* ALL POPUPS */}

      {/* customers popup */}
      {popup && (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
          }}
          >
          <div ref={formRef} style={{width:'760px',height:'500px',margin:'auto',marginTop:'80px',marginBottom:'80px',padding:'10px 16px',overflowY:'auto',borderRadius:'8px'}}>

            {/* Search Box */}
            <div style={{position:'relative',marginBottom:'20px'}}>
              <div style={{display:'flex',alignItems:'center',border:'1px solid #E1E1E1',borderRadius:'8px',backgroundColor:'#fff',padding:'6px 12px'}}>
                <IoSearch style={{fontSize:'20px',marginRight:'10px',color:'#C2C2C2'}} />
                <input 
                  type="text" 
                  placeholder="Search by name, email, or phone number..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{width:'100%',padding:'8px',fontSize:'16px',border:'none',outline:'none',color:'#333'}} 
                />
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div style={{
                  position:'absolute',
                  top:'100%',
                  left:0,
                  right:0,
                  backgroundColor:'white',
                  border:'1px solid #E1E1E1',
                  borderRadius:'8px',
                  boxShadow:'0 4px 12px rgba(0,0,0,0.1)',
                  maxHeight:'300px',
                  overflowY:'auto',
                  zIndex:1000
                }}>
                  {searchResults.map((customer) => (
                    <div 
                      key={customer._id}
                      onClick={() => handleCustomerSelect(customer)}
                      style={{
                        padding:'12px 16px',
                        borderBottom:'1px solid #f0f0f0',
                        cursor:'pointer',
                        display:'flex',
                        flexDirection:'column',
                        gap:'4px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor='#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor='white'}
                    >
                      <div style={{fontWeight:'600',color:'#333'}}>
                        {customer.name || 'No Name'}
                      </div>
                      <div style={{fontSize:'14px',color:'#666'}}>
                        {customer.phone || 'No Phone'}
                        {customer.email && ` • ${customer.email}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results Message */}
              {showDropdown && searchResults.length === 0 && searchQuery.trim() !== '' && (
                <div style={{
                  position:'absolute',
                  top:'100%',
                  left:0,
                  right:0,
                  backgroundColor:'white',
                  border:'1px solid #E1E1E1',
                  borderRadius:'8px',
                  padding:'16px',
                  textAlign:'center',
                  color:'#666',
                  zIndex:1000
                }}>
                  No customers found matching "{searchQuery}"
                </div>
              )}
            </div>

            {/* Add New Customer Button */}
            <div style={{display:'flex',alignItems:'center',border:'1px solid #1368EC',borderRadius:'8px',backgroundColor:'#f8f9ff',padding:'12px 16px',cursor:'pointer',marginTop:'20px'}} onClick={handleAddCustomerPopupChange}>
              <GoPersonAdd style={{fontSize:'24px',marginRight:'10px',color:'#1368EC'}} />
              <div style={{fontSize:'16px',color:'#1368EC',fontWeight:'500'}}>
                Add New Customer
              </div>
            </div>

            {/* Selected Customer Info (if any) */}
            {selectedCustomer && (
              <div style={{
                marginTop:'20px',
                padding:'16px',
                backgroundColor:'#e8f5e8',
                border:'1px solid #4caf50',
                borderRadius:'8px'
              }}>
                <div style={{fontWeight:'600',color:'#2e7d32',marginBottom:'8px'}}>
                  Selected Customer Details:
                </div>
                <div style={{color:'#333'}}>
                  <div>Name: <strong>{selectedCustomer.name && selectedCustomer.name}</strong></div>
                  <div>Phone: <strong>{selectedCustomer.phone && selectedCustomer.phone}</strong></div>
                  {selectedCustomer.email && <div>Email: {selectedCustomer.email}</div>}
                </div>
              </div>
            )}
            
          </div>

        </div>
      )}

      {/* cash details popup */}
      {cashpopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={CashRef} style={{width:'500px',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px'}}>
            
            <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #E1E1E1',padding:'10px 0px'}}>
              <span>Cash details</span>
              <span>₹{roundedAmount}</span>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
              <div style={{width:'100%'}}>
                <span>Amount Received</span>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="text" placeholder="₹00.00" style={{border:'none',outline:'none',width:'100%'}} value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} />
                </div>
              </div>
              <div style={{width:'100%'}}>
                <span>Change to return</span>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <span>₹{changeToReturn}</span>
                </div>
              </div>
            </div>

            {dueAmount > 0 && (
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
                <div style={{width:'100%'}}>
                  <span style={{color: '#dc3545', fontWeight: '600'}}>Due Amount</span>
                  <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'#fff5f5',borderRadius:'10px',border:'1px solid #dc3545',width:'100%',marginTop:'5px'}}>
                    <span style={{color: '#dc3545', fontWeight: '600'}}>₹{dueAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div style={{display:'flex',justifyContent:'space-between',marginTop:'5px',marginBottom:'8px'}}>
              <div></div>
              <div 
                style={{
                  padding:'6px 15px',
                  backgroundColor:'#1368EC',
                  borderRadius:'8px',
                  color:'white',
                  cursor:'pointer'
                }} 
                onClick={() => {
                  if (amountReceived && Number(amountReceived) > 0) {
                    createPosSale('Cash', Number(amountReceived), changeToReturn);
                    setCashPopup(false);
                  } else {
                    alert('Please enter a valid amount received');
                  }
                }}
              >
                <span>Record Payment</span>
              </div>
            </div>

          </div>
        </div>
        </>
      )}

      {/* add card popup */}
      {cardpopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={CardRef} style={{width:'500px',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px'}}>
            
            <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #E1E1E1',padding:'10px 0px'}}>
              <span>Enter Card details</span>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
              <div style={{width:'100%'}}>
                <span>Card Number</span>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'#F9FAFB',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="number" placeholder='1234 5678 9101 1213' style={{border:'none',outline:'none',width:'100%',backgroundColor:'#F9FAFB'}} required />
                </div>
              </div>
              <div style={{width:'100%'}}>
                <span>Name on Card</span>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'#F9FAFB',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="text" placeholder='Enter Card Holder Name' style={{border:'none',outline:'none',width:'100%',backgroundColor:'#F9FAFB'}} required />
                </div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'50%',gap:'15px',marginTop:'2px',}}>
              <div style={{width:'100%'}}>
                <span>Valid till</span>
                <div style={{display:'flex',justifyContent:'center',padding:'10px 15px',backgroundColor:'#F9FAFB',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="number" placeholder='30/12' style={{border:'none',outline:'none',width:'100%',backgroundColor:'#F9FAFB'}} required />
                </div>
              </div>
              <div style={{width:'100%'}}>
                <span>CVV</span>
                <div style={{display:'flex',justifyContent:'center',padding:'10px 15px',backgroundColor:'#F9FAFB',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="number" placeholder='999' style={{border:'none',outline:'none',width:'100%',backgroundColor:'#F9FAFB'}} required />
                </div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',marginTop:'5px',marginBottom:'8px'}}>
              <div></div>
              <div style={{padding:'3px 10px',backgroundColor:'white',border:'2px solid #E6E6E6',borderRadius:'8px',color:'#676767'}}>
                <span>Send OTP</span>
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:'8px'}}>
              <div style={{display:'flex',gap:'15px'}}>
                {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={otpRefs[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  placeholder='0'
                  style={{color:'#C2C2C2',width:'60px',height:'60px',textAlign:'center',borderRadius:'8px',padding:'8px',backgroundColor:'#F5F5F5',outline:'none',border:'none',fontSize:'50px'}}
                />
                ))}
              </div>
              <div style={{marginTop:'10px',fontSize:'14px'}}>
                <span>Have not received the OTP? </span>
                <span style={{color:'#1368EC'}}>Send again</span>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',marginTop:'20px',marginBottom:'8px'}}>
              <div></div>
              <div 
                style={{
                  padding:'3px 10px',
                  backgroundColor:'#1368EC',
                  border:'2px solid #E6E6E6',
                  borderRadius:'8px',
                  color:'white',
                  cursor:'pointer'
                }}
                onClick={() => {
                  createPosSale('Card');
                  setCardPopup(false);
                }}
              >
                <span>Proceed to Pay</span>
              </div>
            </div>

          </div>
        </div>
        </>
      )}

      {/* add bag popup */}
      {bagpopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={BagRef} style={{width:'500px',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px'}}>
            
            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px'}}>
              <span>Select Bag Type</span>
            </div>

            <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',marginTop:'20px',gap:'10px',marginBottom:'30px'}}>
              <div 
                style={{
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  cursor:'pointer',
                  gap:'0px',
                  backgroundColor: bagCharge == 10 ? '#E3F3FF' : '#BCBCBC',
                  borderRadius: '8px',
                  padding: '20px 25px',
                  border: '1px solid #E6E6E6',
                  color: bagCharge == 10 ? '#1368EC' : 'white',
                }}
                onClick={() => {
                  if (bagCharge === 0) {
                    setBagCharge(10);
                  } else {
                    setBagCharge(0);
                  }
                }}
              >
              <SlHandbag style={{fontSize:'30px',marginTop:'20px'}} /> 
              <span style={{fontSize:'15px',marginTop:'15px'}}>₹10</span>
              <span style={{fontSize:'15px',}}>10Kg Bag</span>
            </div>

            <div 
                style={{
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  cursor:'pointer',
                  gap:'0px',
                  backgroundColor: bagCharge == 20 ? '#E3F3FF' : '#BCBCBC',
                  borderRadius: '8px',
                  padding: '20px 25px',
                  border: '1px solid #E6E6E6',
                  color: bagCharge == 20 ? '#1368EC' : 'white',
                }}
                onClick={() => {
                  if (bagCharge === 0) {
                    setBagCharge(20);
                  } else {
                    setBagCharge(0);
                  }
                }}
              >
              <PiShoppingBagThin style={{fontSize:'50px',marginTop:'10px'}} /> 
              <span style={{fontSize:'15px',marginTop:'10px'}}>₹20</span>
              <span style={{fontSize:'15px',}}>15Kg Bag</span>
            </div>

            <div 
                style={{
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  cursor:'pointer',
                  gap:'0px',
                  backgroundColor: bagCharge == 30 ? '#E3F3FF' : '#BCBCBC',
                  borderRadius: '8px',
                  padding: '20px 25px',
                  border: '1px solid #E6E6E6',
                  color: bagCharge == 30 ? '#1368EC' : 'white',
                }}
                onClick={() => {
                  if (bagCharge === 0) {
                    setBagCharge(30);
                  } else {
                    setBagCharge(0);
                  }
                }}
              >
              <PiBagThin style={{fontSize:'50px',marginTop:'10px'}} /> 
              <span style={{fontSize:'15px',marginTop:'10px'}}>₹30</span>
              <span style={{fontSize:'15px',}}>20Kg Bag</span>
            </div>
            </div>

          </div>
        </div>
        </>
      )}

      {/* upi popup */}
      {upipopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={UpiRef} style={{width:'400px',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px'}}>
            
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:'40px 0px'}}>
              <div style={{textAlign:'center'}}>
                <div>
                  <img src={Upi} alt="UPI" style={{width:'200px',marginTop:'10px'}} />
                </div>
                <div style={{width:'108%',marginTop:'10px',background:'linear-gradient(to right, #E3EDFF, #FFFFFF)',marginLeft:'-24px',marginRight:'-24px',padding:'10px 16px',}}>
                  <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',}}>
                    <span style={{fontSize:'20px',fontWeight:'600'}}>{companyData.companyName}</span>
                  </div>
                </div>
                <div style={{fontSize:'24px',fontWeight:'600',marginBottom:'20px',marginTop:'10px',color:'#1368EC'}}>
                  ₹{roundedAmount}.00
                </div>
                <div style={{margin:'auto',width:'50%',}}>
                <div style={{padding:'0px',border:'2px dashed #ccc',borderRadius:'8px',marginBottom:'20px'}}>
                  <img src={qrCodeUrl} alt="QR Code" style={{width:'100%',height:'100%'}} />
                </div>
                </div>
                <div 
                  style={{
                    padding:'12px 24px',
                    backgroundColor:'#1368EC',
                    color:'white',
                    borderRadius:'8px',
                    cursor:'pointer',
                    display:'inline-block'
                  }}
                  onClick={() => {
                    createPosSale('UPI', Number(roundedAmount), changeToReturn);
                    setUpiPopup(false);
                  }}
                >
                  Complete
                </div>
                <div>
                  <img src={Banks} alt="UPI" style={{width:'350px',marginTop:'20px'}} />
                </div>
              </div>
            </div>
            
          </div>
        </div>
        </>
      )}

      {/* transaction details popup */}
      {transactionpopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={TransactionRef} style={{width:'70vw',height:'auto',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px',position:'relative'}}>

              <div style={{ border: '1px solid #E1E1E1', padding: '5px 0px', borderRadius: '8px', alignItems: 'center', marginTop: '5px' }} >

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 20px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {searchdrop ? (
                      <>
                        <div style={{ border: 'none', marginLeft: '10px', alignItems: 'center', display: 'flex', width: '600px' }}>
                          <IoIosSearch style={{ fontSize: '25px' }} />
                          <input 
                            type='text' 
                            placeholder='Search by invoice ID, customer name, phone, or item name...' 
                            value={transactionSearchQuery}
                            onChange={(e) => handleTransactionSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '20px', width: '100%', color: '#333' }} 
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                          <div style={{ backgroundColor: '#ccc', color: 'black', padding: '5px 8px', borderRadius: '6px' }}>All</div>
                          <div style={{ color: 'black', padding: '5px 8px', }}>Recents</div>
                          <div style={{ color: 'black', padding: '5px 8px', }}>Paid</div>
                          <div style={{ color: 'black', padding: '5px 8px', }}>Due</div>
                    <div 
                      style={{ 
                        color: 'black', 
                        padding: '5px 8px', 
                        cursor: 'pointer',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px'
                      }}
                      onClick={() => fetchPosSales(currentPage, transactionSearchQuery)}
                      title="Refresh"
                    >
                      ↻
                    </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {searchdrop ? (
                      <></>) : (<>
                        <div style={{ color: 'black', padding: '3px 8px', borderRadius: '6px', border: '2px solid #ccc', display: 'flex', gap: '10px', alignItems: 'center', cursor:'pointer' }} value={searchdrop} onClick={handleSearchDropChange}>
                          <IoSearch />
                          <CgSortAz style={{ fontSize: '25px' }} />
                        </div>
                      </>)}
                    <div style={{ color: 'black', padding: '7px 8px', borderRadius: '6px', border: '2px solid #ccc', display: 'flex', gap: '10px', alignItems: 'center', cursor:'pointer' }} onClick={handleClear}><TbArrowsSort /></div>
                  </div>
                </div>

                {searchdrop ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', }}>

                      <div style={{ marginTop: "4px", display: 'flex', gap: '10px' }}>
                        <div style={{ border: '2px solid #ccc', padding: '1px 5px 0px 8px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}>
                          <div style={{ outline: 'none', border: 'none', color: '#555252' }}> Filter <CgSortAz style={{ fontSize: '30px' }} /></div>
                        </div>

                        <div
                          style={{ border: categoryValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 8px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
                          value={categoryValue}
                          onChange={handleCategoryChange}>
                          <select className="" style={{ outline: 'none', border: 'none', color: categoryValue ? '#1368EC' : '#555252' }}>
                            <option value="" style={{ color: '#555252' }}>Category</option>
                            <option value="c1" style={{ color: '#555252' }}>Category 1</option>
                            <option value="c2" style={{ color: '#555252' }}>Category 2</option>
                          </select>
                        </div>

                        <div
                          style={{ border: socketValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 8px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
                          value={socketValue}
                          onChange={handleSocketChange}>
                          <select className="" style={{ outline: 'none', border: 'none', color: socketValue ? '#1368EC' : '#555252' }}>
                            <option value="" style={{ color: '#555252' }}>Socket Level</option>
                            <option value="sl1" style={{ color: '#555252' }}>Last 7 days</option>
                          </select>
                        </div>

                        <div
                          style={{ border: warehouseValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 8px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
                          value={warehouseValue}
                          onChange={handleWarehouseChange}>
                          <select className="" style={{ outline: 'none', border: 'none', color: warehouseValue ? '#1368EC' : '#555252' }}>
                            <option value="" style={{ color: '#555252' }}>Warehouse</option>
                            <option value="wh1" style={{ color: '#555252' }}>Warehouse 1</option>
                          </select>
                        </div>

                        <div
                          style={{ border: exprationValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 3px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
                          value={exprationValue}
                          onChange={handleExprationChange}>
                          <select className="" style={{ outline: 'none', border: 'none', color: exprationValue ? '#1368EC' : '#555252' }}>
                            <option value="" style={{ color: '#555252' }}>Expiration</option>
                            <option value="e1" style={{ color: '#555252' }}>Expiration 1</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ color: 'black', padding: '2px 8px', borderRadius: '6px', border: '2px solid #ccc', display: 'flex', alignItems: 'center', cursor:'pointer' }}>
                        <span>Clear</span>
                      </div>

                    </div>
                  </>
                ) : (<></>)}

              </div>

            <div style={{border:'1px solid #ccc',marginTop:'10px',borderRadius:'8px',height:'60vh',overflowY:'auto'}}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#E6E6E6' }}>
                    <tr style={{ color: "#676767", }}>
                      <th style={{ padding: '8px', borderTopLeftRadius: '8px' }}>Invoice ID</th>
                      <th>Customer</th>
                      <th>Sold Items</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Total Amount</th>
                      <th>Due Amount</th>
                      <th style={{ borderTopRightRadius: '8px' }}>Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                          Loading...
                        </td>
                    </tr>
                    ) : posSales.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      posSales.map((sale) => (
                        <tr key={sale._id} style={{ borderTop: '1px solid #E6E6E6' }}>
                          <td style={{ padding: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#1368EC' }}>
                              {sale.invoiceNumber || 'N/A'}
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <div>
                              <div style={{ fontWeight: '600' }}>{sale.customer?.name || 'N/A'}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>{sale.customer?.phone || 'N/A'}</div>
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ fontSize: '12px' }}>
                              {sale.items?.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  {item.images && item.images.length > 0 ? (
                                    <img 
                                      src={item.images[0]} 
                                      alt={item.productName} 
                                      style={{ 
                                        width: '30px', 
                                        height: '30px', 
                                        objectFit: 'cover', 
                                        borderRadius: '4px',
                                        border: '1px solid #ddd'
                                      }} 
                                    />
                                  ) : null}
                                  <div>
                                    <div style={{ fontWeight: '500' }}>{item.productName || 'N/A'}</div>
                                    <div style={{ fontSize: '11px', color: '#666' }}>
                                      Qty: {item.quantity} × ₹{item.unitPrice?.toFixed(2) || '0.00'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            {new Date(sale.saleDate).toLocaleDateString('en-IN')}
                            <br />
                            <span style={{ fontSize: '12px', color: '#666' }}>
                              {new Date(sale.saleDate).toLocaleTimeString('en-IN')}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: sale.status === 'Paid' ? '#d4edda' : 
                                               sale.status === 'Due' ? '#fff3cd' : '#f8d7da',
                              color: sale.status === 'Paid' ? '#155724' : 
                                     sale.status === 'Due' ? '#856404' : '#721c24',
                              fontSize: '12px'
                            }}>
                              {sale.status}
                            </span>
                          </td>
                          <td>₹{sale.totals?.totalAmount?.toFixed(2) || '0.00'}</td>
                          <td>
                            {sale.paymentDetails?.dueAmount > 0 ? (
                              <span style={{ color: '#dc3545', fontWeight: '600' }}>
                                ₹{sale.paymentDetails.dueAmount.toFixed(2)}
                              </span>
                            ) : (
                              <span style={{ color: '#28a745' }}>₹0.00</span>
                            )}
                          </td>
                          <td>{sale.paymentDetails?.paymentMethod || 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
            </div>

            <div style={{display:'flex',justifyContent:'end',marginTop:'10px',padding:'0px 10px',gap:'10px',}}>
              <div
              style={{
                padding: "6px 12px",
                borderRadius: "5px",
                border: "1px solid #E6E6E6",
                backgroundColor: "#FFFFFF",
                color: "#333",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
              }}
              >
                10 per page
              </div>
              <div
              style={{
                padding: "6px 12px",
                borderRadius: "5px",
                border: "1px solid #E6E6E6",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                color: "#333",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
              }}
              >
                <span>{((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, totalSales)} of {totalSales}</span> 
                <span style={{color:'#ccc'}}>|</span> 
                <IoIosArrowBack 
                  style={{
                    color: currentPage > 1 ? '#333' : '#ccc',
                    cursor: currentPage > 1 ? "pointer" : "not-allowed"
                  }} 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                /> 
                <IoIosArrowForward 
                  style={{
                    color: currentPage < totalPages ? '#333' : '#ccc',
                    cursor: currentPage < totalPages ? "pointer" : "not-allowed"
                  }}
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                />
              </div>
            </div>

          </div>
        </div>
        </>
      )}

      {/* add customer popup */}
      {addcustomerpopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={AddCustomerRef} style={{width:'70vw',height:'auto',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px',position:'relative',}}>

            <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #E1E1E1',padding:'10px 0px'}}>
              <span>Add Customers details</span>
            </div>
            
            <form onSubmit={handleSubmit}>
            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
              <div style={{width:'100%'}}>
                <div>Customer Number <span style={{color:'red'}}>*</span></div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'#F9FAFB',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="text" placeholder='Enter Customer Name' style={{border:'none',outline:'none',width:'100%',backgroundColor:'#F9FAFB'}} name="name" value={form.name} onChange={handleInputChange} required />
                </div>
              </div>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',gap:'15px'}}>
                <div style={{width:'100%'}}>
                <div>Mobile Number <span style={{color:'red'}}>*</span></div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'#F9FAFB',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input 
                  type="number" 
                  placeholder='Enter Mobile Number' 
                  style={{border:'none',outline:'none',width:'100%',backgroundColor:'#F9FAFB'}} 
                  name="phone" 
                  value={form.phone} 
                  onChange={(e) => {
                    // allow only digits and limit to 10
                    const value = e.target.value.replace(/\D/g, ""); 
                    if (value.length <= 10) {
                      handleInputChange(e);
                    }
                  }}
                  maxLength={10} 
                  required 
                  />
                </div>
                </div>
                <div style={{width:'100%'}}>
                <div>Email Id</div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'#F9FAFB',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="email" placeholder='Enter Email Id' style={{border:'none',outline:'none',width:'100%',backgroundColor:'#F9FAFB'}} name="email" value={form.email} onChange={handleInputChange} />
                </div>
                </div>
              </div>
            </div>

            {/* address */}
            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
              <div style={{width:'100%'}}>
                <div>Address</div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'#F9FAFB',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <textarea type="text" placeholder='Enter Customer Address...' style={{border:'none',outline:'none',width:'100%',backgroundColor:'#F9FAFB'}} ></textarea>
                </div>
              </div>
            </div>

              {/* select country , state, pin */}
              <div style={{ display: "flex", gap: "16px",marginBottom:'10px' }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      color: "#262626",
                      fontWeight: "400",
                      fontSize: "16px",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      // setCountry(e.target.value)
                      const value = e.target.value;
                      setSelectedCountry(value);
                      setFormData((prev) => ({
                        ...prev,
                        companycountry: value,
                        companystate: "",
                        companycity: "",
                      }));

                      setSelectedState(""), setSelectedCity("");
                    }}
                    //
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      backgroundColor: "#F9FAFB",
                      color: "#6B7280",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select Country</option>
                    {countryList.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* {console.log("statelist",stateList)} */}
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      color: "#262626",
                      fontWeight: "400",
                      fontSize: "16px",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedState(value);
                      setFormData((prev) => ({
                        ...prev,
                        companystate: value,
                        companycity: "",
                      }));
                      setSelectedCity("");
                    }}
                    disabled={!selectedCountry}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      backgroundColor: "#F9FAFB",
                      color: "#6B7280",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select State</option>

                    {stateList.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                    {/* <option value="California">California</option>
              <option value="Maharashtra">Maharashtra</option> */}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      color: "#262626",
                      fontWeight: "400",
                      fontSize: "16px",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    City
                  </label>
                  <select
                    // value={city}
                    // onChange={(e) => setCity(e.target.value)}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      backgroundColor: "#F9FAFB",
                      color: "#6B7280",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select City</option>
                    {/* <option value="Los Angeles">Los Angeles</option>
              <option value="Mumbai">Mumbai</option> */}
                    {cityList.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      color: "#262626",
                      fontWeight: "400",
                      fontSize: "16px",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Pin Code
                  </label>

                  <input
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    type="number"
                    placeholder='123456'
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      backgroundColor: "#F9FAFB",
                      color: "#6B7280",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* buttons */}
              <div style={{display:'flex',justifyContent:'end',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
                <button type="submit" disabled={loading} style={{padding:'3px 10px',backgroundColor:'#1368EC',border:'2px solid #E6E6E6',borderRadius:'8px',color:'white',cursor:'pointer'}}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>

          </div>
        </div>
        </>
      )}

      {/* product discount change popup */}
      {discountpopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={DiscountRef} style={{width:'700px',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px'}}>
            
    {/* selected item image, name, sku, quantity available, mrp */}
    <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #E1E1E1',padding:'10px 0px'}}>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '15px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'white',
            width: '80px',
            height: '80px',
            alignItems: 'center',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid #E6E6E6',
          }}
        >
          {selectedItemForDiscount.images &&
          selectedItemForDiscount.images.length > 0 &&
          selectedItemForDiscount.images[0] ? (
            <img
              src={selectedItemForDiscount.images[0].url || selectedItemForDiscount.images[0]}
              alt={selectedItemForDiscount.productName}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            style={{
              display:
                selectedItemForDiscount.images &&
                selectedItemForDiscount.images.length > 0 &&
                selectedItemForDiscount.images[0]
                  ? 'none'
                  : 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ccc',
              fontSize: '24px',
            }}
          >
            <span style={{ fontSize: '10px' }}>No Image</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: 'black',fontWeight:'600',fontSize:'20px' }}>{selectedItemForDiscount?.productName || 'N/A'}</span>
          </div>
          <div style={{display:'flex',gap:'15px',justifyContent:'space-around',alignItems:'center'}}>
          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: '#676767' }}>SKU: </span>
            <span>{selectedItemForDiscount.sku || 'N/A'}</span>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: '#676767' }}>Qty Available: </span>
            <span>
              {(() => {
                // Fallback to products array
                const product = products.find(p => p._id === selectedItemForDiscount._id);
                return product ? product.quantity : 'N/A';
              })()}
            </span>
            <span>
              {(() => {
                // Fallback to products array
                const product = products.find(p => p._id === selectedItemForDiscount._id);
                return product ? product.unit : 'N/A';
              })()}
            </span>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: '#676767' }}>Rate: </span>
            <span>₹{selectedItemForDiscount.sellingPrice} /-</span>
          </div>
          </div>
        </div>
      </div>
    </div>

            {/* quantity */}
            <div style={{width:'100%',display:'flex',justifyContent:'space-between',gap:'50px',marginTop:'15px'}}>
              <div style={{width:'50%',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'25px',fontWeight:'500'}}>Quantity</span>
              </div>
              <div style={{width:'25%',display:'flex',justifyContent:'center',padding:'10px 0px',gap:'15px',marginTop:'2px',alignItems:'center'}}>
              </div>
              <div style={{width:'25%',display:'flex',justifyContent:'center',padding:'10px 0px',gap:'15px',marginTop:'2px',alignItems:'center'}}>
              <button 
                style={{borderRadius:'8px',border: discountQuantity <= 1 ? '1px solid #E6E6E6' : '1px solid #E6E6E6',backgroundColor: discountQuantity <= 1 ? 'white' : '#F9FAFB',display:'flex',alignItems:'center',justifyContent:'center',padding:'5px 12px',
                  cursor: discountQuantity <= 1 ? 'not-allowed' : 'pointer',}}
                onClick={() => handleQuantityChange(discountQuantity - 1)}
                disabled={discountQuantity <= 1}
              >
                -
              </button>

              <div><span>{discountQuantity}</span></div>

              <button 
                style={{
                  borderRadius:'8px',border:'1px solid #E6E6E6',backgroundColor:'#F9FAFB',display:'flex',alignItems:'center',justifyContent:'center',padding:'5px 12px',
                  cursor: discountQuantity >= (selectedItemForDiscount.availableQuantity || 0) ? 'not-allowed' : 'pointer',
                }}
                onClick={() => handleQuantityChange(discountQuantity + 1)}
                disabled={discountQuantity >= (selectedItemForDiscount.availableQuantity || 0)}
              >
                +
              </button>
              </div>
            </div>

            {/* discount */}
            <div style={{width:'100%',display:'flex',justifyContent:'space-between'}}>
              <div style={{width:'50%',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'25px',fontWeight:'500'}}>Discount</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'50%',gap:'15px',marginTop:'2px',alignItems:'center'}}>
              <div style={{width:'100%',borderRadius:'8px',border:'1px solid #E6E6E6',backgroundColor:'#F9FAFB',display:'flex',alignItems:'center',}}>
                <div style={{display:'flex',justifyContent:'center',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',borderRight:'1px solid #E6E6E6',width:'70%'}}>
                  <input 
                    type="number" 
                    placeholder="00.00" 
                    value={discountPercentage}
                    onChange={(e) => handleDiscountPercentageChange(e.target.value)}
                    style={{border:'none',outline:'none',width:'100%',backgroundColor:'white'}} 
                  />
                </div>
                <div style={{display:'flex',alignItems:'center',width:'30%',justifyContent:'center',}}>
                  <span>%</span>
                </div>
              </div>

              <div><span>or</span></div>

              <div style={{width:'100%',borderRadius:'8px',border:'1px solid #E6E6E6',backgroundColor:'#F9FAFB',display:'flex',alignItems:'center',}}>
                <div style={{display:'flex',justifyContent:'center',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',borderRight:'1px solid #E6E6E6',width:'70%'}}>
                  <input 
                    type="number" 
                    placeholder="00.00" 
                    value={discountFixed}
                    onChange={(e) => handleDiscountFixedChange(e.target.value)}
                    style={{border:'none',outline:'none',width:'100%',backgroundColor:'white'}} 
                  />
                </div>
                <div style={{display:'flex',alignItems:'center',width:'30%',justifyContent:'center',}}>
                  <span>₹</span>
                </div>
              </div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',marginTop:'20px',marginBottom:'8px'}}>
              <div></div>
              <div 
                style={{padding:'3px 10px',backgroundColor:'#1368EC',border:'2px solid #E6E6E6',borderRadius:'8px',color:'white',cursor:'pointer'}}
                onClick={applyDiscountChanges}
              >
                <span>Apply</span>
              </div>
            </div>

          </div>
        </div>
        </>
      )}

      {/* paymentpopup */}
      {paymentpopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={PaymentRef} style={{width:'400px',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px'}}>
            
            <div style={{display:'flex',justifyContent:'center',borderBottom:'1px solid #E1E1E1',padding:'10px 0px',alignContent:'center'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
                <img src={PaymentDone} alt="product" style={{width:'150px',height:'150px',objectFit:'cover',borderRadius:'8px'}} />
                <span>Payment Successful</span>
              </div>
            </div>

            {/* invoice & payment mode */}
            <div style={{width:'100%'}}>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'10px'}}>
                <span>Invoice no.</span>
                <span>{selectedSale?.invoiceNumber || 'N/A'}</span>
              </div>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                <span>Payment Mode</span>
                <span>{selectedSale?.paymentDetails?.paymentMethod || 'N/A'}</span>
              </div>
            </div>

            {/* Products summery */}
            <div style={{width:'108%',marginTop:'20px',background:'linear-gradient(to right, #E3EDFF, #FFFFFF)',marginLeft:'-16px',marginRight:'-16px',padding:'10px 16px',}}>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'10px'}}>
                <span style={{fontSize:'20px',fontWeight:'600'}}>Payment Summary</span>
              </div>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'10px'}}>
                <span>Total Amount</span>
                <span>₹{selectedSale?.totals?.totalAmount || '0.00'}</span>
              </div>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                <span>Amount Received</span>
                <span>₹{selectedSale?.paymentDetails?.amountReceived?.toFixed(2) || '0.00'}</span>
              </div>
              {selectedSale?.paymentDetails?.changeReturned > 0 && (
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                <span>Amount Returned</span>
                <span>₹{selectedSale?.paymentDetails?.changeReturned?.toFixed(2) || '0.00'}</span>
              </div>
              )}
              {(selectedSale?.totals?.totalAmount)-(selectedSale?.paymentDetails?.amountReceived?.toFixed(2)) > 0 && (
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                <span>Amount Due</span>
                <span>₹{(selectedSale?.totals?.totalAmount)-(selectedSale?.paymentDetails?.amountReceived?.toFixed(2))}</span>
              </div>
              )}
              {/* {selectedSale?.paymentDetails?.bagCharge > 0 && (
                <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                  <span>Bag Charge</span>
                  <span>₹{selectedSale?.paymentDetails?.bagCharge?.toFixed(2) || '0.00'}</span>
                </div>
              )} */}
            </div>

            {/* customer details */}
            <div style={{width:'100%',marginTop:'20px'}}>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'10px'}}>
                <span style={{fontSize:'20px',fontWeight:'600'}}>Customer</span>
              </div>
              <div style={{width:'100%',display:'flex',alignItems:'center',marginTop:'10px',gap:'5px'}}>
                <span>Name:</span>
                <span style={{fontWeight:'600'}}>{selectedSale?.customer?.name || 'N/A'}</span>
              </div>
              <div style={{width:'100%',display:'flex',alignItems:'center',marginTop:'2px',gap:'5px'}}>
                <span style={{color:'#676767'}}>Phone:</span>
                <span style={{fontWeight:'600'}}>{selectedSale?.customer?.phone || 'N/A'}</span>
              </div>
              {/* {selectedSale?.customer?.email && (
                <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                  <span style={{color:'#676767'}}>Email:</span>
                  <span style={{fontWeight:'600'}}>{selectedSale?.customer?.email}</span>
                </div>
              )} */}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '8px', gap: '20px' }}>
              <div
                style={{
                  padding: '3px 10px',
                  backgroundColor: isGenerating ? '#ccc' : '#E3F3FF',
                  border: '2px solid #BBE1FF',
                  borderRadius: '8px',
                  color: isGenerating ? '#666' : '#1368EC',
                  display: 'flex',
                  gap: '5px',
                  alignItems: 'center',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                }}
                onClick={isGenerating ? null : () => {
                  setInvoicePopup(true); // Open invoice popup
                  setTimeout(() => handleInvoicePrint(), 100); // Delay to ensure DOM rendering
                }}
              >
                <span><MdPrint /></span>
                <span>{isGenerating ? 'Generating...' : 'Print'}</span>
              </div>
              <div
                style={{
                  padding: '3px 10px',
                  backgroundColor: isGenerating ? '#ccc' : '#1368EC',
                  border: '2px solid #E6E6E6',
                  borderRadius: '8px',
                  color: 'white',
                  display: 'flex',
                  gap: '5px',
                  alignItems: 'center',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                }}
                onClick={isGenerating ? null : () => {
                  setInvoicePopup(true); // Open invoice popup
                  setTimeout(() => handleDownloadPDF(), 100); // Delay to ensure DOM rendering
                }}
              >
                <span><AiOutlineDownload /></span>
                <span>{isGenerating ? 'Generating...' : 'Download'}</span>
              </div>
            </div>

            {/* create new invoice */}
            <div style={{width:'108%',marginTop:'20px',marginLeft:'-16px',marginRight:'-16px',padding:'15px 16px',borderTop:'1px solid #E1E1E1',display:'flex',justifyContent:'center'}}>
              <div 
                style={{
                  padding:'3px 10px',
                  backgroundColor:'#E3F3FF',
                  border:'2px solid #BBE1FF',
                  borderRadius:'8px',
                  color:'#1368EC',
                  display:'flex',
                  gap:'5px',
                  alignItems:'center',
                  cursor:'pointer'
                }}
                                  onClick={() => {
                    setPaymentPopup(false);
                    setSelectedSale(null);
                    // Reset all form data
                    setSelectedItems([]);
                    setSelectedCustomer(null);
                    setBagCharge(0);
                    setAmountReceived('');
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowDropdown(false);
                    // Reset totals
                    setSubTotal(0);
                    setTotalAmount(0);
                    setRoundedAmount(0);
                    setTotalTax(0);
                    setTotalItems(0);
                    setTotalQuantity(0);
                    setDiscount(0);
                    // Close all popups
                    setCashPopup(false);
                    setCardPopup(false);
                    setUpiPopup(false);
                    // Refresh transactions
                    fetchPosSales();
                    // Reset category filter
                    setSelectedCategory(null);
                    setProducts(allProducts);
                    // Reset updown state
                    setUpdown(false);
                    // Reset search drop state
                    setSearchDrop(false);
                    // Reset filter values
                    setCategoryValue('');
                    setSocketValue('');
                    setWarehouseValue('');
                    setExprationValue('');
                    // Reset OTP state
                    setOtp(['', '', '', '']);
                    // Reset address fields
                    setCountry('');
                    setState('');
                    setCity('');
                    setPinCode('');
                    setSelectedCountry('');
                    setSelectedState('');
                    setSelectedCity('');
                    // Reset form data
                    if (formRef.current) {
                      formRef.current.reset();
                    }
                    // Reset active tabs
                    const initialTabs = allProducts.reduce((acc, product) => {
                      acc[product._id] = "general";
                      return acc;
                    }, {});
                    setActiveTabs(initialTabs);
                    // Reset search query
                    setSearchQuery('');
                    // Reset search results
                    setSearchResults([]);
                    setShowDropdown(false);
                    // Reset popup states
                    setPopup(false);
                    setAddCustomerPopup(false);
                    setDiscountPopup(false);
                    // Reset transaction popup
                    setTransactionPopup(false);
                    // Reset selected sale
                    setSelectedSale(null);
                    // Reset current page
                    setCurrentPage(1);
                    // Reset total pages
                    setTotalPages(1);
                    // Reset total sales
                    setTotalSales(0);
                    // Reset loading state
                    setLoading(false);
                    // Reset pos sales
                    setPosSales([]);
                    // Reset amount received
                    setAmountReceived('');
                    // Reset search query
                    setSearchQuery('');
                    // Reset search results
                    setSearchResults([]);
                    setShowDropdown(false);
                    // Reset popup states
                    setPopup(false);
                    setAddCustomerPopup(false);
                    setDiscountPopup(false);
                    // Reset transaction popup
                    setTransactionPopup(false);
                    // Reset selected sale
                    setSelectedSale(null);
                    // Reset current page
                    setCurrentPage(1);
                    // Reset total pages
                    setTotalPages(1);
                    // Reset total sales
                    setTotalSales(0);
                    // Reset loading state
                    setLoading(false);
                    // Reset pos sales
                    setPosSales([]);
                    // Reset amount received
                    setAmountReceived('');
                  }}
              >
                <span><IoMdAdd/></span>
                <span>Create New Invoice</span>
              </div>
            </div>

          </div>
        </div>
        </>
      )}

      {/* paymentpopup */}
      {invoicepopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={InvoiceRef} style={{width:'450px',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px',fontSize:'13px'}}>
            
            <div style={{display:'flex',justifyContent:'center',padding:'10px 0px',alignContent:'center'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
                <span>{companyData.companyName}</span>
                <span>{companyData.companyaddress}</span>
                <span>Phone - {companyData.companyphone}</span>
                <span>{companyData.companyemail}</span>
                <span>GST No. - {companyData.gstin}</span>
              </div>
            </div>
            
            <div style={{display:'flex',justifyContent:'center',padding:'10px 0px',alignContent:'center',borderBottom:'1px solid #E1E1E1'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
                <span>Tax Invoice</span>
                <span>Customer Copy</span>
                <span>TAKEAWAY</span>
              </div>
            </div>

            {/* invoice & payment mode */}
            <div style={{width:'100%',borderBottom:'1px solid #E1E1E1',paddingBottom:'10px',marginTop:'10px'}}>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'10px',}}>
                <span>Invoice - {selectedSale?.invoiceNumber || 'N/A'}</span>
                <span>{selectedSale?.saleDate || 'N/A'}</span>
              </div>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                <span>Payment Mode - {selectedSale?.paymentDetails?.paymentMethod || 'N/A'}</span>
                <span>Status - {selectedSale?.status || 'N/A'}</span>
              </div>
            </div>

            <div style={{width:'100%',marginTop:'10px',padding:'10px 16px',borderBottom:'1px solid #E1E1E1',}}>
              <table style={{width:'100%',marginTop:'10px',borderCollapse:'collapse',marginBottom:'10px'}}>
                <thead>
                  <tr>
                    <th style={{borderBottom:'1px solid #E1E1E1',textAlign:'left',paddingBottom:'5px'}}>Name</th>
                    <th style={{borderBottom:'1px solid #E1E1E1',textAlign:'left',paddingBottom:'5px'}}>Quantity</th>
                    <th style={{borderBottom:'1px solid #E1E1E1',textAlign:'left',paddingBottom:'5px'}}>Price / unit</th>
                    <th style={{borderBottom:'1px solid #E1E1E1',textAlign:'right',paddingBottom:'5px'}}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale?.items?.map((item, index) => (
                <tr key={index} style={{ }}>
                  <td style={{textAlign:'left'}}>{item.productName}</td>
                  <td style={{textAlign:'left'}}>{item.quantity} {item.unit}</td>
                  <td style={{textAlign:'left'}}>₹{item.unitPrice}</td>
                  <td style={{textAlign:'right'}}>₹{item.totalPrice?.toFixed(2)}</td>
                </tr>
                ))}
                </tbody>
              </table>
            </div>

            {/* Products summery */}
            <div style={{width:'100%',marginTop:'10px',padding:'10px 16px',}}>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'10px'}}>
                <span style={{fontSize:'20px',fontWeight:'600'}}>Payment Summary</span>
              </div>
              {selectedSale?.paymentDetails?.bagCharge > 0 && (
                <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                  <span>Bag Charge</span>
                  <span>₹{selectedSale?.paymentDetails?.bagCharge?.toFixed(2) || '0.00'}</span>
                </div>
              )}
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                <span>Total Discount</span>
                <span>₹{totalDiscountinvoice.toFixed(2)}</span>
              </div>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                <span>Total Tax</span>
                <span>₹{totalTaxinvoice.toFixed(2)}</span>
              </div>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                <span>Total Amount</span>
                <span>₹{selectedSale?.totals?.totalAmount || '0.00'}</span>
              </div>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'5px'}}>
                <span>Amount Received</span>
                <span>₹{selectedSale?.paymentDetails?.amountReceived?.toFixed(2) || '0.00'}</span>
              </div>
              {selectedSale?.paymentDetails?.changeReturned > 0 && (
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                <span>Amount Returned</span>
                <span>₹{selectedSale?.paymentDetails?.changeReturned?.toFixed(2) || '0.00'}</span>
              </div>
              )}
              {(selectedSale?.totals?.totalAmount)-(selectedSale?.paymentDetails?.amountReceived?.toFixed(2)) > 0 && (
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                <span>Amount Due</span>
                <span>₹{(selectedSale?.totals?.totalAmount)-(selectedSale?.paymentDetails?.amountReceived?.toFixed(2))}</span>
              </div>
              )}
            </div>

            {/* customer details */}
            <div style={{width:'100%',marginTop:'10px',borderBottom:'1px solid #E1E1E1',padding:'10px 16px',marginBottom:'0px'}}>
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'10px'}}>
                <span style={{fontSize:'20px',fontWeight:'600'}}>Customer Details</span>
              </div>
              <div style={{width:'100%',display:'flex',alignItems:'center',marginTop:'10px',gap:'5px',justifyContent:'space-between'}}>
                <span>Name:</span>
                <span style={{fontWeight:'600'}}>{selectedSale?.customer?.name || 'N/A'}</span>
              </div>
              <div style={{width:'100%',display:'flex',alignItems:'center',marginTop:'2px',gap:'5px',marginBottom:'20px',justifyContent:'space-between'}}>
                <span>Phone:</span>
                <span style={{fontWeight:'600'}}>{selectedSale?.customer?.phone || 'N/A'}</span>
              </div>
            </div>

            
            <div style={{display:'flex',justifyContent:'center',borderBottom:'1px solid #E1E1E1',padding:'10px 0px',alignContent:'center',marginBottom:'10px'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
                <span>Thank You for Visiting {companyData.companyName}</span>
                <span>Have a Nice Day</span>
              </div>
            </div>

          </div>
        </div>
        </>
      )}

    </div>
    
  )
}

export default Pos