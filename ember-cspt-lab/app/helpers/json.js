import { helper } from '@ember/component/helper';

export default helper(function json([value]) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
});
