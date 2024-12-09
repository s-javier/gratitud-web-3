import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

import { Api, Page } from './enums'

export default [
  route(Api.AUTH_SIGN_IN_EMAIL.slice(1), './routes/auth/sign-in-email.api.tsx'),
  route(Api.AUTH_SIGN_IN_CODE.slice(1), './routes/auth/sign-in-code.api.tsx'),

  route(Api.ORGANIZATION_CHANGE.slice(1), './routes/admin/organization/change.api.tsx'),

  route(Api.GRATITUDE_CREATE.slice(1), './routes/gratitude/create.api.tsx'),
  route(Api.GRATITUDE_UPDATE.slice(1), './routes/gratitude/update.api.tsx'),
  route(Api.GRATITUDE_DELETE.slice(1), './routes/gratitude/delete.api.tsx'),

  layout('./layouts/Auth.layout.tsx', [
    index('./routes/auth/Login.view.tsx'),
    route(Page.CODE.slice(1), './routes/auth/Code.view.tsx'),
  ]),

  layout('./layouts/Admin.layout.tsx', [
    route(Page.ADMIN_WELCOME.slice(1), './routes/admin/Welcome.view.tsx'),

    route(Page.GRATITUDE_MY_GRATITUDES.slice(1), './routes/gratitude/my/My.view.tsx'),
    route(Page.GRATITUDE_REMEMBER.slice(1), './routes/gratitude/remember/Remember.view.tsx'),
  ]),
] satisfies RouteConfig
