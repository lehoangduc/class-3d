import _ from 'lodash'

import { ENVS, SHARED_ENVS } from './envs'

export const getEnv = (key: string) => _.get(ENVS, key)

export const getSharedEnv = (key: string) => _.get(SHARED_ENVS, key)

export const getSharedEnvs = () => SHARED_ENVS

export const isProduction = () => ENVS?.env === 'production'
