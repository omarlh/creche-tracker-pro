
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

    // Format phone number to ensure it's in international format
    let formattedPhone = to.replace(/\s+/g, "").replace(/[^\d+]/g, "")
    
    // Handle Morocco phone numbers specifically
    if (formattedPhone.startsWith('0') && formattedPhone.length === 10) {
      // Assuming it's a Moroccan number starting with 0
      formattedPhone = '+212' + formattedPhone.substring(1)
    } else if (!formattedPhone.startsWith('+')) {
      // If no leading '+', add it with Morocco country code if it looks like a Moroccan number
      if (formattedPhone.startsWith('212')) {
        formattedPhone = '+' + formattedPhone
      } else if (formattedPhone.startsWith('00')) {
        // Handle 00 international prefix
        formattedPhone = '+' + formattedPhone.substring(2)
      } else {
        // Assume it's a Moroccan number without prefix
        formattedPhone = '+212' + formattedPhone
      }
    }
    
    console.log(`Attempting to send WhatsApp message to ${formattedPhone}: ${message}`)

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
    
    if (!response.ok) {
      console.error('Error response from WhatsApp API:', data)
      
      // Add more detailed error information
      let errorMessage = data.error?.message || 'Erreur lors de l\'envoi du message WhatsApp'
      
      // Handle specific error codes from Meta API
      if (data.error?.code === 131047) {
        errorMessage = `Numéro non inscrit au service WhatsApp: ${formattedPhone}`
      } else if (data.error?.code === 100) {
        errorMessage = `Paramètre invalide: ${data.error?.error_data?.details || formattedPhone}`
      }
      
      throw new Error(errorMessage)
    }

    console.log('WhatsApp API success response:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
