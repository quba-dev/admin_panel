import mongoose from 'mongoose';


const UserRoles = new mongoose.Schema({
    user_id: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    role_id: [{type: mongoose.Types.ObjectId, ref: 'Role'}]
})

export default mongoose.model('UserRoles', UserRoles)