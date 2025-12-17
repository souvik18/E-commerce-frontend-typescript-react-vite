import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EnquiryData {
  product_id: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const enquiryData: EnquiryData = await req.json();

    const emailBody = `
New Enquiry Received

Product: ${enquiryData.product_name}
Customer Name: ${enquiryData.customer_name}
Customer Email: ${enquiryData.customer_email}
Customer Phone: ${enquiryData.customer_phone}

Message:
${enquiryData.message || 'No message provided'}

---
This enquiry was submitted from your business website.
    `;

    console.log('Enquiry Email Content:', emailBody);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Enquiry received successfully',
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing enquiry:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});