
# Patient-monitoring-system!

A interactive platform for coders to find a coding partner. 
### problem statement
You are tasked to design a device that alerts a doctor/ hospital nearby when the health of a Covid patient isolated at home becomes serious. Also, the device gets data of all hospitals and bed availability, should choose the least distance out of all available hospitals.
The sensors available in the patient room are:
-   O2 saturation levels
-   body temperature
-   rate of heartbeat
The beds available are updated on the portal by the respective Hospital Operations.

### Tech stack USED 
 - Node js 
 - Mongo DB
 - Arduino

### circuit diagram
![circuit diagram](https://github.com/rafitc/patient-monitoring/blob/main/circuit/circuit.jpg)

### Firmware 
#### components used
- Nodemcu 
- MAX30102
- MAX30205
#### code 
Refer here :
#### Algorithm
Connect with WiFi > Read data from sensor > Check patient condition is normal or not > if goes beyond the set value > Make a POST Request with patient details with health condition. 

### API
#### Hospital API
/patient 
	Receive POST method with patient details > Parse GEO location from body > Call compareDisatance() function > Find distance with each Lat,Lon in DB and store the distance and id in a JS object > find least value in json object and find the hospital from id. 
/hospital 
 
## Things to do
  - API
    - [ ] /patient 
    - [ ] /hospital
- Firmware
    - [x] v1.0 code
    - [ ]  Check response from API
    

