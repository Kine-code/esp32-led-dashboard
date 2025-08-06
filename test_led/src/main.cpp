#include <WiFi.h>
#include <Arduino.h>
#include <WebServer.h>
#include <ArduinoJson.h>

const char* ssid = "Phong_CNTT";
const char* password = "eaut111111";

WebServer server(80);

const int led1 = 14;
const int led2 = 27;

void handleControl() {
  Serial.println(server.arg("plain"));
  if (server.hasArg("plain")) {
    DynamicJsonDocument doc(200);
    DeserializationError error = deserializeJson(doc, server.arg("plain"));

    if (!error) {
      String led = doc["led"];
      String state = doc["state"];

      if (led == "LED1") {
        digitalWrite(led1, state == "on" ? HIGH : LOW);
      } else if (led == "LED2") {
        digitalWrite(led2, state == "on" ? HIGH : LOW);
      }

      server.send(200, "application/json", "{\"status\":\"OK\"}");
      return;
    }
  }
  server.send(400, "application/json", "{\"error\":\"Bad Request\"}");
}

void setup() {
  Serial.begin(115200);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  digitalWrite(led1, LOW);
  digitalWrite(led2, LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("WiFi connected. IP:");
  Serial.println(WiFi.localIP());

  server.on("/api/control", HTTP_POST, handleControl);
  server.begin();
}

void loop() {
  server.handleClient();
}
