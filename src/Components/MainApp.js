import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import ViewExpensesScreen from '../Screens/ViewExpensesScreen';
import AddExpenseScreen from '../Screens/AddExpenseScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Stack = createNativeStackNavigator();


const MainApp = () => {
    const scheme = useColorScheme();
    return (
        <NavigationContainer >
            <Stack.Navigator screenOptions={{
                headerShown: false,
                animation: 'fade_from_bottom',
                 orientation:'portrait'
            }}>
                <Stack.Screen name="ViewExpenses" component={ViewExpensesScreen} options={{ title: 'Expenses' }} />
                <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default MainApp;