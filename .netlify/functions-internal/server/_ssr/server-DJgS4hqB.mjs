import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { r as createSsrRpc } from "./server-3ArcV-Gz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-DJgS4hqB.js
var listConversations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8c268163592aac3c92342701eb40a52d22f5a0c68acf78c02fdaae85b203f26e"));
var getConversation = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("ae0cd7c3ec9b55892e9768293d3cd5fc4284539e682254d23a665e5d4337626b"));
var openConversation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1226a209efdeb5ed553ed79ffb51340db5a2c302b5276a2912377662482d56af"));
var sendMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1aa8e9da95a4494f9ebe4722b1f2a73360ea6de8b2bb716516399f71f92b53e9"));
var joinCommunity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((communityId) => communityId).handler(createSsrRpc("d25180cf38c0db45c35b6ca179fdbdb0977ed8a83919b9c99b1f6492d66033cf"));
var myCommunities = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cd8fff3846d9df00971e47df95793633c255afde74dedbb0e811f229d150d589"));
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b87a705d21f422de288a8796a3a6e9b0268ad02a7374945222dd6406bf4ba8f7"));
//#endregion
export { myCommunities as a, listConversations as i, getConversation as n, openConversation as o, joinCommunity as r, sendMessage as s, createPost as t };
