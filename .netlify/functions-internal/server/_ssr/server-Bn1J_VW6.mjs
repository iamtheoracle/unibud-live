import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { r as createSsrRpc } from "./server-3ArcV-Gz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Bn1J_VW6.js
var listBudConversations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1e67275c55dd7e08c79a6fd702bd4d16d67c13d93ce0ccad09252a3f9a551048"));
var getBudThread = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input ?? {}).handler(createSsrRpc("a177a03ff47fe208046d071c181146b88e2db20c9b849c830208d7d3b4b23bdb"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("cb5160266982658da6dba7d51673041fa293dc2e6d141693caa6dafc96e64fcd"));
var deleteBudConversation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b955600f8299f74d22c9e4954183b6090e7722002c8d2209ffc9a600adebd745"));
var retryBud = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6ba2aae4a56a5d157178a4a982f84ef1821ea7d50137486b32f2ce08b070dc44"));
var askBud = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a72d2a9896693f0fac177b7f02d4ea730613e3e1efffeaf5856bd87ba01dec3a"));
//#endregion
export { retryBud as a, listBudConversations as i, deleteBudConversation as n, getBudThread as r, askBud as t };
