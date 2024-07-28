export type UserProfile = {
  id: number;
  userId: number;
  onboarded: boolean;
};

export type User = {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
};
