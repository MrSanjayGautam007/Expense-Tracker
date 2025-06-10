import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { saveExpense } from '../Storage/storages';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from 'react-native-vector-icons/dist/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import HeaderComp from '../Components/HeaderComp';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
const AddExpenseScreen = () => {

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [title, setTitle] = useState('');
    const navigation = useNavigation();
    const handleSave = async () => {
        const formattedDate = date.toISOString().split('T')[0]; // "2025-05-30"
        if (!amount || !category || !date || !title) {
            Alert.alert('Message','All fields are required');
            return; 
        }
        const expense = { id: Date.now(), amount, category, date:formattedDate, title };
        await saveExpense(expense);
        Alert.alert('Message','Expense saved successfully');
        setAmount('');
        setCategory(''); 
        setDate('');
        navigation.goBack(); 
    };
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };
    return (
        <SafeAreaView style={styles.mainContainer}>
             <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
            <HeaderComp title={'Add Expense'} />
            <ScrollView
                contentContainerStyle={{
                    padding: 10,
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,

                }}
                style={styles.scrollContainer}
            >
                <View style={styles.inputView}>
                    <TextInput
                        placeholder="Title"
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        autoFocus={true}
                        placeholderTextColor={'#000'}
                    />
                </View>
                <View style={styles.inputView}>

                    <TextInput
                        placeholder="Amount"
                        keyboardType="numeric"
                        style={styles.input}
                        placeholderTextColor={'#000'}
                        value={amount}
                        onChangeText={setAmount}

                    />
                </View>
                <View style={styles.pickerView}>
                    <Picker
                        selectedValue={category}
                        style={styles.pickerText}
                        onValueChange={(itemValue) => {
                            setCategory(itemValue);
                        }}
                    >
                        <Picker.Item label="Select Category" value="" />
                        <Picker.Item label="Personal Expenses" value="Personal" />
                        <Picker.Item label="Grocery" value="Grocery" />
                        <Picker.Item label="Bills" value="Bills" />
                        <Picker.Item label="Shopping" value="Shopping" />
                        <Picker.Item label="Food" value="Food" />
                        <Picker.Item label="Travel" value="Travel" />
                        <Picker.Item label="Entertainment" value="Entertainment" />
                        <Picker.Item label="Utilities" value="Utilities" />
                        <Picker.Item label="Transportation" value="Transportation" />
                        <Picker.Item label="Health" value="Health" />
                        <Picker.Item label="Education" value="Education" />
                        <Picker.Item label="Other" value="Other" />

                    </Picker>
                </View>
                <View style={{ width: '90%' }}>
                    <Text style={styles.label}>Select Date</Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                    <Text style={styles.dateText}>

                        {/* { date ? date.toLocaleDateString() : 'Select Date' } */}
                        {date.toDateString()}

                    </Text>
                    <Feather name="calendar" size={20} color="black" />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
                <View style={{ gap: 10 }}>
                    <Button mode='contained' onPress={handleSave} style={{ marginTop: 20 }}
                    disabled={!title}
                    >
                        Save Expense
                    </Button>
                    <Button mode='elevated' onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
                        Cancel
                    </Button>
                </View>
            </ScrollView>


        </SafeAreaView>
    );
}
export default AddExpenseScreen;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    inputView: {
        borderWidth: 0.5,
        marginBottom: 12,
        padding: 2,
        width: '90%',
        borderColor: '#ccc',
        borderRadius: 5,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
        // for ios
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    datePicker: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#eee',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        borderWidth: 0.5,
        borderColor: '#ccc',
        shadowColor: '#000',
        elevation: 5,

    },
    dateText: {
        fontSize: 16,
        color: '#333',
        alignSelf: 'flex-start',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#000',
        fontWeight: '600',
        marginLeft: 5,

    },
    pickerText: {
        color: '#000',
        fontSize: 16,
    },
    scrollContainer: {
        width: '100%',

    },
    pickerView: {
        borderWidth: 0.5,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '90%',
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
        // for ios
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height: 45,
        justifyContent: 'center',
    },
    input: {
        fontSize: 16,
        color: '#000',
        padding: 10,
        width: '100%',
    }
});
