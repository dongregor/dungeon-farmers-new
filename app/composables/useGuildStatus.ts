interface GuildStatus {
  hasGuild: boolean
  guildName: string | null
  loading: boolean
  error: string | null
}

// Cached status to avoid redundant API calls
let cachedStatus: { hasGuild: boolean; guildName: string | null } | null = null
let fetchPromise: Promise<void> | null = null

export function useGuildStatus() {
  const status = useState<GuildStatus>('guildStatus', () => ({
    hasGuild: false,
    guildName: null,
    loading: true,
    error: null,
  }))

  async function fetchStatus(force = false) {
    // Return cached if available and not forcing
    if (!force && cachedStatus !== null) {
      status.value = {
        hasGuild: cachedStatus.hasGuild,
        guildName: cachedStatus.guildName,
        loading: false,
        error: null,
      }
      return
    }

    // Reuse existing fetch promise to avoid duplicate requests
    if (fetchPromise) {
      await fetchPromise
      return
    }

    status.value.loading = true
    status.value.error = null

    fetchPromise = (async () => {
      try {
        const data = await $fetch<{ hasGuild: boolean; guildName: string | null }>('/api/guild-master/status')
        cachedStatus = {
          hasGuild: data.hasGuild,
          guildName: data.guildName,
        }
        status.value = {
          hasGuild: data.hasGuild,
          guildName: data.guildName,
          loading: false,
          error: null,
        }

        // Sync with localStorage for faster subsequent loads
        if (import.meta.client) {
          if (data.hasGuild) {
            localStorage.setItem('guild_initialized', 'true')
          } else {
            localStorage.removeItem('guild_initialized')
          }
        }
      } catch (err) {
        status.value.error = err instanceof Error ? err.message : 'Failed to fetch guild status'
        status.value.loading = false

        // Fallback to localStorage if API fails
        if (import.meta.client) {
          const localStatus = localStorage.getItem('guild_initialized') === 'true'
          status.value.hasGuild = localStatus
          cachedStatus = { hasGuild: localStatus, guildName: null }
        }
      } finally {
        fetchPromise = null
      }
    })()

    await fetchPromise
  }

  function setHasGuild(hasGuild: boolean, guildName: string | null = null) {
    cachedStatus = { hasGuild, guildName }
    status.value = {
      hasGuild,
      guildName,
      loading: false,
      error: null,
    }

    if (import.meta.client) {
      if (hasGuild) {
        localStorage.setItem('guild_initialized', 'true')
      } else {
        localStorage.removeItem('guild_initialized')
      }
    }
  }

  function clearCache() {
    cachedStatus = null
    if (import.meta.client) {
      localStorage.removeItem('guild_initialized')
    }
  }

  return {
    status: readonly(status),
    fetchStatus,
    setHasGuild,
    clearCache,
  }
}
