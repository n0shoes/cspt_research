import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class EncodingTestController extends Controller {
  @tracked windowPathname = '';
  @tracked windowHref = '';
  @tracked windowSearch = '';
  @tracked windowHash = '';
}
