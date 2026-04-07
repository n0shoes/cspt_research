import Controller from '@ember/controller';

export default class DashboardStatsController extends Controller {
  queryParams = ['widget'];
  widget = 'default';
}
