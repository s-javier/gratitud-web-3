import { and, asc, eq } from 'drizzle-orm'

import { OutputFromDB } from '~/types'
import { ErrorTitle } from '~/enums'
import db from '~/db'
import { rolePermissionTable, permissionTable } from '~/db/schema'
// import { CacheData } from '~/enums'
// import { cache } from '~/utils/cache'

type Output = {
  errors?: { server: { title: string; message: string } }
  rolePermission?: {
    roleId: string
    permissionId: string
  }[]
}

export const getRolePermissionAllFromDB = async (): Promise<Output> => {
  let rolePermission
  // if (cache.has(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }))) {
  //   organizations = cache.get(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL })) as any[]
  //   return
  // }
  try {
    rolePermission = await db
      .select({
        roleId: rolePermissionTable.roleId,
        permissionId: rolePermissionTable.permissionId,
      })
      .from(rolePermissionTable)
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de rolePermission.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo obtener los roles y permisos.',
        },
      },
    }
  }
  // cache.set(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }), organizations)
  return { rolePermission }
}

type OutputPopulated = {
  errors?: { server: { title: string; message: string } }
  rolePermissionPopulated?: {
    roleId: string
    permissionId: string
    permissionPath: string
    permissionType: string
    sort: number | null
  }[]
}

export const getRolePermissionAllPopulatedFromDB = async (): Promise<OutputPopulated> => {
  let rolePermissionPopulated
  // if (cache.has(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }))) {
  //   organizations = cache.get(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL })) as any[]
  //   return
  // }
  try {
    rolePermissionPopulated = await db
      .select({
        roleId: rolePermissionTable.roleId,
        permissionId: permissionTable.id,
        permissionPath: permissionTable.path,
        permissionType: permissionTable.type,
        sort: rolePermissionTable.sort,
      })
      .from(permissionTable)
      .innerJoin(rolePermissionTable, eq(permissionTable.id, rolePermissionTable.permissionId))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de rolePermission poblados.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo obtener los roles y permisos.',
        },
      },
    }
  }
  // cache.set(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }), organizations)
  return { rolePermissionPopulated }
}

type Input = {
  roleId: string
  permissionId: string
  type: string
}

export const delteRolePermissionFromDB = async (input: Input): Promise<OutputFromDB> => {
  try {
    let query
    let index
    if (input.type === 'view') {
      query = await db
        .select({ permissionId: rolePermissionTable.permissionId })
        .from(rolePermissionTable)
        .where(eq(rolePermissionTable.roleId, input.roleId))
        .orderBy(asc(rolePermissionTable.sort))
      index = query.findIndex((item: any) => item.permissionId === input.permissionId)
    }
    await db
      .delete(rolePermissionTable)
      .where(
        and(
          eq(rolePermissionTable.roleId, input.roleId),
          eq(rolePermissionTable.permissionId, input.permissionId),
        ),
      )
    if (input.type === 'view' && index && query) {
      for (let i = index + 1; i < query.length; i += 1) {
        await db
          .update(rolePermissionTable)
          .set({ sort: i })
          .where(
            and(
              eq(rolePermissionTable.roleId, input.roleId),
              eq(rolePermissionTable.permissionId, query[i].permissionId),
            ),
          )
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo eliminar la relación rol-permiso.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo eliminar la relación rol-permiso.',
        },
      },
    }
  }
  // cache.delete(JSON.stringify({ data: CacheData.RECEIVABLES, userId }))
  return null
}
