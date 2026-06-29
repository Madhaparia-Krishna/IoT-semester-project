import React, { useState, useEffect } from 'react';
import { Logo } from '../logo/Logo';
import { GlassCard } from '../ui/GlassCard';
import { Sidebar } from '../ui/Sidebar';
import { Cpu, Radio, Zap, Droplets, ZoomIn, ZoomOut, Maximize2, ExternalLink, X, ArrowRight } from 'lucide-react';
import schematicImg from '../../assets/schematic.svg';

interface SchematicPageProps {
  onNavigate: (page: 'home' | 'schematic' | 'pcb' | 'pcb-3d' | 'wokwi' | 'physical' | 'dashboard') => void;
}

export const SchematicPage: React.FC<SchematicPageProps> = ({ onNavigate }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle ESC key to close fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

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
          <Logo size="md" className="lg:hidden" onClick={() => {
            window.scrollTo(0, 0);
            onNavigate('home');
          }} />
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer text-sm ml-auto"
          >
            Launch Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
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
        {/* OSH Lab Link Card */}
        <GlassCard className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-display font-bold text-xl text-white mb-2">View on OSH Lab</h3>
              <p className="text-slate-400 text-sm">
                Access the complete schematic design, PCB layout, and Bill of Materials on OSH Lab. You can also fork the project and customize it for your needs.
              </p>
            </div>
            <a
              href="https://oshwlab.com/evaghjiani/project_wsoshhsu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex-shrink-0"
            >
              <span>Open in OSH Lab</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </GlassCard>

        {/* Schematic Image with Zoom Controls */}
        <GlassCard className="overflow-hidden">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
            <h3 className="font-display font-bold text-lg text-white">Circuit Schematic</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-all text-sm font-semibold min-w-[70px]"
                title="Reset Zoom"
              >
                {zoomLevel}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 300}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-all ml-2"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className={`bg-white/5 rounded-lg border border-white/5 overflow-auto ${isFullscreen ? 'fixed inset-0 z-[9999] p-0 bg-black flex items-center justify-center' : 'p-8'}`}>
            {isFullscreen && (
              <>
                {/* Close button */}
                <button
                  onClick={toggleFullscreen}
                  className="fixed top-6 right-6 p-3 bg-black/80 hover:bg-black text-white rounded-lg z-[10000] border border-white/20"
                  title="Exit Fullscreen (ESC)"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Zoom controls in fullscreen */}
                <div className="fixed top-6 left-6 z-[10000] flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                    disabled={zoomLevel <= 50}
                    className="p-2 bg-black/80 hover:bg-black border border-white/20 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
                    className="px-3 py-2 bg-black/80 hover:bg-black border border-white/20 rounded-lg text-white transition-all text-sm font-semibold min-w-[70px]"
                    title="Reset Zoom"
                  >
                    {zoomLevel}%
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                    disabled={zoomLevel >= 300}
                    className="p-2 bg-black/80 hover:bg-black border border-white/20 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>

                {/* Instructions */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] text-white/60 text-xs text-center">
                  <p>Click image to zoom • Press ESC or click X to close</p>
                </div>
              </>
            )}
            <div className={`flex items-center justify-center ${isFullscreen ? 'w-full h-full overflow-auto p-8' : 'min-h-[400px]'}`}>
              <img
                src={schematicImg}
                alt="VermIQ Circuit Schematic"
                style={{
                  width: `${zoomLevel}%`,
                  maxWidth: 'none',
                  transition: 'width 0.2s ease'
                }}
                className={`object-contain p-4 rounded-lg ${isFullscreen ? 'cursor-zoom-in' : 'bg-white/2 cursor-zoom-in'}`}
                onClick={handleZoomIn}
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-slate-500 text-center">
              Complete circuit schematic showing ESP32 microcontroller, sensor modules, power distribution, and communication interfaces. Click image to zoom in, or use the controls above.
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
                  <p className="text-sm text-slate-400 mb-3">
                    Central processing unit with integrated WiFi/Bluetooth connectivity. Dual-core 240 MHz CPU with 520KB SRAM, 16 ADC channels, and OTA firmware update support.
                  </p>
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
                  <p className="text-sm text-slate-400 mb-3">
                    Capacitive sensor measuring volumetric water content (0-100%). Analog output (0-3.3V) sampled every 30 seconds. Maintains optimal 60-80% moisture for worm survival.
                  </p>
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
                  <h3 className="font-display font-bold text-lg text-white mb-2">DHT22 Temperature & Humidity</h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Digital sensor (-40°C to +80°C, ±0.5°C accuracy). Detects temperature fluctuations indicating aerobic decomposition. 1-Wire protocol, sampled every 30 seconds.
                  </p>
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
                  <p className="text-sm text-slate-400 mb-3">
                    802.11 b/g/n connectivity at 2.4 GHz. MQTT protocol for real-time data streaming. Automatic reconnection with exponential backoff on connection loss.
                  </p>
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
                    Every 30 seconds, the ESP32 reads analog values from the moisture sensor via ADC and digital readings from the DHT22 sensor. Raw values are converted to meaningful measurements using calibration factors.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div className="w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent"></div>
                </div>
                <div className="pb-6">
                  <h4 className="font-display font-semibold text-white text-lg mb-2">Data Validation</h4>
                  <p className="text-slate-400 text-sm">
                    Firmware validates sensor readings against expected ranges and predefined thresholds. Alerts are triggered if values are out of range (e.g., moisture &lt; 50% or &gt; 85%).
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
                    Data is formatted in JSON and published to the MQTT broker over WiFi with topics including node ID, sensor type, and timestamp. Automatic reconnection handles connection drops.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">4</div>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-white text-lg mb-2">Cloud Ingestion & Real-Time Updates</h4>
                  <p className="text-slate-400 text-sm">
                    Backend receives MQTT data, stores readings in Firebase Firestore for historical analysis, and streams updates to the dashboard via WebSockets.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Power Distribution */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">Power Distribution & Pinout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4">Power Rails</h3>
              <div className="space-y-3 text-sm text-slate-400">
                <div>
                  <p className="font-semibold text-white mb-1">5V Input (USB)</p>
                  <p>Powers the ESP32 board and all connected sensors.</p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">3.3V Logic Rail</p>
                  <p>ESP32 onboard regulator output for sensor logic levels and GPIO signaling.</p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">GND (Ground)</p>
                  <p>Common reference point for all components. Short connections minimize noise.</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4">GPIO Pinout Reference</h3>
              <div className="space-y-2 text-xs font-mono bg-white/5 p-4 rounded border border-white/5">
                <div className="flex justify-between text-slate-300">
                  <span>GPIO 35 (ADC1_7)</span>
                  <span className="text-emerald-400">→ Moisture</span>
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
                    <span className="text-cyan-400">→ Ground</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Design Considerations */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">Design Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-emerald-400">Hardware Design</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Moisture sensor at mid-depth for representative readings</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>DHT22 in protective housing with proper ventilation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>ESP32 in weatherproof enclosure with antenna clearance</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-cyan-400">Signal & Reliability</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Twisted pair cables for analog lines to reduce EMI</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Watchdog timer monitors main loop for hangs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Local storage buffers readings when WiFi unavailable</span>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Launch Dashboard
            </button>
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                onNavigate('home');
              }}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/5 transition-all"
            >
              Return to Home
            </button>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-bg-space text-slate-500 text-sm lg:ml-64">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" onClick={() => {
            window.scrollTo(0, 0);
            onNavigate('home');
          }} />
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
