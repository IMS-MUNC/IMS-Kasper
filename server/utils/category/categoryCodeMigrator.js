const Category = require("../../models/categoryModels");

const assignCategoryCodesToExisting = async () => {
  const categoriesWithoutCode = await Category.find({ categoryCode: { $exists: false } }).sort({ createdAt: 1 });

  for (let i = 0; i < categoriesWithoutCode.length; i++) {
    const code = `CAT-${String(i + 1).padStart(4, '0')}`;
    categoriesWithoutCode[i].categoryCode = code;
    await categoriesWithoutCode[i].save();
  }

  console.log("Category codes assigned to existing categories.");
};

module.exports = assignCategoryCodesToExisting;
