#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ---------------- OLED ----------------
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// ---------------- DHT22 ----------------
#define DHTPIN 15
#define DHTTYPE DHT22

// ---------------- Other Sensors ----------------
#define ONE_WIRE_BUS 4
#define MOISTURE_PIN 34
#define PH_PIN 35

DHT dht(DHTPIN, DHTTYPE);

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {

  Serial.begin(115200);

  // Start sensors
  dht.begin();
  sensors.begin();

  // Start OLED
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED failed");
    while(true);
  }

  // OLED startup message
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);

  display.setCursor(0,0);
  display.println("IoT System");
  display.println("Starting...");
  display.display();

  delay(2000);
}

void loop() {

  // ----- DHT22 -----
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();

  // ----- DS18B20 -----
  sensors.requestTemperatures();
  float soilTemp = sensors.getTempCByIndex(0);

  // ----- Analog Sensors -----
  int moistureRaw = analogRead(MOISTURE_PIN);
  int phRaw = analogRead(PH_PIN);

  // ----- Convert Values -----
  float moisture = (moistureRaw / 4095.0) * 100.0;
  float ph = (phRaw / 4095.0) * 14.0;

  // ----- SERIAL MONITOR -----
  Serial.println("------ SENSOR DATA ------");

  Serial.print("Air Temp: ");
  Serial.print(temp);
  Serial.println(" °C");

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Soil Temp: ");
  Serial.print(soilTemp);
  Serial.println(" °C");

  Serial.print("Moisture: ");
  Serial.print(moisture);
  Serial.println(" %");

  Serial.print("pH: ");
  Serial.println(ph);

  Serial.println();

  // ----- OLED DISPLAY -----
  display.clearDisplay();

  display.setCursor(0,0);

  display.print("AirT: ");
  display.print(temp);
  display.println(" C");

  display.print("Hum: ");
  display.print(humidity);
  display.println(" %");

  display.print("SoilT: ");
  display.print(soilTemp);
  display.println(" C");

  display.print("Moist: ");
  display.print(moisture);
  display.println(" %");

  display.print("pH: ");
  display.println(ph);

  display.display();

  delay(2000);
}