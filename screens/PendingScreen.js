import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActionSheetProvider,
  connectActionSheet,
  ActionSheetOptions,
  ActionSheetProps,
} from '@expo/react-native-action-sheet';
import { DataTable } from 'react-native-paper';
import API, { graphqlOperation } from '@aws-amplify/api';
import config from '../aws-exports';
API.configure(config);

async function getData(queryStr) {
  //alert('query str = ' + queryStr);
  const data = await API.graphql(graphqlOperation(queryStr));
  return data;
}

function PendingScreen(props) {

  const [visits, setVisits] = useState([]);
  const [addedVisit, setAddedVisit] = useState({});
  const [item, setItem] = useState();

  useEffect(() => {
    //const item = props.navigation.getParam('itemData');
    //setItem(item);
    //alert(JSON.stringify(item));
    //const str = 'query pendingVisits{pendingVisits(patientID:'+item.patientID+'){id patientID name seeBy visitCode}}';
    const str = 'query pendingVisits{pendingVisits{id patientID name seeBy visitCode}}';
    
    getData(str).then((results)=>{
      setVisits(results.data.pendingVisits);
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
  return (
    <ScrollView style={styles.container}>
      <View><Text onPress={_onPress3}></Text></View>
      <View style={styles.welcomeContainer}>
          <Image source={require('../assets/images/pending.png')} style={styles.welcomeImage}/>
        </View>
        <Text style={styles.getStartedText}>Pending Visits</Text>
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>See By</DataTable.Title>
              <DataTable.Title style={{justifyContent: 'flex-end'}}>Type</DataTable.Title>
            </DataTable.Header>
            {
              visits.map(row => {
              return(
                <DataTable.Row
                  key={row.patientID}
                  onPress={() => {
                    //Linking.openURL(`tel:${row.id}`);
                    //setTimeout(()=>setAddedVisit(row),500);
                  }}
                >
                  <DataTable.Cell>{row.name}</DataTable.Cell>
                  <DataTable.Cell style={styles.messageColumn}>{row.seeBy}</DataTable.Cell>
                  <DataTable.Cell numeric>{row.visitCode}</DataTable.Cell>
                </DataTable.Row>
              )})
              }
          </DataTable>
        </View>
    </ScrollView>
  );

  function _onPress3(item){
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ['Add Visit', 'Remove Timeslot', 'Cancel'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;
  
    props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        // Do something here depending on the button index selected
        if(buttonIndex==0){
          _onPress2(item);
        } else if(buttonIndex==1){
          removeSlot.bind(this, item)
        }
      },
    );
  }

}

PendingScreen.navigationOptions = {
  title: null,
};

function _onPress3(item){
  // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
  const options = ['Add Visit', 'Remove Timeslot', 'Cancel'];
  const destructiveButtonIndex = 1;
  const cancelButtonIndex = 2;

  this.props.showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
    },
    (buttonIndex) => {
      // Do something here depending on the button index selected
      if(buttonIndex==0){
        this._onPress2(item);
      } else if(buttonIndex==1){
        this.removeSlot.bind(this, item)
      }
    },
  );
}

const ConnectedApp = connectActionSheet(PendingScreen);

export default class PendingScreenContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ActionSheetProvider {...this.props}>
        <ConnectedApp {...this.props} />
      </ActionSheetProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
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

