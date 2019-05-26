import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  Image,
  Platform
} from "react-native";
import { Firebase } from "../api/config.js";

const Card = ({ amount = 0, item = "no-name", children, image }) => (
  <View
    style={{
      borderWidth: 0.5,
      borderColor: "#d6d7da",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10
    }}
  >
    <Text>{item}</Text>
    <Text>RM {amount}</Text>

    {children ? <Text>RM {children}</Text> : null}
    {children ? <Text>RM test {children}</Text> : null}
    <Image style={{ width: 40, height: 40 }} source={{ uri: image }} />

    {/* {children && <Text>RM {children}</Text>} */}
  </View>
);

class Row extends React.Component{
  render(){
    const {desc, price} = this.props;
    return(
      <View style={styles.cardRow}>
        <Text>{desc}</Text>
        <Text>RM {price}</Text>
      </View>
    );
  }
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Spending',
  };
  
  constructor(props) {
    super(props)
    this.state = { items: [{ key: '1'}] }
    const items = Firebase.database().ref('users/' + 'joel');
    items.on('value', (snapshot) => {
      const data = snapshot.val()
      const convertedItems = Object.values(data.items)
      // to convert key into string for React native flat list to render items key
      convertedItems.map((item, index) => item.key = index.toString())
      this.setState({ items: convertedItems })
    });
  }

  render() {
    const total = this.state.items.map(item => item.amount)
    const totalAmount = total ? total.reduce((accumulator, currentValue) => accumulator + currentValue) : 0

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {/* <Row desc={"Item1"} price={"100"}/>
          <Row desc={"Item2"} price={"200"}/> */}
          <FlatList
            data={this.state.items}
            renderItem={({ item }) => (
              <Card amount={item.amount} item={item.desc} image={item.imageURL} />
            )
              // <View style={styles.card}>
              //   <View style={styles.cardDate}>
              //     <Text>{JSON.stringify(item.date)}</Text>
              //   </View>
              //   <View style={styles.cardRow}>
              //     <Text>{item.desc}</Text>
              //     <Text>RM {JSON.stringify(item.amount)}</Text>
              //   </View>
              // </View>
            }/>
        </ScrollView>
        <View style={styles.tabBarInfoContainer}>
          <Text style={{fontWeight: 'bold'}}>Total</Text>
          <Text style={{fontWeight: 'bold'}}>RM {totalAmount}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },
  contentContainer: {
    //paddingTop: 30,
  },
  card: {
    borderWidth: 0.5,
    borderColor: '#d6d7da'
  },
  cardDate: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#f5f5f5'
  },
  cardRow: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },		
  tabBarInfoContainer: {
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
    justifyContent: 'space-between',
    padding: 10,
  }
});