import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, Button, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as tools from '../../components/tools/db';

import DisplayButtons from '../../components/DisplayButtons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


function ManualInput() {
    const [selectedSize, setSelectedSize] = useState('Small');
    const [numBags, setNumBags] = useState(0);
    const [waste, setWaste] = useState('Trash');
    const [saved, setSaved] = useState(false);
    const [show, setShow] = useState(false);


    const formatDate = (dateObj) => {
        const month = (dateObj.getUTCMonth()+1).toString().padStart(2, "0");
        const day = (dateObj.getUTCDate()).toString().padStart(2, "0");
        const year = dateObj.getUTCFullYear();
        return `${year}-${month}-${day}`;
    }

    const datetime = new Date();

    const [date, setDate] = useState(datetime);

    const [bags, setBags] = useState();

    const [number, onChangeNumber] = useState(0);

    useEffect(() => {
        async function storeData() {
            console.log('storing data...');
            await tools.storeData("bags", [
                { name: "Trash", date: "2024-03-01", small: 0, medium: 0, large: 3 },
                { name: "Compost", date: "2024-03-01", small: 0, medium: 1, large: 0 },
                { name: "Trash", date: "2024-03-03", small: 1, medium: 0, large: 0 },
                { name: "Recycling", date: "2024-03-03", small: 1, medium: 0, large: 0 },
                { name: "Compost", date: "2024-03-03", small: 1, medium: 0, large: 0 },
                { name: "Trash", date: "2024-03-05", small: 0, medium: 1, large: 0 },
                { name: "Recycling", date: "2024-03-06", small: 0, medium: 0, large: 2 },
                { name: "Trash", date: "2024-03-08", small: 1, medium: 2, large: 0 },
                { name: "Compost", date: "2024-03-08", small: 1, medium: 0, large: 0 },
                { name: "Compost", date: "2024-03-09", small: 0, medium: 0, large: 2 },
                { name: "Recycling", date: "2024-03-09", small: 0, medium: 2, large: 1 }
            ])
            setBags(await tools.getData("bags"));
            console.log('bags initial', bags);
        }
        storeData();
    }, []);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        console.log('date', currentDate);
        setDate(currentDate);
        setShow(false);
    };

    const saveData = async (date, waste, number, selectedSize) => {
        const updatedArr = await tools.getData('bags');
        const formattedDate = formatDate(date);

        let itemFound = false;

        for (let i = 0; i < updatedArr.length; i++) {
            if (updatedArr[i].date === formattedDate && updatedArr[i].name === waste) {
                updatedArr[i][selectedSize.toLowerCase()] = Number(updatedArr[i][selectedSize.toLowerCase()]) + Number(number);
                console.log('item found', updatedArr[i][selectedSize.toLowerCase()], selectedSize.toLowerCase());
                itemFound = true;
                break;
            }
        }

        console.log('bags data', await tools.getData("bags"));
        if (!itemFound) {
            updatedArr.push({ name: waste, date: formattedDate, small: 0, medium: 0, large: 0 });

            updatedArr[updatedArr.length - 1][selectedSize.toLowerCase()] = Number(updatedArr[updatedArr.length - 1][selectedSize.toLowerCase()]) + Number(number);
            console.log('item created', updatedArr, typeof (updatedArr[updatedArr.length - 1][selectedSize.toLowerCase()]), typeof (number), number, selectedSize.toLowerCase());
        }

        await tools.deleteData("bags");
        await tools.storeData("bags", updatedArr);
    }

    useEffect(()=> {
        console.log('waste', waste);
    }, [waste])

    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.body}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={{display: "flex", alignItems: "center", marginTop: 12, justifyContent: "center"}}>
                        <Image style={{height: 50, width: 100, objectFit: "contain"}} source={require('../../../assets/geco_logo.jpg')}/>
                    </View>
                    <Text style={{ fontWeight: "bold", fontSize: 28, marginTop: 7 }}>Log Disposed Bins</Text>
                    <Text style={styles.header}>Select Bin</Text>

                    <View style={styles.buttonContainer}>

                        <FontAwesome.Button onPress={() => setWaste('Trash')} style={waste === 'Trash' ? styles.selectedButton : styles.button} name={waste === 'Trash' ? 'check' :"trash"} backgroundColor="gray">
                            Trash
                        </FontAwesome.Button>
                        <FontAwesome.Button onPress={() => setWaste('Recycling')} style={waste === 'Recycling' ? styles.selectedButton : styles.button} name={waste === 'Recycling' ? 'check' : "recycle"} backgroundColor="#3b5998">
                            Recycle
                        </FontAwesome.Button>
                        <FontAwesome.Button onPress={() => setWaste('Compost')} style={waste === 'Compost' ? styles.selectedButton : styles.button} name={waste === 'Compost' ? 'check' : "leaf"} backgroundColor="green">
                            Compost
                        </FontAwesome.Button>
                    </View>

                    <Text style={styles.header}>Number of Bags?</Text>
                    <TextInput
                        style={{ margin: 12, height: 40, width: 200, borderColor: 'black', borderRadius: 20, borderWidth: 1, color: '#595959', fontSize: 15, marginHorizontal: 5, paddingHorizontal: 10 }}
                        onChangeText={onChangeNumber}
                        placeholder="Enter Number of Bags"
                        keyboardType="numeric"
                    />

                    <Text style={styles.header}>Bag Size?</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedSize}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedSize(itemValue)
                        }
                    >
                        <Picker.Item style={styles.pickerItem} label="Small" value="Small" />
                        <Picker.Item style={styles.pickerItem} label="Medium" value="Medium" />
                        <Picker.Item style={styles.pickerItem} label="Large" value="Large" />
                    </Picker>

                    <Text style={styles.header}>Date</Text>
                    <Button onPress={() => setShow(true)} title="Select date" color={'#013669'}/>
                    {show && (<DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={"date"}
                        is24Hour={true}
                        onChange={onChange}
                    />)}

                    <View style={styles.saveButtonContainer}>
                        <Button
                            style={styles.saveButton}
                            color={'#3299ad'}
                            onPress={() => { saveData(date, waste, number, selectedSize); setSaved(true); }}
                            title="Save And Add Another" />
                        <Button
                            style={styles.saveButton}
                            color={'#3299ad'}
                            onPress={() => { saveData(date, waste, number, selectedSize); router.replace("./Homepage") }}
                                title="Save" />
                    </View>
                </View>
                <View style={{height:100}}></View>
            </ScrollView>
            </View>

            <DisplayButtons currentPath='ManualInput' />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        // backgroundColor: "#e6ffe6"
    },
    container: {
        // flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
    },
    header: {
        fontSize: 20,
        height: 40,
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        dispay: 'flex',
        justifyContent: 'space-evenly',
        height: 100,
        width: 400,
    },
    button: {
        // margin: 30,
        marginHorizontal: 15,
        textAlign: 'center',
        height: 100,
        // margin: 10,
        width: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 2,
        marginRight: 2,
    },
    selectedButton: {
        marginHorizontal: 15,
        textAlign: 'center',
        height: 100,
        width: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: 0.5,
        marginLeft: 2,
        marginRight: 2,
    },
    picker: {
        fontSize: 20,
        top: -40,
        zIndex: 0,
        height: 50,
        width: 200,
        marginTop: 50,
    },
    datePicker: {
        borderColor: 'black',
        borderStyle: 'solid',
        height: 50
    },
    saveButtonContainer: {
        marginTop: 45,
        width: '80%',
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'center',
    },
    saveButton: {
        width: 150,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#013669',
        backgroundColor: 'green',
        borderRadius: 5,
        textAlign: 'center',
        alignContent: 'center',
    }
});

export default ManualInput;