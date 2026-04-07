import Route from '@ember/routing/route';

export default class TeamMemberRoute extends Route {
  async model(params) {
    const teamId = params.teamId;
    const memberId = params.memberId;
    const fetchUrl = `/api/teams/${teamId}/members/${memberId}`;
    const hasSlash = teamId.includes('/') || memberId.includes('/');
    const hasDots = teamId.includes('..') || memberId.includes('..');
    const hasTraversal = teamId.includes('../') || memberId.includes('../');
    const hasEncodedSlash = teamId.includes('%2F') || teamId.includes('%2f') || memberId.includes('%2F') || memberId.includes('%2f');

    let result;
    try {
      const response = await fetch(fetchUrl);
      result = await response.json();
    } catch (err) {
      result = { error: err.message, note: 'Browser resolved ../ — fetch exited /api/ scope' };
    }

    return {
      source: 'params.teamId + params.memberId',
      rawTeamId: teamId,
      rawMemberId: memberId,
      fetchUrl,
      hasDots,
      hasSlash,
      hasTraversal,
      hasEncodedSlash,
      result,
    };
  }
}
