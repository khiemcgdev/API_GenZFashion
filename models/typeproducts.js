const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Typeproducts = new Schema({
    name: { type: String, required: true }, 
    image: { type: String}, 
    id_size: [{ type: Schema.Types.ObjectId, ref: 'sizes' }] 
}, {
    timestamps: true
});

module.exports = mongoose.model('typeproducts', Typeproducts);
