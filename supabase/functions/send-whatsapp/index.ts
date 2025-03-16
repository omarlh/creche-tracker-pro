
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
    // Utiliser le secret 'creche' comme clé WhatsApp API
    const apiKey = Deno.env.get('creche')
    if (!apiKey) {
      console.error('La clé API WhatsApp (creche) n\'est pas définie dans les variables d\'environnement')
      throw new Error('La clé API WhatsApp n\'est pas configurée')
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
    
    console.log(`Tentative d'envoi du message WhatsApp à ${formattedPhone}: ${message}`)
    console.log(`Utilisation de la clé API: ${apiKey.substring(0, 5)}...`)

    // Modification: Amélioration du handling des erreurs de l'API Facebook
    try {
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
        console.error('Erreur de réponse de l\'API WhatsApp:', data)
        
        // Add more detailed error information
        let errorMessage = data.error?.message || 'Erreur lors de l\'envoi du message WhatsApp'
        
        // Handle specific error codes from Meta API
        if (data.error?.code === 131047) {
          errorMessage = `Numéro non inscrit au service WhatsApp: ${formattedPhone}`
        } else if (data.error?.code === 100) {
          errorMessage = `Paramètre invalide: ${data.error?.error_data?.details || formattedPhone}`
        } else if (data.error?.code === 190) {
          errorMessage = `Problème d'authentification: Vérifiez que le token d'accès est valide`
        }
        
        // Returning a successful response to the client but with error data
        return new Response(
          JSON.stringify({ success: false, error: errorMessage }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Réponse réussie de l\'API WhatsApp:', data)

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (fetchError) {
      console.error('Erreur de fetch API WhatsApp:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: `Erreur de connexion API: ${fetchError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message WhatsApp:', error)
    // Returning a 200 status with error information to avoid non-2xx error
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { 
        status: 200, // Change from 400 to 200
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
