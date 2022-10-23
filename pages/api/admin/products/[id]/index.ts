import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import Product from '../../../../../models/Product';

const handler = nc<NextApiRequest, NextApiResponse>()
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  const product = await Product.findById(req.query.id);
  if(!product) {
    return res.status(404).json({message: 'product not found'})
  }
  res.status(200).json(product);
});

handler.put(async(req, res) => {
  const product = await Product.findById(req.query.id)
  if(!product) {
    return res.status(404).json({message: 'product not found'})
  }
  const { name, slug, price, image, category, brand, countInStock, description} = req.body

  product.name = name
  product.slug = slug
  product.price = price
  product.image = image
  product.category = category
  product.brand = brand
  product.countInStock = countInStock
  product.description = description

  await product.save()
  res.status(203).json({message: 'Product updated successfully', product})
})

handler.delete(async(req, res)=>{
  const product = await Product.findById(req.query.id)
  if(!product) {
    return res.status(404).json({message: 'Product not found'})
  }
  await product.remove()
  res.status(203).json({message: 'Product deleted'})
})
export default handler;