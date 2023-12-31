import axios from 'axios';


export const getInitialPrompt = (description) => {
  return [
    { role: "system", content: `
      You are a helpful assistant to help calculate and estimate nutrition consumptions.
      Respond in JSON format.
    ` },
    { role: "system", content: `
      I will tell you in natural language what they eat, and then you need to break down each kind of food and how much each kind of common nutritions 
      (calories, carbohydrate, protein, fat, dietary fiber) is consumed. You should also add up to the total amount of each nutritions, as well as the percentages compared to
      the daily recommended amount for an average adult.
      Return a dictionary where keys are each kind of food, as well as the total, and the values are sub-dictionary of amounts and percentages of each kind of nutrition.
      You must return in JSON format.

      Example:
      Input: half bowl of rice, 150g beef tongue dipped with vegetable oil and half small plate of bok choy
      Output:
      {
        "rice": {"calories": {"amount": 103.0, "percentage": 5.15}, "carbohydrate": {"amount": 22.5, "percentage": 7.5}, "protein": {"amount": 2.1, "percentage": 4.2}, "dietary fiber": {"amount": 0.3, "percentage": 1.0}},
        "beef tongue": {"calories": {"amount": 244.5, "percentage": 12.23}, "carbohydrate": {"amount": 0.0, "percentage": 0.0}, "protein": {"amount": 29.25, "percentage": 58.5}, "dietary fiber": {"amount": 0.0, "percentage": 0.0}},
        "vegetable oil": {"calories": {"amount": 120.0, "percentage": 6.0}, "carbohydrate": {"amount": 0.0, "percentage": 0.0}, "protein": {"amount": 0.0, "percentage": 0.0}, "dietary fiber": {"amount": 0.0, "percentage": 0.0}},
        "bok choy": {"calories": {"amount": 10.0, "percentage": 0.5}, "carbohydrate": {"amount": 1.5, "percentage": 0.5}, "protein": {"amount": 1.0, "percentage": 2.0}, "dietary fiber": {"amount": 0.7, "percentage": 2.3}},
        "total": {"calories": {"amount": 477.5, "percentage": 23.88}, "carbohydrate": {"amount": 24.0, "percentage": 8.0}, "protein": {"amount": 32.35, "percentage": 64.7}, "dietary fiber": {"amount": 1.0, "percentage": 3.3}}
      }
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
      This is great progress. However, there are a additional details I would like to clarify:
      
      Update your estimation based on this and return in the exact same format as your previous answer.
      Respond in JSON format.
      ` },
    { role: "user", content: `${description}`}
    ];
};

export const fetchNutritionData = async ({ apiKey, messages }) => {
  // uncomment to mock openai api call to test other components
  // return `{
  //   "rice": {"calories": {"amount": 103.0, "percentage": 5.15}, "carbohydrate": {"amount": 22.5, "percentage": 7.5}, "protein": {"amount": 2.1, "percentage": 4.2}, "dietary fiber": {"amount": 0.3, "percentage": 1.0}},
  //   "beef tongue": {"calories": {"amount": 244.5, "percentage": 12.23}, "carbohydrate": {"amount": 0.0, "percentage": 0.0}, "protein": {"amount": 29.25, "percentage": 58.5}, "dietary fiber": {"amount": 0.0, "percentage": 0.0}},
  //   "vegetable oil": {"calories": {"amount": 120.0, "percentage": 6.0}, "carbohydrate": {"amount": 0.0, "percentage": 0.0}, "protein": {"amount": 0.0, "percentage": 0.0}, "dietary fiber": {"amount": 0.0, "percentage": 0.0}},
  //   "bok choy": {"calories": {"amount": 10.0, "percentage": 0.5}, "carbohydrate": {"amount": 1.5, "percentage": 0.5}, "protein": {"amount": 1.0, "percentage": 2.0}, "dietary fiber": {"amount": 0.7, "percentage": 2.3}},
  //   "total": {"calories": {"amount": 477.5, "percentage": 23.88}, "carbohydrate": {"amount": 24.0, "percentage": 8.0}, "protein": {"amount": 32.35, "percentage": 64.7}, "dietary fiber": {"amount": 1.0, "percentage": 3.3}}
  // }`;

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