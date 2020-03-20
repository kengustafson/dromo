import React, { useEffect, useReducer, Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {AppleStyleSwipeableRow} from './AppleStyleSwipeableRow';
import { FlatList, RectButton, Swipeable } from 'react-native-gesture-handler';

const initialState = {todos:[]};
const reducer = (state, action) =>{
  switch(action.type){
    case 'QUERY':
      return {...state, todos:action.todos}
    case 'SUBSCRIPTION':
      return {...state, todos:[...state.todos, action.todo]}
    default:
      return state
  }
}

import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createTodo } from '../src/graphql/mutations';
import config from '../aws-exports';
API.configure(config);
PubSub.configure(config);

async function createNewTodo() {
  alert('Pressed');
  const todo = { name: "Use AppSync" , description: "Realtime and Offline"};
  await API.graphql(graphqlOperation(createTodo, { input: todo }));
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
    email
  }
}
`;

async function getData() {
  //const todoData = await API.graphql(graphqlOperation(listTodos));
  const todoData = await API.graphql(graphqlOperation(mySQLList));
  alert(todoData);
  //dispatch({type:'QUERY', todos: todoData.data.listTodos.items});
  //dispatch({type:'QUERY', todos: todoData.data.listCustomerss});
}  


const Row: React.FunctionComponent<{ item: Item }> = ({ item }) => (
  <>
    <Text numberOfLines={2} style={styles.messageText}>
      {item.message}
    </Text>
    <Text style={styles.dateText}>
      {item.when} {'❭'}
    </Text>
  </>
);

//const [state, dispatch] = useReducer(reducer, initialState);

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {"2019-12-18":[{"name":"George Washington", "height":50}]}
    };
  }

  componentDidMount() {
    getData();
  };

  render() {
    return (
      <React.Fragment>
      <View
        style={{
          flexDirection: 'row',
          height: 80,
          padding: 30,
        }}>
      {/*<Button onPress={createNewTodo} title='Create Todo' />
      <Button onPress={getData} title='List Todos' />  */}
      </View>

      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2019-10-31'}
          renderItem={ () => (
            <AppleStyleSwipeableRow>
              <Text style={styles.paragraph}>
                Mary Chavez.
              </Text>
            </AppleStyleSwipeableRow>
          )}
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
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
      </React.Fragment>
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: Math.max(250, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      //console.log(this.state.items);/
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
    );
  }

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
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  },
  paragraph: {
    margin: 16,
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
  },
});