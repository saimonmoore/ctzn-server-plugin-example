/*
 * You generally won't need direct access to the server db class
 *
 * ...but if you need to you can!
 */
export const publicServerDbExtensions = {
  setup: function setup(serverKlass, helpers) {
    console.log('[ctzn-server-plugin-example] Extended public server DB class!')
  }
}

/*
 * You generally won't need direct access to the server db class
 *
 * ...but if you need to you can!
 */
export const privateServerDbExtensions = {
  setup: function setup(serverKlass, helpers) {
    console.log('[ctzn-server-plugin-example] Extended private server DB class!')
  }
}
