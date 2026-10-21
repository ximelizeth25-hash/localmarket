---
name: iot-embedded-pro
description: >-
  Desarrollo profesional de firmware y sistemas embebidos para ESP32, Arduino,
  C/C++ y MQTT. Úsala siempre que escribas o depures código para
  microcontroladores, sensores, Wi-Fi o telemetría IoT.
---

# IoT & Embedded Pro (ESP32, Arduino y MQTT)

Guía de ingeniería para firmware robusto, continuo y libre de congelamientos o reinicios por memoria en ESP32 y Arduino.

## 1. Código 100% No Bloqueante con `millis()`
- **Prohibido usar `delay(1000)`** (o retardos largos) dentro de `loop()`. Bloquear el hilo principal congela la lectura de sensores, dispara el Watchdog Timer (WDT) y tumba la pila TCP/IP (Wi-Fi y MQTT `loop()`).
- Usa temporizadores asíncronos seguros ante el desbordamiento de `millis()`:
  ```cpp
  unsigned long lastTelemetryMs = 0;
  const unsigned long TELEMETRY_INTERVAL_MS = 5000UL;

  void loop() {
      unsigned long now = millis();
      if (now - lastTelemetryMs >= TELEMETRY_INTERVAL_MS) {
          lastTelemetryMs = now;
          publishTelemetry();
      }
      mqttClient.loop();
  }
  ```

## 2. Reconexión Automática a Wi-Fi y Brokers MQTT
- Nunca uses bucles `while (!client.connected()) { delay(5000); }` infinitos que congelen los actuadores/sensores locales si se cae el internet.
- Implementa una máquina de estados no bloqueante que verifique `WiFi.status() == WL_CONNECTED` y `mqttClient.connected()` cada cierto intervalo (ej. cada 5 segundos con backoff), reconectando en segundo plano y re-suscribiéndose a los topics automáticamente tras recuperar la red.

## 3. Prevención de Fragmentación de Memoria (Heap Fragmentation)
- **Evita la clase `String` dinámica** de Arduino para concatenar JSONs o topics dentro de `loop()`.
- Usa **buffers estáticos o en pila de tamaño fijo** (`char buffer[256]`) formateados de manera segura con `snprintf()`:
  ```cpp
  char payload[128];
  snprintf(payload, sizeof(payload),
           "{\"device\":\"%s\",\"temp\":%.2f,\"uptime\":%lu}",
           deviceId, temperature, millis() / 1000UL);
  mqttClient.publish("sensors/telemetry", payload);
  ```
- Verifica siempre que el tamaño del buffer sea suficiente y que `snprintf` garantice la terminación nula (`\0`).
