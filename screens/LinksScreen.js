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
import { Firebase } from "../api/config.js";
import uuid from "uuid";

export default class LinksScreen extends React.Component {
  state = {date: new Date(), desc: 'ABC', amount: 1}

  handleAddItem = myData => {
    // Firebase dont take in date object?
    // myData.date = myData.date.toLocaleDateString();
    const { imageURL } = this.state;
    Firebase.database()
      .ref("users/joel")
      .push({
        desc: this.state.desc,
        amount: Number(this.state.amount),
        date: this.state.date,
        imageURL: imageURL
      });

    // this.props.navigation.navigate("Home", { test: "some data from link screen" });
  };

  pickImage = async () => {
    // Permissions.askAsync(Permissions.CAMERA)
    //   .then(status => {
    //     if (status === "granted") {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   })
    //   .then(data => {
    //     console.log(data)
    //   });

    // Ask for permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      // Do camera stuff
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (!result.cancelled) {
        this.setState({ image: result.uri });

        // Uploading part
        try {
          const imageURL = await this.uploadImageAsync(result.uri);
          this.setState({ imageURL });
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      // Permission denied
      throw new Error("Camera permission not granted");
    }
  };

  uploadImageAsync = async uri => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = Firebase.storage()
      .ref()
      .child(uuid.v4());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };
  
  render() {
    const { image } = this.state;
    
    return (
      <View style={styles.container}>
        <Text>{this.state.userInput}</Text>
        <ScrollView keyboardDismissMode={'on-drag'}>
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
                style={styles.textInput}
                onChangeText={(userInput) => this.setState({ userInput })}
                value={this.state.text}
              />
            </View>
          </View>
          <View style={styles.row}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TextInput
                 style={[styles.textInput, {flex: 1}]}
                 onChangeText={(desc) => this.setState({ desc })}
                 value={this.state.text}
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
                onPress={this.pickImage}
              />
              <Button
            title="Get new location"
            onPress={this.pickImage}
          />

          {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200, alignSelf: "center" }}
                />
                )}
          {this.state.imageURL && <Text>{this.state.imageURL}</Text>}
           </View>
        </ScrollView>
        <TouchableOpacity onPress={this.handleAddItem} style={styles.tabBarStickyBottom}>
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
