

export enum UserRole {
  UNSELECTED,
  DOCTOR,
  PATIENT,
}

export interface Review {
  patientName: string;
  rating: number;
  text: string;
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Doctor {
  id: number;
  name: string;
  email?: string;
  password?: string;
  specialty: string;
  photoUrl: string;
  degree: string;
  rating: number;
  isOnline: boolean;
  location: Location;
  reviews: Review[];
  availableSlots: string[];
}

export interface Consultation {
  id: number;
  date: string;
  symptoms: string[];
  notes: string;
}

export interface Progress {
  weightHistory: { date: string; weight: number }[];
  symptomLog: { date: string; symptom: string; severity: number }[];
  dietAdherence: { date: string; adherence: number }[];
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  photoUrl: string;
  email?: string;
  password?: string;
  assignedDoctorId: number;
  consultationType: 'Online' | 'Offline';
  relationship: string;
  consultations: Consultation[];
  progress?: Progress;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  tags: string[];
}

export interface YogaAsana {
  id: number;
  name: string;
  sanskritName: string;
  description: string;
  steps: string[];
  benefits: string;
  timeOfDay: string;
  repetitions: string;
  doshas: string[];
}

export interface FoodLibraryItem {
    id: number;
    name: string;
    prakriti: 'Vata' | 'Pitta' | 'Kapha' | 'Tridoshic';
    rasa: string;
    calories: number;
    protein: number;
}

export interface DietPlan {
    totalCalories: number;
    totalProtein: number;
    meals: {
        Breakfast: FoodLibraryItem[];
        Lunch: FoodLibraryItem[];
        Dinner: FoodLibraryItem[];
        Snacks: FoodLibraryItem[];
    };
}

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'doctor' | 'bot';
    type: 'text' | 'prescription' | 'diet' | 'image' | 'document';
    data?: any;
    isLoading?: boolean;
}

export interface UpcomingAppointment {
    doctor: Doctor;
    date: string;
    time: string;
    chatHistory: ChatMessage[];
}

export interface Herb {
  id: number;
  name: string;
  botanicalName: string;
  imageUrl: string;
  description: string;
  benefits: string[];
  recipe: {
    title: string;
    ingredients: string[];
    instructions: string[];
  };
}

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  snippet: string;
  content: string;
}

export interface CommunityComment {
    id: number;
    author: string;
    authorImageUrl: string;
    content: string;
    timestamp: string;
}

export interface CommunityPost {
    id: number;
    author: string;
    authorImageUrl: string;
    content: string;
    timestamp: string;
    comments: CommunityComment[];
}

export interface GeneratedRecipe {
    id: number;
    patientId: number;
    mealType: string;
    title: string;
    ingredients: string[];
    instructions: string[];
}

export interface UserProfile {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    prakriti: string;
    vikriti: string;
    weight?: number;
}
