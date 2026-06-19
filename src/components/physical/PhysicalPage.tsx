import React, { useState } from 'react';
import { Logo } from '../logo/Logo';
import { GlassCard } from '../ui/GlassCard';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Layers, Image } from 'lucide-react';
import phys1 from '../../assets/physical/Full_physical_lab_1.jpeg';
import phys2 from '../../assets/physical/Full_physical_lab_2.jpeg';
import phys3 from '../../assets/physical/Full_physical_lab_3.jpeg';
import oled from '../../assets/physical/OLED_display.jpeg';

interface PhysicalPageProps {
  onNavigate: (page: 'home' | 'schematic' | 'pcb' | 'wokwi') => void;
}

const PHYSICAL_IMAGES = [
  { id: 1, src: phys1, title: 'Lab Setup - Full View', description: 'Complete physical implementation of the VermIQ monitoring system in the laboratory environment' },
  { id: 2, src: phys2, title: 'Lab Setup - Angle View', description: 'Alternative angle showing sensor placement and device integration' },
  { id: 3, src: phys3, title: 'Lab Setup - Close Up', description: 'Detailed view of the vermiculture bin with integrated sensors' },
  { id: 4, src: oled, title: 'OLED Display Output', description: 'Real-time sensor readings displayed on the OLED screen' },
];

