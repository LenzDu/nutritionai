import axios from 'axios';


export const getInitialPrompt = (description) => {
  return [
    { role: "system", content: `
      You are a helpful assistant to help calculate and estimate nutrition consumptions.\n
      Respond in JSON format.
    ` },
    { role: "system", content: `
        Users will tell you in natural language what they eat, and then you need to break down each kind of food and how much each kind of common nutritions 
        (calories, protein, saturated fat, total fat, carbohydrate, dietary fiber) is consumed. You should also add up to the total amount of each nutritions, as well as the percentages compared to
        the daily recommended amount for an average adult.\n\n
        
        Output instruction:\n
        Your output should be a json dictionary with exactly 2 fields:\n
        - food_summary: a dictionary of each kind of food with a brief explanation on the assumptions you used. 
        Users may give you very vague descriptions, and you should fill in more details (such as amount in standard units, the specific type of food, the way it is cooked, etc.) so users can verify if your assumption is correct. 
        For example, if users say they had "one steak", you can list "ribeye steak" with "a medium (250g) ribeye steak".\n
        - nutrition_breakdown: a dictionary that list the nutritions for each kind of food. 
        Keys are kinds of food that are listed in "food_summary", plus "total", and the values are sub-dictionary of amounts and percentages of each kind of nutrition.\n
        You must include these exact kinds of nutritions with their expected units: {'calories': 'kcal', 'protein': 'g', 'saturated_fat': 'g', 'total_fat': 'g', 'carbohydrate': 'g', 'dietary_fiber': 'g'}\n\n
  
        You must return in JSON format.\n\n
        
        Example:\n
        Input: a big mac meal at mcdonald's\n
        Output:\n
        {
        'food_summary': {'big mac': "one big mac burger from McDonald's", 'medium fries': "assuming the big mac meal comes with a medium serving of McDonald's fries", 'medium coke': 'assuming the big mac meal comes with a medium 21 oz Coca-Cola'},
        'nutrition_breakdown': {
            'big mac': {'calories': {'amount': 563, 'percentage': 28.15}, 'protein': {'amount': 26, 'percentage': 52}, 'saturated_fat': {'amount': 10, 'percentage': 50}, 'total_fat': {'amount': 33, 'percentage': 50.77}, 'carbohydrate': {'amount': 46, 'percentage': 15.33}, 'dietary_fiber': {'amount': 3, 'percentage': 12}},
            'medium fries': {'calories': {'amount': 340, 'percentage': 17}, 'protein': {'amount': 4, 'percentage': 8}, 'saturated_fat': {'amount': 3.5, 'percentage': 17.5}, 'total_fat': {'amount': 16, 'percentage': 24.62}, 'carbohydrate': {'amount': 44, 'percentage': 14.67}, 'dietary_fiber': {'amount': 4, 'percentage': 16}},
            'medium coke': {'calories': {'amount': 200, 'percentage': 10}, 'protein': {'amount': 0, 'percentage': 0}, 'saturated_fat': {'amount': 0, 'percentage': 0}, 'total_fat': {'amount': 0, 'percentage': 0}, 'carbohydrate': {'amount': 55, 'percentage': 18.33}, 'dietary_fiber': {'amount': 0, 'percentage': 0}},
            'total': {'calories': {'amount': 1103, 'percentage': 55.15}, 'protein': {'amount': 30, 'percentage': 60}, 'saturated_fat': {'amount': 13.5, 'percentage': 67.5}, 'total_fat': {'amount': 49, 'percentage': 75.38}, 'carbohydrate': {'amount': 145, 'percentage': 48.33}, 'dietary_fiber': {'amount': 7, 'percentage': 28}}
        }}
      ` },
      // Description of meal:
      // ${description}
      { role: "user", content: `${description}`}
  ];
};


export const getFollowUpPrompt = (conversation, description) => {
  return [
    ...conversation,
    { role: "system", content: `
      This is great progress. However, there are additional details the user would like to clarify:
      
      Update your estimation based on this and return in the exact same format as your previous answer.
      Respond in JSON format.
      ` },
    { role: "user", content: `${description}`}
    ];
};

export const fetchNutritionData = async ({ apiKey, messages }) => {
  // uncomment to mock openai api call to test other components
  // return `{
  //   "food_summary": {"big mac": "one big mac burger from McDonald\'s", "medium fries": "assuming the big mac meal comes with a medium serving of McDonald\'s fries", "medium coke": "assuming the big mac meal comes with a medium 21 oz Coca-Cola"},
  //   "nutrition_breakdown": {
  //     "big mac": {"calories": {"amount": "563", "percentage": 28.15}, "protein": {"amount": 26, "percentage": 52}, "saturated_fat": {"amount": 10, "percentage": 50}, "total_fat": {"amount": 33, "percentage": 50.77}, "carbohydrate": {"amount": 46, "percentage": 15.33}, "dietary_fiber": {"amount": 3, "percentage": 12}},
  //     "medium fries": {"calories": {"amount": 340, "percentage": 17}, "protein": {"amount": 4, "percentage": 8}, "saturated_fat": {"amount": 3.5, "percentage": 17.5}, "total_fat": {"amount": 16, "percentage": 24.62}, "carbohydrate": {"amount": 44, "percentage": 14.67}, "dietary_fiber": {"amount": 4, "percentage": 16}},
  //     "medium coke": {"calories": {"amount": 200, "percentage": 10}, "protein": {"amount": 0, "percentage": 0}, "saturated_fat": {"amount": 0, "percentage": 0}, "total_fat": {"amount": 0, "percentage": 0}, "carbohydrate": {"amount": 55, "percentage": 18.33}, "dietary_fiber": {"amount": 0, "percentage": 0}},
  //     "total": {"calories": {"amount": 1103, "percentage": 55.15}, "protein": {"amount": 30, "percentage": 60}, "saturated_fat": {"amount": 13.5, "percentage": 67.5}, "total_fat": {"amount": 49, "percentage": 75.38}, "carbohydrate": {"amount": 145, "percentage": 48.33}, "dietary_fiber": {"amount": 7, "percentage": 28}}}}
  // `;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      messages: messages,
      model: "gpt-4-1106-preview",
      response_format: { "type": "json_object" },
      max_tokens: 1000,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      }
    }
  );

  return response.data.choices[0].message.content;
  // return JSON.parse(response.data.choices[0].message.content);
};