import rfdc from 'rfdc'
import { OrgUserRoles, ProjectRoles, WorkspaceUserRoles } from 'nocodb-sdk'
import type { UsersSortType } from '~/lib'
import { useGlobal } from '#imports'

/**
 * Hook for managing user sorts and sort configurations.
 * @returns An object containing reactive values and functions related to user sorts.
 */
export function useUserSorts(roleType: 'Workspace' | 'Org' | 'Project') {
  const clone = rfdc()

  const { user } = useGlobal()

  const sorts = ref<UsersSortType>({})

  // Key for storing user sort configurations in local storage
  const userSortConfigKey = 'userSortConfig'

  // Default user ID if no user found (fallback)
  const defaultUserId = 'default'

  /**
   * Computed property that returns a record of sort directions based on the current sort configurations.
   * @type {ComputedRef<Record<string, UsersSortType['direction']>>}
   */
  const sortDirection: ComputedRef<Record<string, UsersSortType['direction']>> = computed(() => {
    if (sorts.value.field) {
      return { [sorts.value.field]: sorts.value.direction } as Record<string, UsersSortType['direction']>
    }
    return {} as Record<string, UsersSortType['direction']>
  })

  /**
   * Loads user sort configurations from local storage based on the current user ID.
   */
  function loadSorts(): void {
    try {
      // Retrieve sort configuration from local storage
      const storedConfig = localStorage.getItem(userSortConfigKey)

      const sortConfig = storedConfig ? JSON.parse(storedConfig) : {}
      sorts.value = sortConfig

      // Load user-specific sort configurations or default configurations
      sorts.value = user.value?.id ? sortConfig[user.value.id] || {} : sortConfig[defaultUserId] || {}
    } catch (error) {
      console.error('Error while retrieving sort configuration from local storage:', error)
      // Set sorts to an empty obj in case of an error
      sorts.value = {}
    }
  }

  /**
   * Saves or updates a user sort configuration and updates local storage.
   * @param {UsersSortType} newSortConfig - The new sort configuration to save or update.
   */
  function saveOrUpdate(newSortConfig: UsersSortType): void {
    try {
      if (newSortConfig.field && newSortConfig.direction) {
        sorts.value = { ...newSortConfig }
      } else {
        sorts.value = {}
      }

      // Update local storage with the new sort configurations
      const storedConfig = localStorage.getItem(userSortConfigKey)
      const sortConfig = storedConfig ? JSON.parse(storedConfig) : {}

      if (user.value?.id) {
        // Save or delete user-specific sort configurations
        if (sorts.value.field) {
          sortConfig[user.value.id] = sorts.value
        } else {
          delete sortConfig[user.value.id]
        }
      } else {
        // Save or delete default user sort configurations
        sortConfig[defaultUserId] = sorts.value
      }

      localStorage.setItem(userSortConfigKey, JSON.stringify(sortConfig))
    } catch (error) {
      console.error('Error while retrieving sort configuration from local storage:', error)
    }
  }

  /**
   * Sorts and returns a deep copy of an array of objects based on the provided sort configurations.
   *
   * @param data - The array of objects to be sorted.
   * @param sortsConfig - The object of sort configurations.
   * @returns A new array containing sorted objects.
   * @template T - The type of objects in the input array.
   */
  function handleGetSortsData<T extends Record<string, any>>(data: T[], sortsConfig: UsersSortType = sorts.value): T[] {
    let userRoleOrder: string[] = []
    if (roleType === 'Workspace') {
      userRoleOrder = Object.values(WorkspaceUserRoles)
    } else if (roleType === 'Org') {
      userRoleOrder = Object.values(OrgUserRoles)
    } else if (roleType === 'Project') {
      userRoleOrder = Object.values(ProjectRoles)
    }

    data = clone(data)

    const superUserIndex = data.findIndex((user) => user?.roles?.includes('super'))
    const superUser = superUserIndex !== -1 ? data.splice(superUserIndex, 1) : null
    // console.log('super', superUser)
    let sortedData = data.sort((a, b) => {
      switch (sortsConfig.field) {
        case 'roles':
          const roleA = a?.roles?.split(',')[0]
          const roleB = b?.roles?.split(',')[0]

          if (sortsConfig.direction === 'asc') {
            return userRoleOrder.indexOf(roleA) - userRoleOrder.indexOf(roleB)
          } else {
            return userRoleOrder.indexOf(roleB) - userRoleOrder.indexOf(roleA)
          }

        case 'email':
          if (sortsConfig.direction === 'asc') {
            return a[sortsConfig.field]?.localeCompare(b[sortsConfig.field])
          } else {
            return b[sortsConfig.field]?.localeCompare(a[sortsConfig.field])
          }
      }

      return 0
    })

    if (superUser && superUser.length) {
      if (sortsConfig.direction === 'desc') {
        sortedData = [...sortedData, superUser[0]]
      } else {
        sortedData = [superUser[0], ...sortedData]
      }
    }

    return sortedData
  }

  return { sorts, sortDirection, loadSorts, saveOrUpdate, handleGetSortsData }
}
