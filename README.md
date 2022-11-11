# Parking Spot Detector: Front-end

## The React Native front-end mobile application for the parking spot detector capstone project

### System Overview
Parking Spot Detector is a three-piece software solution component system, including both hardware and software solutions, for congested street parking in metropolitan areas. By using a smart camera unit, a flexible AWS cloud backend, and a mobile app interface built with React Native, we can curate parking data, deliver it to residents, and alleviate the strain that finding parking has on their day-to-day lives. Our Camera Units monitor street parking and send updates to our cloud servers while our servers maintain street-parking states and push updates to our end users through our mobile app. 
 
The Camera Unit comprises a 105° field-of-view camera, a GPS chip, a magnetic compass, and a RaspberryPi. The camera—and its wide field of view—allows us to monitor as much physical street area from a single unit as possible. From the rooftops of 3-story Temple area North Philadelphia homes, it is completely within reason to expect a single Camera Unit to cover the majority of a city block. The GPS chip and magnetic compass are crucial for geo-locating our data and enabling us to build an accurate picture of geographic coverage. The GPS chip can be expected to perform within a third of a meter and the magnetic compass will help us determine the orientation of our cameras. Finally, our RaspberryPi will take in all motion-detected frames from the camera (as well as other peripherals from the mentioned sensors) and discriminate for relevant updates using the open-source ML software TensorFlow trained with the MNIST dataset. We hope to be as efficient as possible by only introducing relevant frames to our cloud processing load. 
 
The AWS Cloud backend will be responsible for maintaining user profiles, processing captured street frames, and maintaining a consistent parking state. Our servers will maintain connections to Camera Units and, of course, the end users. AWS EC2 will be used to host web servers that manage incoming frames and run the necessary jobs to process and consistently represent incoming state changes. We plan on using AWS DynamoDB to serialize parking state data and AWS S3 to hold relevant assets as they are communicated to the user (for example, screenshots of open spots). Lastly, the cloud backend will update users through push notifications and the mobile app web service endpoint. 
 
The mobile app in this repository is developed using React Native, a Facebook-maintained framework for building native mobile apps for iOS and Android through a common Javascript/HTML-like interface. We hope this approach multiplies our user reach, while not requiring any extra lines of code. Our mobile app will be an interface for the user to interact with our cloud, configure their settings, and receive updates about parking near their home. We will use as many pre-styled elements as possible and ensure that our mobile app receives push notifications properly on iOS and Android. 

### Installation Instructions

[Download the Expo Go application from the Google or Apple stores for your mobile device.](https://expo.dev/client)
Scan the following QR code on your mobile device after the Expo Go app is installed:

<img src="https://qr.expo.dev/expo-go?owner=projects-in-computer-science&slug=ParkingSpotDetectorv1&releaseChannel=default&host=exp.host" width="350" alt="Parking Spot Detector App QR code">

Or, open this link on your browser or Expo Go App after the Expo Go app is installed:

[exp.host/@projects-in-computer-science/ParkingSpotDetectorv1?release-channel=default](exp.host/@projects-in-computer-science/ParkingSpotDetectorv1?release-channel=default)

### Development Instructions

[Prerequisite: Follow this link to install the tools needed.](https://docs.expo.dev/get-started/installation/)
Clone the project into your IDE (VS code is the preffered IDE currently used)
Run npm install expo from within the cloned repository folder
Run the command npx expo start to start the expo cli for using emulators and debugging features
Follow the prompts to use Expo CLI.
