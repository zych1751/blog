const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const Account = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now }
});

Account.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
};

Account.methods.validateHash = function(password) {
    return bcrypt.compareSync(password, this.password);
};

mongoose.model('Account', Account);
