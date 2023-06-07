import { generateToken } from "../JWT/JWT.js"
import orderModel from "../model/orderSchema.js"
import userModel from "../model/userSchema.js"
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'


export const userRegister = (req, res) => {
    try {
        let { name, password, phone } = req.body
        userModel.findOne({ phone })
            .then((user) => {
                if (user) {
                    res.status(200)
                        .json({ registration: false })
                } else {
                    bcrypt.hash(password, 10)
                        .then((hash) => {
                            const newUser = new userModel({
                                name,
                                phone,
                                password: hash,
                            })
                            newUser.save()
                                .then((user) => {
                                    const token = generateToken({
                                        userId: user._id
                                    })
                                    res.status(200)
                                        .json({ registration: true, token })
                                })
                        })
                }
            })
    } catch (err) {
        res.status(500)
            .json({ message: 'server failed' })
    }
}


export const signIn = (req, res) => {
    try {
        let { phone, password, login_by, email } = req.body
        if (login_by === 'phone') {
            userModel.findOne({ phone })
                .then((user) => {
                    if (user) {
                        bcrypt.compare(password, user.password, function (err, result) {
                            if (result) {
                                const token = generateToken({
                                    userId: user._id
                                })
                                res.status(200)
                                    .json({ logIn: 'success', token })
                            } else {
                                res.status(200)
                                    .json({ logIn: 'incPass' })
                            }
                        })
                    } else {
                        res.status(200)
                            .json({ logIn: 'noUser' })
                    }
                })
        } else if (login_by === 'google') {
            let { user } = req.body.firebaseCred
            userModel.findOne({ email: user.email }).then((userExist) => {
                if (userExist) {
                    res.status(200)
                        .json({ logIn: 'success', token })
                } else {
                    let newUser = new userModel({
                        name: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber ?? null
                    })
                    newUser.save().then(() => {
                        const token = generateToken({
                            userId: user._id
                        })
                        res.status(200)
                            .json({ logIn: 'success', token })
                    })
                }
            })
        }

    } catch (err) {
        res.status(500)
            .json({ message: 'server failed' })
    }
}


export const createOrder = (req, res) => {
    try {
        const { sub_total, phone_number, user_id } = req.body
        const newOrder = new orderModel({
            user_id: user_id ?? req.userLogged, // user_id from authentication middleware
            sub_total,
            phone_number
        })
        newOrder.save().then(() => {
            res.status(200)
                .json({ message: 'created' })
        })

    } catch (err) {
        res.status(500)
            .json({ message: 'server failed' })
    }
}

export const getOrders = (req, res) => {
    try {
        const user_id = req.query.user_id
        orderModel
            .find({ user_id })
            .populate('user_id')
            .then((orders) => {
                res.status(200).json(orders)
            })
    } catch (err) {
        res.status(500)
            .json({ message: 'server failed' })
    }
}


