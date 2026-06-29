import React, { useState } from 'react';
import { Logo } from '../logo/Logo';
import { GlassCard } from '../ui/GlassCard';
import { Sidebar } from '../ui/Sidebar';
import { ChevronLeft, ChevronRight, X, Layers, Image, ArrowRight } from 'lucide-react';
import phys1 from '../../assets/physical/Full_physical_lab_1.jpeg';
import phys2 from '../../assets/physical/Full_physical_lab_2.jpeg';
import phys3 from '../../assets/physical/Full_physical_lab_3.jpeg';
import oled from '../../assets/physical/OLED_display.jpeg';

interface PhysicalPageProps {
  onNavigate: (page: 'home' | 'schematic' | 'pcb' | 'wokwi' | 'physical' | 'dashboard') => void;
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

      <Sidebar
        currentPage="physical"
        onNavigate={onNavigate}
      />

      {/* Navbar */}
      <header className="border-b border-white/5 relative z-10 backdrop-blur-md bg-bg-space/40 sticky top-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" onClick={() => {
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
      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10 space-y-12 lg:ml-64">
        {/* Physical Implementation Overview Card */}
        <GlassCard className="bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border-emerald-500/20">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-3">About This Implementation</h2>
              <p className="text-sm text-slate-400 mb-4">
                Complete system integrating hardware sensors, microcontrollers, and real-time display for practical vermiculture monitoring. Demonstrates continuous environmental parameter measurement for optimal worm habitat management.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                  <p className="text-xs font-semibold text-emerald-400 mb-1">Setup Type</p>
                  <p className="font-display text-white">Laboratory Test Bed</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                  <p className="text-xs font-semibold text-cyan-400 mb-1">Status</p>
                  <p className="font-display text-white">Active & Operational</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                  <p className="text-xs font-semibold text-blue-400 mb-1">Monitoring</p>
                  <p className="font-display text-white">Real-time Continuous</p>
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
              <ul className="space-y-2 text-sm text-slate-400">
                <li><span className="text-white font-semibold">Moisture Sensors:</span> Analog capacitive probes</li>
                <li><span className="text-white font-semibold">Temperature:</span> DS18B20 digital sensors</li>
                <li><span className="text-white font-semibold">Humidity:</span> DHT22 sensors</li>
                <li><span className="text-white font-semibold">pH Probes:</span> Analog pH sensors</li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Display & Interface
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><span className="text-white font-semibold">OLED Display:</span> 128x64 pixel screen</li>
                <li><span className="text-white font-semibold">Updates:</span> Refreshes every 2 seconds</li>
                <li><span className="text-white font-semibold">Status:</span> WiFi, MQTT, sync LEDs</li>
                <li><span className="text-white font-semibold">Alerts:</span> Visual and audio notifications</li>
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
                28L plastic bin with drainage, bedding material, 1kg of Eisenia fetida worms
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">Sensor Placement</p>
              <p className="text-white font-display text-sm">
                Probes at 5cm, 10cm, 15cm depths for stratified monitoring
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Data Collection</p>
              <p className="text-white font-display text-sm">
                5-minute interval logging with real-time Firebase sync
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
                <li>Continuous temperature logging (15°C - 28°C optimal)</li>
                <li>Moisture level tracking (60% - 80% optimal)</li>
                <li>Humidity monitoring for ambient conditions</li>
                <li>pH tracking for compost maturity assessment</li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-purple-400">Connectivity & Syncing</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>WiFi connection for cloud data transmission</li>
                <li>MQTT broker for reliable message queueing</li>
                <li>Firebase Realtime Database for instant updates</li>
                <li>Offline capability with local storage fallback</li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-cyan-400">Data Accuracy</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Calibrated sensors for precise measurements</li>
                <li>Multi-point averaging for noise reduction</li>
                <li>Automatic error detection and logging</li>
                <li>Timestamp validation for data integrity</li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-rose-400">Maintenance & Reliability</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Watchdog timer for automatic recovery</li>
                <li>Regular sensor recalibration schedule</li>
                <li>Probe cleaning protocol to maintain accuracy</li>
                <li>Battery backup for critical functions</li>
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
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Launch Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('schematic')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
            >
              View Schematic
            </button>
            <button
              type="button"
              onClick={() => onNavigate('pcb')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
            >
              View PCB Design
            </button>
            <button
              type="button"
              onClick={() => onNavigate('wokwi')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
            >
              View Simulation
            </button>
            <button
              type="button"
              onClick={() => {
                window.scrollTo(0, 0);
                onNavigate('home');
              }}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
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
              type="button"
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
              className="w-full max-h-[75vh] object-contain rounded-lg"
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
                type="button"
                onClick={prevImage}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                aria-label="Previous image"
                title="Previous (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                aria-label="Next image"
                title="Next (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

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
            <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PhysicalPage;
