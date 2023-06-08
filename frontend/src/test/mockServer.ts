import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { handlers } from './mockHandlers'
import { handlersNon0 } from './mockHandlersNon0'

const server = setupServer(...handlers)
const serverNon0 = setupServer(...handlersNon0)

export { server, serverNon0, rest }