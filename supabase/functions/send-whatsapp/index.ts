
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
    // Define maskedKey at the beginning so it's available throughout the function
    let maskedKey = "***"
    
    // Get the WhatsApp API token from environment variables
    const apiKey = Deno.env.get('creche')
    
    // Log token information for debugging (safely)
    if (apiKey) {
      const keyLength = apiKey.length
      maskedKey = keyLength > 10 
        ? `${apiKey.substring(0, 4)}...${apiKey.substring(keyLength - 4)}`
        : '***'
      console.log(`Token API trouvé (masqué): ${maskedKey}, longueur: ${keyLength}`)
    } else {
      console.error('La clé API WhatsApp n\'est pas configurée')
    }
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'La clé API WhatsApp n\'est pas configurée. Veuillez configurer le secret "creche" dans les paramètres de fonction.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get request body
    const { to, message } = await req.json()

    // Validate input
    if (!to || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Le numéro de téléphone et le message sont requis' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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
    
    console.log(`Tentative d'envoi du message WhatsApp à ${formattedPhone}: ${message}`)
    console.log(`Utilisation du token: ${maskedKey}`)

    // Call WhatsApp API
    try {
      // Use the standard Meta WhatsApp API endpoint
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
      })

      console.log('Statut de réponse de l\'API WhatsApp:', response.status)
      
      // Log response headers for debugging
      console.log('En-têtes de réponse:', JSON.stringify(Array.from(response.headers.entries())))

      const data = await response.json()
      console.log('Corps de réponse de l\'API WhatsApp:', JSON.stringify(data))
      
      if (!response.ok) {
        console.error('Erreur de réponse de l\'API WhatsApp:', data)
        console.error('Statut HTTP:', response.status)
        
        // Add more detailed error information
        let errorMessage = data.error?.message || 'Erreur lors de l\'envoi du message WhatsApp'
        
        // Handle specific error codes from Meta API
        if (data.error?.code === 131047) {
          errorMessage = `Numéro non inscrit au service WhatsApp: ${formattedPhone}`
        } else if (data.error?.code === 100) {
          errorMessage = `Paramètre invalide: ${data.error?.error_data?.details || formattedPhone}`
        } else if (data.error?.code === 190) {
          errorMessage = `Le token WhatsApp n'est pas valide. Veuillez vérifier le secret "creche" dans les paramètres.`
        }
        
        // Return a successful HTTP response with error details
        return new Response(
          JSON.stringify({ success: false, error: errorMessage, details: data.error }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Réponse réussie de l\'API WhatsApp:', data)

      return new Response(
        JSON.stringify({ success: true, data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (fetchError) {
      console.error('Erreur de fetch API WhatsApp:', fetchError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erreur de connexion API: ${fetchError.message}`,
          stack: fetchError.stack 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message WhatsApp:', error)
    // Always return a 200 status with error information
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erreur inconnue',
        stack: error.stack 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
