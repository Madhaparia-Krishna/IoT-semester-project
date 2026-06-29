import React from 'react';
import { Logo } from '../logo/Logo';
import {
  Zap,
  Box,
  Cpu,
  Layers,
  LayoutDashboard,
  Home,
  LogOut,
  Menu,
  X,
  Images,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import schematicImg from '../../assets/schematic.svg';
import pcb1 from '../../assets/pcb/3D_PCB-ESP32_1.png';
import pcb2 from '../../assets/pcb/3D_PCB-ESP32_2.png';
import pcb3 from '../../assets/pcb/3D_PCB-ESP32_3.png';
import pcb4 from '../../assets/pcb/3D_PCB-ESP32_4.png';
import wokwi1 from '../../assets/wokwi/wowki-simulation-vscode.png';
import wokwi2 from '../../assets/wokwi/enlarged-wowki-simulation.png';
import phys1 from '../../assets/physical/Full_physical_lab_1.jpeg';
import phys2 from '../../assets/physical/Full_physical_lab_2.jpeg';
import phys3 from '../../assets/physical/Full_physical_lab_3.jpeg';
import oled from '../../assets/physical/OLED_display.jpeg';
// Dashboard & UI Screenshots
import dashboardHome from '../../assets/Dashboard_Homepage.png';
import dashboardAnalytics from '../../assets/Dashboard_analytics.png';
import dashboardPH from '../../assets/Dashboard_pH_Data_ESP32_Nodes_1.png';
import dashboardSettings from '../../assets/Dashboard_Settings_Historical_DB_data.png';
// Sensor Data Screenshots
import sensorReading1 from '../../assets/all_sensor_reading_1.png';
import sensorReading2 from '../../assets/all_sensor_reading_2.png';
import sensorReading3 from '../../assets/all_sensor_reading_3.png';
import moistureData1 from '../../assets/Screenshot_Moisture_Data_1.png';
import moistureData2 from '../../assets/Screenshot_Moisture_Data_2.png';
import phData from '../../assets/Screenshot_pH_Data_07.png';
import phDataError from '../../assets/Screenshot_pH_Data_and_error.png';
// Error & System Screenshots
import error1 from '../../assets/Error_data_recorded_01.png';
import error2 from '../../assets/Error_data_recorded_02.png';
import oledReset from '../../assets/Screenshot_OLED_Reset.png';
import mqtt from '../../assets/MQTT response.jpeg';
// Firebase Screenshots
import firebase1 from '../../assets/Firebase_FireStore_DB_Data.png';
import firebase2 from '../../assets/Firebase_Realtime_Database_with_historical_DB_data.png';
// Login
import login from '../../assets/VermIQ_Login_Page_18.png';

interface SidebarProps {
  currentPage: 'home' | 'schematic' | 'pcb' | 'wokwi' | 'physical' | 'dashboard';
  onNavigate: (page: 'home' | 'schematic' | 'pcb' | 'wokwi' | 'physical' | 'dashboard') => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: 'schematic' | 'pcb' | 'wokwi' | 'physical' | 'dashboard' | 'sensor-data' | 'system' | 'database' | 'ui';
}

const GALLERY_IMAGES: GalleryImage[] = [
  // Schematic
  { id: 'schematic-1', src: schematicImg, title: 'Circuit Schematic', category: 'schematic' },
  // PCB
  { id: 'pcb-1', src: pcb1, title: 'PCB Top View', category: 'pcb' },
  { id: 'pcb-2', src: pcb2, title: 'PCB Front 3D', category: 'pcb' },
  { id: 'pcb-3', src: pcb3, title: 'PCB Side 3D', category: 'pcb' },
  { id: 'pcb-4', src: pcb4, title: 'PCB Isometric', category: 'pcb' },
  // Wokwi
  { id: 'wokwi-1', src: wokwi1, title: 'Wokwi VSCode', category: 'wokwi' },
  { id: 'wokwi-2', src: wokwi2, title: 'Wokwi Enlarged', category: 'wokwi' },
  // Physical
  { id: 'phys-1', src: phys1, title: 'Lab Setup Full', category: 'physical' },
  { id: 'phys-2', src: phys2, title: 'Lab Setup Angle', category: 'physical' },
  { id: 'phys-3', src: phys3, title: 'Lab Setup Close', category: 'physical' },
  { id: 'phys-4', src: oled, title: 'OLED Display', category: 'physical' },
  // Dashboard Screenshots
  { id: 'dashboard-1', src: dashboardHome, title: 'Dashboard Homepage', category: 'dashboard' },
  { id: 'dashboard-2', src: dashboardAnalytics, title: 'Dashboard Analytics', category: 'dashboard' },
  { id: 'dashboard-3', src: dashboardPH, title: 'Dashboard pH Data', category: 'dashboard' },
  { id: 'dashboard-4', src: dashboardSettings, title: 'Dashboard Settings & Historical Data', category: 'dashboard' },
  // Sensor Data
  { id: 'sensor-1', src: sensorReading1, title: 'All Sensor Reading 1', category: 'sensor-data' },
  { id: 'sensor-2', src: sensorReading2, title: 'All Sensor Reading 2', category: 'sensor-data' },
  { id: 'sensor-3', src: sensorReading3, title: 'All Sensor Reading 3', category: 'sensor-data' },
  { id: 'moisture-1', src: moistureData1, title: 'Moisture Data 1', category: 'sensor-data' },
  { id: 'moisture-2', src: moistureData2, title: 'Moisture Data 2', category: 'sensor-data' },
  { id: 'ph-data', src: phData, title: 'pH Data 07', category: 'sensor-data' },
  { id: 'ph-error', src: phDataError, title: 'pH Data with Error', category: 'sensor-data' },
  // Error & System
  { id: 'error-1', src: error1, title: 'Error Data Recorded 01', category: 'system' },
  { id: 'error-2', src: error2, title: 'Error Data Recorded 02', category: 'system' },
  { id: 'oled-reset', src: oledReset, title: 'OLED Reset', category: 'system' },
  { id: 'mqtt', src: mqtt, title: 'MQTT Response', category: 'system' },
  // Firebase
  { id: 'firebase-1', src: firebase1, title: 'Firebase FireStore DB Data', category: 'database' },
  { id: 'firebase-2', src: firebase2, title: 'Firebase Realtime Database with Historical Data', category: 'database' },
  // Login
  { id: 'login', src: login, title: 'VermIQ Login Page', category: 'ui' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isAuthenticated = false,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [galleryOpen, setGalleryOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
    { id: 'schematic', label: 'Schematic', icon: Zap },
    { id: 'pcb', label: 'PCB Design', icon: Box },
    { id: 'wokwi', label: 'Simulation', icon: Cpu },
    { id: 'physical', label: 'Physical', icon: Layers },
  ];

  const handleNavClick = (page: string) => {
    if (page === 'home') {
      window.scrollTo(0, 0);
    }
    onNavigate(page as 'home' | 'schematic' | 'pcb' | 'wokwi' | 'physical' | 'dashboard');
    setIsOpen(false);
  };

  const visibleItems = navItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  );

  const handleNextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % GALLERY_IMAGES.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
  };

  const handleGalleryClick = () => {
    setGalleryOpen(true);
    setSelectedImageIndex(null);
    setIsOpen(false);
  };

  const openImageFullscreen = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeFullscreen = () => {
    setSelectedImageIndex(null);
  };

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        if (e.key === 'Escape') {
          closeFullscreen();
          return;
        }
        if (e.key === 'ArrowLeft') {
          handlePrevImage();
          return;
        }
        if (e.key === 'ArrowRight') {
          handleNextImage();
          return;
        }
      }
      
      if (galleryOpen && e.key === 'Escape') {
        setGalleryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [galleryOpen, selectedImageIndex]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar Backdrop (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-bg-space to-[#0a0c12] border-r border-white/10 backdrop-blur-md z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5 sticky top-0 bg-gradient-to-b from-bg-space to-[#0a0c12]">
          <Logo size="md" onClick={() => {
            window.scrollTo(0, 0);
            onNavigate('home');
            setIsOpen(false);
          }} />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left font-medium ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}

          {/* Gallery Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={handleGalleryClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <Images className="w-5 h-5 flex-shrink-0" />
              <span>Gallery</span>
              <ChevronDown className="ml-auto w-4 h-4" />
            </button>
          </div>
        </nav>

        {/* Footer - Logout Button */}
        {isAuthenticated && onLogout && (
          <div className="border-t border-white/5 p-4 sticky bottom-0 bg-gradient-to-t from-bg-space to-[#0a0c12]">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 font-medium border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Full-Page Gallery Grid */}
      {galleryOpen && selectedImageIndex === null && (
        <div className="fixed inset-0 bg-bg-space z-50 flex flex-col">
          {/* Header */}
          <div className="h-20 border-b border-white/10 flex items-center justify-between px-6 bg-gradient-to-r from-bg-space via-bg-space to-[#0a0c12] sticky top-0 z-10">
            <h2 className="text-white font-display font-bold text-2xl">Gallery</h2>
            <button
              onClick={() => {
                setGalleryOpen(false);
              }}
              className="text-white hover:text-slate-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Gallery Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {GALLERY_IMAGES.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openImageFullscreen(index)}
                  className="group relative overflow-hidden rounded-lg aspect-video bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer"
                  title={image.title}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-end p-4">
                    <p className="text-sm font-semibold text-white text-center">{image.title}</p>
                    <p className="text-xs text-slate-300 capitalize mt-1">{image.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image View */}
      {galleryOpen && selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
          onClick={() => closeFullscreen()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-display font-bold text-xl">Gallery</h2>
              <span className="text-slate-400 text-sm">
                {selectedImageIndex + 1} / {GALLERY_IMAGES.length}
              </span>
            </div>
            <button
              onClick={() => {
                closeFullscreen();
              }}
              className="text-white hover:text-slate-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Image Container */}
          <div
            className="w-full h-full flex items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY_IMAGES[selectedImageIndex].src}
              alt={GALLERY_IMAGES[selectedImageIndex].title}
              className="max-w-4xl max-h-[75vh] object-contain"
            />
          </div>

          {/* Image Info */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent flex flex-col items-center justify-end pb-6">
            <h3 className="text-white font-semibold text-lg mb-1">{GALLERY_IMAGES[selectedImageIndex].title}</h3>
            <p className="text-slate-400 text-sm capitalize">{GALLERY_IMAGES[selectedImageIndex].category}</p>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Keyboard hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-xs text-center">
            <p>Use arrow keys to navigate • Press ESC to close</p>
          </div>
        </div>
      )}

      {/* Main Content Shift */}
      <div className="lg:ml-64" />
    </>
  );
};

export default Sidebar;
