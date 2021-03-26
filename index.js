import schemas from './schemas/index.js'
import {
  publicCitizenDbExtensions,
  privateCitizenDbExtensions,
  publicCommunityDbExtensions,
  publicServerDbExtensions,
  privateServerDbExtensions
} from './db/index.js'
import { dbViewExtensions } from './db/views.js'
import { apiExtensions } from './api/index.js'
import { appExtensions } from './app/index.js'

export default {
  apiExtensions,
  appExtensions,
  dbViewExtensions,
  privateCitizenDbExtensions,
  publicCitizenDbExtensions,
  publicCommunityDbExtensions,
  publicServerDbExtensions,
  privateServerDbExtensions,
  schemas
};
