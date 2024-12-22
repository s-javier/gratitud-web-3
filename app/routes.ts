import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

import { Api, Page } from './enums'

export default [
  route(Api.AUTH_SIGN_IN_EMAIL.slice(1), './routes/auth/api.sign-in-email.tsx'),
  route(Api.AUTH_SIGN_IN_CODE.slice(1), './routes/auth/api.sign-in-code.tsx'),

  route(Api.ORGANIZATION_CREATE.slice(1), './routes/organization/all/api.create.tsx'),
  route(Api.ORGANIZATION_UPDATE.slice(1), './routes/organization/all/api.update.tsx'),
  route(Api.ORGANIZATION_DELETE.slice(1), './routes/organization/all/api.delete.tsx'),
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

    route(
      Page.ADMIN_ORGANIZATIONS.slice(1),
      './routes/organization/all/component.view.Organizations.tsx',
    ),
    route(Page.ADMIN_ROLES.slice(1), './routes/role/component.view.Roles.tsx'),
    route(Page.ADMIN_PERMISSIONS.slice(1), './routes/permission/component.view.Permissions.tsx'),
    route(Page.ADMIN_USERS.slice(1), './routes/user/component.view.Users.tsx'),
    route(Page.ADMIN_MENU_PAGES.slice(1), './routes/menu-page/component.view.MenuPages.tsx'),

    route(Page.GRATITUDE_MY_GRATITUDES.slice(1), './routes/gratitude/my/component.view.My.tsx'),
    route(
      Page.GRATITUDE_REMEMBER.slice(1),
      './routes/gratitude/remember/component.view.Remember.tsx',
    ),
    route(
      Page.GRATITUDE_ASK_GIVEN.slice(1),
      './routes/gratitude/ask-given/component.view.AskGiven.tsx',
    ),
  ]),
] satisfies RouteConfig
