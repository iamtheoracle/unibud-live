import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/campus-store-VLAQ_aP0.js
var ago = (m) => (/* @__PURE__ */ new Date(Date.now() - m * 6e4)).toISOString();
var SEED_SPILLS = [
	{
		id: "sp1",
		authorHandle: "amaka",
		body: "Faculty night was actually good from the floor. Whoever said it was dead was standing in the wrong corner.",
		createdAt: ago(18),
		communityId: "afrobeats",
		replies: [{
			id: "sp1a",
			authorHandle: "kemi",
			body: "The DJ saved it after 11. Before that it was a photoshoot.",
			createdAt: ago(14)
		}, {
			id: "sp1b",
			authorHandle: "tunde",
			body: "I left early. Gate light was already a queue.",
			createdAt: ago(11),
			parentId: "sp1a"
		}]
	},
	{
		id: "sp2",
		authorHandle: "tunde",
		body: "If your hostel group chat is still arguing about whose turn it is to buy gas, just split it on UNIBUD and rest.",
		createdAt: ago(42),
		communityId: "hostel-life",
		replies: [{
			id: "sp2a",
			authorHandle: "ibrahim",
			body: "This is the whole point. Stop collecting cash in DMs.",
			createdAt: ago(38)
		}]
	},
	{
		id: "sp3",
		authorHandle: "chinedu",
		body: "Unpopular: most “campus startups” are just WhatsApp stores with a Canva logo. Ship something that works offline first.",
		createdAt: ago(90),
		communityId: "campus-biz",
		replies: []
	},
	{
		id: "sp4",
		authorHandle: "fatima",
		body: "Night class playlist that is not Afrobeats-only. Drop one song. I’ll start: anything with no lyrics for the last hour.",
		createdAt: ago(120),
		communityId: "quiet-nights",
		replies: [{
			id: "sp4a",
			authorHandle: "adaeze",
			body: "Instrumental Burna still counts. Don’t fight me.",
			createdAt: ago(110)
		}]
	},
	{
		id: "sp5",
		authorHandle: "ibrahim",
		body: "Saturday five-a-side is not cancelled. Pitch behind the hostel, 5pm. Bring a bib or come in white.",
		createdAt: ago(180),
		communityId: "five-aside",
		replies: [{
			id: "sp5a",
			authorHandle: "tunde",
			body: "I have the ball. Don’t be the person who shows up in slides.",
			createdAt: ago(160)
		}]
	},
	{
		id: "sp6",
		authorHandle: "kemi",
		body: "Someone in The Gist said faculty night tickets were sold out. They were not. Marketplace still has them. Stop buying from broadcasts.",
		createdAt: ago(240),
		communityId: "the-gist",
		quoteId: "sp1",
		replies: [{
			id: "sp6a",
			authorHandle: "amaka",
			body: "Correct. I listed the last Saturday slots in services too.",
			createdAt: ago(220)
		}]
	},
	{
		id: "sp7",
		authorHandle: "aisha_nbo",
		body: "We open-sourced a $90 robot arm that learns from a phone. If you are building in engineering anywhere, the notes are public. Fork it.",
		createdAt: ago(50),
		communityId: "tech-builders",
		replies: [{
			id: "sp7a",
			authorHandle: "adaeze",
			body: "This is the kind of demo I want in lab, not another slide deck.",
			createdAt: ago(40)
		}]
	},
	{
		id: "sp8",
		authorHandle: "jonas_wits",
		body: "New ice map in a lunar crater you can actually point to. Not a TED talk. The photo is the point.",
		createdAt: ago(70),
		replies: []
	}
];
var RightsManagement = {
	report(audio, reason) {
		return {
			audio: {
				...audio,
				status: audio.status === "removed" ? "removed" : "reported"
			},
			report: {
				id: `ar-${Date.now()}`,
				audioId: audio.audioId,
				reason,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		};
	},
	takedown(audio) {
		return {
			...audio,
			status: "removed",
			src: void 0
		};
	},
	restrict(audio) {
		return {
			...audio,
			status: "restricted"
		};
	}
};
function originalFromPublish(input) {
	return {
		audioId: `oa-${input.sourceContentId}`,
		sourceType: "ORIGINAL_AUDIO",
		title: input.title,
		creatorHandle: input.creatorHandle,
		sourceContentId: input.sourceContentId,
		durationMs: input.durationMs,
		src: input.src,
		usageCount: 1,
		usedBy: [input.sourceContentId],
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		status: "active",
		claimedOriginal: true
	};
}
var SEED_ORIGINAL_AUDIO = [{
	audioId: "oa-adaeze-morning",
	sourceType: "ORIGINAL_AUDIO",
	title: "Campus morning voiceover",
	creatorHandle: "adaeze",
	sourceContentId: "p1",
	durationMs: 8400,
	usageCount: 1,
	usedBy: ["p1"],
	createdAt: "2026-08-20T07:12:00.000Z",
	status: "active",
	claimedOriginal: true
}, {
	audioId: "oa-tunde-gate",
	sourceType: "ORIGINAL_AUDIO",
	title: "Second gate at 8am",
	creatorHandle: "tunde",
	sourceContentId: "p2",
	durationMs: 11200,
	usageCount: 1,
	usedBy: ["p2"],
	createdAt: "2026-08-21T08:04:00.000Z",
	status: "active",
	claimedOriginal: true
}];
var SEED_NOTES = [
	{
		id: "n1",
		kind: "social",
		title: "Your post just got some love from Tunde.",
		body: "He reacted to the hostel note you shared with campus.",
		href: "/",
		read: false,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 48e4)).toISOString()
	},
	{
		id: "n2",
		kind: "social",
		title: "Adaeze Okonkwo accepted your connection request.",
		body: "You can message her without waiting on a request.",
		href: "/connect",
		read: false,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 144e4)).toISOString()
	},
	{
		id: "n3",
		kind: "communities",
		title: "UNN Engineering has new replies in a discussion you follow.",
		body: "Twelve people jumped in since you last looked.",
		href: "/communities/unn-eng",
		read: false,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 36e5)).toISOString()
	},
	{
		id: "n4",
		kind: "events",
		title: "Reminder: Faculty night is tonight.",
		body: "Doors from 19:30. Tickets are in Marketplace — Events.",
		href: "/market",
		read: true,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 144e5)).toISOString()
	},
	{
		id: "n5",
		kind: "class",
		title: "CSC 301 is live on UniBoard.",
		body: "Dr. Okoro started Recursion. Joining now can count as live attendance.",
		href: "/board/csc301",
		read: false,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 3e5)).toISOString()
	},
	{
		id: "n6",
		kind: "live",
		title: "Late join is still live.",
		body: "You can rejoin CSC 301 while the session is open. Recording later will not flip absence.",
		href: "/board/csc301",
		read: false,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 18e4)).toISOString()
	},
	{
		id: "n7",
		kind: "news",
		title: "Exam timetable is out.",
		body: "Dates sit on UniBoard and Educational News — not Square.",
		href: "/news",
		read: false,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 54e5)).toISOString()
	}
];
var useCampusStore = create()(persist((set) => ({
	liked: {},
	likeCounts: {
		p1: 28,
		p2: 14,
		p3: 41,
		p5: 63,
		p8: 9,
		sp1: 22,
		sp3: 31,
		sp6: 18
	},
	following: ["amaka", "adaeze"],
	followers: ["tunde", "kemi"],
	connections: ["amaka", "tunde"],
	incoming: [
		"chinedu",
		"kemi",
		"fatima"
	],
	outgoing: ["ibrahim"],
	recentSearches: [
		"architecture society",
		"faculty night",
		"Adaeze Okonkwo"
	],
	localPosts: [],
	myStories: [],
	notes: SEED_NOTES,
	storiesSeen: [],
	showBud: true,
	budShortcut: "bottom",
	role: "student",
	tutorMode: false,
	liveAttendance: {},
	livePresence: {},
	recordingWatched: {},
	faculty: "Engineering",
	department: "Computer Engineering",
	programme: "Computer Engineering",
	level: "200",
	semester: "1",
	profileVisibility: "public",
	academicVisibility: "connections",
	identityTags: [],
	socialLinks: [],
	highlights: [],
	interests: [],
	academicInterests: [],
	skills: [],
	projects: [],
	onboardingDone: false,
	avatarDataUrl: "",
	legalName: "",
	postReplies: {},
	spills: SEED_SPILLS,
	flaggedSpills: [],
	followedRiffs: [],
	homeCampusId: "unilag",
	lifeStage: "student",
	hiddenPosts: [],
	savedPosts: [],
	reportedPosts: [],
	commentLikes: {},
	composeOpen: false,
	dropOpen: false,
	originalAudios: SEED_ORIGINAL_AUDIO,
	savedAudioIds: [],
	audioReports: [],
	squareView: "feed",
	prefs: {
		push: true,
		reads: true,
		market: false
	},
	fixerRatings: [],
	budAtlas: {
		lastGoal: "",
		understood: [],
		struggles: [],
		likes: []
	},
	toggleLike: (id) => set((s) => {
		const on = !s.liked[id];
		const base = s.likeCounts[id] ?? 12;
		return {
			liked: {
				...s.liked,
				[id]: on
			},
			likeCounts: {
				...s.likeCounts,
				[id]: Math.max(0, base + (on ? 1 : -1))
			}
		};
	}),
	follow: (handle) => set((s) => ({ following: s.following.includes(handle) ? s.following : [...s.following, handle] })),
	unfollow: (handle) => set((s) => ({ following: s.following.filter((h) => h !== handle) })),
	accept: (handle) => set((s) => ({
		incoming: s.incoming.filter((h) => h !== handle),
		connections: s.connections.includes(handle) ? s.connections : [...s.connections, handle]
	})),
	decline: (handle) => set((s) => ({ incoming: s.incoming.filter((h) => h !== handle) })),
	request: (handle) => set((s) => ({ outgoing: s.outgoing.includes(handle) ? s.outgoing : [...s.outgoing, handle] })),
	cancelRequest: (handle) => set((s) => ({ outgoing: s.outgoing.filter((h) => h !== handle) })),
	unconnect: (handle) => set((s) => ({ connections: s.connections.filter((h) => h !== handle) })),
	addSearch: (q) => set((s) => {
		const t = q.trim();
		if (!t) return s;
		return { recentSearches: [t, ...s.recentSearches.filter((x) => x !== t)].slice(0, 8) };
	}),
	clearSearches: () => set({ recentSearches: [] }),
	removeSearch: (q) => set((s) => ({ recentSearches: s.recentSearches.filter((x) => x !== q) })),
	addPost: (body, handle, media) => set((s) => ({ localPosts: [{
		id: media?.id ?? `local-${Date.now()}`,
		authorHandle: handle,
		body,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		communityId: s.homeCampusId === "unn" ? "unn-eng" : "unilag-campus",
		image: media?.image,
		video: media?.video,
		kind: media?.video ? "reel" : "post",
		audioId: media?.audioId
	}, ...s.localPosts] })),
	addStory: (story) => set((s) => ({ myStories: [story, ...s.myStories ?? []].slice(0, 12) })),
	markAllRead: () => set((s) => ({ notes: s.notes.map((n) => ({
		...n,
		read: true
	})) })),
	markRead: (id) => set((s) => ({ notes: s.notes.map((n) => n.id === id ? {
		...n,
		read: true
	} : n) })),
	seeStory: (handle) => set((s) => ({ storiesSeen: s.storiesSeen.includes(handle) ? s.storiesSeen : [...s.storiesSeen, handle] })),
	setShowBud: (v) => set({
		showBud: v,
		budShortcut: v ? "bottom" : "hidden"
	}),
	setBudShortcut: (v) => set({
		budShortcut: v,
		showBud: v !== "hidden"
	}),
	setRole: (v) => set({
		role: v,
		tutorMode: v === "lecturer"
	}),
	setTutorMode: (v) => set((s) => ({ tutorMode: s.role === "lecturer" ? v : false })),
	markLivePresent: (sessionId) => set((s) => ({
		liveAttendance: {
			...s.liveAttendance,
			[sessionId]: "present"
		},
		livePresence: {
			...s.livePresence,
			[sessionId]: "in"
		}
	})),
	leaveLive: (sessionId) => set((s) => ({ livePresence: {
		...s.livePresence,
		[sessionId]: "away"
	} })),
	rejoinLive: (sessionId) => set((s) => ({
		liveAttendance: {
			...s.liveAttendance,
			[sessionId]: "present"
		},
		livePresence: {
			...s.livePresence,
			[sessionId]: "in"
		}
	})),
	markRecordingWatched: (sessionId) => set((s) => ({ recordingWatched: {
		...s.recordingWatched,
		[sessionId]: true
	} })),
	setFaculty: (v) => set({ faculty: v }),
	setDepartment: (v) => set({ department: v }),
	setProgramme: (v) => set({ programme: v }),
	setLevel: (v) => set({ level: v }),
	setSemester: (v) => set({ semester: v }),
	setProfileVisibility: (v) => set({ profileVisibility: v }),
	setAcademicVisibility: (v) => set({ academicVisibility: v }),
	toggleIdentityTag: (id) => set((s) => ({ identityTags: s.identityTags.includes(id) ? s.identityTags.filter((t) => t !== id) : [...s.identityTags, id] })),
	setSocialLinks: (links) => set({ socialLinks: links }),
	addHighlight: (h) => set((s) => ({ highlights: [...s.highlights, h] })),
	removeHighlight: (id) => set((s) => ({ highlights: s.highlights.filter((h) => h.id !== id) })),
	setInterests: (v) => set({ interests: v }),
	setAcademicInterests: (v) => set({ academicInterests: v }),
	setSkills: (v) => set({ skills: v }),
	setProjects: (v) => set({ projects: v }),
	setOnboardingDone: (v) => set({ onboardingDone: v }),
	setAvatarDataUrl: (v) => set({ avatarDataUrl: v }),
	setLegalName: (v) => set({ legalName: v }),
	addPostReply: (postId, reply) => set((s) => ({ postReplies: {
		...s.postReplies,
		[postId]: [...s.postReplies[postId] ?? [], reply]
	} })),
	addSpill: (body, handle, extra) => set((s) => ({ spills: [{
		id: `sp-${Date.now()}`,
		authorHandle: handle,
		body,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		quoteId: extra?.quoteId,
		quotedFrom: extra?.quotedFrom,
		communityId: extra?.communityId,
		replies: []
	}, ...s.spills] })),
	replySpill: (spillId, reply) => set((s) => ({ spills: s.spills.map((sp) => sp.id === spillId ? {
		...sp,
		replies: [...sp.replies, reply]
	} : sp) })),
	flagSpill: (id) => set((s) => ({ flaggedSpills: s.flaggedSpills.includes(id) ? s.flaggedSpills : [...s.flaggedSpills, id] })),
	followRiff: (id) => set((s) => {
		const cur = s.followedRiffs ?? [];
		return { followedRiffs: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
	}),
	setHomeCampusId: (v) => set({ homeCampusId: v }),
	setLifeStage: (v) => set({ lifeStage: v }),
	hidePost: (id) => set((s) => ({ hiddenPosts: s.hiddenPosts.includes(id) ? s.hiddenPosts : [...s.hiddenPosts, id] })),
	toggleSavePost: (id) => set((s) => {
		const cur = s.savedPosts ?? [];
		return { savedPosts: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
	}),
	reportPost: (id) => set((s) => ({
		reportedPosts: (s.reportedPosts ?? []).includes(id) ? s.reportedPosts : [...s.reportedPosts ?? [], id],
		hiddenPosts: s.hiddenPosts.includes(id) ? s.hiddenPosts : [...s.hiddenPosts, id]
	})),
	toggleCommentLike: (id) => set((s) => ({ commentLikes: {
		...s.commentLikes ?? {},
		[id]: !s.commentLikes?.[id]
	} })),
	setComposeOpen: (composeOpen) => set({ composeOpen }),
	setDropOpen: (dropOpen) => set({ dropOpen }),
	registerOriginalAudio: (a) => set((s) => ({ originalAudios: [a, ...(s.originalAudios ?? []).filter((x) => x.audioId !== a.audioId)].slice(0, 80) })),
	saveAudio: (id) => set((s) => ({ savedAudioIds: (s.savedAudioIds ?? []).includes(id) ? s.savedAudioIds : [...s.savedAudioIds ?? [], id] })),
	unsaveAudio: (id) => set((s) => ({ savedAudioIds: (s.savedAudioIds ?? []).filter((x) => x !== id) })),
	useOriginalAudio: (id, contentId) => set((s) => ({ originalAudios: (s.originalAudios ?? []).map((a) => a.audioId === id && !a.usedBy.includes(contentId) ? {
		...a,
		usageCount: a.usageCount + 1,
		usedBy: [...a.usedBy, contentId]
	} : a) })),
	reportAudio: (id, reason) => set((s) => {
		const cur = (s.originalAudios ?? []).find((a) => a.audioId === id);
		if (!cur) return s;
		const { audio, report } = RightsManagement.report(cur, reason);
		return {
			originalAudios: (s.originalAudios ?? []).map((a) => a.audioId === id ? audio : a),
			audioReports: [...s.audioReports ?? [], report]
		};
	}),
	setPendingShare: (pendingShare) => set({ pendingShare }),
	setSquareView: (squareView) => set({ squareView }),
	setPrefs: (v) => set((s) => ({ prefs: {
		...s.prefs,
		...v
	} })),
	addFixerRating: (n) => set((s) => ({ fixerRatings: [...s.fixerRatings ?? [], Math.min(5, Math.max(1, Math.round(n)))].slice(-40) })),
	patchBudAtlas: (v) => set((s) => ({ budAtlas: {
		lastGoal: v.lastGoal ?? s.budAtlas?.lastGoal ?? "",
		understood: v.understood ?? s.budAtlas?.understood ?? [],
		struggles: v.struggles ?? s.budAtlas?.struggles ?? [],
		likes: v.likes ?? s.budAtlas?.likes ?? s.interests ?? []
	} }))
}), {
	name: "unibud-campus",
	merge: (persisted, current) => ({
		...current,
		...persisted,
		composeOpen: false,
		dropOpen: false,
		squareView: "feed"
	})
}));
function unreadCount(notes) {
	return notes.filter((n) => !n.read).length;
}
function resolveBudShortcut(s) {
	if (s.budShortcut === "top" || s.budShortcut === "bottom" || s.budShortcut === "hidden") return s.budShortcut;
	return s.showBud === false ? "hidden" : "bottom";
}
function connectLabel(handle, s) {
	if (s.connections.includes(handle)) return "Connected";
	if (s.outgoing.includes(handle)) return "Pending";
	return "Connect";
}
//#endregion
export { useCampusStore as a, unreadCount as i, originalFromPublish as n, resolveBudShortcut as r, connectLabel as t };
