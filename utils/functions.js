import * as Device from 'expo-device';
const getDeviceName = async () => {
     try {
       const deviceName = await Device.deviceName;
       console.log('Device name:', deviceName);
       return deviceName;
     } catch (error) {
       console.error('Error getting device name:', error);
       return null;
     }
   };
   
   
const DeviceName = await getDeviceName();

export DeviceName;