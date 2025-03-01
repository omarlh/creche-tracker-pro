
// Follow this setup guide to integrate the Supabase JS Client in a function:
// https://supabase.com/docs/guides/functions/quickstart#supabase-client

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get WhatsApp API key from env
    const apiKey = Deno.env.get('WHATSAPP_API_KEY')
    if (!apiKey) {
      throw new Error('WHATSAPP_API_KEY not set in environment variables')
    }

    // Get request body
    const { to, message } = await req.json()

    // Validate input
    if (!to || !message) {
      throw new Error('Missing required parameters: to and message')
    }

    // Format phone number if needed (this is a mock implementation)
    const formattedNumber = to.startsWith('+') ? to : `+${to}`

    console.log(`Sending WhatsApp message to ${formattedNumber}: ${message}`)

    // In a real implementation, you would call the WhatsApp API here
    // For now, we're just returning a success message
    
    // Simulate API call success
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message sent successfully',
        to: formattedNumber,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing request:', error.message)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
