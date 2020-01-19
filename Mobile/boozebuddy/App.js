/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import { Input } from 'react-native-elements';

export default class App extends React.Component {

  render() {
    return (
      <View>
        <Text>Hey</Text>
        <Input placeholder="type here" />
      </View>
    )
  }
}
