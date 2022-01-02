import { SetMetadata } from '@nestjs/common'
import { UserRole } from '../users/entities/user.entity'

export const ROLES_KEY = 'roles'
export type AllowedRoles = keyof typeof UserRole | 'Any'
export const Role = (roles: AllowedRoles[]) => SetMetadata(ROLES_KEY, roles)

// import { SetMetadata } from '@nestjs/common'
// import { Role } from '../enums/role.enum'
// export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
