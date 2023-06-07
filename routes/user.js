import express from 'express';
import {   createOrder, getOrders, signIn, userRegister } from '../controllers/userController.js';
import { userAuth } from '../middlewares/middlewares.js';
const router = express.Router();


router.post('/add-user',userRegister);
router.post('/login-user',signIn)
router.post('/add-order',userAuth,createOrder)
router.get('/get-order',userAuth,getOrders)


export default router;