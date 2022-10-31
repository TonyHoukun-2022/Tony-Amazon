import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import Product from "../../../models/Product";

const handler = nc<NextApiRequest, NextApiResponse>({attachParams: true});

handler.get(async (req, res) => {
    const slug = req.query?.slug
    const product = await Product.findOne({slug}, '-reviews')
    return res.json(product)
})

export default handler