import { dailyValue } from "../reference-data";

// Define a function to calculate the percentage
export const calculatePercentage = (amount, nutrient) => {
  const recommendedAmount = dailyValue[nutrient];
  return (amount / recommendedAmount) * 100;
};

export const calculateTotalNutrients = (data) => {
  const firstFoodItemKey = Object.keys(data).find(key => key !== 'total');
  const nutritionTypes = firstFoodItemKey ? Object.keys(data[firstFoodItemKey]) : [];

  // Initialize an object to store total amounts for each nutrient
  let totals = nutritionTypes.reduce((acc, nutrient) => {
    acc[nutrient] = 0;
    return acc;
  }, {});

  // Sum up all the amounts for each nutrient
  Object.values(data).forEach(foodData => {
    nutritionTypes.forEach(nutrient => {
      totals[nutrient] += foodData[nutrient] || 0;
    });
  });

  return totals;
};


export const calculateMaxContributor = (data, nutrient) => {
  let maxContributor = { name: '', amount: 0 };
  Object.entries(data).forEach(([foodName, nutrients]) => {
    if (nutrients[nutrient] > maxContributor.amount) {
      maxContributor = { name: foodName, amount: nutrients[nutrient] };
    }
  });
  return maxContributor;
};