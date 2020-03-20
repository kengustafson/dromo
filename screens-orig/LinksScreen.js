
import React, { useEffect, useReducer } from 'react';
import { ScrollView, StyleSheet, View, Button, Text } from 'react-native';

import { listTodos } from '../src/graphql/queries';
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

export default function LinksScreen() {

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getData()
  }, []);

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
      id
      name
      email
    }
  }
  `;


  async function getData() {
    //const todoData = await API.graphql(graphqlOperation(listTodos));
    const todoData = await API.graphql(graphqlOperation(mySQLList));
    alert(todoData);
    //dispatch({type:'QUERY', todos: todoData.data.listTodos.items});
    dispatch({type:'QUERY', todos: todoData.data.listCustomerss});
  }

  return (
    <ScrollView style={styles.container}>

    <View style={styles.container}>
      <Button onPress={createNewTodo} title='Create Todo' />
      <Button onPress={getData} title='List Todos' />
      {/* { state.todos.map((todo, i) => <Text key={todo.id}>{todo.name} : {todo.description} {i}</Text>) } */}
      { state.todos.map((todo, i) => <Text key={todo.id}>{todo.name} : {todo.email} {i}</Text>) }
    </View>
    </ScrollView>
  );
}


/*
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddeeff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
});
*/

LinksScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
