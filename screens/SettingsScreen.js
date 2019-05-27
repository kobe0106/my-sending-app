import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  Text,
  View,
  Button
} from "react-native";

export default class SettingsScreen extends React.Component {
  state = {res: ''};
  static navigationOptions = {
    title: 'app.json',
  };

  getWeather = () => {
    // const responds = await fetch ('https://www.metaweather.com/api/location/search//query=london');
    // const jsonDate = await responds.json();
    // this.setState({weather:jsonDate});

    fetch('https://www.metaweather.com/api/location/search/?query=london')
    .then(res => {
      return res.json();
    })
    .then(json => {
      this.setState({weather: json});
    });
  };

  render() {
    const res = 'ABC';
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
        <View>
          <Text>{this.state.json}</Text>
          <Button
                title="Check"
                onPress={this.getWeather}
              />
        </View>
      );
  }
}
