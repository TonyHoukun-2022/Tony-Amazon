// /api/product/:id/review
import nc from 'next-connect'
import mongoose from 'mongoose'
import { onError } from '../../../../utils/error'
import Product from '../../../../models/Product'
import { isAuth } from '../../../../utils/auth'

const handler = nc({
  onError,
})

//get product review
handler.get(async (req, res) => {
  const product = await Product.findById(req.query.id)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.status(200).json(product.reviews)
})

//post review
//req.user is assigned with decoded user at isAuth middleware
handler.use(isAuth).post(async (req, res) => {
  const product = await Product.findById(req.query.id)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  //check if current login user have review
  const existReview = product.reviews.find((x) => x.user === req.user._id)

  if (!existReview) {
    const review = {
      user: mongoose.Types.ObjectId(req.user._id),
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    //avg rating
    product.rating = product.reviews.reduce((sum, review) => review.rating + sum, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ message: 'review submitted', product })
  }

  //if current login user has review of this product, update it
  if (existReview) {
    //filter with product._id, and existReview._id, and update comment and rating field of existReview
    //'reviews._id' => find review._id in reviews array
    await Product.updateOne(
      { _id: req.query.id, 'reviews._id': existReview._id },
      {
        $set: {
          'reviews.$.comment': req.body.comment,
          'reviews.$.rating': Number(req.body.rating),
        },
      }
    )

    //find the just updated product
    const updatedProduct = await Product.findById(req.query.id)
    //update rest of fields of updatedProduct
    updatedProduct.numReviews = updatedProduct.reviews.length
    // avg rating
    updatedProduct.rating = updatedProduct.reviews.reduce((sum, review) => review.rating + sum, 0) / updatedProduct.reviews.length

    await updatedProduct.save()

    res.status(203).json({ message: 'review updated', product: updatedProduct })
  }
})

export default handler
