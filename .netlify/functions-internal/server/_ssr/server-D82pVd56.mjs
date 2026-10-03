import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { r as createSsrRpc } from "./server-3ArcV-Gz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-D82pVd56.js
var getWallet = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c24bb7589c99aaa146fd19c2da2c3b7c80fbed83f68da84df6eccc0314a7111b"));
var addDemoFunds = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((kobo) => kobo).handler(createSsrRpc("8529a3226e92dafd450333a25afd5046b146283f002d41b5034ca66ba9b689c3"));
var sendDemoMoney = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("407859e35cb52f503a226719d1ac57bbfe3bdb2aaa3d1c1aa948419fde10e419"));
var withdrawDemo = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e6d5a40fa0f7534645504148ea0b26c17a40d9e9529b045a3700c5a5a32fbf9e"));
var payListingDemo = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a61e37c6992d3c5c25f1e738f0cc57c04629eacf370892058edce745dc8fdb3f"));
var createMoneyRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("db895b5de14bc03324f6c6d972066dc8d486099d91c98669ff464b37ab9a3d1f"));
var updateMoneyRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9cf6e694e084ffb5b912fc12823ae741227506b29a7d0aaeaa7addf152cf0938"));
var saveFundingNotes = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("bcf20e5785da3d0c036eccb9f326158c7efcab155d92130d451174a7c02af282"));
//#endregion
export { saveFundingNotes as a, withdrawDemo as c, payListingDemo as i, createMoneyRequest as n, sendDemoMoney as o, getWallet as r, updateMoneyRequest as s, addDemoFunds as t };
