/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  useColorScheme,
  View,
  Platform
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import RoamManager from './RoamManager';
import Roam from "roam-reactnative";




export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
      RoamManager.checkPermission();
      RoamManager.configure();
      //RoamManager.createOrLoadRoamUser();
      //RoamManager.startTracking();
      //RoamManager.startListener();
  })

  const [count, setCount] = useState(0);

  const startTracking = () => {
    console.log('start tracking')
    if (Platform.OS === 'android') {
      Roam.setForegroundNotification(
        true,
        'Test Project',
        'App is fetching location.',
        'mipmap-hdpi/ic_launcher',
        'com.testproject.MainActivity',
      );
      Roam.startTrackingTimeInterval(5, Roam.DesiredAccuracy.HIGH);
    } else {
      Roam.startTrackingCustom(true, false, Roam.ActivityType.FITNESS, Roam.DesiredAccuracy.HIGH, true, 0, 100, 5);
    }

    
  }


  const startListener = () => {
    console.log('start listener')

    Roam.startListener("location", (location) => {
      //Alert.alert(JSON.stringify(location));
      console.log(`count before ${count}`)
      setCount(count => count + 1);
      console.log(`count after ${count}`)
      console.log(JSON.stringify(location))
      
    });
  }

  const stopListener = () => {
    console.log('stop listener')
    Roam.stopListener("location");
  }


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <TouchableHighlight
      style={styles.sectionContainer}
      onPress={() => {
        startTracking()
      }}
      ><Text style={{padding: 20}}>StartTracking</Text></TouchableHighlight>


      <TouchableHighlight
      style={styles.sectionContainer}
      onPress={() => {
        startListener()
      }}
      ><Text style={{padding: 20}}>Start Listener</Text></TouchableHighlight>


      <TouchableHighlight
      style={styles.sectionContainer}
      onPress={() => {
        stopListener()
      }}
      ><Text style={{padding: 20}}>Stop Listener</Text></TouchableHighlight>


     <TouchableHighlight
     style={styles.sectionContainer}
     onPress={() => {
       Roam.stopTracking()
       setCount(0)
      }}
     >
       <Text style={{padding: 20}}>Stop Tracking</Text>
     </TouchableHighlight>


     <Text style={styles.count}>Counts: {count}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    alignSelf: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  count: {
    color: 'red',
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 40
  }
});


