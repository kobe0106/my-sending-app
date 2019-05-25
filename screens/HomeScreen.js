import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  FlatList
} from 'react-native';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Spending',
  };
  
  render() {
    const testData = [
      {
        key: "0",
        amount: 1,
        desc: 'Food',
        date: new Date()
      },
      {
        key: "1",
        amount: 2,
        desc: 'Food',
        date: new Date()
      }
    ]
    const total = testData.map(item => item.amount)
    const totalAmount = total.reduce((accumulator, currentValue) => accumulator + currentValue)
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <FlatList
            data={testData}
            renderItem={({ item }) =>
              <View style={styles.card}>
                <View style={styles.cardDate}>
                  <Text>{item.date.toLocaleDateString()}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text>{item.desc}</Text>
                  <Text>RM {JSON.stringify(item.amount)}</Text>
                </View>
              </View>
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