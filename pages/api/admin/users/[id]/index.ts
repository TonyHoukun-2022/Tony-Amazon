import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import User from '../../../../../models/User';

const handler = nc<NextApiRequest, NextApiResponse>()
handler.use(isAuth, isAdmin)

handler.get(async(req, res) => {
  const user = await User.findById(req.query.id)
  if(!user) {
    return res.status(404).json({message: 'user not found'})
  }
  res.status(200).json(user)
})


// handler.put(async (req, res) => {
//     const user = await User.findById(req.query.id);
//     if(!user) {
//         res.status(404).send({ message: 'User Not Found' });
//     }
//     user.name = req.body.name;
//     user.slug = req.body.slug;
//     user.price = req.body.price;
//     user.category = req.body.category;
//     user.image = req.body.image;
//     user.brand = req.body.brand;
//     user.countInStock = req.body.countInStock;
//     user.description = req.body.description;
//     await user.save();
//     res.send({ message: 'User Updated Successfully' });
  
//   });

handler.delete(async (req, res) => {
    const user = await User.findById(req.query.id);
    if (user) {
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  });

export default handler