# Parking Spot Detector: Front-end

## The React Native front-end mobile application for the parking spot detector capstone project

### System Overview

Parking Spot Detector is a three-piece software solution component system, including both hardware and software solutions, for congested street parking in metropolitan areas. By using a smart camera unit, a flexible AWS cloud backend, and a mobile app interface built with React Native, we can curate parking data, deliver it to residents, and alleviate the strain that finding parking has on their day-to-day lives. Our Camera Units monitor street parking and send updates to our cloud servers while our servers maintain street-parking states and push updates to our end users through our mobile app.

The Camera Unit comprises a 105° field-of-view camera, a GPS chip, a magnetic compass, and a RaspberryPi. The camera—and its wide field of view—allows us to monitor as much physical street area from a single unit as possible. From the rooftops of 3-story Temple area North Philadelphia homes, it is completely within reason to expect a single Camera Unit to cover the majority of a city block. The GPS chip and magnetic compass are crucial for geo-locating our data and enabling us to build an accurate picture of geographic coverage. The GPS chip can be expected to perform within a third of a meter and the magnetic compass will help us determine the orientation of our cameras. Finally, our RaspberryPi will take in all motion-detected frames from the camera (as well as other peripherals from the mentioned sensors) and discriminate for relevant updates using the open-source ML software TensorFlow trained with the MNIST dataset. We hope to be as efficient as possible by only introducing relevant frames to our cloud processing load.

The AWS Cloud backend will be responsible for maintaining user profiles, processing captured street frames, and maintaining a consistent parking state. Our servers will maintain connections to Camera Units and, of course, the end users. AWS EC2 will be used to host web servers that manage incoming frames and run the necessary jobs to process and consistently represent incoming state changes. We plan on using AWS DynamoDB to serialize parking state data and AWS S3 to hold relevant assets as they are communicated to the user (for example, screenshots of open spots). Lastly, the cloud backend will update users through push notifications and the mobile app web service endpoint.

The mobile app in this repository is developed using React Native, a Facebook-maintained framework for building native mobile apps for iOS and Android through a common Javascript/HTML-like interface. We hope this approach multiplies our user reach, while not requiring any extra lines of code. Our mobile app will be an interface for the user to interact with our cloud, configure their settings, and receive updates about parking near their home. We will use as many pre-styled elements as possible and ensure that our mobile app receives push notifications properly on iOS and Android.

#### Features

- UI Components
  - User Login
  - User Registration
  - Bottom Tab Navigation
    - Home Screen
      - User login information
      - Parking location data on map
        - Parking location can be show more info may be chosen and more data can be viewed on new screen with navigation button
      - Create parking area button opens new screen to enter a new parking location
    - User Profile Screen
      - Update, logout, and delete may be chosen to modify or logout user
    - Navigation Screen
      - Shows current user location, updates parking location upon notification recieved, and navigation button allows user to navigate to the parking spot if available.
- Notifications
  - Notifications recieved may be clicked on to open app to navigation screen (only if user was logged in) to show parking location and allow navigation

#### Known Issues

- User registration issues
  - User registration not working currently, use login credentials displayed on sign in screen
- Navigation screen map updates may lag based on wifi/cell signal

### Installation Instructions

1. [Download the Expo Go application from the Google or Apple stores for your mobile device.](https://expo.dev/client)
2. Scan the following (platform dependant) QR codes on your mobile device after the Expo Go app is installed:

- Android Version

<img src= "https://qr.expo.dev/eas-update?updateId=e4866825-16a3-40a6-9950-45a0b08b0aa1&appScheme=exp&host=u.expo.dev" width="350" alt="Parking Spot Detector App QR code">

Or, open this link on your browser or Expo Go App after the Expo Go app is installed:

[exp://u.expo.dev/update/e4866825-16a3-40a6-9950-45a0b08b0aa1](exp://u.expo.dev/update/e4866825-16a3-40a6-9950-45a0b08b0aa1)

- IOS Version

<img src="https://qr.expo.dev/eas-update?updateId=19398b82-7282-42c5-bb7d-c36120d8b234&appScheme=exp&host=u.expo.dev" width="350" alt="Parking Spot Detector App QR code">

Or, open this link on your browser or Expo Go App after the Expo Go app is installed:

[exp://u.expo.dev/update/19398b82-7282-42c5-bb7d-c36120d8b234](exp://u.expo.dev/update/19398b82-7282-42c5-bb7d-c36120d8b234)

### Development Instructions

1. [Prerequisite: Follow this link to install the tools needed.](https://docs.expo.dev/get-started/installation/)
2. Clone the project into your IDE (VS code is the preffered IDE currently used)
3. Run npm install expo from within the cloned repository folder
4. Run the command npx expo start to start the expo cli for using emulators and debugging features
5. Follow the prompts to use Expo CLI.

### QA Acceptance Testing

Follow the guide in this link [acceptance_qa_testing.xlsx](./acceptance_qa_testing.xlsx)
