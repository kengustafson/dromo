import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Alert } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

export class AppleStyleSwipeableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.dataFunc = this.props.dataFunc.bind(this);
    //this.reRenderItem = this.props.renderItem.bind(this);
  };

  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 99, 100],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}>
          TRANSFER
        </Animated.Text>
      </RectButton>
    );
  };

  renderRightAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const pressHandler = () => {
      this.close();
      //alert(text);
      //dialog();
      if(text=='MOV'){
        Alert.alert('Move visit to another date?', 'My Alert Msg', [{text:'Ask me later', onPress: this.dataFunc('test')},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('OK Pressed')}
          ], {cancelable: false},
        );
      }
      else if(text=='DEL'){
        Alert.alert('Delete this visit from schedule?', 'This will remove the visit from your schedule.  All other visits remain unchanged.',
          [/*{text:'Ask me later', onPress: () => console.log('Ask me later pressed')},*/
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: this.dataFunc('test')}
          ], {cancelable: false},
        );
      }
      else {
        Alert.alert('Patient hospitalized', 'My Alert Msg', [{text:'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('OK Pressed')}
          ], {cancelable: false},
        );
      }
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={pressHandler}>
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  renderRightActions = progress => (
    <View style={{ width: 192, flexDirection: 'row' }}>
      {this.renderRightAction('MOV', '#777777', 192, progress)}
      {this.renderRightAction('DEL', '#ffab00', 128, progress)}
      {this.renderRightAction('HOS', '#497AFC', 64, progress)}
    </View>
  );
  updateRef = ref => {
    this._swipeableRow = ref;
  };
  close = () => {
    this._swipeableRow.close();
  };
  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={4}
        leftThreshold={80}
        rightThreshold={40}
        renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}>
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#aa2c00',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});