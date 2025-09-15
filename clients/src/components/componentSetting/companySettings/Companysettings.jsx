//
import React, { useRef, useState, useEffect } from "react";
import { BiBuilding } from "react-icons/bi";
// import company_icon from "../../../assets/images/upload.webP";
import { HiOutlineUpload } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import "./Compansettings.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { Country, State, City } from "country-state-city"
import BASE_URL from "../../../pages/config/config";
import CompyIc from "../../../assets/images/cmnyi.png";
import CompyLg from "../../../assets/images/cmnyp.png";

const Companysettings = () => {
  // for country, state, city
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const token = localStorage.getItem("token")
  const [isUpdating, setIsUpdating] = useState(false);

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
  const [imageFiles, setImageFiles] = useState({
    companyIcon: null,
    companyFavicon: null,
    companyLogo: null,
    companyDarkLogo: null,
  });

  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchCompanyProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/companyprofile/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched company profile data:", res.data);
      const profile = res.data.data;
      if (profile) {
        setFormData({
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
        });
        //set dependent dropdown
        setSelectedCountry(profile.companycountry || "");
        setSelectedState(profile.companystate || "");
        setSelectedCity(profile.companycity || "");

        setIsUpdating(true);
      }
    } catch (error) {
      toast.error("No existing company profile or error fetching it:", error);
    }
  };
  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const gstinRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;
  const cinRegex = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gstinRegex.test(formData.gstin)) {
      toast.error("Invalid GSTIN format");
      return;
    }
    if (!cinRegex.test(formData.cin)) {
      toast.error("Invalid CIN format");
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    if (imageFiles.companyIcon)
      form.append("companyIcon", imageFiles.companyIcon);
    if (imageFiles.companyFavicon)
      form.append("companyFavicon", imageFiles.companyFavicon);
    if (imageFiles.companyLogo)
      form.append("companyLogo", imageFiles.companyLogo);
    if (imageFiles.companyDarkLogo)
      form.append("companyDarkLogo", imageFiles.companyDarkLogo);

    try {
      const res = await axios.post(`${BASE_URL}/api/companyprofile/send`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Form Data", formData);
      localStorage.setItem("companyinfo", JSON.stringify(formData));
      if (res.status === 200 || res.status === 201) {
        toast.success(
          `Company Profile ${isUpdating ? "updated" : "created"} successfully`,
          {
            position: "top-center",
          }
        );
        await fetchCompanyProfile();
      }
    } catch (error) {
      toast.error("Error while saving company info", error);
    }
  };

  const companyimageData = [
    {
      field: "companyIcon",
      label: "Company Icon",
      description: "Upload Icon of your Company",
      image: CompyIc,
    },
    {
      field: "companyFavicon",
      label: "Favicon",
      description: "Upload Favicon of your Company",
      image: CompyLg,
    },
    {
      field: "companyLogo",
      label: "Company Logo",
      description: "Upload Logo of your Company",
      image: CompyLg,
    },
    {
      field: "companyDarkLogo",
      label: "Company Dark Logo",
      description: "Upload Dark Logo of your Company",
      image: CompyLg,
    },
  ];

  return (
    <div>
      <div className="company-settings-container">
        <form onSubmit={handleSubmit}>
          <div className="cmmpyprofilesettinng" style={{ padding: '10px 10px 0px 10px' }}>
            <div>
              <h1 className="cfnnysthead">Company Settings</h1>
              <hr style={{ margin: "5px", height: "1px", color: "#bdbdbdff" }} />
            </div>

            <div className="company-info pt-1 pb-3">
              <div
                className="company-info-input"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  padding: "10px 0",
                }}
              >
                <div style={{ display: "flex", gap: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      Company Name
                    </label>
                    <input
                      className="cfnnystheadinput"
                      type="text"
                      placeholder="Enter company name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      Company Email{" "}
                    </label>
                    <input
                      className="cfnnystheadinput"
                      type="email"
                      placeholder="Enter company email"
                      name="companyemail"
                      value={formData.companyemail}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      Company Phone
                    </label>
                    <input
                      className="cfnnystheadinput"
                      type="text"
                      placeholder="Enetr company number"
                      name="companyphone"
                      value={formData.companyphone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      Fax
                    </label>
                    <input
                      className="cfnnystheadinput"
                      type="text"
                      placeholder="Fax"
                      name="companyfax"
                      value={formData.companyfax}
                      onChange={handleChange}
                      maxLength="10"
                      pattern="\d{10}"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      Website
                    </label>
                    <input
                      className="cfnnystheadinput"
                      type="url"
                      placeholder="Website"
                      name="companywebsite"
                      value={formData.companywebsite}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      GSTIN
                    </label>
                    <input
                      className="cfnnystheadinput"
                      type="text"
                      placeholder="Enter GSTIN (e.g., 27ABCDE1234F1Z5)"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      maxLength={15}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      CIN
                    </label>
                    <input
                      className="cfnnystheadinput"
                      type="text"
                      placeholder="Enter CIN (e.g., U12345MH2000PTC123456)"
                      name="cin"
                      value={formData.cin}
                      onChange={handleChange}
                      maxLength={21}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    width: "100%",
                  }}
                >
                  <label
                    className="cfnnystheadlabel"
                    htmlFor=""
                    style={{ fontWeight: "400" }}
                  >
                    Company Description
                  </label>
                  <textarea
                    rows="4"
                    cols="50"
                    className="cfnnystheadinput"
                    type="text"
                    placeholder="Description"
                    name="companydescription"
                    value={formData.companydescription}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="cmmpyprofilesettinng" style={{ padding: '10px 10px 0px 10px' }}>
            <div className="">
              <div>
                <h1 className="cfnnysthead">Company Information</h1>
                <hr
                  style={{ margin: "5px", height: "1px", color: "#bdbdbdff" }}
                />
              </div>
              <div
                className="company-info-input"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  padding: "10px 0",
                }}
              >
                <div style={{ display: "flex", gap: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      Address
                    </label>
                    <textarea
                      className="cfnnystheadinput"
                      rows="4"
                      cols="50"
                      type="text"
                      placeholder="Enter company address"
                      name="companyaddress"
                      value={formData.companyaddress}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <div className="cntryprfle">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      Country
                    </label>
                    <select
                      className="cfnnystheadinput"
                      value={selectedCountry}
                      onChange={(e) => {
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
                    >
                      <option value="">Select Country</option>
                      {countryList.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      State
                    </label>
                    <select
                      className="cfnnystheadinput"
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
                    >
                      <option value="">Select State</option>
                      {stateList.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      City
                    </label>
                    <select
                      className="cfnnystheadinput"
                      value={selectedCity}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedCity(value);
                        setFormData((prev) => ({
                          ...prev,
                          companycity: value,
                        }));
                      }}
                      disabled={!selectedState}
                    >
                      <option value="">Select City</option>
                      {cityList.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <label
                      className="cfnnystheadlabel"
                      htmlFor=""
                      style={{ fontWeight: "400" }}
                    >
                      Postal Code
                    </label>
                    <input
                      type="number"
                      className="cfnnystheadinput"
                      placeholder="Type Pin Code"
                      name="companypostalcode"
                      value={formData.companypostalcode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cmmpyprofilesettinng" style={{ padding: '10px 10px 5px 10px' }}>
            <div className="company-images">
              <div>
                <h1 className="cfnnysthead">Branding</h1>
                <hr
                  style={{ margin: "5px", height: "1px", color: "#bdbdbdff" }}
                />
              </div>
              {companyimageData.map((item, index) => (
                <div
                  key={index}
                  className="company-images-content"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px 10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: " #F1F1F1",
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      <img
                        src={item.image}
                        alt="itmimg"
                        style={{ width: 20, height: 20, objectFit: "contain" }}
                      />
                    </span>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span className="cfnnystheadlabel">{item.label}</span>
                      <span className="cfnnystheadlabeldesc">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed rgb(211, 211, 211)",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        padding: "5px",
                        position: "relative",
                        backgroundColor: "#f1f1f1ff",
                      }}
                    >
                      {imageFiles[item.field] ? (
                        <img
                          src={URL.createObjectURL(imageFiles[item.field])}
                          alt="preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : formData[item.field] ? (
                        <img
                          src={`${BASE_URL}/uploads/${formData[item.field]}`}
                          alt="saved"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span
                          onClick={() =>
                            setImageFiles((prev) => ({
                              ...prev,
                              [item.field]: null,
                            }))
                          }
                          style={{ color: "#1368EC" }}
                        >
                          +
                        </span>
                      )}
                      {/* <div
                      onClick={() =>
                        setImageFiles((prev) => ({
                          ...prev,
                          [item.field]: null
                        }))
                      }
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "5px",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "5px",
                        position: "absolute",
                        top: "10%",
                        right: "10%",
                        cursor: "pointer",
                      }}
                    >
                      <RxCross2 />
                    </div> */}
                    </div>
                    <div>
                      <label htmlFor={item.field}>
                        <div
                          className="company-images-upload-btn"
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          Change
                        </div>
                      </label>
                      <input
                        id={item.field}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const maxSize = 1 * 1024 * 1024;
                            if (file.size > maxSize) {
                              toast.error(
                                "File size must be less than or equal to 1MB"
                              );
                              return;
                            }
                            setImageFiles((prev) => ({
                              ...prev,
                              [item.field]: file,
                            }));
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{ display: "flex", justifyContent: "end", gap: "10px" }}
            >
              <button
                type="submit"
                style={{
                  border: "1px solid #E6E6E6",
                  borderRadius: "4px",
                  padding: "8px",
                  backgroundColor: "#FFFFFF",
                  color: "#676767",
                  borderRadius: "5px",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  border: "1px solid #676767",
                  borderRadius: "4px",
                  padding: "8px",
                  backgroundColor: "#262626",
                  color: "#FFFFFF",
                  borderRadius: "5px",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Companysettings;
