export const publicCitizenDbExtensions = {
  setup: function setup(citizenKlass) {
    citizenKlass.cats = citizenKlass.getTable('my.network/cat')
    console.log('[ctzn-server-plugin-example] Extended public citizen DB class!')
  }
}

export const privateCitizenDbExtensions = {
  setup: function setup(citizenKlass) {
    console.log('[ctzn-server-plugin-example] Extended private citizen DB class!')
  }
}
