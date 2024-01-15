interface NutrientData {
  [key: string]: number;
};

export const calculatePercentage = (dailyValue: NutrientData, amount: number, nutrient: string): number => {
  const recommendedAmount = dailyValue[nutrient];
  return (amount / recommendedAmount) * 100;
};

export const calculateTotalNutrients = (data: Record<string, NutrientData>): NutrientData => {
  // Assuming data always contains at least one food item with nutrients data
  const nutritionTypes = Object.keys(data[Object.keys(data)[0]]);
  
  // Initialize an object to store total amounts for each nutrient
  let totals: NutrientData = nutritionTypes.reduce((acc: NutrientData, nutrient) => {
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

interface FoodContributor {
  name: string;
  amount: number;
}

export const calculateMaxContributor = (data: Record<string, NutrientData>, nutrient: string): FoodContributor => {
  let maxContributor: FoodContributor = { name: '', amount: 0 };
  Object.entries(data).forEach(([foodName, nutrients]) => {
    const nutrientAmount = nutrients[nutrient];
    if (nutrientAmount !== undefined && nutrientAmount > maxContributor.amount) {
      maxContributor = { name: foodName, amount: nutrientAmount };
    }
  });
  return maxContributor;
};
