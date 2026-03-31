export type Fertilizer = {
  label: string;
  fertilizers: {
    basal: string[];
    top_dressing: string[];
    organic: string[];
  };
  application: string;
};

export const fertilizers: Fertilizer[] = [
  {
    label: "maize",
    fertilizers: {
      basal: ["DAP", "NPK 23:23:0"],
      top_dressing: ["CAN", "Urea"],
      organic: ["Compost manure", "Farmyard manure"],
    },
    application:
      "Apply DAP at planting, then top-dress with CAN after 3-4 weeks.",
  },
  {
    label: "banana",
    fertilizers: {
      basal: ["NPK 17:17:17"],
      top_dressing: ["Urea"],
      organic: ["Compost", "Manure"],
    },
    application: "Apply NPK during planting and regularly add organic manure.",
  },
  {
    label: "beans",
    fertilizers: {
      basal: ["DAP"],
      top_dressing: [],
      organic: ["Compost"],
    },
    application: "Use DAP sparingly; beans fix nitrogen naturally.",
  },
  {
    label: "rice",
    fertilizers: {
      basal: ["DAP"],
      top_dressing: ["Urea"],
      organic: ["Compost"],
    },
    application: "Apply DAP before flooding, then Urea after 2-3 weeks.",
  },
  {
    label: "coffee",
    fertilizers: {
      basal: ["NPK 17:17:17"],
      top_dressing: ["CAN"],
      organic: ["Compost", "Mulch"],
    },
    application: "Apply NPK at onset of rains and CAN later.",
  },
  {
    label: "tea",
    fertilizers: {
      basal: ["NPK 25:5:5"],
      top_dressing: ["Urea"],
      organic: ["Mulch"],
    },
    application: "Apply fertilizer in split doses throughout the year.",
  },
  {
    label: "tomato",
    fertilizers: {
      basal: ["DAP"],
      top_dressing: ["CAN", "Urea"],
      organic: ["Compost"],
    },
    application: "Apply DAP at transplanting, then CAN after flowering.",
  },
  {
    label: "kale",
    fertilizers: {
      basal: ["DAP"],
      top_dressing: ["CAN"],
      organic: ["Manure"],
    },
    application: "Frequent CAN application boosts leafy growth.",
  },
  {
    label: "cabbage",
    fertilizers: {
      basal: ["DAP"],
      top_dressing: ["CAN"],
      organic: ["Compost"],
    },
    application: "Apply CAN every 2–3 weeks for better head formation.",
  },
  {
    label: "onions",
    fertilizers: {
      basal: ["DAP"],
      top_dressing: ["CAN"],
      organic: ["Manure"],
    },
    application: "Avoid excess nitrogen to prevent poor bulb formation.",
  },
  {
    label: "potato",
    fertilizers: {
      basal: ["DAP"],
      top_dressing: ["CAN"],
      organic: ["Compost"],
    },
    application: "Apply DAP at planting and CAN at tuber initiation.",
  },
  {
    label: "sweet_potato",
    fertilizers: {
      basal: ["NPK 17:17:17"],
      top_dressing: [],
      organic: ["Compost"],
    },
    application: "Avoid excessive nitrogen; promotes vines not tubers.",
  },
  {
    label: "cassava",
    fertilizers: {
      basal: ["NPK 17:17:17"],
      top_dressing: [],
      organic: ["Manure"],
    },
    application: "Apply at planting; cassava thrives in low fertility soils.",
  },
  {
    label: "sorghum",
    fertilizers: {
      basal: ["DAP"],
      top_dressing: ["Urea"],
      organic: ["Compost"],
    },
    application: "Apply small amounts due to drought tolerance.",
  },
  {
    label: "millet",
    fertilizers: {
      basal: ["DAP"],
      top_dressing: ["Urea"],
      organic: ["Manure"],
    },
    application: "Low fertilizer requirement; apply moderately.",
  },
  {
    label: "groundnuts",
    fertilizers: {
      basal: ["SSP (Single Super Phosphate)"],
      top_dressing: [],
      organic: ["Compost"],
    },
    application: "Avoid nitrogen fertilizers; use phosphorus-rich fertilizers.",
  },
  {
    label: "soybeans",
    fertilizers: {
      basal: ["DAP"],
      top_dressing: [],
      organic: ["Compost"],
    },
    application: "Minimal nitrogen needed due to nitrogen fixation.",
  },
  {
    label: "sugarcane",
    fertilizers: {
      basal: ["NPK 20:10:10"],
      top_dressing: ["Urea"],
      organic: ["Filter cake", "Compost"],
    },
    application: "Apply nitrogen in split doses during growth stages.",
  },
  {
    label: "mango",
    fertilizers: {
      basal: ["NPK 17:17:17"],
      top_dressing: ["Urea"],
      organic: ["Manure"],
    },
    application: "Apply fertilizer at flowering and fruiting stages.",
  },
  {
    label: "avocado",
    fertilizers: {
      basal: ["NPK 17:17:17"],
      top_dressing: ["CAN"],
      organic: ["Compost"],
    },
    application: "Apply regularly with emphasis on nitrogen.",
  },
];

