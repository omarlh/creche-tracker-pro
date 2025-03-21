
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
    // Get the WhatsApp API token from environment variables
    let apiToken = Deno.env.get('WHATSAPP_TOKEN');
    
    // Diagnostic logs - Don't log the actual token for security
    console.log(`API Token found?: ${apiToken ? 'Yes' : 'No'}`);
    if (!apiToken) {
      console.log('Trying fallback token "creche"');
      apiToken = Deno.env.get('creche'); // Try fallback
      console.log(`Fallback token found?: ${apiToken ? 'Yes' : 'No'}`);
    }
    
    // Log token information for debugging (safely)
    if (!apiToken) {
      console.error('La clé API WhatsApp n\'est pas configurée')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'La clé API WhatsApp n\'est pas configurée. Veuillez configurer WHATSAPP_TOKEN avec une clé valide.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get token length for logs (without revealing the actual token)
    const tokenLength = apiToken.length
    const maskedToken = tokenLength > 10 
      ? `${apiToken.substring(0, 4)}...${apiToken.substring(tokenLength - 4)}`
      : '***'
    console.log(`Token API trouvé (masqué): ${maskedToken}, longueur: ${tokenLength}`)

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
      formattedPhone = '+212' + formattedPhone.substring(1)
    } else if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('212')) {
        formattedPhone = '+' + formattedPhone
      } else if (formattedPhone.startsWith('00')) {
        formattedPhone = '+' + formattedPhone.substring(2)
      } else {
        formattedPhone = '+212' + formattedPhone
      }
    }
    
    console.log(`Tentative d'envoi du message WhatsApp à ${formattedPhone}: ${message}`)
    console.log(`Utilisation du token: ${maskedToken}`)

    // Test the token validity with a simple call to the Graph API
    try {
      console.log("Test de validité du token avant l'envoi du message...");
      const testResponse = await fetch('https://graph.facebook.com/v17.0/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });
      
      const testData = await testResponse.json();
      console.log(`Résultat du test de token: Status ${testResponse.status}`);
      console.log(`Response body:`, JSON.stringify(testData));
      
      if (!testResponse.ok) {
        if (testData.error && testData.error.code === 190) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Le token d'accès n'est pas valide. Veuillez vérifier que vous utilisez un token d'accès permanent pour l'API WhatsApp Business Cloud.`,
              details: testData.error
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } else {
        console.log("Token validé avec succès! App ID:", testData.id);
      }
    } catch (tokenError) {
      console.error('Erreur lors de la validation du token:', tokenError);
    }

    // Call WhatsApp API with more debugging
    try {
      console.log("Appel de l'API WhatsApp Business (Graph API)...")
      
      // Use the standard Meta WhatsApp API endpoint (Cloud API)
      const response = await fetch('https://graph.facebook.com/v17.0/171689289460681/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
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
      console.log('En-têtes de réponse:', JSON.stringify(Array.from(response.headers.entries())))

      const data = await response.json()
      console.log('Corps de réponse de l\'API WhatsApp:', JSON.stringify(data))
      
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
          errorMessage = `Token d'accès invalide. Veuillez vérifier que le secret WHATSAPP_TOKEN est correctement configuré avec un Permanent Access Token valide de l'API WhatsApp Business.`
        } else if (data.error?.code === 10) {
          errorMessage = `Erreur d'autorisation: le token semble valide mais manque des autorisations nécessaires pour l'envoi de messages WhatsApp.`
        }
        
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
