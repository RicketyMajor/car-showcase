export const manufacturers = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroen",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MINI",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "Ram",
  "Rolls-Royce",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

export const yearsOfProduction = [
  { title: "Year", value: "" },
  { title: "2015", value: "2015" },
  { title: "2016", value: "2016" },
  { title: "2017", value: "2017" },
  { title: "2018", value: "2018" },
  { title: "2019", value: "2019" },
  { title: "2020", value: "2020" },
  { title: "2021", value: "2021" },
  { title: "2022", value: "2022" },
  { title: "2023", value: "2023" },
];

// Values are matched as substrings against the API's fuelType1 field, so
// "Gasoline" covers both "Regular Gasoline" and "Premium Gasoline". Hydrogen is
// here because the data really does carry it - the 2022 Toyota Mirai is one.
export const fuels = [
  { title: "Fuel", value: "" },
  { title: "Gasoline", value: "Gasoline" },
  { title: "Diesel", value: "Diesel" },
  { title: "Electricity", value: "Electricity" },
  { title: "Hydrogen", value: "Hydrogen" },
];

// Only destinations that exist. The inherited list ("How it works", "Podcast",
// "Discord") all pointed at "/" and did nothing.
export const footerLinks = [
  {
    title: "Data",
    links: [
      { title: "FuelEconomy.gov", url: "https://www.fueleconomy.gov/feg/ws/" },
    ],
  },
  {
    title: "Built with",
    links: [
      { title: "Next.js", url: "https://nextjs.org/" },
      { title: "TypeScript", url: "https://www.typescriptlang.org/" },
      { title: "Tailwind CSS", url: "https://tailwindcss.com/" },
    ],
  },
  {
    title: "Source",
    links: [
      { title: "GitHub repository", url: "https://github.com/RicketyMajor/car-showcase" },
    ],
  },
];

// Query-string keys. Every reader and writer of the URL imports from here so a
// rename can never leave the two halves disagreeing.
export const SEARCH_PARAM = {
  manufacturer: "manufacturer",
  model: "model",
  year: "year",
  fuel: "fuel",
  limit: "limit",
} as const;

// FuelEconomy.gov cannot list models without a make, so the landing page needs a
// starting point.
export const DEFAULT_MANUFACTURER = "Toyota";
export const DEFAULT_YEAR = 2022;

// Cars added to the grid per "Show more" click.
export const PAGE_SIZE = 10;
