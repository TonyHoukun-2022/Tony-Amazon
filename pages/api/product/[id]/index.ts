import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import Product from '../../../../models/Product'

const handler = nc<NextApiRequest, NextApiResponse>({attachParams: true});

handler.get(async (req, res) => {
    const id = req.query?.id
    const product = await Product.findById(id)
    return res.json(product)
})

export default handler