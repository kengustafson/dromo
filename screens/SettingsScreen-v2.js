import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  TouchableHighlight
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {AppleStyleSwipeableRow} from './AppleStyleSwipeableRow';

import API, { graphqlOperation } from '@aws-amplify/api';
import { createTodo } from '../src/graphql/mutations';
import config from '../aws-exports';
API.configure(config);

async function createNewTodo() {
  alert('Pressed');
  const todo = { name: "Use AppSync" , description: "Realtime and Offline"};
  await API.graphql(graphqlOperation(createTodo, { input: todo }));
}

async function getData(queryStr) {
  //alert('query str = ' + queryStr);
  const data = await API.graphql(graphqlOperation(queryStr));
  //alert("From getData    " + JSON.stringify(todoData));
  return data;
}

function handleUpdate(){}

function moveVisit(id){}

function removeVisit(id){
  //let items = this.state.items;
}

const myList = `query ListTodos(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
    }
    nextToken
  }
}
`;

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
    //this.getData = this.getData.bind(this);
    //var myLoadItems = (day) => {loadItems(day)};

  }

  componentDidMount() {
  };

  render() {

    return (

      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2019-12-18'}
        minDate={'2019-12-18'}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#666'},
        //    '2017-05-09': {textColor: '#666'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        // renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
 
    );
  }

  loadItems(day) {
    setTimeout(() => {
    //alert('day is --  ' + JSON.stringify(day));
    const queryStr = '{listCustomerss(VisitDate:"'+day.dateString+'"){id,patientID,name,VisitStart}}';
    getData(queryStr).then((results)=> {
      let newItems = {};
      newItems[day.dateString] = results.data.listCustomerss.sort((a,b)=>{
        a = new Date(a.VisitStart);
        b = new Date(b.VisitStart);
        return a<b ? -1: a>b ? 1 : 0;
      });
      this.setState({
        items: newItems
      })}
    );
    }, 500);

    setTimeout(() => {
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
    }, 5000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  myLoadItems = (day) => {this.loadItems(day)};

  removeSlot(item){
    var str = 'mutation deleteCustomers{deleteCustomers(id:'+item.id+'){VisitDate}}';
    //alert(str);
    getData(str); // NEED TO .then() THIS PROMISE!!
    this.myLoadItems({"dateString": item.VisitStart.substring(0, 10)});
  }

  getClosestPatients(item){
    //alert(JSON.stringify(item));
    var newResults;
    var str = 'query closestPatients{closestPatients(patientID:'+item.patientID+'){name distance}}';
    //alert(str);
    getData(str).then((results)=> {
      newResults = results;
      
    }); 
    alert('from getCP ' + newResults);
    return newResults;
  }

  _onPress(item){
    Alert.alert('Add a visit to schedule here?', 'YES will show a list of the best replacements that adhere to any restrictions.\n\nNO will remove the time slot and attempt to reschedule remaining visits earlier.', 
      [{text: 'Cancel', onPress: () => console.log('OK Pressed'), style: 'cancel'},
       {text: 'No - Remove timeslot', onPress: this.removeSlot.bind(this, item)},
       {text:'Yes - Show List', onPress: this.getClosestPatients.bind(this, item)},
      ], {cancelable: false},
    );
  }

  _onPress2(item){
    this.props.navigation.navigate('ModifyVisit', {itemData: item});
  }

  renderItem(item) {
    if(item.name) {
      return (
        <View style={[styles.item, {height: 60}]}>
          <TouchableHighlight onPress={this._onPress.bind(this,item)} underlayColor='#daeeff'>
          <Text>{item.name}</Text>
          </TouchableHighlight>
          <AppleStyleSwipeableRow dataFunc={getData} myLoadItems={this.myLoadItems} item={item}>
              <Text style={{fontSize:14, textAlign:'right'}}>{item.VisitStart.substring(11,16)}</Text>
          </AppleStyleSwipeableRow>
        </View>
      )
    }
    else {
      return (
        <View style={[styles.item, {height: 60}]}>
        {/*<TouchableHighlight onPress={this._onPress.bind(this,item)} underlayColor='#daeeff'>*/}
        <TouchableHighlight onPress={this._onPress2.bind(this,item)} underlayColor='#daeeff'>
          <Text style={{fontSize:18, fontWeight: 'bold', textAlign:'center'}}>{'...'}</Text>
        </TouchableHighlight>
        </View>
      )
    }
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text></Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 20,
    marginTop: 15
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});