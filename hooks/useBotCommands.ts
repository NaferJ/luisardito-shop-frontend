import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

// Tipos
export interface BotCommand {
  id: number
  command: string
  aliases: string[]
  response_message: string
  description?: string
  command_type: 'simple' | 'dynamic'
  dynamic_handler?: string
  enabled: boolean
  requires_permission: boolean
  permission_level: 'viewer' | 'vip' | 'moderator' | 'broadcaster'
  cooldown_seconds: number
  usage_count: number
  last_used_at?: string
  created_at: string
  updated_at: string
}

export interface CommandFormData {
  command: string
  aliases?: string[]
  response_message: string
  description?: string
  command_type: 'simple' | 'dynamic'
  dynamic_handler?: string
  enabled: boolean
  requires_permission?: boolean
  permission_level?: 'viewer' | 'vip' | 'moderator' | 'broadcaster'
  cooldown_seconds?: number
}

export interface CommandStats {
  summary: {
    total: number
    enabled: number
    disabled: number
    simple: number
    dynamic: number
  }
  mostUsed: Array<{
    id: number
    command: string
    usage_count: number
    last_used_at?: string
  }>
  recentlyUsed: Array<{
    id: number
    command: string
    usage_count: number
    last_used_at?: string
  }>
}

interface ApiResponse<T> {
  ok: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// API Calls
const commandsApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    enabled?: boolean
    command_type?: string
    search?: string
  }) => {
    const { data } = await api.get<ApiResponse<BotCommand[]>>(`/api/kick-admin/bot-commands`, {
      params
    })
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get<ApiResponse<BotCommand>>(`/api/kick-admin/bot-commands/${id}`)
    return data
  },

  create: async (command: CommandFormData) => {
    const { data } = await api.post<ApiResponse<BotCommand>>(
      `/api/kick-admin/bot-commands`,
      command
    )
    return data
  },

  update: async (id: number, command: Partial<CommandFormData>) => {
    const { data } = await api.put<ApiResponse<BotCommand>>(
      `/api/kick-admin/bot-commands/${id}`,
      command
    )
    return data
  },

  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<void>>(`/api/kick-admin/bot-commands/${id}`)
    return data
  },

  toggle: async (id: number) => {
    const { data } = await api.patch<ApiResponse<BotCommand>>(
      `/api/kick-admin/bot-commands/${id}/toggle`,
      {}
    )
    return data
  },

  duplicate: async (id: number) => {
    const { data } = await api.post<ApiResponse<BotCommand>>(
      `/api/kick-admin/bot-commands/${id}/duplicate`,
      {}
    )
    return data
  },

  getStats: async () => {
    const { data } = await api.get<ApiResponse<CommandStats>>(`/api/kick-admin/bot-commands/stats`)
    return data
  },

  test: async (testData: {
    response_message: string
    test_username?: string
    test_args?: string
  }) => {
    const { data } = await api.post<
      ApiResponse<{
        original: string
        processed: string
        variables_used: Record<string, string>
      }>
    >(`/api/kick-admin/bot-commands/test`, testData)
    return data
  }
}

// Hooks
export const useBotCommands = (params?: {
  page?: number
  limit?: number
  enabled?: boolean
  command_type?: string
  search?: string
}) => {
  return useQuery({
    queryKey: ['botCommands', params],
    queryFn: () => commandsApi.getAll(params),
    refetchInterval: 30000 // Refetch cada 30 segundos
  })
}

export const useBotCommand = (id: number) => {
  return useQuery({
    queryKey: ['botCommand', id],
    queryFn: () => commandsApi.getById(id),
    enabled: !!id
  })
}

export const useBotCommandStats = () => {
  return useQuery({
    queryKey: ['botCommandStats'],
    queryFn: () => commandsApi.getStats(),
    refetchInterval: 60000 // Refetch cada 60 segundos
  })
}

export const useCreateBotCommand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CommandFormData) => commandsApi.create(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botCommands'] })
      queryClient.invalidateQueries({ queryKey: ['botCommandStats'] })
    }
  })
}

export const useUpdateBotCommand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, command }: { id: number; command: Partial<CommandFormData> }) =>
      commandsApi.update(id, command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botCommands'] })
      queryClient.invalidateQueries({ queryKey: ['botCommand'] })
      queryClient.invalidateQueries({ queryKey: ['botCommandStats'] })
    }
  })
}

export const useDeleteBotCommand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => commandsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botCommands'] })
      queryClient.invalidateQueries({ queryKey: ['botCommandStats'] })
    }
  })
}

export const useToggleBotCommand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => commandsApi.toggle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botCommands'] })
      queryClient.invalidateQueries({ queryKey: ['botCommand'] })
      queryClient.invalidateQueries({ queryKey: ['botCommandStats'] })
    }
  })
}

export const useDuplicateBotCommand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => commandsApi.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botCommands'] })
      queryClient.invalidateQueries({ queryKey: ['botCommandStats'] })
    }
  })
}

export const useTestBotCommand = () => {
  return useMutation({
    mutationFn: (testData: {
      response_message: string
      test_username?: string
      test_args?: string
    }) => commandsApi.test(testData)
  })
}
