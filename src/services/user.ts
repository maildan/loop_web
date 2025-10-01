import apiService from './api';

export interface UserGoals {
  weeklyDocs: number;
  monthlyWords: number;
}

// 이 인터페이스는 useAuth.ts와 중복될 수 있으므로 한 곳에서 관리하는 것이 좋습니다.
export interface User {
  id: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  goal_weekly_docs?: number;
  goal_monthly_words?: number;
}

export const fetchUserProfile = () => {
  return apiService.get<User>('/users/me');
};

export const updateUserGoals = (goals: UserGoals) => {
  return apiService.patch<any>('/users/me/goals', goals);
};
