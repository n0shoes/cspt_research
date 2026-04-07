import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class DashboardSettingsController extends Controller {
  @tracked hashPath = '';
  @tracked fetchUrl = '';
  @tracked result = null;
  @tracked hasDots = false;
}
