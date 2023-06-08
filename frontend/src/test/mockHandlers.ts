import { rest } from 'msw';
import { config } from "../utils/config"
import * as data from "./mockData";
import * as API from "../utils/APIReturnTypes"
const API_BASE = config.API_BASE_TEST;

const handlers = [
    rest.get(`${API_BASE}/auth/login/success`, async (req, res, ctx) => {
        const user = data.user;
        return res(ctx.json({user: data.user}))
    }),

    rest.get(`${API_BASE}/book/all_for_user/${data.user_id}`, async (req, res, ctx) => {
        return res(ctx.json([]))
    }),

    rest.get(`${API_BASE}/quote/all_for_book/${data.book1_id}`, async (req, res, ctx) => {
        return res(ctx.json([]))
    }),

    rest.post(`${API_BASE}/book`, async (req, res, ctx) => {
        return res(ctx.json(data.book1_added))
    }),

    rest.delete(`${API_BASE}/book`, async (req, res, ctx) => {
        return res(ctx.json(data.book1_deleted))
    }),

    rest.get(`${API_BASE}/book/id/${data.book1_id}`, async (req, res, ctx) => {
        return res(ctx.json(data.book1_return))
    }),

    rest.post(`${API_BASE}/quote`, async (req, res, ctx) => {
        return res(ctx.json(data.quote1_added))
    }),

    rest.delete(`${API_BASE}/quote`, async (req, res, ctx) => {
        return res(ctx.json(data.quote1_deleted))
    }),
]

export { handlers }