export type UserInfo = {
  userId: string
  organizationId: string
  roleId: string
}

export type OutputFromDB = {
  errors?: { server: { title: string; message: string } }
} | null
