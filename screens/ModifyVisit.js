import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Linking,
} from 'react-native';
import Constants from 'expo-constants';
import { DataTable, Button } from 'react-native-paper';
import { MonoText } from '../components/StyledText';
import API, { graphqlOperation } from '@aws-amplify/api';
import config from '../aws-exports';
API.configure(config);

async function getData(queryStr) {
  //alert('query str = ' + queryStr);
  const data = await API.graphql(graphqlOperation(queryStr));
  return data;
}

export default function ModifyVisit(props) {

  const [visits, setVisits] = useState([]);
  const [addedVisit, setAddedVisit] = useState({});
  const [item, setItem] = useState();

  useEffect(() => {
    const item = props.navigation.getParam('itemData');
    setItem(item);
    //alert(JSON.stringify(item));
    const str = 'query closestPatients{closestPatients(patientID:'+item.patientID+'){id name phone distance}}';

    getData(str).then((results)=>{
      setVisits(results.data.closestPatients);
      //alert(JSON.stringify(results));
    });
  },[]);

  function insertVisit(addedVisit, item){
    //alert('addedVisit: '+JSON.stringify(addedVisit)+'  item: '+JSON.stringify(item));
    var str = 'mutation updateSchedule{updateSchedule(id:'+item.id+', patientID:'+addedVisit.id+'){name}}';
    //alert(str);
    getData(str).then((results)=> {

      props.navigation.goBack();
    }); 
  }

  /*
  const callNumber = (item) => {
    console.log('callNumber ----> ', item.phone);
    let phoneNumber = item.phone;
    if (Platform.OS !== 'android') {
    dialStr = 'telprompt:'+phoneNumber;
    }
    else  {
    dialStr = 'tel:'+phoneNumber;
    }
    Linking.canOpenURL(dialStr)
    .then(supported => {
    if (!supported) {
        Alert.alert('Phone number is not available');
      } else {
        return Linking.openURL(dialStr);
    }
    })
    .catch(err => console.log(err));
    };
    */

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <Image source={require('../assets/images/mapping-icon.png')} style={styles.welcomeImage}/>
        </View>

        <View style={styles.getStartedContainer}>

          <Text style={styles.getStartedText}>Add Visit</Text>

          <View style={styles.getStartedContainer2}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Phone</DataTable.Title>
                <DataTable.Title style={{justifyContent: 'flex-end'}}>Miles</DataTable.Title>
              </DataTable.Header>
              {
                visits.map(row => {
                return(
                  <DataTable.Row
                    key={row.name}
                    onPress={() => {
                      Linking.openURL(`tel:${row.phone}`);
                      setTimeout(()=>setAddedVisit(row),500);
                    }}
                  >
                    <DataTable.Cell>{row.name}</DataTable.Cell>
                    <DataTable.Cell style={styles.messageColumn}>{row.phone}</DataTable.Cell>
                    <DataTable.Cell numeric>{row.distance}</DataTable.Cell>
                  </DataTable.Row>
                )})
                }
            </DataTable>
          </View>

          <View>
              <Text style={styles.getStartedText}></Text>
              <Button color='#2e78b7' icon='map-marker-plus' mode="outlined"  onPress={()=>insertVisit(addedVisit, item)}>Add:  {addedVisit.name}  </Button>
              <Text style={styles.getStartedText}></Text>
              <Button color='#dd0000' mode='text' onPress={()=>props.navigation.goBack()}>Cancel</Button>

            </View>

        </View>

      </ScrollView>

    </View>
  );
}

/*
<View
style={[styles.codeHighlightContainer, styles.homeScreenFilename,]}>
<MonoText>Please choose from the following:</MonoText>
<Text style={styles.getStartedText}></Text>
</View>

<View style={styles.helpContainer}>
  <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
    <Text style={styles.helpLinkText}>
      *New Evaluation(s)
    </Text>
  </TouchableOpacity>
</View>
*/

ModifyVisit.navigationOptionss = {
  header: null,
};

function handleHelpPress() {
  alert('pressed');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //justifyContent: 'center',
    //paddingTop: Constants.statusBarHeight,
    padding: 4,
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: -20,
    marginBottom: 40,
  },
  welcomeImage: {
    width: 160,
    height: 120,
    resizeMode: 'contain',
    marginTop: 10,
    marginLeft: -10,
  },
  getStartedContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  getStartedContainer2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 3,
  },
  getStartedText: {
    fontSize: 24,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
