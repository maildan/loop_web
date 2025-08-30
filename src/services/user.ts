export interface UserGoals {
  weeklyDocs: number;
  monthlyWords: number;
}

export const fetchUserProfile = async (token: string) => {
  const response = await fetch('/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
};

export const updateUserGoals = async (token: string, goals: UserGoals) => {
  const response = await fetch('/api/users/me/goals', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(goals),
  });

  if (!response.ok) {
    throw new Error('Failed to update user goals');
  }

  return response.json();
};
