### Points to confirm

- Initialize roam sdk in MainApplication.java
		Roam.initialize(this, "YOUR-KEY-HERE");

- Confirm package name in Roam Project settings

- Make a Location Service class and register RNRoamReceiver in it. For reference, you can find an example of the service class in "/android/app/src/main/java/com/testproject/LocationService.java"

- Declare service tag in android manifest file.
For example:
		<service android:name=".LocationService" />

- Start the service in MainActivity or MainApplication

- In order to run it in background, either use startForeground() in LocationService.java or use the below method in react native
		setForeground(enabled: any, title: any, description: any, image: any, activity: any)