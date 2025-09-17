/**
 * Sample Quick, Healthy, Local & Budget-Friendly Recipes
 * For demonstration purposes in the Adaptive Nutrition System
 */

export const quickRecipesSamples = {
  breakfast: [
    {
      name: "Avena Express Proteica",
      time: "5 min",
      cost: "Bajo",
      local: true,
      ingredients: ["Avena integral", "Leche", "Plátano", "Canela", "Miel"],
      description: "Desayuno rápido y nutritivo perfecto para comenzar el día"
    },
    {
      name: "Tostadas de Aguacate y Huevo",
      time: "8 min", 
      cost: "Medio",
      local: true,
      ingredients: ["Pan integral", "Aguacate", "Huevo", "Tomate", "Sal"],
      description: "Combinación perfecta de grasas saludables y proteína"
    },
    {
      name: "Batido Verde Energético",
      time: "4 min",
      cost: "Bajo", 
      local: true,
      ingredients: ["Espinacas", "Plátano", "Manzana", "Agua", "Limón"],
      description: "Carga de vitaminas y minerales en forma líquida"
    }
  ],
  lunch: [
    {
      name: "Bowl de Pollo y Verduras",
      time: "25 min",
      cost: "Medio",
      local: true,
      ingredients: ["Pechuga de pollo", "Arroz integral", "Brócoli", "Zanahoria"],
      description: "Almuerzo balanceado con proteína completa y carbohidratos complejos"
    },
    {
      name: "Ensalada de Atún Mediterránea", 
      time: "8 min",
      cost: "Bajo",
      local: true,
      ingredients: ["Atún en agua", "Lechuga", "Tomate", "Pepino", "Aceitunas"],
      description: "Opción fresca rica en proteínas y omega-3"
    },
    {
      name: "Quesadillas de Frijoles",
      time: "13 min",
      cost: "Bajo",
      local: true, 
      ingredients: ["Tortillas de maíz", "Frijoles refritos", "Queso panela", "Cebolla"],
      description: "Proteína vegetal económica con sabor tradicional mexicano"
    }
  ],
  dinner: [
    {
      name: "Salmón con Vegetales al Horno",
      time: "28 min",
      cost: "Alto",
      local: false,
      ingredients: ["Filete de salmón", "Calabacín", "Pimiento", "Cebolla"],
      description: "Cena elegante rica en omega-3 y antioxidantes"
    },
    {
      name: "Tacos de Pescado Ligeros",
      time: "18 min", 
      cost: "Medio",
      local: true,
      ingredients: ["Pescado blanco", "Tortillas de maíz", "Repollo", "Lime"],
      description: "Cena mexicana saludable baja en calorías"
    },
    {
      name: "Sopa de Lentejas Casera",
      time: "40 min",
      cost: "Bajo",
      local: true,
      ingredients: ["Lentejas", "Cebolla", "Zanahoria", "Apio", "Ajo"],
      description: "Comfort food rico en fibra y proteína vegetal"
    }
  ],
  snacks: [
    {
      name: "Yogur con Frutas de Temporada",
      time: "3 min",
      cost: "Bajo", 
      local: true,
      ingredients: ["Yogur natural", "Frutas de temporada", "Granola", "Miel"],
      description: "Snack probiótico con frutas locales"
    },
    {
      name: "Hummus con Vegetales Crujientes", 
      time: "8 min",
      cost: "Bajo",
      local: true,
      ingredients: ["Garbanzos cocidos", "Tahini", "Limón", "Zanahoria", "Apio"],
      description: "Dip mediterráneo rico en proteína vegetal"
    }
  ]
};

export const nutritionTips = [
  {
    tip: "🥑 Usa aguacates locales como fuente de grasas saludables - son más baratos y frescos",
    category: "local"
  },
  {
    tip: "⏰ Prepara avena overnight para ahorrar tiempo en las mañanas ocupadas", 
    category: "time"
  },
  {
    tip: "💰 Compra legumbres secas en lugar de enlatadas - son 70% más económicas",
    category: "budget"
  },
  {
    tip: "🌱 Las verduras de temporada tienen mejor precio y más nutrientes",
    category: "health"
  },
  {
    tip: "🍳 Los huevos son la proteína más económica y versátil disponible",
    category: "budget"
  },
  {
    tip: "🥬 Las verduras de hoja verde local son ricas en folato y hierro",
    category: "health"
  }
];

export const budgetSubstitutions = {
  "salmón": {
    alternatives: ["sardinas", "atún fresco", "pescado blanco local"],
    savings: "60-80%",
    nutritionNote: "Las sardinas tienen incluso más omega-3 que el salmón"
  },
  "quinoa": {
    alternatives: ["arroz integral", "avena", "amaranto local"],
    savings: "50-70%", 
    nutritionNote: "El amaranto local tiene perfil proteico similar a la quinoa"
  },
  "arándanos": {
    alternatives: ["fresas locales", "moras", "frutas de temporada"],
    savings: "40-60%",
    nutritionNote: "Las frutas locales de temporada tienen más antioxidantes"
  },
  "almendras": {
    alternatives: ["cacahuates", "semillas de girasol", "nueces de la región"],
    savings: "50-70%",
    nutritionNote: "Los cacahuates tienen similar contenido proteico"
  }
};