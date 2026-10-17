import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { i as roleLabel } from "./roles-B968-RcG.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { o as getMyProfile, p as upsertMyProfile } from "./server-3ArcV-Gz.mjs";
import { a as myCommunities } from "./server-DJgS4hqB.mjs";
import { c as UNIVERSITIES, d as uniById, n as COMMUNITIES } from "./catalog-DxoFHR0q.mjs";
import { t as Avatar } from "./person-BF6bewJz.mjs";
import { rt as BadgeCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady, t as SignInCard } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as Textarea } from "./textarea-DCQBtqbi.mjs";
import { t as Input } from "./input-BLGtTKRX.mjs";
import { t as Label } from "./label-CLxaGYqN.mjs";
import { i as tagLabel, n as SOCIAL_PLATFORMS, r as isSafeExternalUrl, t as IDENTITY_TAGS } from "./identity-tags-DhbfIlck.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-yCnqzjSm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Profile() {
	const { user, isPending } = useAuthReady();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	const mine = useQuery({
		queryKey: ["my-communities"],
		queryFn: () => myCommunities(),
		enabled: Boolean(user)
	});
	const [ctx, setCtx] = (0, import_react.useState)("social");
	const [tab, setTab] = (0, import_react.useState)("posts");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [handle, setHandle] = (0, import_react.useState)("");
	const [universityId, setUniversityId] = (0, import_react.useState)("unilag");
	const [program, setProgram] = (0, import_react.useState)("");
	const [year, setYear] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [hlName, setHlName] = (0, import_react.useState)("");
	const role = useCampusStore((s) => s.role ?? "student");
	const faculty = useCampusStore((s) => s.faculty);
	const department = useCampusStore((s) => s.department);
	const setFaculty = useCampusStore((s) => s.setFaculty);
	const setDepartment = useCampusStore((s) => s.setDepartment);
	const connections = useCampusStore((s) => s.connections);
	const following = useCampusStore((s) => s.following);
	const followers = useCampusStore((s) => s.followers);
	const localPosts = useCampusStore((s) => s.localPosts);
	const visibility = useCampusStore((s) => s.profileVisibility);
	const academicVisibility = useCampusStore((s) => s.academicVisibility);
	const identityTags = useCampusStore((s) => s.identityTags);
	const toggleIdentityTag = useCampusStore((s) => s.toggleIdentityTag);
	const socialLinks = useCampusStore((s) => s.socialLinks);
	const setSocialLinks = useCampusStore((s) => s.setSocialLinks);
	const highlights = useCampusStore((s) => s.highlights);
	const addHighlight = useCampusStore((s) => s.addHighlight);
	const removeHighlight = useCampusStore((s) => s.removeHighlight);
	const interests = useCampusStore((s) => s.interests);
	const skills = useCampusStore((s) => s.skills);
	const setSkills = useCampusStore((s) => s.setSkills);
	const projects = useCampusStore((s) => s.projects);
	const avatarDataUrl = useCampusStore((s) => s.avatarDataUrl);
	const setAvatarDataUrl = useCampusStore((s) => s.setAvatarDataUrl);
	const legalName = useCampusStore((s) => s.legalName);
	const setLegalName = useCampusStore((s) => s.setLegalName);
	const setHomeCampusId = useCampusStore((s) => s.setHomeCampusId);
	const [cropX, setCropX] = (0, import_react.useState)(50);
	const [cropY, setCropY] = (0, import_react.useState)(50);
	const [cropSrc, setCropSrc] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!q.data) {
			if (user?.displayName) setDisplayName(user.displayName);
			return;
		}
		setDisplayName(q.data.displayName);
		setHandle(q.data.handle);
		setUniversityId(q.data.universityId);
		setProgram(q.data.program);
		setYear(q.data.year);
		setBio(q.data.bio);
		if (q.data.universityId) setHomeCampusId(q.data.universityId);
	}, [
		q.data,
		user,
		setHomeCampusId
	]);
	const save = useMutation({
		mutationFn: () => upsertMyProfile({ data: {
			displayName,
			handle,
			universityId,
			program,
			year,
			bio,
			campusRole: role
		} }).then((row) => {
			if (row?.universityId) setHomeCampusId(row.universityId);
			return row;
		}),
		onSuccess: () => {
			toast.success("Profile saved");
			setEditing(false);
			qc.invalidateQueries({ queryKey: ["profile"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-40 animate-pulse rounded-2xl bg-secondary" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "px-5 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {
			title: "Your profile",
			body: "Sign in to keep a student identity on UNIBUD."
		})
	});
	const uni = uniById(universityId);
	const rooms = COMMUNITIES.filter((c) => mine.data?.includes(c.id)).slice(0, 6);
	const shownHandle = handle || "you";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "One identity. Social and Academic are how you show up — not two accounts."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start gap-4",
				children: [avatarDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: avatarDataUrl,
					alt: "",
					className: "size-16 rounded-2xl object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					name: displayName || user.displayName || "You",
					className: "size-16 text-lg rounded-2xl"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-3xl",
							children: [displayName || user.displayName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "ml-1 inline size-4 text-bud" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: ["@", shownHandle]
						}),
						ctx === "academic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs font-medium",
							children: roleLabel(role, program || void 0)
						}) : identityTags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: identityTags.map(tagLabel).join(" · ")
						}) : null
					]
				})]
			}),
			bio && ctx === "social" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed",
				children: bio
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 grid grid-cols-3 gap-2 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
						n: connections.length,
						label: "Connections"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
						n: followers.length,
						label: "Followers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
						n: following.length,
						label: "Following"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCtx("social"),
					className: cn("h-9 rounded-full px-4 text-sm", ctx === "social" ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
					children: "Social"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCtx("academic"),
					className: cn("h-9 rounded-full px-4 text-sm", ctx === "academic" ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
					children: "Academic"
				})]
			}),
			ctx === "social" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				highlights.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Highlights"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex gap-3 overflow-x-auto",
						children: highlights.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-20 shrink-0 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto size-16 overflow-hidden rounded-full bg-secondary ring-2 ring-border",
									children: h.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: h.cover,
										alt: "",
										className: "size-full object-cover"
									}) : null
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 truncate text-[11px]",
									children: h.name
								}),
								editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-[10px] text-muted-foreground",
									onClick: () => removeHighlight(h.id),
									children: "Remove"
								}) : null
							]
						}, h.id))
					})]
				}) : null,
				interests.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs text-muted-foreground",
					children: ["Into ", interests.join(", ")]
				}) : null,
				socialLinks.filter((l) => l.visible && isSafeExternalUrl(l.url)).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: socialLinks.filter((l) => l.visible && isSafeExternalUrl(l.url)).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.url,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "h-8 rounded-full bg-secondary px-3 text-xs leading-8 capitalize",
						children: l.platform
					}, l.id))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex gap-2",
					children: [
						"posts",
						"reels",
						"saved"
					].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(id),
						className: cn("h-9 rounded-full px-4 text-sm capitalize", tab === id ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
						children: id === "posts" ? "All posts" : id === "reels" ? "Reels" : "Saved"
					}, id))
				}),
				tab === "posts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2",
					children: [localPosts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-xl bg-card p-3 text-sm ring-1 ring-border",
						children: p.body
					}, p.id)), localPosts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-6 text-sm text-muted-foreground",
						children: "No posts yet. Square is for sharing."
					}) : null]
				}) : null,
				tab === "reels" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2",
					children: [localPosts.filter((p) => p.kind === "reel" || p.video).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "overflow-hidden rounded-xl bg-card ring-1 ring-border",
						children: [p.image || p.video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.image ?? p.video,
							alt: "",
							className: "h-32 w-full object-cover"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-3 text-sm",
							children: p.body
						})]
					}, p.id)), localPosts.filter((p) => p.kind === "reel" || p.video).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-6 text-sm text-muted-foreground",
						children: "Reels you post on Square show up here. They are not a separate app."
					}) : null]
				}) : null,
				tab === "saved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: [
						"Saved is private to you.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/saved",
							className: "font-medium text-foreground",
							children: "Open Saved"
						})
					]
				}) : null
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-5 grid grid-cols-2 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Campus",
							value: uni?.shortName ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Faculty",
							value: faculty || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Department",
							value: department || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Programme",
							value: program || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Level",
							value: year || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Academic visibility",
							value: academicVisibility
						})
					]
				}),
				skills.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs text-muted-foreground",
					children: ["Skills · ", skills.join(" · ")]
				}) : null,
				projects.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-card p-3 text-sm ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: p.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: p.note
						})]
					}, p.id))
				}) : null,
				rooms.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Communities"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-2",
						children: rooms.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/communities/$id",
							params: { id: c.id },
							className: "text-sm text-bud",
							children: c.name
						}) }, c.id))
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs text-muted-foreground",
					children: [
						"Legal name stays off the social card. Social visibility: ",
						visibility,
						"."
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6 w-full",
				variant: editing ? "outline" : "primary",
				onClick: () => setEditing((v) => !v),
				children: editing ? "Close editor" : "Edit Profile"
			}),
			editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Display name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: displayName,
							onChange: (e) => setDisplayName(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Username",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: handle,
							onChange: (e) => setHandle(e.target.value),
							placeholder: "adaeze"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Legal name (not shown socially)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: legalName,
							onChange: (e) => setLegalName(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Profile photo (square crop)",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							className: "text-sm",
							onChange: (e) => {
								const file = e.target.files?.[0];
								if (!file) return;
								const url = URL.createObjectURL(file);
								setCropSrc((prev) => {
									if (prev) URL.revokeObjectURL(prev);
									return url;
								});
								setCropX(50);
								setCropY(50);
							}
						}), cropSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: cropSrc,
									alt: "",
									className: "size-24 rounded-2xl object-cover",
									style: { objectPosition: `${cropX}% ${cropY}%` }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-[11px] text-muted-foreground",
									children: ["Move horizontally", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: 100,
										value: cropX,
										onChange: (e) => setCropX(Number(e.target.value)),
										className: "w-full"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-[11px] text-muted-foreground",
									children: ["Move vertically", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: 100,
										value: cropY,
										onChange: (e) => setCropY(Number(e.target.value)),
										className: "w-full"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => {
										const img = new Image();
										img.onload = () => {
											const canvas = document.createElement("canvas");
											canvas.width = 320;
											canvas.height = 320;
											const ctx2 = canvas.getContext("2d");
											if (!ctx2) return;
											const size = Math.min(img.width, img.height);
											const maxX = img.width - size;
											const maxY = img.height - size;
											const sx = cropX / 100 * maxX;
											const sy = cropY / 100 * maxY;
											ctx2.drawImage(img, sx, sy, size, size, 0, 0, 320, 320);
											setAvatarDataUrl(canvas.toDataURL("image/jpeg", .86));
										};
										img.src = cropSrc;
									},
									children: "Use this crop"
								})
							]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bio",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: bio,
							onChange: (e) => setBio(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Social roles"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: IDENTITY_TAGS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => toggleIdentityTag(t.id),
							className: cn("h-8 rounded-full px-3 text-xs", identityTags.includes(t.id) ? "bg-ink text-paper" : "bg-secondary"),
							children: t.label
						}, t.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "External accounts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: SOCIAL_PLATFORMS.map((p) => {
							const existing = socialLinks.find((l) => l.platform === p.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-20 text-xs",
									children: p.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: `https://${p.host}/you`,
									value: existing?.url ?? "",
									onChange: (e) => {
										const url = e.target.value;
										const next = socialLinks.filter((l) => l.platform !== p.id);
										if (url.trim()) next.push({
											id: existing?.id ?? p.id,
											platform: p.id,
											url: url.trim(),
											visible: existing?.visible ?? true
										});
										setSocialLinks(next);
									}
								})]
							}, p.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "New highlight (optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: hlName,
								onChange: (e) => setHlName(e.target.value),
								placeholder: "Hall week"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => {
									if (!hlName.trim()) return;
									addHighlight({
										id: `hl-${Date.now()}`,
										name: hlName.trim(),
										cover: "/covers/campus-night.jpg",
										items: ["/covers/campus-night.jpg"]
									});
									setHlName("");
								},
								children: "Add"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "University",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: universityId,
							onChange: (e) => setUniversityId(e.target.value),
							className: "h-12 w-full rounded-full bg-secondary px-4 text-sm",
							children: UNIVERSITIES.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: u.id,
								children: u.name
							}, u.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Faculty",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: faculty,
							onChange: (e) => setFaculty(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Department",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: department,
							onChange: (e) => setDepartment(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Programme",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: program,
							onChange: (e) => setProgram(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Year",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: year,
							onChange: (e) => setYear(e.target.value),
							placeholder: "300"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Skills (comma)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: skills.join(", "),
							onChange: (e) => setSkills(e.target.value.split(",").map((x) => x.trim()).filter(Boolean))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: save.isPending,
						children: "Save"
					})
				]
			}) : null
		]
	});
}
function Count({ n, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-card py-3 ring-1 ring-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-muted-foreground",
			children: label
		})]
	});
}
function Meta({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-card p-3 ring-1 ring-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-medium capitalize",
			children: value
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { Profile as component };
