import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import VoipIntegrationPanel from './components/VoipIntegrationPanel';
import TranslationSettingsPanel from './components/TranslationSettingsPanel';
import UserManagementPanel from './components/UserManagementPanel';
import AudioQualityPanel from './components/AudioQualityPanel';
import NotificationPanel from './components/NotificationPanel';
import SecurityPanel from './components/SecurityPanel';
import SystemHealthPanel from './components/SystemHealthPanel';

const SettingsConfiguration = () => {
  const [activeTab, setActiveTab] = useState('voip');

  const settingsTabs = [
    {
      id: 'voip',
      label: 'VoIP Integration',
      icon: 'Phone',
      description: 'Configure VoIP platform connections'
    },
    {
      id: 'translation',
      label: 'Translation',
      icon: 'Languages',
      description: 'Language and translation settings'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      description: 'Manage users and permissions'
    },
    {
      id: 'audio',
      label: 'Audio Quality',
      icon: 'Mic',
      description: 'Audio processing and quality settings'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      description: 'Alert and notification preferences'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      description: 'Security and compliance settings'
    },
    {
      id: 'system',
      label: 'System Health',
      icon: 'Activity',
      description: 'Monitor system performance'
    }
  ];

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'voip':
        return <VoipIntegrationPanel />;
      case 'translation':
        return <TranslationSettingsPanel />;
      case 'users':
        return <UserManagementPanel />;
      case 'audio':
        return <AudioQualityPanel />;
      case 'notifications':
        return <NotificationPanel />;
      case 'security':
        return <SecurityPanel />;
      case 'system':
        return <SystemHealthPanel />;
      default:
        return <VoipIntegrationPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex h-[calc(100vh-60px)]">
        {/* Settings Sidebar */}
        <div className="w-80 bg-surface border-r border-border flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Settings" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">System Configuration</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                  transition-professional focus-ring
                  ${activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon 
                  name={tab.icon} 
                  size={18} 
                  className={activeTab === tab.id ? 'text-primary-foreground' : 'text-muted-foreground'}
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${
                    activeTab === tab.id ? 'text-primary-foreground' : 'text-foreground'
                  }`}>
                    {tab.label}
                  </div>
                  <div className={`text-xs ${
                    activeTab === tab.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>

          {/* System Status Footer */}
          <div className="p-4 border-t border-border">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">System Status</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-gentle-pulse"></div>
                  <span className="text-xs text-success">Online</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Services:</span>
                  <span>6/7 Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span>99.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Header */}
          <div className="bg-surface border-b border-border px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {settingsTabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {settingsTabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Settings Panel Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {renderActivePanel()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Overlay */}
      <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-overlay hidden">
        <div className="bg-surface w-80 h-full shadow-floating">
          {/* Mobile sidebar content would go here */}
        </div>
      </div>
    </div>
  );
};

export default SettingsConfiguration;