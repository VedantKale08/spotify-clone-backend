const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userModel = mongoose.Schema(
    {
        email:{
            type: String,
            required: true
        },
        password:{
            type: String
        },
        username:{
            type: String
        },
        gender:{
            type: String
        },
        isPrimeUser:Boolean,
        byGoogle:Boolean
    },{
        timestamps:true,
    }
)

userModel.pre('save', async function (next) {
    if(!this.isModified) {
        next();
    }
    if(this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
})

userModel.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User',userModel);

module.exports = User;