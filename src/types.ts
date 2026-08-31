export interface CropRecommendationRequest {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface CropMatch {
  crop: string;
  score: number;
}

export interface CropRecommendationResponse {
  recommended_crop: string;
  confidence_score: number;
  all_recommendations: CropMatch[];
  input_params?: CropRecommendationRequest;
}

export interface DiseaseDetectionResult {
  disease: string;
  description: string;
  treatment: string;
  severity: "Low" | "Low to Medium" | "Medium" | "High" | "None";
  confidence: number;
  source?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall_chance: number;
  wind_speed: number;
  description: string;
  pressure: number;
  feels_like: number;
  advisory: string;
}

export interface FarmerRecord {
  id: number;
  location: string;
  crop: string;
  timestamp: string;
  details?: {
    area?: string;
    soil_type?: string;
    irrigation?: string;
    notes?: string;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    ph?: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}
