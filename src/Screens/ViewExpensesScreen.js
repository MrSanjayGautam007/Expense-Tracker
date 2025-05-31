import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, TouchableOpacity, TextInput, Alert, StatusBar, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { deleteExpense, getExpenses } from '../Storage/storages';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from 'react-native-vector-icons/dist/Feather';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import Share from 'react-native-share';
const ViewExpensesScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [activateDelete, setActivateDelete] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [deleteId, setDeleteId] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filterDate, setFilterDate] = useState('');

    const filteredExpenses = expenses.filter((item) =>
        (!filterCategory || item.category.toLowerCase().includes(filterCategory.toLowerCase())) &&
        (!filterDate || item.date === filterDate)
    );
    const loadExpenses = async () => {
        const data = await getExpenses();
        console.log('Expenses Data:', data);
        setExpenses(data);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadExpenses);
        return unsubscribe;
    }, [navigation]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadExpenses();
        setRefreshing(false);
    };
    // const handleDateChange = (event, selectedDate) => {
    //     const currentDate = selectedDate || date;
    //     setShowDatePicker(Platform.OS === 'ios');
    //     console.log('Selected Date:', currentDate);
    //     setFilterDate(currentDate);
    // };
    const handleDateFilter = (event, selectedDate) => {
        if (event.type === 'set') {
            const picked = selectedDate || date;
            setDate(picked);
            setShowDatePicker(Platform.OS === 'ios');

            // Format to match saved expense.date
            const formatted = picked.toISOString().split('T')[0]; // "YYYY-MM-DD"
            setFilterDate(formatted);
        } else {
            setShowDatePicker(false);
        }
    };
    //
    const handleDeleteExpense = async (id) => {
        await deleteExpense(id);
        await loadExpenses();
        // Alert.alert('Success', 'Expense deleted successfully');
    }

    const handleLongPress = (item) => {
        // setActivateDelete(!activateDelete);
        // setDeleteId(item.id);

        Alert.alert(
            'Delete Expense?',
            `Are you sure you want to delete this expense? ${item.title} - ₹${item.amount}`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => handleDeleteExpense(item.id),
                    style: 'destructive'
                }
            ]
        );

    }
    const renderItem = ({ item }) => (
        <View style={styles.itemRenderView}>
            <TouchableOpacity
                activeOpacity={0.7}
                onLongPress={
                    () => handleLongPress(item)
                }
                style={[styles.itemView]}>
                <View>
                    <Text style={styles.textExpense}>{item.title} - ₹{item.amount}</Text>
                    <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                </View>
                {/* <TouchableOpacity
                    onPress={() => handleDeleteExpense(item.id)}
                >
                    <Feather name="trash-2" size={20} color="red" />
                </TouchableOpacity> */}
            </TouchableOpacity>
        </View>

    );
    // const formatDate = (itemDate) => {
    //     console.log('Item Date:', itemDate);
    //     const d = new Date(itemDate);
    //     return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

    // };
    const formatDate = (isoDate) => {
        if (!isoDate) return 'N/A';
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleShowFilter = () => {
        setShowFilter(!showFilter);
    };
    const handleClearFilter = () => {
        setFilterCategory('');
        setFilterDate('');
        setShowFilter(false);
        setDate(new Date());
        setActivateDelete(false);
    }
    const handleExportCSV = async () => {
        try {
            const csv = Papa.unparse(expenses);
            const path = `${RNFS.DocumentDirectoryPath}/expenses.csv`;
            await RNFS.writeFile(path, csv, 'utf8');

            const options = {
                url: 'file://' + path,
                type: 'text/csv',
                filename: 'expenses', // 👈 this sets file name for some apps
                title: 'Exported Expenses CSV',
                failOnCancel: false,
            };

            await Share.open(options);
        } catch (error) {
            Alert.alert('Export Failed', error.message);
        }
    };
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
            <View style={styles.headerView}>
                <Text style={styles.total}>
                    Total Spent: ₹{expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)}
                </Text>
            </View>
            {/* filter Header */}
            <View style={styles.filterView}>
                <View style={styles.iconHeader}>
                    {
                        !showFilter && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleShowFilter}
                            >
                                <Feather name="filter" size={24} color="black" />
                            </TouchableOpacity>
                        )
                    }

                    {
                        showFilter && (
                            <>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginLeft: 5 }}
                                    onPress={() => setShowDatePicker(true)}>
                                    <Feather name="calendar" size={17} color="black" />
                                    <Text style={{ color: 'black', fontSize: 15 }}>Filter by date</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateFilter}
                                    />
                                )}
                                <View style={{ width: '60%', height: 30, justifyContent: 'center', }}>
                                    <Picker
                                        selectedValue={filterCategory}
                                        style={styles.pickerText}
                                        onValueChange={(itemValue) => {
                                            setFilterCategory(itemValue);
                                        }}
                                    >
                                        <Picker.Item label="Filter by category" value="" />
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
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={handleClearFilter}
                                    style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Feather name="x" size={20} color="black" />
                                    <Text style={{ color: 'black', fontSize: 15 }}>Clear Filter</Text>
                                </TouchableOpacity>
                            </>
                        )
                    }
                </View>
                {
                    activateDelete && (<TouchableOpacity
                        
                        onPress={() => handleDeleteExpense(deleteId)}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="delete" size={23} color="red" />
                    </TouchableOpacity>)
                }
            </View>

            <FlatList
                data={filteredExpenses}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                        }}>No expenses found.</Text>
                    </View>
                }
            />
          
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.addBtn}
                onPress={() => navigation.navigate('AddExpense')}
            >
                <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleExportCSV} style={styles.exportBtn}>
                {/* <Feather name="download" size={24} color="white" /> */}
                <Entypo name="export" size={24} color="white" />
            </TouchableOpacity>
          
        </SafeAreaView>
    );
}
export default ViewExpensesScreen;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemRenderView: {
        padding: 10,
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 5,
        width: '90%',
        alignSelf: 'center',
    },
    textExpense: {
        fontSize: 16

    },
    dateText: {
        color: '#777'
    },
    addBtn: {
        position: 'absolute',
        bottom: 100,
        right: 50,
        backgroundColor: '#007bff',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
    },
    headerView: {
        padding: 12,
        backgroundColor: 'skyblue',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        // for ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '60%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 10,
        height: 100,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    exportBtn: {
        padding: 10,
        backgroundColor: '#28a745',
        alignSelf: 'center',
     
        position: 'absolute',
        bottom: 100,
        left: 50,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exportText: {
        color: 'white',
        fontWeight: 'bold',
    },
    iconHeader: {
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        borderColor: '#ddd',
        width: '90%',
        gap: 10,

    },
    filterView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
        backgroundColor: '#f8f8f8',
        width: '90%',
        alignSelf: 'center',
        marginVertical: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#ccc',

    },
    itemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    pickerView: {
        borderWidth: 0.5,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '100%',
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
        // for ios
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pickerText: {
        color: '#000',
        fontSize: 16,
    },
    

});
