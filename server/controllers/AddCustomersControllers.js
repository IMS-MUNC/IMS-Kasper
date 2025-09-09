const Customers = require("../models/AddCustomersModels");

const createcustomers = async (req, res)=>{
    try {
        const newCustomer = new Customers(req.body);
        await newCustomer.save();
        res.status(201).json(newCustomer);
        
    } catch (err) {
        res.status(400).json({Error : err.message});
    }
};

const getCustomers = async (req, res) =>{
    try {
        const customer = await  Customers.find();
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({Error :  err.message});
    }
}

module.exports = {createcustomers , getCustomers};