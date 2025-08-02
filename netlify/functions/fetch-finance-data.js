exports.handler = async function(event, context) {
  const { symbol } = event.queryStringParameters;
  const API_KEY = process.env.FINANCE_API_KEY; // Ensure this is set in Netlify environment variables

  if (!symbol) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Symbol parameter is required." })
    };
  }

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API Key not configured." })
    };
  }

  try {
    // This is a placeholder. You'll need to replace this with a real financial API endpoint.
    // Example: Alpha Vantage, Financial Modeling Prep, etc.
    // For demonstration, let's return some dummy data.
    const dummyData = [10, 20, 15, 25, 30, 22, 18, 28, 35, 40]; // Dummy data for a symbol

    // In a real scenario, you would make an API call like:
    // const response = await fetch(`https://api.example.com/data?symbol=${symbol}&apikey=${API_KEY}`);
    // const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(dummyData) // Return dummy data for now
    };
  } catch (error) {
    console.error("Error fetching finance data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch finance data." })
    };
  }
};