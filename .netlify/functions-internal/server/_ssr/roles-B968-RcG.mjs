//#region node_modules/.nitro/vite/services/ssr/assets/roles-B968-RcG.js
/** Lecturer / tutor broadcasting and official teaching. Does not inherit. */
function canTeach(role) {
	return role === "lecturer";
}
/** Class coordination only. Governors stay students. Lecturers do not inherit this. */
function canGovernClass(role) {
	return role === "governor";
}
/** Community moderation, scoped in the UI to that community. Does not inherit. */
function canModerateCommunity(role) {
	return role === "moderator";
}
function roleLabel(role, program) {
	switch (role) {
		case "lecturer": return program ? `Lecturer · ${program}` : "Lecturer";
		case "governor": return "Student · Class Governor";
		case "moderator": return "Community Moderator";
		default: return "Student";
	}
}
//#endregion
export { roleLabel as i, canModerateCommunity as n, canTeach as r, canGovernClass as t };
