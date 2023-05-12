/**
 * copy of mockHandlers.ts, but with certain empty arrays changed to be non-empty
 */
import { rest } from 'msw';
import { config } from "../utils/config"
import * as data from "./mockData";
import * as API from "../utils/APIReturnTypes"
const API_BASE = config.API_BASE;

const handlersNon0 = [
    rest.get(`${API_BASE}/auth/login/success`, async (req, res, ctx) => {
        const user = data.user;
        return res(ctx.json({ user: data.user }))
    }),

    rest.get(`${API_BASE}/book/all_for_user/${data.user_id}`, async (req, res, ctx) => {
        return res(ctx.json([data.book1_return]))
    }),

    rest.get(`${API_BASE}/quote/all_for_book/${data.book1_id}`, async (req, res, ctx) => {
        return res(ctx.json([data.quote1_return]))
    }),
]

export { handlersNon0 }