import mongoose, { Schema, mongo } from "mongoose";

// Create user schema to mongoDB database

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const userSchema = new Schema(
    {
        name: String,
        email: String,
        imageProfile: String,
        userId: String,
        contact: [{
            contactName: String,
            address: String,
        }]
    }
);

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;