import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Pets: undefined;
  Health: undefined;
  CareTeam: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type PetStackParamList = {
  PetList: undefined;
  PetProfile: { id: string };
  AddPet: undefined;
  EditPet: { id: string };
};

export type HealthStackParamList = {
  HealthDashboard: undefined;
  AddHealthRecord: { petId: string };
  HealthHistory: { petId: string; type: string };
  Medications: { petId: string };
  Vaccinations: { petId: string };
};

export type CareTeamStackParamList = {
  CareTeamList: undefined;
  AddCareTeamMember: undefined;
  CareTeamMemberProfile: { id: string };
};

export type AnalyticsStackParamList = {
  AnalyticsDashboard: undefined;
  WeightTrend: { petId: string };
  ActivityStats: { petId: string };
  MedicationAdherence: { petId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
