import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPENSES_KEY = 'EXPENSES_KEY';

export const saveExpense = async (expense) => {
  const existing = await getExpenses();
  const updated = [expense, ...existing];
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
};

export const getExpenses = async () => {
  const data = await AsyncStorage.getItem(EXPENSES_KEY);
  return data ? JSON.parse(data) : [];
};
export const deleteExpense = async (id) => {
  const existing = await getExpenses();
  const updated = existing.filter((expense) => expense.id !== id);
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
}
