import React, { useState } from 'react';
import { View, Text, TextInput,FlatList, StyleSheet, Modal, TouchableOpacity,Image, Platform } from 'react-native';
import CustomTextInput from './textInput';
import countryData from '../../utils/countries.json';
import CityData from '../../utils/cities.json'
import { TextInputCity } from './vectors';
import { getEmojiFlag } from "countries-list";
 


 
 


const CountryPickerModal = ({ visible, onSelect, onClose,title,type,check }) => {
  const [searchText, setSearchText] = useState('');
  let defaultData = []
  if(type == 'country') {
    defaultData = countryData
  } else {
    if(check){
      defaultData = CityData.filter((city) => getEmojiFlag(city.country_code) == check)
    } else {
      defaultData = CityData
    }
    
  }
  const [countries] = useState(defaultData);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
         
        
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
 
            </View>

            <View style={{ borderRadius:50,paddingVertical:0,paddingHorizontal:36, backgroundColor:"rgba(181, 181, 181, 0.12)"}}>
            <CustomTextInput  name="search" placeHolder="Search" LeftIcon={"search"} LeftIconStyles={{position:"absolute",top:15,left:18}} RightIcon={null} RightIconStyles={null} setState={setSearchText} state={searchText}/>
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code+item.name+item.population}
              initialNumToRender={10}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  {type=='city'?<View style={{marginRight:10}}><TextInputCity/></View>: <Text style={styles.flag}>{item.flag}</Text>}
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.dialCode}>{item.dial_code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:"rgba(0, 0, 0, 0.56)"
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalContainer: {
    height: '50%',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  flag: {
    fontSize: 20,
    marginRight: 10,
    width: 30,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  dialCode: {
    fontSize: 16,
    color: '#666',
  },
});

export default CountryPickerModal;