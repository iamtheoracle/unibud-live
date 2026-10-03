import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as createServerFn } from "./ssr.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { r as createSsrRpc } from "./server-3ArcV-Gz.mjs";
import { H as Fingerprint } from "../_libs/lucide-react.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady, t as SignInCard } from "./sign-in-gate-rXdNMVWJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault-gate-CXiQkllu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var vaultStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f2218adb991edf653f254ff844af803a4cea29c4144127bac1aa1be42ed0eca4"));
var setVaultPin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("3b0d8883e4d4898643eafe505fd6b0c848f45b1df79ecca414d85f0b13f1a636"));
var verifyVaultPin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("203b94765dfbe879584c15aa4ee4021d32b9c7e3695c6ec36c89716e226932d6"));
var vaultPasskeyChallenge = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("40148330e8b90e854e246893c97d3d6a0db75c677c71d3aa604451ad9ab65828"));
var saveVaultPasskey = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("7cd5c1612b2ab528776c56311da3c9da282dfd09ef2356c0b360b390a7f682ce"));
var verifyVaultPasskey = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("4889c38e7f00846e23b6366485d86882d46ea5933da2484b68e822a238b46bb5"));
var SESSION_KEY = "unibud-vault-open";
function sessionOpen() {
	try {
		return sessionStorage.getItem(SESSION_KEY) === "1";
	} catch {
		return false;
	}
}
function markOpen() {
	try {
		sessionStorage.setItem(SESSION_KEY, "1");
	} catch {}
}
function b64urlToBuf(s) {
	const pad = s.replace(/-/g, "+").replace(/_/g, "/");
	const bin = atob(pad);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
	return out;
}
function bufToB64url(buf) {
	const bytes = new Uint8Array(buf);
	let s = "";
	for (const b of bytes) s += String.fromCharCode(b);
	return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function VaultGate({ title, children }) {
	const { user, isPending } = useAuthReady();
	const [ready, setReady] = (0, import_react.useState)(sessionOpen);
	const [hasPin, setHasPin] = (0, import_react.useState)(false);
	const [hasPasskey, setHasPasskey] = (0, import_react.useState)(false);
	const [pin, setPin] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("unlock");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user || ready) return;
		vaultStatus().then((s) => {
			setHasPin(s.hasPin);
			setHasPasskey(s.hasPasskey);
			setMode(s.hasPin ? "unlock" : "setup");
		});
	}, [user, ready]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-48 animate-pulse rounded-3xl bg-secondary" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-8 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {
				title: "Sign in first",
				body: "Wallet and Marketplace sit behind your account, then a 4-digit passcode."
			})
		})]
	});
	if (ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	function tap(d) {
		setError(null);
		setPin((p) => p.length >= 4 ? p : p + d);
	}
	async function submitPin() {
		if (pin.length !== 4) return;
		setBusy(true);
		setError(null);
		try {
			if (mode === "setup") await setVaultPin({ data: { pin } });
			else await verifyVaultPin({ data: { pin } });
			markOpen();
			setReady(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not unlock");
			setPin("");
		} finally {
			setBusy(false);
		}
	}
	async function registerKey() {
		if (!user) return;
		setBusy(true);
		setError(null);
		try {
			const { challenge } = await vaultPasskeyChallenge();
			const cred = await navigator.credentials.create({ publicKey: {
				challenge: b64urlToBuf(challenge),
				rp: {
					name: "UNIBUD",
					id: window.location.hostname
				},
				user: {
					id: new TextEncoder().encode(user.id),
					name: user.primaryEmail ?? "student",
					displayName: user.displayName ?? "Student"
				},
				pubKeyCredParams: [{
					type: "public-key",
					alg: -7
				}, {
					type: "public-key",
					alg: -257
				}],
				authenticatorSelection: {
					userVerification: "required",
					residentKey: "preferred"
				},
				timeout: 6e4
			} });
			if (!cred) throw new Error("Passkey was cancelled.");
			await saveVaultPasskey({ data: { credentialId: bufToB64url(cred.rawId) } });
			setHasPasskey(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Passkey not available on this device.");
		} finally {
			setBusy(false);
		}
	}
	async function unlockKey() {
		setBusy(true);
		setError(null);
		try {
			const { challenge } = await vaultPasskeyChallenge();
			const cred = await navigator.credentials.get({ publicKey: {
				challenge: b64urlToBuf(challenge),
				userVerification: "required",
				timeout: 6e4
			} });
			if (!cred) throw new Error("Passkey was cancelled.");
			await verifyVaultPasskey({ data: { credentialId: bufToB64url(cred.rawId) } });
			markOpen();
			setReady(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Passkey failed.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[70dvh] max-w-sm flex-col justify-center px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Protected"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl",
				children: mode === "setup" ? "Set a passcode" : `Unlock ${title}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: mode === "setup" ? "Four digits. This locks Wallet and Marketplace on this account. Demo money still never leaves UNIBUD." : "Enter your 4-digit passcode, or use a passkey."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex justify-center gap-3",
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-3 rounded-full", pin.length > i ? "bg-ink" : "bg-border") }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-8 grid w-56 grid-cols-3 gap-2",
				children: [
					"1",
					"2",
					"3",
					"4",
					"5",
					"6",
					"7",
					"8",
					"9",
					"⌫",
					"0",
					"OK"
				].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					className: "grid h-14 place-items-center rounded-full text-lg font-medium hover:bg-secondary",
					onClick: () => {
						if (d === "⌫") setPin((p) => p.slice(0, -1));
						else if (d === "OK") submitPin();
						else tap(d);
					},
					children: d
				}, d))
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-sm text-destructive",
				children: error
			}) : null,
			hasPasskey ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "mt-6 w-full",
				disabled: busy,
				onClick: () => void unlockKey(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fingerprint, { className: "size-4" }), "Unlock with passkey"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				className: "mt-6 w-full",
				disabled: busy,
				onClick: () => void registerKey(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fingerprint, { className: "size-4" }), "Add a passkey"]
			})
		]
	});
}
//#endregion
export { VaultGate as t };
