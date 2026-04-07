import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class EncodingWildcardController extends Controller {
  @tracked windowPathname = '';
  @tracked windowHref = '';
}
