import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BASE_URL from "../../../pages/config/config";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCouponModal = ({ show, handleClose, onSave, editCoupon = null, mode }) => {
  const isEditMode = mode === "edit";
  const quillRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    discount: '',
    limit: '',
    valid: '',
    validStatus: '',
    oncePerCustomer: false,
    status: true
  });

  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editCoupon) {
      setFormData({
        name: editCoupon.name || '',
        code: editCoupon.code || '',
        type: editCoupon.type || '',
        discount: editCoupon.discount || '',
        limit: editCoupon.limit || '',
        valid: editCoupon.valid?.split('T')[0] || '',
        validStatus: editCoupon.validStatus || '',
        oncePerCustomer: editCoupon.oncePerCustomer || false,
        status: editCoupon.status ?? true
      });
      setDescription(editCoupon.description || '');
    } else {
      setFormData({
        name: '',
        code: '',
        type: '',
        discount: '',
        limit: '',
        valid: '',
        validStatus: '',
        oncePerCustomer: false,
        status: true
      });
      setDescription('');
    }
  }, [editCoupon, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

    const handleSave = async () => {
    const plainDescription = description.replace(/<[^>]*>?/gm, '');
    const finalData = {
      ...formData,
      description: plainDescription
    };
   
    // 1. First, check if all required fields have a value
    const requiredFields = ['name', 'code', 'type', 'discount', 'limit', 'valid', 'validStatus'];
    const allFieldsFilled = requiredFields.every(field => finalData[field] && finalData[field].toString().trim() !== '');
    
    if (!allFieldsFilled) {
      toast.error("Please fill all the required fields marked with * before submitting.");
      return;
    }

    // 2. NEW: After confirming fields are filled, check the code's length
    if (finalData.code.trim().length !== 6) {
      toast.error("Coupon code must be 6 characters long.");
      return; // Stop the function if the code length is not 6
    }

    // If all checks pass, proceed with the API call
    try {
      const token = localStorage.getItem("token");
      
      const url = editCoupon
        ? `${BASE_URL}/api/coupons/${editCoupon._id}`
        : `${BASE_URL}/api/coupons/`;

      const method = editCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(`Error: ${result.message || 'Failed to save coupon'}`);
        return;
      }
      
      toast.success(`Coupon ${isEditMode ? 'updated' : 'created'} successfully!`);
      onSave(); // refresh table
      handleClose();
    } catch (err) {
      console.error("Coupon submission error:", err);
      toast.error("Something went wrong while saving the coupon.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header className="d-flex justify-content-between align-items-center border-0 pb-0">
        <Modal.Title className="fw-bold">{isEditMode ? "Edit Coupon" : "Add Coupon"}</Modal.Title>
        <Button
          variant="link"
          onClick={handleClose}
          className="fs-4 p-0 m-0"
          style={{
            lineHeight: "1",
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            height: "30px",
            width: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <IoMdClose />
        </Button>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Label>Coupon Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="name"
                type="text"
                placeholder="Enter coupon name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <Form.Label>Coupon Code <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="code"
                type="text"
                placeholder="Enter 6 digit coupon code"
                value={formData.code}
                onChange={handleChange}
                maxLength={6}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Type <span className="text-danger">*</span></Form.Label>
              <Form.Select name="type" value={formData.type} onChange={handleChange}>
                <option value="">Choose Type</option>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </Form.Select>
            </div>

            <div className="col-md-6">
              <Form.Label>Discount <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="discount"
                type="number"
                placeholder="e.g. 20% or ₹100"
                value={formData.discount}
                onChange={handleChange}
                min={1}
              />
            </div>

            <div className="col-md-12">
              <Form.Label>Limit <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="limit"
                type="number"
                placeholder="Enter usage limit"
                value={formData.limit}
                onChange={handleChange}
                min={1}
              />
              <small className="text-muted">Enter 1 for Unlimited</small>
            </div>

            <div className="col-md-6">
              <Form.Label>Valid Until <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="valid"
                type="date"
                value={formData.valid}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <Form.Label>Status <span className="text-danger">*</span></Form.Label>
              <Form.Select name="validStatus" value={formData.validStatus} onChange={handleChange}>
                <option value="">Choose Type</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </div>

            <div className="col-md-12">
              <Form.Label>Description</Form.Label>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Type the message"
                style={{ height: "120px", marginBottom: "35px" }}
              />
            </div>
            {/* <div className="col-md-12 d-flex align-items-center justify-content-between pt-3">
              <Form.Label className="mb-0">Active Status</Form.Label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input bg-success"
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
              </div>
            </div> */}
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="primary" onClick={handleSave}>
          {isEditMode ? "Edit & Save" : "Add & Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCouponModal;
