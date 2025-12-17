import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { z } from 'zod'
import type { ExpeditionEvent, ExpeditionRewards } from '~~/types'

const choiceSchema = z.object({
  eventId: z.string().min(1),
  choiceId: z.number().int().min(0)
})

export default defineEventHandler(async (event) => {
  // Auth check
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const supabase = await serverSupabaseClient(event)
  const expeditionId = getRouterParam(event, 'id')

  if (!expeditionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Expedition ID required'
    })
  }

  // Validate request body
  const body = await readBody(event)
  const parsed = choiceSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request',
      data: { errors: parsed.error.issues }
    })
  }

  const { eventId, choiceId } = parsed.data

  try {
    // Fetch expedition
    const { data: expedition, error: expeditionError } = await supabase
      .from('expeditions')
      .select('*')
      .eq('id', expeditionId)
      .eq('player_id', user.id)
      .single()

    if (expeditionError || !expedition) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Expedition not found'
      })
    }

    // Find the choice event in the log
    const log = expedition.log
    if (!log || !log.events) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No events found for this expedition'
      })
    }

    const eventIndex = log.events.findIndex((e: ExpeditionEvent) => e.id === eventId)
    if (eventIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found'
      })
    }

    const choiceEvent = log.events[eventIndex]
    if (choiceEvent.type !== 'choice') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Event is not a choice'
      })
    }

    if (!choiceEvent.data.choices || choiceId >= choiceEvent.data.choices.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid choice ID'
      })
    }

    // Resolve the choice
    const choice = choiceEvent.data.choices[choiceId]
    const resolvedEvent: ExpeditionEvent = {
      ...choiceEvent,
      data: {
        ...choiceEvent.data,
        selectedChoice: choiceId,
        outcome: choice.outcome
      }
    }

    // Update the event in the log
    const updatedEvents = [...log.events]
    updatedEvents[eventIndex] = resolvedEvent

    // Calculate any additional rewards based on choice
    const additionalRewards: Partial<ExpeditionRewards> = {
      gold: Math.floor(Math.random() * 20),
      xp: Math.floor(Math.random() * 10)
    }

    // Update expedition log
    const { error: updateError } = await supabase
      .from('expeditions')
      .update({
        log: {
          ...log,
          events: updatedEvents
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', expeditionId)

    if (updateError) throw updateError

    return {
      event: resolvedEvent,
      additionalRewards
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to resolve choice',
      data: { error: error.message }
    })
  }
})
