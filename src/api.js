import axios from 'axios';


export const getInitialPrompt = (description) => {
  return [
    {
      role: "system", content: `
      You are a helpful assistant to help calculate and estimate nutrition consumptions.\n
      Respond in JSON format.
    ` },
    {
      role: "system", content: `
        Users will tell you in natural language what they eat, and then you need to break down each kind of food and how much each kind of common nutritions 
        (calories, protein, saturated fat, total fat, carbohydrate, dietary fiber) is consumed.\n\n
        
        Output instruction:\n
        Your output should be a json dictionary with exactly 2 fields:\n
        - food_summary: a dictionary of each kind of food with a brief explanation on the assumptions you used. 
        Users may give you very vague descriptions, and you should fill in more details (such as amount in standard units, the specific type of food, the way it is cooked, etc.) so users can verify if your assumption is correct. 
        For example, if users say they had "one steak", you can list "ribeye steak" with "a medium (250g) ribeye steak".\n
        - nutrition_breakdown: a dictionary that list the nutritions for each kind of food. 
        Keys are kinds of food that are listed in "food_summary" and the values are amounts of each kind of nutrition.\n
        You must include these exact kinds of nutritions with their expected units: {'calories': 'kcal', 'protein': 'g', 'saturated_fat': 'g', 'total_fat': 'g', 'carbohydrate': 'g', 'dietary_fiber': 'g'}.\n\n
  
        You must return in JSON format.\n\n
        
        Example:\n
        Input: a big mac meal at mcdonald's\n
        Output:\n
        {
        'food_summary': {'big mac': "one big mac burger from McDonald's", 'medium fries': "assuming the big mac meal comes with a medium serving of McDonald's fries", 'medium coke': 'assuming the big mac meal comes with a medium 21 oz Coca-Cola'},
        'nutrition_breakdown': {
            'big mac': {'calories': 563, 'protein': 26, 'saturated_fat': 10, 'total_fat': 33, 'carbohydrate': 46, 'dietary_fiber': 3},
            'medium fries': {'calories': 340, 'protein': 4, 'saturated_fat': 3.5, 'total_fat': 16, 'carbohydrate': 44, 'dietary_fiber': 4},
            'medium coke': {'calories': 200, 'protein': 0, 'saturated_fat': 0, 'total_fat': 0, 'carbohydrate': 55, 'dietary_fiber': 0},
        }}
      ` },
    // Description of meal:
    // ${description}
    { role: "user", content: `${description}` }
  ];
};


export const getFollowUpPrompt = (conversation, description) => {
  return [
    ...conversation,
    {
      role: "system", content: `
      This is great progress. However, there are additional details the user would like to clarify:
      
      Update your estimation based on this and return in the exact same format as your previous answer.
      Respond in JSON format.
      ` },
    { role: "user", content: `${description}` }
  ];
};

export const fetchNutritionData = async ({ apiKey, messages }) => {
  // uncomment to mock openai api call to test other components
  // return {
  //   message: `{
  //     "food_summary": {"big mac": "one big mac burger from McDonald's", "medium fries": "assuming the big mac meal comes with a medium serving of McDonald's fries", "medium coke": "assuming the big mac meal comes with a medium 21 oz Coca-Cola"},
  //     "nutrition_breakdown": {
  //       "big mac": {"calories": 563, "protein": 26, "saturated_fat": 10, "total_fat": 33, "carbohydrate": 46, "dietary_fiber": 3},
  //       "medium fries": {"calories": 340, "protein": 4, "saturated_fat": 3.5, "total_fat": 16, "carbohydrate": 44, "dietary_fiber": 4},
  //       "medium coke": {"calories": 200, "protein": 0, "saturated_fat": 0, "total_fat": 0, "carbohydrate": 55, "dietary_fiber": 0}}}
  //   `,
  //   usage: {
  //     'prompt_tokens': 649,
  //     'completion_tokens': 323,
  //     'total_tokens': 972
  //   }
  // };

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      messages: messages,
      model: "gpt-4-1106-preview",
      response_format: { "type": "json_object" },
      max_tokens: 1000,
      temperature: 0.8
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      }
    }
  );
  return {
    message: response.data.choices[0].message.content,
    usage: response.data.usage
  };
};

export const calcualteCost = ( usage ) => {
  return usage.prompt_tokens * 0.01 * 0.001 + usage.completion_tokens * 0.03 * 0.001
}