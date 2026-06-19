import React from 'react';
import { Logo } from '../logo/Logo';
import { GlassCard } from '../ui/GlassCard';
import { Sidebar } from '../ui/Sidebar';
import { Cpu, Radio, Zap, Droplets } from 'lucide-react';
import schematicImg from '../../assets/schematic.svg';

interface SchematicPageProps {
  onNavigate: (page: 'home' | 'schematic' | 'pcb' | 'wokwi' | 'physical' | 'dashboard') => void;
}

export const SchematicPage: React.FC<SchematicPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-bg-space font-sans relative overflow-hidden bg-mesh-green select-none">
      {/* Sidebar */}
      <Sidebar
        currentPage="schematic"
        onNavigate={onNavigate}
      />

      {/* Background visual glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="border-b border-white/5 relative z-10 backdrop-blur-md bg-bg-space/40 sticky top-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" className="lg:hidden" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8 relative z-10 lg:ml-64">
        <div className="space-y-4">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white text-glow-emerald">
            Circuit Schematic & Hardware Architecture
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl">
            Explore the complete hardware design of the VermIQ system, including the ESP32 microcontroller, sensor connections, and power distribution.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10 space-y-12 lg:ml-64">
        {/* Schematic Image */}
        <GlassCard className="overflow-hidden">
          <div className="bg-white/5 p-8 rounded-lg border border-white/5">
            <img
              src={schematicImg}
              alt="VermIQ Circuit Schematic"
              className="w-full h-auto object-contain bg-white/2 p-4 rounded-lg"
            />
          </div>
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-slate-500 text-center">
              Complete circuit schematic showing ESP32 microcontroller, sensor modules, power distribution, and communication interfaces
            </p>
          </div>
        </GlassCard>

        {/* System Components Overview */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">System Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ESP32 Microcontroller */}
            <GlassCard>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 text-cyan-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">ESP32 Microcontroller</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>
                      The ESP32 serves as the central processing unit for the VermIQ system. This dual-core microcontroller features integrated WiFi and Bluetooth connectivity, making it ideal for IoT applications.
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-xs">
                      <p><strong className="text-white">Key Features:</strong></p>
                      <ul className="list-disc list-inside text-slate-500 space-y-1">
                        <li>240 MHz dual-core CPU with 520KB SRAM</li>
                        <li>WiFi 802.11 b/g/n and Bluetooth 4.2/5.0 LE support</li>
                        <li>16 ADC channels for analog sensor input</li>
                        <li>GPIO pins for digital I/O and sensor control</li>
                        <li>Built-in security features and OTA firmware updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Soil Moisture Sensor */}
            <GlassCard>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">Soil Moisture Sensor</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>
                      Measures the volumetric water content in the compost medium through capacitive sensing. Essential for maintaining the optimal 60-80% moisture range required for worm survival.
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-xs">
                      <p><strong className="text-white">Specifications:</strong></p>
                      <ul className="list-disc list-inside text-slate-500 space-y-1">
                        <li>Analog output (0-3.3V) connected to ADC pin</li>
                        <li>Operating range: 0-100% moisture</li>
                        <li>Calibration: Air (~0V) to saturated soil (~3.3V)</li>
                        <li>Sampling rate: Every 30 seconds</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
            {/* Temperature & Humidity Sensor */}
            <GlassCard>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">DHT22 Temperature & Humidity Sensor</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>
                      Provides real-time environmental readings for microclimate monitoring. Detects temperature fluctuations that may indicate aerobic decomposition or sub-optimal conditions.
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-xs">
                      <p><strong className="text-white">Specifications:</strong></p>
                      <ul className="list-disc list-inside text-slate-500 space-y-1">
                        <li>Temperature range: -40°C to +80°C (±0.5°C accuracy)</li>
                        <li>Humidity range: 0-100% RH (±2% accuracy)</li>
                        <li>Digital output (1-Wire protocol) on GPIO pin</li>
                        <li>Optimal range for vermiculture: 15-28°C, 60-80% RH</li>
                        <li>Sampling interval: Every 30 seconds</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* WiFi & Communication Module */}
            <GlassCard>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">WiFi & MQTT Communication</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>
                      The ESP32's integrated WiFi module connects to your network and communicates with the backend via MQTT protocol. Enables real-time data streaming and remote device control.
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-xs">
                      <p><strong className="text-white">Protocol Stack:</strong></p>
                      <ul className="list-disc list-inside text-slate-500 space-y-1">
                        <li>WiFi: 802.11 b/g/n (2.4 GHz band)</li>
                        <li>MQTT Broker: Mosquitto (port 1883)</li>
                        <li>Topic structure: vermiq/node/[nodeId]/[sensorType]</li>
                        <li>QoS Level: 1 (At least once delivery)</li>
                        <li>Automatic reconnection with exponential backoff</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Circuit Operation Flow */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">Circuit Operation & Data Flow</h2>
          <GlassCard>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-transparent"></div>
                </div>
                <div className="pb-6">
                  <h4 className="font-display font-semibold text-white text-lg mb-2">Sensor Data Acquisition</h4>
                  <p className="text-slate-400 text-sm">
                    Every 30 seconds, the ESP32 reads analog values from the moisture sensor (via ADC) and digital readings from the DHT22 temperature/humidity sensor. The firmware applies calibration factors to convert raw sensor values into meaningful measurements.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div className="w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent"></div>
                </div>
                <div className="pb-6">
                  <h4 className="font-display font-semibold text-white text-lg mb-2">Data Validation & Thresholding</h4>
                  <p className="text-slate-400 text-sm">
                    The firmware validates sensor readings against expected ranges and checks against predefined thresholds. If anomalies are detected (e.g., moisture &lt; 50% or &gt; 85%, temperature &gt; 30°C), an alert flag is set.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
                </div>
                <div className="pb-6">
                  <h4 className="font-display font-semibold text-white text-lg mb-2">MQTT Transmission</h4>
                  <p className="text-slate-400 text-sm">
                    Data packets are constructed in JSON format and published to the MQTT broker over WiFi. Topics include node identification, sensor type, and timestamp. The ESP32 automatically reconnects if the connection drops.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">4</div>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-white text-lg mb-2">Cloud Ingestion & Real-Time Dashboard</h4>
                  <p className="text-slate-400 text-sm">
                    The backend subscribes to MQTT topics and receives data. Readings are stored in Firebase Firestore for historical analysis and streamed to connected clients via WebSockets. The dashboard updates in real time, and alerts are triggered if thresholds are exceeded.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Power Distribution */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">Power Distribution & External Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4">Voltage Regulators & Power Rails</h3>
              <div className="space-y-3 text-sm text-slate-400">
                <div>
                  <p className="font-semibold text-white text-base mb-1">Primary 5V Rail (USB Input)</p>
                  <p>Powers the ESP32 development board. Regulated voltage is distributed to all sensors through GPIO pins.</p>
                </div>
                <div>
                  <p className="font-semibold text-white text-base mb-1">3.3V Logic Rail</p>
                  <p>Derived from ESP32's onboard regulator. Used for DHT22 sensor logic levels and GPIO signal conditioning.</p>
                </div>
                <div>
                  <p className="font-semibold text-white text-base mb-1">Analog Reference (AREF)</p>
                  <p>3.3V reference voltage for ADC conversions. Critical for accurate analog sensor reading calibration.</p>
                </div>
                <div>
                  <p className="font-semibold text-white text-base mb-1">GND (Ground Plane)</p>
                  <p>Common reference point for all sensors. Short, direct connections to ground minimize noise and improve signal integrity.</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4">Connector Pinout Reference</h3>
              <div className="space-y-2 text-xs font-mono bg-white/5 p-4 rounded border border-white/5">
                <div className="flex justify-between text-slate-300">
                  <span>GPIO 35 (ADC1_7)</span>
                  <span className="text-emerald-400">→ Moisture Sensor</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>GPIO 4</span>
                  <span className="text-emerald-400">→ DHT22 Data</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>GPIO 5</span>
                  <span className="text-emerald-400">→ OLED SDA</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>GPIO 18</span>
                  <span className="text-emerald-400">→ OLED SCL</span>
                </div>
                <div className="border-t border-white/5 pt-2 mt-2">
                  <div className="flex justify-between text-slate-300">
                    <span>5V</span>
                    <span className="text-amber-400">→ USB Input</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>GND</span>
                    <span className="text-cyan-400">→ Ground Return</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Design Considerations */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">Design Considerations & Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-emerald-400">Sensor Placement</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Moisture sensor positioned at mid-depth in compost to capture representative water content</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>DHT22 placed in protective housing to avoid direct water contact while maintaining air circulation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>ESP32 mounted in weatherproof enclosure with antenna orientation for optimal WiFi reception</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-cyan-400">Signal Integrity</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Twisted pair cables for analog sensor lines to reduce EMI pickup</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Decoupling capacitors (0.1µF) near sensor power pins for noise filtering</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Ferrite cores on WiFi antenna cable to minimize conducted EMI to sensors</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-amber-400">Firmware Reliability</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Watchdog timer monitors main loop for hangs; automatic reboot on stall detection</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Local SPIFFS storage buffers readings if WiFi/MQTT is unavailable; syncs when reconnected</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>OTA firmware updates allow remote patches without physical device access</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-blue-400">Thermal Management</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Enclosure vented to prevent ESP32 overheating during high WiFi activity</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Thermal pads between PCB and case for efficient heat dissipation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Monitoring of internal ESP32 junction temperature to prevent thermal throttling</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* Call to Action */}
        <GlassCard className="bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border-emerald-500/20 text-center py-12">
          <h3 className="font-display text-2xl font-bold text-white mb-4">Ready to Deploy?</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            This circuit design has been tested in production environments. Visit the dashboard to monitor your nodes in real time or contact support for hardware assembly assistance.
          </p>
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              onNavigate('home');
            }}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Return to Home
          </button>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-bg-space text-slate-500 text-sm lg:ml-64">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div>© {new Date().getFullYear()} VermIQ-Lite. Smart Agritech Environmental Systems.</div>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
            <span className="hover:text-white transition-colors cursor-pointer">API Specs</span>
            <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchematicPage;
