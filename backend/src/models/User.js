import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
})

// helper to set password----- "this" doesnt work with arrow function
userSchema.methods.setPassword = async function(pass) {
    this.password = await bcrypt.hash(pass, 10)
}

// helper to verify

userSchema.methods.verifyPassword = function(pass) {
    return bcrypt.compare(pass, this.password)
}

export default mongoose.model('User', userSchema);