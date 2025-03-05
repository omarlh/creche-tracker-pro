
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
      throw new Error('Le numéro de téléphone et le message sont requis')
    }

    // Format phone number to ensure it starts with country code
    const formattedPhone = to.startsWith('+') ? to : `+${to.replace(/^00/, '')}`
    
    console.log(`Sending WhatsApp message to ${formattedPhone}: ${message}`)

    const response = await fetch('https://graph.facebook.com/v17.0/171689289460681/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: {
          body: message
        }
      })
    });

    const data = await response.json()
    console.log('WhatsApp API response:', data)

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur lors de l\'envoi du message WhatsApp')
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
