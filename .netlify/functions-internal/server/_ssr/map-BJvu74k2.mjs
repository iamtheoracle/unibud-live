//#region node_modules/.nitro/vite/services/ssr/assets/map-BJvu74k2.js
function mapUni(r) {
	return {
		id: r.id,
		name: r.name,
		shortName: r.short_name,
		city: r.city
	};
}
function mapPerson(r) {
	return {
		handle: r.handle,
		name: r.name,
		universityId: r.university_id,
		program: r.program,
		year: r.year,
		bio: r.bio,
		verified: r.verified
	};
}
function mapListing(r) {
	let tags = [];
	try {
		tags = JSON.parse(r.tags);
	} catch {
		tags = [];
	}
	return {
		id: r.id,
		kind: r.kind,
		category: r.category,
		title: r.title,
		description: r.description,
		priceKobo: r.price_kobo,
		priceNote: r.price_note,
		image: r.image ?? void 0,
		tone: r.tone,
		sellerHandle: r.seller_handle,
		universityId: r.university_id,
		location: r.location,
		tags,
		savedCount: r.saved_count,
		createdAt: r.created_at
	};
}
function mapCommunity(r) {
	return {
		id: r.id,
		name: r.name,
		kind: r.kind,
		universityId: r.university_id ?? void 0,
		description: r.description,
		cover: r.cover ?? void 0,
		members: r.members
	};
}
function mapPost(r) {
	return {
		id: r.id,
		communityId: r.community_id,
		authorHandle: r.author_handle,
		body: r.body,
		image: r.image ?? void 0,
		video: r.video ?? void 0,
		kind: r.kind === "reel" ? "reel" : "post",
		createdAt: r.created_at
	};
}
function mapPostReply(r) {
	return {
		id: r.id,
		postId: r.post_id,
		authorHandle: r.author_handle,
		parentId: r.parent_id ?? void 0,
		body: r.body,
		createdAt: r.created_at
	};
}
function mapDiscovery(r) {
	return {
		id: r.id,
		kicker: r.kicker,
		title: r.title,
		summary: r.summary,
		topic: r.topic,
		image: r.image ?? void 0
	};
}
function mapTx(r) {
	return {
		id: r.id,
		type: r.type,
		amountKobo: r.amount_kobo,
		status: r.status,
		counterparty: r.counterparty,
		note: r.note,
		createdAt: r.created_at
	};
}
function mapRequest(r) {
	return {
		id: r.id,
		direction: r.direction,
		peerHandle: r.peer_handle,
		amountKobo: r.amount_kobo,
		note: r.note,
		status: r.status,
		createdAt: r.created_at
	};
}
function mapConvo(r) {
	return {
		id: r.id,
		peerHandle: r.peer_handle,
		listingId: r.listing_id,
		lastBody: r.last_body,
		updatedAt: r.updated_at
	};
}
function mapMessage(r) {
	return {
		id: r.id,
		conversationId: r.conversation_id,
		sender: r.sender,
		body: r.body,
		createdAt: r.created_at,
		mediaId: r.media_id ?? void 0,
		shareKind: r.share_kind ?? void 0,
		shareJson: r.share_json ?? void 0
	};
}
function mapCourse(r) {
	return {
		id: r.id,
		sessionLabel: r.session_label,
		semester: r.semester,
		title: r.title,
		code: r.code
	};
}
function mapMaterial(r) {
	return {
		id: r.id,
		courseId: r.course_id,
		title: r.title,
		kind: r.kind
	};
}
function mapSession(r) {
	return {
		id: r.id,
		courseId: r.course_id,
		title: r.title,
		startsAt: r.starts_at,
		minutes: r.minutes
	};
}
function mapNote(r) {
	return {
		id: r.id,
		kind: r.kind,
		title: r.title,
		body: r.body,
		href: r.href ?? void 0,
		read: r.read,
		createdAt: r.created_at
	};
}
function mapProfile(r) {
	return {
		userId: r.user_id,
		displayName: r.display_name,
		handle: r.handle,
		universityId: r.university_id,
		program: r.program,
		year: r.year,
		bio: r.bio,
		campusRole: r.campus_role,
		onboardingDone: Boolean(r.onboarding_done)
	};
}
function mapBud(r) {
	let media;
	if (r.media_json) try {
		media = JSON.parse(r.media_json);
	} catch {
		media = void 0;
	}
	return {
		id: r.id,
		role: r.role,
		content: r.content,
		createdAt: r.created_at,
		conversationId: r.conversation_id ?? void 0,
		media
	};
}
function mapConversation(r) {
	return {
		id: r.id,
		title: r.title,
		updatedAt: r.updated_at,
		preview: r.preview ?? ""
	};
}
//#endregion
export { mapTx as _, mapCourse as a, mapMaterial as c, mapPerson as d, mapPost as f, mapSession as g, mapRequest as h, mapConvo as i, mapMessage as l, mapProfile as m, mapCommunity as n, mapDiscovery as o, mapPostReply as p, mapConversation as r, mapListing as s, mapBud as t, mapNote as u, mapUni as v };
