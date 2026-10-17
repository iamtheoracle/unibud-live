import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { n as createListing } from "./server-3ArcV-Gz.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as CATEGORIES } from "./catalog-DxoFHR0q.mjs";
import { r as koboFromNairaInput } from "./format-o0D0ws6F.mjs";
import { t as RedirectToSignIn } from "./gates-DDcqnn-l.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as Skeleton } from "./router-DSOd9OgQ.mjs";
import { t as Textarea } from "./textarea-DCQBtqbi.mjs";
import { t as Input } from "./input-BLGtTKRX.mjs";
import { t as Label } from "./label-CLxaGYqN.mjs";
import { t as VaultGate } from "./vault-gate-CXiQkllu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sell-Bkqeq9J7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RequireAuth({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-xl" })
		]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function SellPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultGate, {
		title: "Marketplace",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SellForm, {}) })
	});
}
function SellForm() {
	const router = useRouter();
	const [kind, setKind] = (0, import_react.useState)("goods");
	const [category, setCategory] = (0, import_react.useState)("other");
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [naira, setNaira] = (0, import_react.useState)("");
	const [priceNote, setPriceNote] = (0, import_react.useState)("asking");
	const [location, setLocation] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		const kobo = koboFromNairaInput(naira);
		if (kobo == null) {
			toast.error("Enter a price in naira");
			return;
		}
		setBusy(true);
		try {
			const listing = await createListing({ data: {
				kind,
				category,
				title,
				description,
				priceKobo: kobo,
				priceNote,
				location
			} });
			await router.invalidate();
			toast.success("Listed");
			await router.navigate({
				to: "/market/$listingId",
				params: { listingId: listing.id }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not list");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "mx-auto max-w-xl space-y-5 pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-bud uppercase",
					children: "Sell"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl",
					children: "List something campus can use"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Be honest. No impersonation. Payments stay on the demo ledger."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					"goods",
					"service",
					"stay"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setKind(k),
					className: kind === k ? "h-11 rounded-md bg-paper text-sm font-medium text-ink" : "h-11 rounded-md border border-border text-sm text-muted-foreground",
					children: k
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "cat",
					children: "Category"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "cat",
					value: category,
					onChange: (e) => setCategory(e.target.value),
					className: "h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm",
					children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c.label
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "title",
					children: "Title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "title",
					required: true,
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "desc",
					children: "Description"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "desc",
					required: true,
					value: description,
					onChange: (e) => setDescription(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "price",
						children: "Price (₦)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "price",
						inputMode: "decimal",
						required: true,
						value: naira,
						onChange: (e) => setNaira(e.target.value),
						placeholder: "15000"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "note",
						children: "Price note"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "note",
						value: priceNote,
						onChange: (e) => setPriceNote(e.target.value)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "loc",
					children: "Location"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "loc",
					value: location,
					onChange: (e) => setLocation(e.target.value),
					placeholder: "Yaba, second gate, remote…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: busy,
				className: "w-full",
				children: busy ? "Publishing…" : "Publish listing"
			})
		]
	});
}
//#endregion
export { SellPage as component };
