import type { ParamMatcher } from '@sveltejs/kit';

// Param matcher as defense against CSPT: only allows integer values
export const match: ParamMatcher = (param) => {
	return /^\d+$/.test(param);
};
