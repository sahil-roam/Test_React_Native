//import { store } from "utils/store";
import Roam from "roam-reactnative";
import { Platform, Alert } from "react-native";
//import { client as apolloClient } from "api/apolloClient";
//import { SET_TRACK_ID_MUTATION } from "./../api/graphql/mutation";
import DeviceInfo from "react-native-device-info";

// https://github.com/roam-ai/roam-reactnative
export default {
  async checkPermission() {
    const apiLevel = await DeviceInfo.getApiLevel();

    // https://github.com/roam-ai/roam-reactnative#request-permissions
    Roam.checkLocationPermission((status: any) => {
      if (status == "DENIED") {
        Roam.requestLocationPermission();
      }
    });

    // https://github.com/roam-ai/roam-reactnative#android-1
    if (Platform.OS === "android") {
      if (apiLevel >= 29) {
        Roam.checkBackgroundLocationPermission((status: any) => {
          if (status == "DENIED") {
            Roam.requestBackgroundLocationPermission();
          }
        });
      }

      Roam.checkLocationServices((status: any) => {
        if (status == "DISABLED") {
          Roam.requestLocationServices();
        }
      });
    }
  },

  configure() {
    // https://github.com/roam-ai/roam-reactnative#accuracy-engine
    Roam.enableAccuracyEngine(); // Roam.enableAccuracyEngine(50);

    // https://github.com/roam-ai/roam-reactnative#offline-location-tracking
    Roam.offlineLocationTracking(true);

    // https://github.com/roam-ai/roam-reactnative#allow-mock-location-tracking
    // Roam.allowMockLocation(true);

    // https://github.com/roam-ai/roam-reactnative#update-location-when-stationary
    Roam.updateLocationWhenStationary(10);

    // https://github.com/roam-ai/roam-reactnative/wiki/Utility-Methods#set-tracking-in-appstate
    Roam.setTrackingInAppState(Roam.AppState.ALWAYS_ON);
  },

  createOrLoadRoamUser() {
    // https://github.com/roam-ai/roam-reactnative#creating-users
    const trackId = 'YOUR-USERID-HERE';// = store.getState().user.profile?.trackId;
    let userId = 'USER-DESCRIPTION';// = store.getState().user.profile?.uid;

    if (trackId) {
      console.log('call get user');
      Roam.getUser(
        trackId,
        (success: any) => {
          console.log(`get user success: ${JSON.stringify(success)}`)
        },
        (error: any) => {
          console.log("Roam User load error: ", error);
        },
      );
    } else {
      console.log('call create user')
      Roam.createUser(
        userId,
        async (success: any) => {
          // try {
          //   await apolloClient.mutate({
          //     mutation: SET_TRACK_ID_MUTATION,
          //     variables: { track_id: success.userId },
          //   });
          // } catch (error) {}
          console.log(`create user success: ${success}`)
        },
        (error: any) => {
          console.log("Roam User creation error: ", error);
        },
      );
    }
  },

  startTracking() {
    //const user = store.getState().user.profile;
    let metadataJSON = {
      METADATA: {
        user: 'test-user',//user?.displayName,
        email: 'test-user-email'//user?.email,
      },
    };

    Roam.publishAndSave(metadataJSON);

    // https://github.com/roam-ai/roam-reactnative#start-tracking
    Roam.startTracking("BALANCED"); // ACTIVE | BALANCED | PASSIVE

    // https://github.com/roam-ai/roam-reactnative#subscribe-messages
    Roam.subscribe(Roam.SubscribeListener.BOTH, '625d097fb2ab4e35e9621e81');

    // Custom tracking mode if needed
    // https://github.com/roam-ai/roam-reactnative#custom-tracking-modes
    // if (Platform.OS === "android") {
    //   console.log('start tracking');
    //   Roam.startTrackingTimeInterval(5, Roam.DesiredAccuracy.HIGH);
    //   //Roam.startTrackingDistanceInterval(10, 10, Roam.DesiredAccuracy.HIGH);
    // } else {
    //   Roam.startTrackingCustom(
    //     true,
    //     false,
    //     Roam.ActivityType.FITNESS,
    //     Roam.DesiredAccuracyIOS.BEST,
    //     true,
    //     10,
    //     10,
    //     0,
    //   );
    // }
  },

  startListener() {
    // https://github.com/roam-ai/roam-reactnative#listeners
    Roam.toggleListener(
      true,
      true,
      (success: any) => {
        console.log("Listener started: ", success);
      },
      (error: any) => {
        console.log("Listener error: ", error);
      },
    );

    Roam.startListener("location", (location) => {
      Alert.alert(JSON.stringify(location));
      console.log(JSON.stringify(location))
    });
  },

  stop() {
    //const user = store.getState().user.profile;

    Roam.disableAccuracyEngine();
    Roam.stopPublishing();
    Roam.stopTracking();
    Roam.unSubscribe(Roam.SubscribeListener.LOCATION, '625d097fb2ab4e35e9621e81');
    Roam.stopListener("location", (location) => {
      console.log(JSON.stringify(location))
    });
  },
};

// useEffect(() => {
//   RoamManager.checkPermission();
//   RoamManager.configure();
//   RoamManager.createOrLoadRoamUser();
//   RoamManager.startTracking();
//   RoamManager.startListener();
// }, []);
