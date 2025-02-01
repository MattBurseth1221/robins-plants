//Interfaces for PlantNet API detection response
interface ScientificName {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;
}

interface Species {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;
  genus: ScientificName;
  family: ScientificName;
  commonNames: string[];
}

export interface PlantDetectResult {
  score: number;
  species: Species;
}