export const PhysicalPage: React.FC<PhysicalPageProps> = ({ onNavigate }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImageIndex !== null) {
        closeImageModal();
      }
      if (e.key === 'ArrowLeft' && selectedImageIndex !== null) {
        prevImage();
      }
      if (e.key === 'ArrowRight' && selectedImageIndex !== null) {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImageIndex]);

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % PHYSICAL_IMAGES.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + PHYSICAL_IMAGES.length) % PHYSICAL_IMAGES.length);
    }
  };

  return (
    <div className="min-h-screen bg-bg-space font-sans relative overflow-hidden bg-mesh-green select-none">
      {/* Background visual glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="border-b border-white/5 relative z-10 backdrop-blur-md bg-bg-space/40 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <Logo size="md" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
            <Layers className="w-3.5 h-3.5" />
            Physical Implementation
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white text-glow-emerald">
            Real-World VermIQ System Deployment
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl">
            Explore the complete physical implementation of the VermIQ monitoring system. These images showcase the actual laboratory setup, sensor integration, and real-time data display on the OLED interface.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10 space-y-12">
        {/* Physical Implementation Overview Card */}
        <GlassCard className="bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border-emerald-500/20">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-3">About This Implementation</h2>
              <div className="space-y-3 text-sm text-slate-400">
                <p>
                  The VermIQ physical system integrates hardware sensors, microcontrollers, and real-time data display into a practical vermiculture monitoring solution. The complete setup demonstrates how environmental parameters are continuously measured and displayed for optimal worm habitat management.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-400 mb-1">Setup Type</p>
                    <p className="font-display text-white">Laboratory Test Bed</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                    <p className="text-xs font-semibold text-cyan-400 mb-1">Deployment Status</p>
                    <p className="font-display text-white">Active & Operational</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                    <p className="text-xs font-semibold text-blue-400 mb-1">Monitoring Type</p>
                    <p className="font-display text-white">Real-time Continuous</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Physical Gallery Title */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-6">Implementation Gallery</h2>
          <p className="text-slate-400 mb-8">Click any image to view in fullscreen. Use arrows to navigate between views.</p>
        </div>

        {/* Physical Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PHYSICAL_IMAGES.map((image, index) => (
            <div
              key={image.id}
              onClick={() => openImageModal(index)}
              className="group cursor-pointer"
            >
              <GlassCard className="overflow-hidden hover:border-emerald-500/50 transition-all duration-300">
                <div className="relative bg-white/5 overflow-hidden rounded-lg aspect-video">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <p className="font-bold">Click to view fullscreen</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-display font-bold text-lg text-white mb-1">{image.title}</h3>
                  <p className="text-sm text-slate-400">{image.description}</p>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* System Components Overview */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">Integrated Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-emerald-400" />
                Sensors & Probes
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong className="text-white">Moisture Sensors:</strong> Analog capacitive probes for accurate soil moisture measurement</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong className="text-white">Temperature Sensors:</strong> DS18B20 digital temperature sensors for precise readings</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong className="text-white">Humidity Sensors:</strong> DHT22 sensors for ambient humidity monitoring</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong className="text-white">pH Sensors:</strong> Analog pH probes for compost acidity monitoring</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Display & Interface
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong className="text-white">OLED Display:</strong> 128x64 pixel monochrome display for local readouts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong className="text-white">Real-time Updates:</strong> Sensor data refreshes every 2 seconds on display</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong className="text-white">Status Indicators:</strong> WiFi, MQTT, and data sync status LEDs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong className="text-white">Alert System:</strong> Visual and audio alerts for threshold violations</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* Deployment Details */}
        <GlassCard className="bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 border-cyan-500/20">
          <h3 className="font-display font-bold text-xl text-white mb-4">Lab Deployment Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Vermiculture Setup</p>
              <p className="text-white font-display text-sm">
                Standard plastic bin (28L) with drainage holes, bedding material (coconut coir + peat), and 1kg of Eisenia fetida worms
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">Sensor Placement</p>
              <p className="text-white font-display text-sm">
                Probes positioned at depths of 5cm, 10cm, and 15cm for stratified environmental monitoring throughout the bin
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Data Collection Period</p>
              <p className="text-white font-display text-sm">
                Continuous monitoring with 5-minute interval data logging and real-time Firebase synchronization
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Operational Insights */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">Operational Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-emerald-400">Environmental Monitoring</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Continuous temperature logging (range: 15°C - 28°C optimal)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Moisture level tracking (range: 60% - 80% optimal)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Humidity monitoring for ambient conditions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>pH tracking for compost maturity assessment</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-purple-400">Connectivity & Syncing</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-purple-400">✓</span>
                  <span>WiFi connection for data transmission to cloud</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">✓</span>
                  <span>MQTT broker for reliable message queueing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">✓</span>
                  <span>Firebase Realtime Database for instant updates</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">✓</span>
                  <span>Offline capability with local storage fallback</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-cyan-400">Data Accuracy</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Calibrated sensors for precise measurements</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Multi-point averaging for noise reduction</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Automatic error detection and logging</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Timestamp validation for data integrity</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-rose-400">Maintenance & Reliability</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-rose-400">✓</span>
                  <span>Watchdog timer for automatic system recovery</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">✓</span>
                  <span>Regular sensor recalibration schedule</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">✓</span>
                  <span>Probe cleaning protocol to maintain accuracy</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">✓</span>
                  <span>Battery backup for critical functions</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* CTA Section */}
        <GlassCard className="bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border-emerald-500/20 text-center py-12">
          <h3 className="font-display text-2xl font-bold text-white mb-4">Explore More Implementation Details</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            View the circuit design, PCB layout, and Wokwi simulation to understand how all components work together in the complete VermIQ system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('schematic')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
            >
              View Schematic
            </button>
            <button
              onClick={() => onNavigate('pcb')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
            >
              View PCB Design
            </button>
            <button
              onClick={() => onNavigate('wokwi')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
            >
              View Simulation
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Return to Home
            </button>
          </div>
        </GlassCard>
      </section>

      {/* Fullscreen Image Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
          onKeyDown={(e) => e.key === 'Escape' && closeImageModal()}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Top Right, Always Visible */}
            <button
              onClick={closeImageModal}
              className="absolute -top-16 right-0 z-60 p-3 text-white hover:text-slate-200 hover:bg-white/10 rounded-lg transition-all duration-200"
              aria-label="Close image viewer"
              title="Press ESC to close"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image */}
            <img
              src={PHYSICAL_IMAGES[selectedImageIndex].src}
              alt={PHYSICAL_IMAGES[selectedImageIndex].title}
              className="w-full h-auto rounded-lg"
            />

            {/* Image Info */}
            <div className="mt-4 text-center">
              <h3 className="font-display text-xl font-bold text-white mb-1">
                {PHYSICAL_IMAGES[selectedImageIndex].title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {PHYSICAL_IMAGES[selectedImageIndex].description}
              </p>
              <p className="text-slate-500 text-xs">
                {selectedImageIndex + 1} of {PHYSICAL_IMAGES.length}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={prevImage}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-bg-space text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div>© {new Date().getFullYear()} VermIQ-Lite. Smart Agritech Environmental Systems.</div>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
            <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PhysicalPage;
