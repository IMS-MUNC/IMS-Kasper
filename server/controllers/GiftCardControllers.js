const GiftCard =require('../models/GiftCardModels');

const createGiftCard = async (req , res)=>{
    try {
        const newGiftCard = new GiftCard(req.body);
        await newGiftCard.save();
        res.status(201).json(newGiftCard);
    } catch (err) {
        res.status(400).json({Error : err.message});
    }
};

const getGiftCard = async (req,res)=>{
    try {
        const gifts = await GiftCard.find();
        res.status(200).json( gifts);
    } catch (err) {
        res.status(500).json({error : err.message})
    }
};

const updateGiftCard = async (req,res)=>{
    try {
        const giftCardId = req.params.id;
        const updatedGift = await GiftCard.findByIdAndUpdate(giftCardId, req.body, {new: true});
        
        if (!updatedGift) {
            return res.status(404).json({error: "Gift card not found"});
        }
        
        res.status(200).json({
            message: "Gift card updated successfully",
            data: updatedGift
        });
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const deletedGiftCard = async(req, res)=>{
    try {
        const giftCardId = req.params.id;
        const deletedGift = await GiftCard.findByIdAndDelete(giftCardId);
        
        if (!deletedGift) {
            return res.status(404).json({error: "Gift card not found"});
        }
        
        res.status(200).json({
            message: "Gift card deleted successfully",
            data: deletedGift
        });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}
module.exports = {createGiftCard,getGiftCard, updateGiftCard,deletedGiftCard};
