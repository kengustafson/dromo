import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  Alert
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
  alert('query str = ' + queryStr);
  const todoData = await API.graphql(graphqlOperation(queryStr));
  //alert("From getData    " + JSON.stringify(todoData));
  return todoData;
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

const mySQLList = `query listCustomerss {
  listCustomerss {
    VisitDate
    name
  }
}
`; // Now dynamic in loadItems

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
    //this.getData = this.getData.bind(this);

  }

  componentDidMount() {
  };

  render() {

    return (
      <React.Fragment>
      <View
        style={{
          flexDirection: 'row',
          height: 60,
          padding: 10,
        }}>
      {/*<Button onPress={createNewTodo} title='Create Todo' /> */}
      {/*<Button onPress={getData} title='Get Data...' /> */}
      </View>

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
      </React.Fragment>
    );
  }

  loadItems(day) {
    const queryStr = '{listCustomerss(VisitDate:"'+day.dateString+'"){name,VisitStart}}';
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

    setTimeout(() => {
      /*
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: 50 //Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      */
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
    }, 5000);

    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: 60}]}>
        <Text>{item.name}</Text>
        <AppleStyleSwipeableRow dataFunc={getData}>
            <Text style={{fontSize:12, textAlign:'right'}}>{item.VisitStart.substring(11,16)}</Text>
        </AppleStyleSwipeableRow>
      </View>
    );
  }

/*
      <View style={[styles.item, {height: 60}]}>
      <Text>{item.name}</Text>
      <AppleStyleSwipeableRow dataFunc={getData}>
          <Text style={{fontSize:12, textAlign:'right'}}>{item.VisitStart.substring(11,16)}</Text>
      </AppleStyleSwipeableRow>
    </View>
*/


  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
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