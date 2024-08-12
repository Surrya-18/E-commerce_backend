const Order=require('../models/orderModel')
const Cart=require('../models/cartModel')
const Product=require('../models/productModel')
exports.createOrder = async (req, res) => {
    const { user_id } = req.user;
    try {
        const { name, address, phno } = req.body;

        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart Not Found' });
        }
        const order = new Order({
            name,
            address,
            phno,
            products: cart.products,
            order_date: new Date(),
            delivery_date: calculateDeliveryDate(), 
        });
        await order.save();
        await Cart.deleteOne({ user_id });
        res.status(201).json({ message: 'Order created successfully' });
    } catch (err) {
        console.error('Error occurred while creating order:', err.message);
        res.status(500).json({ message: 'An error occurred while creating the order' });
    }
};

function calculateDeliveryDate(){
    const today = new Date();
    return new Date(today.setDate(today.getDate()+7));
}