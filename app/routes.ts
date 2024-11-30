import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

import { Api, Page } from './enums'

export default [
  layout('./layouts/Auth.layout.tsx', [
    index('./routes/auth/Login.view.tsx'),
    route(Page.CODE.slice(1), './routes/auth/Code.view.tsx'),
  ]),
  route(Api.AUTH_SIGN_IN_EMAIL.slice(1), './routes/auth/sign-in-email.api.tsx'),
  route(Api.AUTH_SIGN_IN_CODE.slice(1), './routes/auth/sign-in-code.api.tsx'),

  layout('./layouts/Admin.layout.tsx', [
    route(Page.ADMIN_WELCOME.slice(1), './routes/admin/Welcome.view.tsx'),
  ]),
  route(Api.ORGANIZATION_CHANGE.slice(1), './routes/admin/organization/change.api.tsx'),
] satisfies RouteConfig
