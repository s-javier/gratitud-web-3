import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

import { Api, Page } from './enums'

export default [
  route(Api.AUTH_SIGN_IN_EMAIL.slice(1), './routes/auth/api.sign-in-email.tsx'),
  route(Api.AUTH_SIGN_IN_CODE.slice(1), './routes/auth/api.sign-in-code.tsx'),

  route(Api.ORGANIZATION_CHANGE.slice(1), './routes/organization/change/api.change.tsx'),

  route(Api.GRATITUDE_CREATE.slice(1), './routes/gratitude/api.create.tsx'),
  route(Api.GRATITUDE_UPDATE.slice(1), './routes/gratitude/api.update.tsx'),
  route(Api.GRATITUDE_DELETE.slice(1), './routes/gratitude/api.delete.tsx'),

  layout('./routes/auth/component.layout.Auth.tsx', [
    index('./routes/auth/component.view.Login.tsx'),
    route(Page.CODE.slice(1), './routes/auth/component.view.Code.tsx'),
  ]),

  layout('./routes/admin/component.layout.Admin.tsx', [
    route(Page.ADMIN_WELCOME.slice(1), './routes/welcome/component.view.Welcome.tsx'),

    route(Page.GRATITUDE_MY_GRATITUDES.slice(1), './routes/gratitude/my/component.view.My.tsx'),
    route(
      Page.GRATITUDE_REMEMBER.slice(1),
      './routes/gratitude/remember/component.view.Remember.tsx',
    ),
  ]),
] satisfies RouteConfig
