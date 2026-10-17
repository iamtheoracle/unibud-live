import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as canGovernClass } from "./roles-B968-RcG.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { r as useStudioStore } from "./store-Q3creU_Y.mjs";
import { t as recordAudioEvent } from "./events-CplBO0C7.mjs";
import { n as getConversation, s as sendMessage } from "./server-DJgS4hqB.mjs";
import { u as personByHandle } from "./catalog-DxoFHR0q.mjs";
import { t as Avatar } from "./person-BF6bewJz.mjs";
import { A as Mic, B as FlipHorizontal, D as Paperclip, L as Image, T as PhoneOff, W as Ellipsis, a as VideoOff, h as Send, i as Video, j as MicOff, w as Phone } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as cn, i as Route$5 } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady, t as SignInCard } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as BUD_MEDIA } from "./bud-media-oRvNX2s6.mjs";
import { n as mediaUrl } from "./types-DSXVAMNP.mjs";
import { a as sendRoomMessage, i as persistAudioEvent, o as uploadMedia, r as listRoomMessages, t as fileToDataUrl } from "./client-BADY-ptx.mjs";
import { n as ROOM_SEED, r as campusRoomById } from "./chat-rooms-BCFzG8-m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages._id-wBrAqHl5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseShareJson(raw) {
	if (!raw) return void 0;
	try {
		return JSON.parse(raw);
	} catch {
		return;
	}
}
function createPeer(local, signaling) {
	const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
	local.getTracks().forEach((t) => pc.addTrack(t, local));
	let unsub;
	if (signaling) {
		pc.onicecandidate = (e) => {
			if (e.candidate) signaling.send({
				kind: "ice",
				candidate: e.candidate.toJSON()
			});
		};
		unsub = signaling.subscribe((msg) => {
			(async () => {
				if (msg.kind === "offer") {
					await pc.setRemoteDescription({
						type: "offer",
						sdp: msg.sdp
					});
					const answer = await pc.createAnswer();
					await pc.setLocalDescription(answer);
					if (answer.sdp) signaling.send({
						kind: "answer",
						sdp: answer.sdp
					});
				}
				if (msg.kind === "answer" && msg.sdp) await pc.setRemoteDescription({
					type: "answer",
					sdp: msg.sdp
				});
				if (msg.kind === "ice") await pc.addIceCandidate(msg.candidate).catch(() => {});
			})();
		});
	}
	return {
		pc,
		async offer() {
			if (!signaling) return;
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			if (offer.sdp) await signaling.send({
				kind: "offer",
				sdp: offer.sdp
			});
		},
		close() {
			unsub?.();
			pc.close();
		}
	};
}
function signalingNeeded() {
	return "A UNIBUD call signaling service (offer/answer/ICE). STUN is present; TURN and a room server are not.";
}
/** Private 1:1. Local preview is real. Remote needs signaling — not faked. */
function VideoCall({ peer, onEnd }) {
	const mine = (0, import_react.useRef)(null);
	const theirs = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const peerRef = (0, import_react.useRef)(null);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [camOff, setCamOff] = (0, import_react.useState)(false);
	const [facing, setFacing] = (0, import_react.useState)("user");
	const [denied, setDenied] = (0, import_react.useState)(false);
	const [state, setState] = (0, import_react.useState)("getting-media");
	(0, import_react.useEffect)(() => {
		let stop = false;
		navigator.mediaDevices.getUserMedia({
			video: { facingMode: facing },
			audio: true
		}).then((stream) => {
			if (stop) {
				stream.getTracks().forEach((t) => t.stop());
				return;
			}
			streamRef.current = stream;
			if (mine.current) {
				mine.current.srcObject = stream;
				mine.current.play().catch(() => {});
			}
			const session = createPeer(stream);
			peerRef.current = session;
			session.pc.ontrack = (e) => {
				if (theirs.current) theirs.current.srcObject = e.streams[0] ?? new MediaStream([e.track]);
				setState("connected");
			};
			session.pc.onconnectionstatechange = () => {
				const st = session.pc.connectionState;
				if (st === "connected") setState("connected");
				if (st === "failed") setState("failed");
				if (st === "disconnected" || st === "closed") setState("ended");
			};
			setState("waiting-signal");
		}).catch(() => {
			setDenied(true);
			setState("failed");
		});
		return () => {
			stop = true;
			peerRef.current?.close();
			streamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, [facing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[60] bg-ink text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: theirs,
				className: "size-full object-cover",
				playsInline: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: mine,
				className: "absolute right-3 top-[max(3.5rem,env(safe-area-inset-top))] h-36 w-24 rounded-2xl object-cover ring-1 ring-paper/30",
				playsInline: true,
				muted: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 text-sm font-medium",
				children: peer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute inset-x-8 top-16 text-center text-xs text-paper/70",
				children: denied ? "Camera and mic are needed." : state === "waiting-signal" ? signalingNeeded() : state === "connected" ? "Connected" : state === "failed" ? "Call failed" : state === "getting-media" ? "Opening camera…" : "Private call — not Live."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex justify-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-14 place-items-center rounded-full bg-paper/15",
						"aria-label": muted ? "Unmute" : "Mute",
						onClick: () => {
							const next = !muted;
							streamRef.current?.getAudioTracks().forEach((t) => {
								t.enabled = !next;
							});
							setMuted(next);
						},
						children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-14 place-items-center rounded-full bg-paper/15",
						"aria-label": camOff ? "Camera on" : "Camera off",
						onClick: () => {
							const next = !camOff;
							streamRef.current?.getVideoTracks().forEach((t) => {
								t.enabled = !next;
							});
							setCamOff(next);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-16 place-items-center rounded-full bg-destructive",
						"aria-label": "End call",
						onClick: () => {
							peerRef.current?.close();
							streamRef.current?.getTracks().forEach((t) => t.stop());
							onEnd();
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-14 place-items-center rounded-full bg-paper/15",
						"aria-label": "Flip camera",
						onClick: () => setFacing((f) => f === "user" ? "environment" : "user"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipHorizontal, { className: "size-5" })
					})
				]
			})
		]
	});
}
function srcOf(share) {
	if (share.mediaId) return mediaUrl(share.mediaId);
	return share.src;
}
function ShareCard({ share }) {
	const originals = useCampusStore((s) => s.originalAudios ?? []);
	const saveAudio = useCampusStore((s) => s.saveAudio);
	const src = srcOf(share);
	if (share.kind === "photo" && src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		className: "mt-2 max-h-48 w-full rounded-xl object-cover"
	});
	if (share.kind === "video" && src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		src,
		className: "mt-2 max-h-56 w-full rounded-xl",
		controls: true,
		playsInline: true
	});
	if (share.kind === "file") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: src,
		className: "mt-2 block text-xs underline",
		download: true,
		children: share.title ?? "File"
	});
	if (share.kind === "audio") {
		const a = originals.find((x) => x.audioId === share.audioId);
		const title = a?.title ?? share.title ?? "Original audio";
		const who = a?.creatorHandle ? `@${a.creatorHandle}` : "";
		const audioSrc = src || a?.src;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 rounded-2xl bg-background/40 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground",
					children: "Original audio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-semibold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [who, a?.usageCount ? ` · ${a.usageCount} use${a.usageCount === 1 ? "" : "s"}` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-3 text-xs font-medium",
					children: [
						audioSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
							src: audioSrc,
							className: "h-8 w-28",
							controls: true
						}) : null,
						share.audioId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/audio/$id",
							params: { id: share.audioId },
							className: "leading-8",
							children: "Open"
						}) : null,
						share.audioId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								saveAudio(share.audioId);
								recordAudioEvent({
									kind: "save",
									audioId: share.audioId,
									surface: "chat"
								});
							},
							children: "Save"
						}) : null
					]
				})
			]
		});
	}
	if (share.kind === "bud") {
		const m = BUD_MEDIA.find((x) => x.id === share.budMediaId);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 rounded-2xl bg-background/40 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-semibold tracking-[0.14em] uppercase text-bud",
					children: "Bud"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-semibold",
					children: m?.title ?? share.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [m?.kind === "podcast" ? "Lecturer podcast" : m?.kind ?? "Academic media", m ? ` · ${m.durationMin} min` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-3 text-xs font-medium",
					children: [src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						src,
						className: "h-8 w-36",
						controls: true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Open in Bud to play"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bud",
						onClick: () => {
							if (share.budMediaId) sessionStorage.setItem("unibud-bud-media", share.budMediaId);
						},
						children: "Open in Bud"
					})]
				})
			]
		});
	}
	return share.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-sm",
		children: share.title
	}) : null;
}
function Thread() {
	const { id } = Route$5.useParams();
	const room = campusRoomById(id);
	if (room) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomThread, { room });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectThread, { id });
}
function DirectThread({ id }) {
	const { user, isPending } = useAuthReady();
	const qc = useQueryClient();
	const [body, setBody] = (0, import_react.useState)("");
	const q = useQuery({
		queryKey: ["convo", id],
		queryFn: () => getConversation({ data: id }),
		enabled: Boolean(user)
	});
	const mut = useMutation({
		mutationFn: (extra) => sendMessage({ data: {
			conversationId: id,
			body: extra?.body ?? body,
			mediaId: extra?.mediaId,
			shareKind: extra?.shareKind,
			shareJson: extra?.shareJson
		} }),
		onSuccess: () => {
			setBody("");
			qc.invalidateQueries({ queryKey: ["convo", id] });
			qc.invalidateQueries({ queryKey: ["convos"] });
		}
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-40 animate-pulse rounded-2xl bg-secondary" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "px-5 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {
			title: "Sign in",
			body: "Chats are private to your account."
		})
	});
	const person = personByHandle(q.data?.conversation.peerHandle ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-[calc(100dvh-3.5rem)] flex-col bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-border px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name: person?.name ?? "Student",
						className: "size-11"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: person?.name ?? q.data?.conversation.peerHandle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-success",
							children: "Active now · Direct"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallButtons, {
						group: false,
						peer: person?.name ?? "them"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-y-auto px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted-foreground",
					children: "Today"
				}), (q.data?.messages ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", m.sender === "me" ? "ml-auto bg-ink text-paper" : "bg-secondary text-foreground"),
					children: [m.body, m.shareJson || m.mediaId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareCard, { share: parseShareJson(m.shareJson) ?? {
						kind: m.shareKind ?? "file",
						mediaId: m.mediaId,
						title: m.body
					} }) : null]
				}, m.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
				body,
				setBody,
				placeholder: `Message ${person?.name.split(" ")[0] ?? ""}…`,
				onSend: () => {
					if (body.trim()) mut.mutate();
				},
				pending: mut.isPending,
				conversationId: id,
				onShare: (share) => {
					mut.mutateAsync({
						body: share.title ?? "",
						mediaId: share.mediaId,
						shareKind: share.kind,
						shareJson: JSON.stringify(share)
					});
					if (share.audioId) {
						recordAudioEvent({
							kind: "share",
							audioId: share.audioId,
							surface: "chat"
						});
						persistAudioEvent({ data: {
							kind: "share",
							audioId: share.audioId,
							surface: "chat"
						} });
					}
					persistAudioEvent({ data: {
						kind: "chat_media_sent",
						surface: "chat"
					} });
				},
				onCamera: () => {
					useCampusStore.getState().setComposeOpen(true);
					useStudioStore.getState().setDest("message", id);
					useStudioStore.getState().setView("camera");
				}
			})
		]
	});
}
function RoomThread({ room }) {
	const { user, isPending } = useAuthReady();
	const qc = useQueryClient();
	const role = useCampusStore((s) => s.role ?? "student");
	const [body, setBody] = (0, import_react.useState)("");
	const q = useQuery({
		queryKey: ["room", room.id],
		queryFn: () => listRoomMessages({ data: room.id }),
		enabled: Boolean(user)
	});
	const mut = useMutation({
		mutationFn: (extra) => sendRoomMessage({ data: {
			roomId: room.id,
			senderName: "You",
			body: extra?.body ?? body,
			mediaId: extra?.mediaId,
			shareKind: extra?.shareKind,
			shareJson: extra?.shareJson
		} }),
		onSuccess: () => {
			setBody("");
			qc.invalidateQueries({ queryKey: ["room", room.id] });
		}
	});
	const sentPending = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (sentPending.current || !user) return;
		const pending = useCampusStore.getState().pendingShare;
		if (!pending) return;
		sentPending.current = true;
		mut.mutateAsync({
			body: pending.title ?? "",
			mediaId: pending.mediaId,
			shareKind: pending.kind,
			shareJson: JSON.stringify(pending)
		});
		useCampusStore.getState().setPendingShare(void 0);
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-40 animate-pulse rounded-2xl bg-secondary" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "px-5 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {
			title: "Sign in",
			body: "Class, study and community chats are private."
		})
	});
	const canCall = room.kind === "study" || room.kind === "group" || room.kind === "class" && canGovernClass(role);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-[calc(100dvh-3.5rem)] flex-col bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-border px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: room.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								room.kind,
								" chat · ",
								room.subtitle
							]
						})]
					}),
					room.communityId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/communities/$id",
						params: { id: room.communityId },
						className: "text-xs font-medium text-bud",
						children: "Space"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallButtons, {
						group: true,
						disabled: !canCall,
						onCall: () => toast.message(canCall ? "Demo group call — nobody is on a real line." : "Class governors start class calls. Study groups can call among themselves.")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-y-auto px-4 py-5",
				children: [(ROOM_SEED[room.id] ?? []).map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", m.sender === "You" ? "ml-auto bg-ink text-paper" : "bg-secondary text-foreground"),
					children: [m.sender !== "You" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-[11px] font-medium text-muted-foreground",
						children: m.sender
					}) : null, m.body]
				}, `seed-${i}`)), (q.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", m.sender === "You" ? "ml-auto bg-ink text-paper" : "bg-secondary text-foreground"),
					children: [
						m.sender !== "You" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-[11px] font-medium text-muted-foreground",
							children: m.sender
						}) : null,
						m.body,
						m.shareJson || m.mediaId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareCard, { share: parseShareJson(m.shareJson) ?? {
							kind: m.shareKind ?? "file",
							mediaId: m.mediaId,
							title: m.body
						} }) : null
					]
				}, m.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
				body,
				setBody,
				placeholder: `Message ${room.title}…`,
				onSend: () => {
					const t = body.trim();
					if (!t) return;
					mut.mutateAsync({ body: t });
				},
				pending: mut.isPending,
				roomId: room.id,
				onShare: (share) => {
					mut.mutateAsync({
						body: share.title ?? "",
						mediaId: share.mediaId,
						shareKind: share.kind,
						shareJson: JSON.stringify(share)
					});
				}
			})
		]
	});
}
function CallButtons({ group, disabled, onCall, peer = "them" }) {
	const [video, setVideo] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCall, {
			peer,
			onEnd: () => setVideo(false)
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "grid size-11 place-items-center text-muted-foreground disabled:opacity-40",
			"aria-label": group ? "Group call" : "Call",
			disabled,
			onClick: () => onCall ? onCall() : toast.message("Voice needs a connected call service. Video is available now."),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "grid size-11 place-items-center text-muted-foreground",
			"aria-label": "Video call",
			onClick: () => setVideo(true),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "grid size-11 place-items-center text-muted-foreground",
			"aria-label": "More",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-5" })
		})
	] });
}
function Composer({ body, setBody, placeholder, onSend, pending, onCamera, onShare, conversationId, roomId }) {
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [pick, setPick] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const originals = useCampusStore((s) => s.originalAudios ?? []);
	const photoRef = (0, import_react.useRef)(null);
	const videoRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	async function sendFile(file, kind) {
		setBusy(true);
		try {
			const dataUrl = await fileToDataUrl(file);
			const r = await uploadMedia({ data: {
				dataUrl,
				fileName: file.name,
				mime: file.type,
				kind: kind === "file" ? "file" : kind === "photo" ? "photo" : kind === "video" ? "video" : "audio",
				conversationId,
				roomId
			} });
			if (!r.ok) {
				toast.message(r.error);
				return;
			}
			onShare?.({
				kind,
				mediaId: r.id,
				title: file.name,
				src: mediaUrl(r.id)
			});
		} catch {
			toast.message("Could not send that file.");
		} finally {
			setBusy(false);
			setMenu(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sheet-safe border-t border-border px-3 pt-3",
		children: [
			menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap gap-2 text-xs font-medium",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full bg-secondary px-3 py-2",
						onClick: () => photoRef.current?.click(),
						children: "Photo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full bg-secondary px-3 py-2",
						onClick: () => videoRef.current?.click(),
						children: "Video"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full bg-secondary px-3 py-2",
						onClick: () => setPick("audio"),
						children: "Audio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full bg-secondary px-3 py-2",
						onClick: () => fileRef.current?.click(),
						children: "File"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full bg-secondary px-3 py-2",
						onClick: () => setPick("bud"),
						children: "Bud"
					}),
					busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Sending…"
					}) : null
				]
			}) : null,
			pick === "audio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 max-h-36 overflow-y-auto rounded-2xl bg-secondary p-2",
				children: originals.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "block w-full rounded-xl px-2 py-2 text-left text-xs",
					onClick: () => {
						onShare?.({
							kind: "audio",
							audioId: a.audioId,
							title: a.title
						});
						setPick(null);
						setMenu(false);
					},
					children: [
						"Original audio · @",
						a.creatorHandle,
						" — ",
						a.title
					]
				}, a.audioId))
			}) : null,
			pick === "bud" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 rounded-2xl bg-secondary p-2",
				children: BUD_MEDIA.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "block w-full rounded-xl px-2 py-2 text-left text-xs",
					onClick: () => {
						onShare?.({
							kind: "bud",
							budMediaId: m.id,
							title: m.title,
							duration: `${m.durationMin} min`
						});
						setPick(null);
						setMenu(false);
					},
					children: [
						"Bud · ",
						m.title,
						" · ",
						m.durationMin,
						" min"
					]
				}, m.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex items-center gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					onSend();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center text-muted-foreground",
						"aria-label": "Attach",
						onClick: () => setMenu((v) => !v),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center text-muted-foreground",
						"aria-label": "Camera",
						onClick: onCamera,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: body,
						onChange: (e) => setBody(e.target.value),
						placeholder,
						className: "h-11 flex-1 rounded-full bg-secondary px-4 text-sm outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: pending || busy || !body.trim(),
						className: "grid size-11 place-items-center text-ink disabled:text-muted-foreground",
						"aria-label": "Send",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: photoRef,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					e.target.value = "";
					if (!f) return;
					sendFile(f, "photo");
					setMenu(false);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: videoRef,
				type: "file",
				accept: "video/*",
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					e.target.value = "";
					if (!f) return;
					sendFile(f, "video");
					setMenu(false);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					e.target.value = "";
					if (!f) return;
					sendFile(f, "file");
				}
			})
		]
	});
}
//#endregion
export { Thread as component };
