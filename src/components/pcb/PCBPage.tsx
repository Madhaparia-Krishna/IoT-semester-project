import React, { useState } from 'react';
import { Logo } from '../logo/Logo';
import { GlassCard } from '../ui/GlassCard';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Zap, Box } from 'lucide-react';
import pcb1 from '../../assets/pcb/3D_PCB-ESP32_1.png';
import pcb2 from '../../assets/pcb/3D_PCB-ESP32_2.png';
import pcb3 from '../../assets/pcb/3D_PCB-ESP32_3.png';
import pcb4 from '../../assets/pcb/3D_PCB-ESP32_4.png';

interface PCBPageProps {
  onNavigate: (page: 'home' | 'schematic') => void;
}

const PCB_IMAGES = [
  { id: 1, src: pcb1, title: 'Top View', description: 'Complete PCB layout showing component placement and circuit traces' },
  { id: 2, src: pcb2, title: 'Front 3D View', description: 'Front perspective of the fully assembled PCB' },
  { id: 3, src: pcb3, title: 'Side 3D View', description: 'Side angle showing component heights and spatial arrangement' },
  { id: 4, src: pcb4, title: 'Isometric View', description: 'Isometric perspective for comprehensive design visualization' },
];

export const PCBPage: React.FC<PCBPageProps> = ({ onNavigate }) => {
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
      setSelectedImageIndex((selectedImageIndex + 1) % PCB_IMAGES.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + PCB_IMAGES.length) % PCB_IMAGES.length);
    }
  };

  return (
    <div className="min-h-screen bg-bg-space font-sans relative overflow-hidden bg-mesh-green select-none">
      {/* Background visual glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[160px] rounded-full pointer-events-none" />

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold text-xs tracking-wider uppercase">
            <Box className="w-3.5 h-3.5" />
            3D PCB Design
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white text-glow-emerald">
            PCB Manufacturing & 3D Design
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl">
            Explore the physical PCB design from multiple angles. These 3D renderings showcase the complete board layout, component placement, and spatial arrangement of all hardware elements.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10 space-y-12">
        {/* PCB Overview Card */}
        <GlassCard className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-3">About This PCB Design</h2>
              <div className="space-y-3 text-sm text-slate-400">
                <p>
                  The VermIQ PCB is a custom-designed circuit board optimized for environmental monitoring in vermiculture applications. It integrates the ESP32 microcontroller with precision analog and digital sensors for comprehensive data collection.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                    <p className="text-xs font-semibold text-purple-400 mb-1">Board Size</p>
                    <p className="font-display text-white">Custom Fit</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                    <p className="text-xs font-semibold text-blue-400 mb-1">Layers</p>
                    <p className="font-display text-white">2-Layer PCB</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                    <p className="text-xs font-semibold text-cyan-400 mb-1">Manufacturing</p>
                    <p className="font-display text-white">Prototype Ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* PCB Gallery Title */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-6">3D Board Visualizations</h2>
          <p className="text-slate-400 mb-8">Click any image to view in fullscreen. Use arrows to navigate between views.</p>
        </div>

        {/* PCB Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PCB_IMAGES.map((pcb, index) => (
            <div
              key={pcb.id}
              onClick={() => openImageModal(index)}
              className="group cursor-pointer"
            >
              <GlassCard className="overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                <div className="relative bg-white/5 overflow-hidden rounded-lg aspect-video">
                  <img
                    src={pcb.src}
                    alt={pcb.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <p className="font-bold">Click to view fullscreen</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-display font-bold text-lg text-white mb-1">{pcb.title}</h3>
                  <p className="text-sm text-slate-400">{pcb.description}</p>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* PCB Manufacturing Details */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">PCB Manufacturing Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Electrical Specifications
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span><strong className="text-white">Operating Voltage:</strong> 5V DC (USB powered)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span><strong className="text-white">Logic Voltage:</strong> 3.3V (ESP32 native)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span><strong className="text-white">Current Draw:</strong> ~150-200mA typical</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span><strong className="text-white">Trace Width:</strong> 12-16 mil for signal, 24 mil for power</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span><strong className="text-white">Impedance Control:</strong> Controlled 50Ω traces for WiFi antenna</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-400" />
                Physical Specifications
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong className="text-white">PCB Material:</strong> FR-4 (standard PCB laminate)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong className="text-white">Copper Weight:</strong> 1 oz (35 micrometers)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong className="text-white">Solder Mask:</strong> Green (standard)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong className="text-white">Silkscreen:</strong> White, component labeling</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong className="text-white">Via Size:</strong> 0.3mm (12 mil) diameter</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* Assembly Information */}
        <GlassCard className="bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 border-cyan-500/20">
          <h3 className="font-display font-bold text-xl text-white mb-4">Assembly & Testing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Assembly Method</p>
              <p className="text-white font-display text-sm">
                Surface Mount Technology (SMT) for precision components, through-hole for connectors and large components
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">Quality Control</p>
              <p className="text-white font-display text-sm">
                Automated Optical Inspection (AOI), continuity testing, and functional verification before shipping
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Compliance</p>
              <p className="text-white font-display text-sm">
                RoHS compliant, lead-free soldering, ESD protective measures during assembly
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Design Considerations */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">Design Considerations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-emerald-400">Signal Integrity</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Ground plane for RF shielding and EMI reduction</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Separate analog and digital ground planes with single-point connection</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Decoupling capacitors close to each IC power pin</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Differential pair routing for I2C and SPI buses</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-purple-400">Thermal Management</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-purple-400">✓</span>
                  <span>Thermal vias under ESP32 for heat dissipation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">✓</span>
                  <span>Copper flood in non-signal areas for improved thermal conductivity</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">✓</span>
                  <span>Component spacing prevents thermal concentration</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">✓</span>
                  <span>Airflow considerations in enclosure design</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-cyan-400">Reliability</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Serpentine routing for analog sensor traces</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Ferrite beads on power supply inputs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Protection diodes on high-voltage sensor inputs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Test points for troubleshooting and debugging</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-rose-400">Cost Optimization</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-rose-400">✓</span>
                  <span>Standardized component footprints for availability</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">✓</span>
                  <span>Design for manufacturability (DFM) optimization</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">✓</span>
                  <span>Minimum trace spacing for cost-effective production</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">✓</span>
                  <span>Bulk component ordering for volume discounts</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* CTA Section */}
        <GlassCard className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20 text-center py-12">
          <h3 className="font-display text-2xl font-bold text-white mb-4">Ready to Order PCBs?</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Complete design documentation and manufacturing files are available. Contact us for ordering information, volume pricing, or custom modifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('schematic')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
            >
              View Schematic
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
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
              src={PCB_IMAGES[selectedImageIndex].src}
              alt={PCB_IMAGES[selectedImageIndex].title}
              className="w-full h-auto rounded-lg"
            />

            {/* Image Info */}
            <div className="mt-4 text-center">
              <h3 className="font-display text-xl font-bold text-white mb-1">
                {PCB_IMAGES[selectedImageIndex].title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {PCB_IMAGES[selectedImageIndex].description}
              </p>
              <p className="text-slate-500 text-xs">
                {selectedImageIndex + 1} of {PCB_IMAGES.length}
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

export default PCBPage;
