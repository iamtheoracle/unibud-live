import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { a as PEOPLE } from "./catalog-DxoFHR0q.mjs";
import { i as relativeTime, r as koboFromNairaInput, t as formatNaira } from "./format-o0D0ws6F.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-CzUOsSSv.mjs";
import { f as Route$30, g as cn } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as Textarea } from "./textarea-DCQBtqbi.mjs";
import { t as Badge } from "./badge-SYw1Pg1W.mjs";
import { a as saveFundingNotes, c as withdrawDemo, n as createMoneyRequest, o as sendDemoMoney, r as getWallet, s as updateMoneyRequest, t as addDemoFunds } from "./server-D82pVd56.mjs";
import { t as Input } from "./input-BLGtTKRX.mjs";
import { t as VaultGate } from "./vault-gate-CXiQkllu.mjs";
import { t as BudNudge } from "./bud-nudge-D6BWV5dx.mjs";
import { t as DemoCallout } from "./demo-callout-3yKOc5mg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/money-CDYmzfUE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Money() {
	const { tab } = Route$30.useSearch();
	const { user, isPending } = useAuthReady();
	const qc = useQueryClient();
	const wallet = useQuery({
		queryKey: ["wallet"],
		queryFn: () => getWallet(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-48 animate-pulse rounded-3xl bg-secondary" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultGate, {
		title: "Wallet",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})
	});
	const data = wallet.data;
	const active = tab === "requests" || tab === "funding" ? tab : "wallet";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultGate, {
		title: "Wallet",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-4 pb-10 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
					children: "Wallet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-medium tracking-tight",
					children: "Your pocket"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex gap-2",
					children: [
						["wallet", "Wallet"],
						["requests", "Requests"],
						["funding", "Funding"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/money",
						search: { tab: id },
						className: cn("rounded-full px-4 py-2 text-sm", active === id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
						children: label
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 overflow-hidden rounded-3xl bg-card p-5 ring-1 ring-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Demo balance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "warn",
								children: "Demo"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 tabular text-4xl font-medium tracking-tight",
							children: formatNaira(data?.balanceKobo ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: data?.disclaimer
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BudNudge, {
					draft: "Explain this demo wallet: balance, add, send, withdraw. It is not a bank. Stay as Bud.",
					children: "What does this wallet actually do?"
				}),
				active === "wallet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletPane, {
					data,
					onRefresh: () => qc.invalidateQueries({ queryKey: ["wallet"] })
				}) : null,
				active === "requests" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestsPane, {
					data,
					onRefresh: () => qc.invalidateQueries({ queryKey: ["wallet"] })
				}) : null,
				active === "funding" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FundingPane, {
					data,
					onRefresh: () => qc.invalidateQueries({ queryKey: ["wallet"] })
				}) : null
			]
		})
	});
}
function WalletPane({ data, onRefresh }) {
	const [sheet, setSheet] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setSheet("add"),
						children: "Add"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setSheet("send"),
						children: "Send"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setSheet("withdraw"),
						children: "Withdraw"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoCallout, { children: "Add, send, and withdraw only write to your UNIBUD demo ledger. They cannot be mistaken for a real bank movement." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Activity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: (data?.tx ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start justify-between rounded-2xl bg-card px-4 py-3 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium capitalize",
							children: t.type.replace("_", " ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								t.counterparty,
								" · ",
								relativeTime(t.createdAt)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: t.note
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("tabular text-sm", t.type === "send" || t.type === "withdraw" || t.type === "market_pay" ? "text-foreground" : "text-bud"),
							children: [t.type === "send" || t.type === "withdraw" || t.type === "market_pay" ? "−" : "+", formatNaira(t.amountKobo)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "warn",
							children: t.status.replace("_", " ")
						})]
					})]
				}, t.id))
			}),
			!data?.tx.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No movement yet",
				body: "Add demo funds to try send, request, and marketplace pay."
			}) : null,
			sheet === "add" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddSheet, {
				onClose: () => setSheet(null),
				onDone: onRefresh
			}) : null,
			sheet === "send" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendSheet, {
				onClose: () => setSheet(null),
				onDone: onRefresh
			}) : null,
			sheet === "withdraw" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WithdrawSheet, {
				onClose: () => setSheet(null),
				onDone: onRefresh
			}) : null
		]
	});
}
function AddSheet({ onClose, onDone }) {
	const mut = useMutation({
		mutationFn: (kobo) => addDemoFunds({ data: kobo }),
		onSuccess: () => {
			toast.message("Demo funds added", { description: "Not a real deposit." });
			onDone();
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "Add demo funds",
		onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Simulated naira for trying the product. Not a deposit."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid grid-cols-3 gap-2",
			children: [
				2e5,
				5e5,
				1e6
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => mut.mutate(k),
				disabled: mut.isPending,
				children: formatNaira(k)
			}, k))
		})]
	});
}
function SendSheet({ onClose, onDone }) {
	const [handle, setHandle] = (0, import_react.useState)(PEOPLE[0]?.handle ?? "");
	const [amount, setAmount] = (0, import_react.useState)("2000");
	const [note, setNote] = (0, import_react.useState)("");
	const mut = useMutation({
		mutationFn: () => {
			const kobo = koboFromNairaInput(amount);
			if (!kobo) throw new Error("Enter an amount");
			return sendDemoMoney({ data: {
				handle,
				kobo,
				note
			} });
		},
		onSuccess: () => {
			toast.message("Demo send recorded", { description: "No real money moved." });
			onDone();
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "Send (demo)",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs text-muted-foreground",
				children: "To"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				className: "mt-1 h-11 w-full rounded-xl border border-input bg-secondary px-3 text-sm",
				value: handle,
				onChange: (e) => setHandle(e.target.value),
				children: PEOPLE.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: p.handle,
					children: [
						p.name,
						" (@",
						p.handle,
						")"
					]
				}, p.handle))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-3",
				value: amount,
				onChange: (e) => setAmount(e.target.value),
				placeholder: "Amount in naira"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-2",
				value: note,
				onChange: (e) => setNote(e.target.value),
				placeholder: "Note"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4 w-full",
				onClick: () => mut.mutate(),
				disabled: mut.isPending,
				children: "Record demo send"
			})
		]
	});
}
function WithdrawSheet({ onClose, onDone }) {
	const [amount, setAmount] = (0, import_react.useState)("5000");
	const [dest, setDest] = (0, import_react.useState)("Linked bank (not connected)");
	const mut = useMutation({
		mutationFn: () => {
			const kobo = koboFromNairaInput(amount);
			if (!kobo) throw new Error("Enter an amount");
			return withdrawDemo({ data: {
				kobo,
				destination: dest
			} });
		},
		onSuccess: () => {
			toast.message("Demo withdrawal recorded", { description: "No payout rail is connected." });
			onDone();
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "Withdraw (demo)",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No bank, card, or mobile-money rail is integrated. This only writes a demo ledger line."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-3",
				value: amount,
				onChange: (e) => setAmount(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-2",
				value: dest,
				onChange: (e) => setDest(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4 w-full",
				onClick: () => mut.mutate(),
				disabled: mut.isPending,
				children: "Record demo withdrawal"
			})
		]
	});
}
function RequestsPane({ data, onRefresh }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const mut = useMutation({
		mutationFn: (input) => updateMoneyRequest({ data: input }),
		onSuccess: onRefresh
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: () => setOpen(true),
				children: "Request or split"
			}),
			(data?.requests ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-card p-4 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							r.direction === "out" ? "You requested" : "Request",
							" @",
							r.peerHandle
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: r.note
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "tabular text-sm",
						children: formatNaira(r.amountKobo)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: r.status === "pending" ? "warn" : "muted",
						children: r.status
					}), r.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => mut.mutate({
								id: r.id,
								status: "cancelled"
							}),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => mut.mutate({
								id: r.id,
								status: "paid"
							}),
							children: "Mark paid (demo)"
						})]
					}) : null]
				})]
			}, r.id)),
			!data?.requests.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No requests",
				body: "Ask a roommate for their share, or split a food run."
			}) : null,
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestSheet, {
				onClose: () => setOpen(false),
				onDone: onRefresh
			}) : null
		]
	});
}
function RequestSheet({ onClose, onDone }) {
	const [selected, setSelected] = (0, import_react.useState)([PEOPLE[1]?.handle ?? "tunde"]);
	const [amount, setAmount] = (0, import_react.useState)("5000");
	const [note, setNote] = (0, import_react.useState)("Roommate share");
	const [split, setSplit] = (0, import_react.useState)(false);
	const mut = useMutation({
		mutationFn: () => {
			const kobo = koboFromNairaInput(amount);
			if (!kobo) throw new Error("Enter an amount");
			return createMoneyRequest({ data: {
				handles: selected,
				kobo,
				note,
				split
			} });
		},
		onSuccess: () => {
			toast.message("Demo request created");
			onDone();
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "Request money",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex max-h-40 flex-col gap-1 overflow-y-auto",
				children: PEOPLE.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: selected.includes(p.handle),
						onChange: (e) => setSelected((cur) => e.target.checked ? [...cur, p.handle] : cur.filter((h) => h !== p.handle))
					}), p.name]
				}, p.handle))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-3",
				value: amount,
				onChange: (e) => setAmount(e.target.value),
				placeholder: "Amount ₦"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-2",
				value: note,
				onChange: (e) => setNote(e.target.value),
				placeholder: "What’s this for?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: split,
					onChange: (e) => setSplit(e.target.checked)
				}), "Split equally between selected"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4 w-full",
				onClick: () => mut.mutate(),
				disabled: mut.isPending,
				children: "Create demo request"
			})
		]
	});
}
function FundingPane({ data, onRefresh }) {
	const [notes, setNotes] = (0, import_react.useState)(data?.funding.notes ?? "");
	const [status, setStatus] = (0, import_react.useState)(data?.funding.status ?? "exploring");
	const mut = useMutation({
		mutationFn: () => saveFundingNotes({ data: {
			program: "nelfund",
			status,
			notes
		} }),
		onSuccess: () => {
			toast.success("Saved your notes — not an official application");
			onRefresh();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-card p-5 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "From UNIBUD" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-lg font-medium",
						children: "Student funding"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: "UNIBUD is not NELFUND. We do not approve loans, invent eligibility, or disburse government funds. This page is guidance plus a private tracker for your own notes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://nelf.gov.ng/",
						target: "_blank",
						rel: "noreferrer",
						className: "mt-4 inline-flex text-sm text-bud underline-offset-4 hover:underline",
						children: "Official NELFUND site — nelf.gov.ng"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-card p-5 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-medium",
					children: "NELFUND, in plain language"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Interest-free education loans administered by the Nigerian Education Loan Fund." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Institutional charges and upkeep are separate conversations on the official portal." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Application, eligibility, and disbursement happen on the government system — not here." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "If a future official integration exists, status will be labelled as verified from the provider." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-card p-5 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium",
						children: "My notes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Private to you. Not submitted anywhere."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "mt-3 h-11 w-full rounded-xl border border-input bg-secondary px-3 text-sm",
						value: status,
						onChange: (e) => setStatus(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "exploring",
								children: "Exploring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "gathering_docs",
								children: "Gathering documents"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "applied_official",
								children: "Applied on official portal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "waiting",
								children: "Waiting on official status"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-3",
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Matric number, school, questions for the bursary…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						size: "sm",
						onClick: () => mut.mutate(),
						disabled: mut.isPending,
						children: "Save notes"
					})
				]
			})
		]
	});
}
function Sheet({ title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end bg-ink/60 md:items-center md:justify-center",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-t-3xl bg-card p-5 md:rounded-3xl",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children
			})]
		})
	});
}
//#endregion
export { Money as component };
