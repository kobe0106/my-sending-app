import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DatePickerIOS,
  DatePickerAndroid,
  Platform,
  Button,
  Image
} from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { ImagePicker, Permissions } from "expo";

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Item',
  };

  state = { amount: '', desc: '', date: new Date(), image: null }

  render() {
    const { image } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.row}>
            <Text style={{ fontSize: 18 }}>Price</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>RM </Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(input) => this.setState({ amount: input })}
                value={this.state.text}
                keyboardType='numeric'
              />
            </View>
          </View>
          <View style={styles.row}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TextInput
                 style={[styles.textInput, {flex: 1}]}
                 onChangeText={(desc) => this.setState({ desc })}
                 value={this.state.text}
                 keyboardType='numeric'
                 placeholder="Description"
               />
             </View>
           </View>
           <View style={styles.row}>
             <View style={{ flex: 1 }}>
               {
                 Platform.OS === 'ios' ?
                   <DatePickerIOS
                     date={this.state.date}
                     onDateChange={(date) => this.setState({ date })}
                   /> :
                   <TouchableOpacity
                     onPress={async () => {
                        const {year, month, day} = await DatePickerAndroid.open({
                          date: new Date()
                        });
                        this.setState({date: new Date(year, month, day)})
                     }}>
                     <Text>{this.state.date.toString()}</Text>
                   </TouchableOpacity>
               }
             </View>
             <Button
                title="Pick an image from camera roll"
                onPress={async () => {
                  // Ask for permission
                  const { status } = await Permissions.askAsync(
                    Permissions.CAMERA_ROLL
                  );
                  if (status === "granted") {
                    // Do camera stuff
                    let result = await ImagePicker.launchImageLibraryAsync({
                      allowsEditing: true,
                      aspect: [4, 3]
                    });

                    console.log(result);

                    if (!result.cancelled) {
                      this.setState({ image: result.uri });
                    }
                  } else {
                    // Permission denied
                    throw new Error("Camera permission not granted");
                  }
                }}
              />
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200 }}
                />
              )}
           </View>
        </ScrollView>
        <TouchableOpacity onPress={() => alert(JSON.stringify(this.state))} style={styles.tabBarStickyBottom}>
          <Text style={{ fontWeight: 'bold' }}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 30,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  textInput: {
    width: 80,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 10
  },
  tabBarStickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
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
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  }
});
