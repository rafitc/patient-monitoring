
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#include "Protocentral_MAX30205.h" // Arduino Contributed Libs (https://github.com/protocentral/ProtoCentral_MAX30205)

#include "MAX30100_PulseOximeter.h" //Library https://github.com/oxullo/Arduino-MAX30100
#define REPORTING_PERIOD_MS     1000

PulseOximeter pox;
float BPM, SpO2;
uint32_t tsLastReport = 0;

// define MAX30205 objectData
MAX30205 tempSensor;

// Show the temperature in Fahrenheit
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

const char* latitude = "PATIENT LATITUDE";
const char* longitude = "PATIENT LONGITUDE";

const char* Name = "NAME OF PATIENt";
const char* age = "24";

//URL with endpoint
const char* serverName = "http://localhost:3000/patient";

bool trigger = false; //to check patient critical point

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.print("Initializing pulse oximeter..");

  // Initialize the PulseOximeter instance
  if (!pox.begin()) {
    Serial.println("FAILED");
    for (;;);
  } else {
    Serial.println("SUCCESS");
  }
  // Initialize the temperature
  tempSensor.begin();
}


void sendTrigger() {
  //Check WiFi connection status
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    // Your Domain name with URL path or IP address with path
    http.begin(client, serverName);

    // Specify content-type header
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    // Data to send with HTTP POST
    String httpRequestData = "patientname=" + String(Name) + "&age=" + String(age) + "&lat=" + String(latitude) + "&lon=" + String(longitude) + "&oxygen=" + String(SpO2) + "&temp=" + String(temp) + "&bpm=" + String(bpm);
    // Send HTTP POST request
    int httpResponseCode = http.POST(httpRequestData);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    // Free resources
    http.end();
  }

  void loop() {
    //Read value of SPO2
    pox.update();
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {

      BPM = pox.getHeartRate();  //Read value of BPM
      SpO2 = pox.getSpO2(); // //Read value of O2

      Serial.print("BPM: ");
      Serial.println(BPM);

      Serial.print("SpO2: ");
      Serial.print(SpO2);
      Serial.println("%");

      Serial.println("------");
      Serial.println();
      tsLastReport = millis();
    }


    //Read value of Temperature
    float temp = tempSensor.getTemperature(); // read temperature for every 5ms

    if (temp >= 38) {
      trigger = true;
    }
    else if (BPM > 100) {
      trigger = true;
    }
    else if (SpO2 < 92) {
      trigger = true;
    }

    if (trigger) {
      //send WEBHOOK with patient data;
      sendTrigger();
      trigger = false;
    }
  }
