const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name:String,
    last_name:String,
    email:String,
    password:String,
    confirm_password:String,
    phone_no:Number,
    role:String,
    address1:String,
    address2:String,
    city:String,
    state:String,
    country:String,
    zip_code:Number,
    profile:String,
    is_active:Boolean

}, {
    timestamps: true
}
);

module.exports = mongoose.model("Creators", creatorSchema);