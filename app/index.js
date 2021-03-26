/*
 * You generally won't need direct access to the express app instance
 *
 * ...but if you need to you can!
 */
export const appExtensions = {
  setup: function setup(app) {
    console.log('[ctzn-server-plugin-example] Setup advanced app extensions!')
  }
}
