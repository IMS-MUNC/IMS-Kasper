const Counter = require("../models/Counter")
const generateUniqueCategoryCode = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: "categoryCode" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );
    return `CAT-${String(counter.value).padStart(4,"0")}`
}

module.exports = generateUniqueCategoryCode;