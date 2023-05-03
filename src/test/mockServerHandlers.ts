import { rest } from 'msw';
import * as API from "../utils/APIReturnTypes";
import { config } from "../config"
const API_BASE = config.API_BASE;

const handlers = [
    rest.get(`${API_BASE}/auth/login/success`, async (req, res, ctx) => {
        // const user = await users.login(JSON.parse(req.body))
        // return res(ctx.json({ user }))
        // const user: API.userReturnType = {
            
        // }
        const user:API.userReturnType = {
            google_id:"123456789",
            google_name:"john doe",
            __v: "0",
            _id: "012345"
        };
        return res(ctx.json({ 
            user: user
        }))
    }),
//     rest.post('/checkout', async (req, res, ctx) => {
//         const user = await users.login(JSON.parse(req.body))
//         const isAuthorized = user.authorize(req.headers.Authorization)
//         if (!isAuthorized) {
//             return res(ctx.status(401), ctx.json({ message: 'Not authorized' }))
//         }
//         const shoppingCart = JSON.parse(req.body)
//         // do whatever other things you need to do with this shopping cart
//         return res(ctx.json({ success: true }))
//     }),
]

export { handlers }