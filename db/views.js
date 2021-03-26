import { setup as setupCatViews } from './cat-views.js'

export const dbViewExtensions = {
  setup: function setup(viewHelpers) {
    setupCatViews(viewHelpers)
    console.log('[ctzn-server-plugin-example] Setup db view extensions!')
  }
}
