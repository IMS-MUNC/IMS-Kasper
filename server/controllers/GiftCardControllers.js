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
        const userId = req.params.id;
        const updatedGift = await GiftCard.findByIdAndUpdate(userId,req.body , {new : true});
        res.status(200).json({message : "updated : "}, updatedGift);
    } catch (err) {
        res.status(400).json({error : err.message});
    }
};

const deletedGiftCard = async(req, res)=>{
    try {
        const deletegif =  await GiftCard.findByIdAndDelete(req.params.id);
        res.status(204).json({message : "GiftCard Deleted"},deletegif);
    } catch (err) {
        res.status(500).json({error : err.message});
    }
}
module.exports = {createGiftCard,getGiftCard, updateGiftCard,deletedGiftCard}; 
