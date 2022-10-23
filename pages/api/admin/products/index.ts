import nc from 'next-connect';
import Product from '../../../../models/Product';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAuth, isAdmin } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

//create product with sample data
handler.post(async(req, res)=>{
  const newProduct = await Product.create({
    name: 'sample product',
    slug: 'sample-product-' + Math.random(),
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    description: 'sample description',
    rating: 0,
    numReviews: 0,
  })

  res.status(201).json({message: 'Product created', product: newProduct})
})

export default handler;