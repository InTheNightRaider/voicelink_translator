import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Dashboard = () => {
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Simulate an incoming call after a short delay
    const timer = setTimeout(() => setIncomingCall(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartTranslation = () => {
    navigate('/active-call-interface');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Dropdown Menu */}
      <div className="fixed top-20 left-6 z-dropdown">
        <Button
          variant="outline"
          size="icon"
          iconName="Menu"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Open Menu"
        />
        {showMenu && (
          <div className="mt-2 w-40 bg-surface border border-border rounded-lg shadow-floating p-2 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              iconName="Clock"
              iconPosition="left"
              onClick={() => navigate('/call-history-transcripts')}
            >
              Call Logs
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              iconName="Settings"
              iconPosition="left"
              onClick={() => navigate('/settings-configuration')}
            >
              Settings
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-[calc(100vh-60px)] p-6 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Waiting for calls…</h1>
          <p className="text-muted-foreground">You will be notified when a caller is on the line.</p>
        </div>
      </div>

      {/* Incoming Call Notification */}
      {incomingCall && (
        <div className="fixed bottom-6 right-6 bg-surface border border-border rounded-lg shadow-floating p-4 flex items-center space-x-4 z-dropdown">
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={18} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Incoming Call</span>
          </div>
          <Button size="sm" onClick={handleStartTranslation}>Start Translation</Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
