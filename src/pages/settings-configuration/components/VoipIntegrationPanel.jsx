import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const VoipIntegrationPanel = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'webex',
      name: 'Cisco Webex',
      status: 'connected',
      apiKey: '••••••••••••••••',
      lastSync: '2025-07-25T22:45:00Z',
      callsHandled: 1247,
      enabled: true
    },
    {
      id: 'zoom',
      name: 'Zoom Phone',
      status: 'disconnected',
      apiKey: '',
      lastSync: null,
      callsHandled: 0,
      enabled: false
    },
    {
      id: 'ringcentral',
      name: 'RingCentral',
      status: 'warning',
      apiKey: '••••••••••••••••',
      lastSync: '2025-07-25T20:15:00Z',
      callsHandled: 892,
      enabled: true
    },
    {
      id: 'twilio',
      name: 'Twilio Voice',
      status: 'connected',
      apiKey: '••••••••••••••••',
      lastSync: '2025-07-25T23:10:00Z',
      callsHandled: 2156,
      enabled: true
    }
  ]);

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [newApiKey, setNewApiKey] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'disconnected': return 'XCircle';
      default: return 'Circle';
    }
  };

  const handleToggleIntegration = (id) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, enabled: !integration.enabled }
        : integration
    ));
  };

  const handleConfigureApi = (integration) => {
    setSelectedIntegration(integration);
    setNewApiKey('');
    setShowApiKeyModal(true);
  };

  const handleSaveApiKey = () => {
    if (selectedIntegration && newApiKey.trim()) {
      setIntegrations(prev => prev.map(integration =>
        integration.id === selectedIntegration.id
          ? { 
              ...integration, 
              apiKey: '••••••••••••••••',
              status: 'connected',
              lastSync: new Date().toISOString()
            }
          : integration
      ));
      setShowApiKeyModal(false);
      setSelectedIntegration(null);
      setNewApiKey('');
    }
  };

  const handleTestConnection = (integration) => {
    console.log(`Testing connection for ${integration.name}`);
    // Mock connection test
    setIntegrations(prev => prev.map(int =>
      int.id === integration.id
        ? { ...int, status: 'connected', lastSync: new Date().toISOString() }
        : int
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">VoIP Platform Integrations</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure connections to supported VoIP platforms for seamless call handling
          </p>
        </div>
        <Button
          variant="outline"
          iconName="RefreshCw"
          iconPosition="left"
          onClick={() => window.location.reload()}
        >
          Refresh Status
        </Button>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name="Phone" size={24} className="text-muted-foreground" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">{integration.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Icon 
                      name={getStatusIcon(integration.status)} 
                      size={14} 
                      className={getStatusColor(integration.status)}
                    />
                    <span className={`text-sm font-medium ${getStatusColor(integration.status)}`}>
                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  label="Enabled"
                  checked={integration.enabled}
                  onChange={() => handleToggleIntegration(integration.id)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">API Status</div>
                <div className="text-sm font-medium text-foreground">
                  {integration.apiKey ? 'Configured' : 'Not Configured'}
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Last Sync</div>
                <div className="text-sm font-medium text-foreground">
                  {integration.lastSync 
                    ? new Date(integration.lastSync).toLocaleString()
                    : 'Never'
                  }
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Calls Handled</div>
                <div className="text-sm font-medium text-foreground">
                  {integration.callsHandled.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
                iconPosition="left"
                onClick={() => handleConfigureApi(integration)}
              >
                Configure API
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Zap"
                iconPosition="left"
                onClick={() => handleTestConnection(integration)}
                disabled={!integration.apiKey}
              >
                Test Connection
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="ExternalLink"
                iconPosition="left"
              >
                Documentation
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* API Key Configuration Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-modal bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg shadow-floating w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Configure {selectedIntegration?.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowApiKeyModal(false)}
              />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Input
                  label="API Key"
                  type="password"
                  placeholder="Enter your API key"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  description="Your API key will be encrypted and stored securely"
                />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Setup Instructions:</p>
                    <p>1. Log into your {selectedIntegration?.name} admin panel</p>
                    <p>2. Navigate to API settings or integrations</p>
                    <p>3. Generate a new API key with call management permissions</p>
                    <p>4. Copy and paste the key above</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowApiKeyModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSaveApiKey}
                disabled={!newApiKey.trim()}
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoipIntegrationPanel;