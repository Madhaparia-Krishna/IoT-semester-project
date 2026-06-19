import React, { useState } from 'react';
import { Logo } from '../logo/Logo';
import { GlassCard } from '../ui/GlassCard';
import { Sidebar } from '../ui/Sidebar';
import { ChevronLeft, ChevronRight, X, Zap, Cpu } from 'lucide-react';
import vscodeImage from '../../assets/wokwi/wowki-simulation-vscode.png';
import enlargedImage from '../../assets/wokwi/enlarged-wowki-simulation.png';

interface WokwiPageProps {
  onNavigate: (page: 'home' | 'schematic' | 'pcb' | 'wokwi' | 'physical' | 'dashboard') => void;
}

const WOKWI_IMAGES = [
  { 
    id: 1, 
    src: vscodeImage, 
    title: 'VSCode Integration', 
    description: 'Wokwi circuit simulation running in VSCode editor environment with real-time monitoring' 
  },
  { 
    id: 2, 
    src: enlargedImage, 
    title: 'Enlarged Simulation View', 
    description: 'Detailed circuit simulation showing individual components and their connections' 
  },
];

export const WokwiPage: React.FC<WokwiPageProps> = ({ onNavigate }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % WOKWI_IMAGES.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + WOKWI_IMAGES.length) % WOKWI_IMAGES.length);
    }
  };

  // Handle keyboard navigation
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

  return (
    <div className="min-h-screen bg-bg-space font-sans relative overflow-hidden bg-mesh-green select-none">
      {/* Background visual glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none" />

      <Sidebar
        currentPage="wokwi"
        onNavigate={onNavigate}
      />

      {/* Navbar */}
      <header className="border-b border-white/5 relative z-10 backdrop-blur-md bg-bg-space/40 sticky top-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8 relative z-10 lg:ml-64">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-xs tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5" />
            Wokwi Simulation
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white text-glow-emerald">
            Circuit Simulation & Testing Environment
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl">
            Explore the Wokwi circuit simulation environment where the ESP32 IoT system is prototyped and tested. This virtual environment allows for safe experimentation and validation of hardware configurations before physical deployment.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10 space-y-12 lg:ml-64">
        {/* Simulation Overview */}
        <GlassCard className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-3">About Wokwi Simulation</h2>
              <div className="space-y-3 text-sm text-slate-400">
                <p>
                  Wokwi is an online simulator for Arduino and ESP32 projects that allows developers to test circuit designs and firmware without physical hardware. Our VermIQ system was prototyped and validated using Wokwi before physical implementation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                    <p className="text-xs font-semibold text-blue-400 mb-1">Virtual Testing</p>
                    <p className="font-display text-white text-sm">
                      Safe environment for circuit design validation
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                    <p className="text-xs font-semibold text-cyan-400 mb-1">Rapid Prototyping</p>
                    <p className="font-display text-white text-sm">
                      Quick iteration cycles without component costs
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-400 mb-1">Real-time Monitoring</p>
                    <p className="font-display text-white text-sm">
                      Live visualization of sensor data and signals
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                    <p className="text-xs font-semibold text-purple-400 mb-1">VSCode Integration</p>
                    <p className="font-display text-white text-sm">
                      Seamless development within VS Code editor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Simulation Gallery Title */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-6">Simulation Screenshots</h2>
          <p className="text-slate-400 mb-8">Click any image to view in fullscreen. Use arrows or keyboard navigation to explore.</p>
        </div>

        {/* Wokwi Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WOKWI_IMAGES.map((image, index) => (
            <div
              key={image.id}
              onClick={() => openImageModal(index)}
              className="group cursor-pointer"
            >
              <GlassCard className="overflow-hidden hover:border-blue-500/50 transition-all duration-300">
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

        {/* Key Components Tested */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">Components Tested in Simulation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-blue-400">ESP32 Microcontroller</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>GPIO configuration and control</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>ADC analog input reading</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>WiFi connectivity simulation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>Serial communication testing</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-cyan-400">Sensor Integration</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Moisture sensor signal processing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>DHT22 temperature/humidity reading</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>I2C protocol communication</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Sensor data validation</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-lg text-white mb-4 text-emerald-400">Software Validation</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Firmware logic testing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Data collection cycles</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Error handling verification</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Performance profiling</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* Simulation Benefits */}
        <GlassCard className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
          <h3 className="font-display text-2xl font-bold text-white mb-6">Benefits of Virtual Prototyping</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-display font-bold text-white mb-3 text-blue-400">Development Advantages</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Faster iteration cycles without hardware constraints</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>No risk of component damage during development</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Easy modification and testing of circuit variations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Reduced prototyping costs and component expenses</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-white mb-3 text-cyan-400">Validation Benefits</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Verify firmware logic before deployment</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Test edge cases and error conditions safely</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Validate sensor integration and data accuracy</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Benchmark performance under various conditions</span>
                </li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* CTA Section */}
        <GlassCard className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20 text-center py-12">
          <h3 className="font-display text-2xl font-bold text-white mb-4">Ready to Explore More?</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Check out the hardware schematic and PCB design, or return to the home page to explore other documentation sections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('schematic')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
            >
              View Schematic
            </button>
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                onNavigate('home');
              }}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
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
            {/* Close Button */}
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
              src={WOKWI_IMAGES[selectedImageIndex].src}
              alt={WOKWI_IMAGES[selectedImageIndex].title}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />

            {/* Image Info */}
            <div className="mt-4 text-center">
              <h3 className="font-display text-xl font-bold text-white mb-1">
                {WOKWI_IMAGES[selectedImageIndex].title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {WOKWI_IMAGES[selectedImageIndex].description}
              </p>
              <p className="text-slate-500 text-xs">
                {selectedImageIndex + 1} of {WOKWI_IMAGES.length}
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
      <footer className="border-t border-white/5 py-12 relative z-10 bg-bg-space text-slate-500 text-sm lg:ml-64">
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

export default WokwiPage;
