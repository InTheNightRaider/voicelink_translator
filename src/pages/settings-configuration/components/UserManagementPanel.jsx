import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserManagementPanel = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Jane Doe',
      email: 'jane.doe@lawfirm.com',
      role: 'admin',
      department: 'Administration',
      status: 'active',
      lastLogin: '2025-07-25T22:30:00Z',
      permissions: {
        callHandling: true,
        transcriptAccess: true,
        systemConfig: true,
        userManagement: true,
        reportAccess: true
      }
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@lawfirm.com',
      role: 'receptionist',
      department: 'Front Desk',
      status: 'active',
      lastLogin: '2025-07-25T23:15:00Z',
      permissions: {
        callHandling: true,
        transcriptAccess: true,
        systemConfig: false,
        userManagement: false,
        reportAccess: false
      }
    },
    {
      id: 3,
      name: 'Robert Chen',
      email: 'robert.chen@lawfirm.com',
      role: 'attorney',
      department: 'Legal',
      status: 'active',
      lastLogin: '2025-07-25T18:45:00Z',
      permissions: {
        callHandling: false,
        transcriptAccess: true,
        systemConfig: false,
        userManagement: false,
        reportAccess: true
      }
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@lawfirm.com',
      role: 'supervisor',
      department: 'Operations',
      status: 'inactive',
      lastLogin: '2025-07-23T16:20:00Z',
      permissions: {
        callHandling: true,
        transcriptAccess: true,
        systemConfig: true,
        userManagement: true,
        reportAccess: true
      }
    }
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    permissions: {
      callHandling: false,
      transcriptAccess: false,
      systemConfig: false,
      userManagement: false,
      reportAccess: false
    }
  });

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'attorney', label: 'Attorney' },
    { value: 'paralegal', label: 'Paralegal' }
  ];

  const departmentOptions = [
    { value: 'Administration', label: 'Administration' },
    { value: 'Front Desk', label: 'Front Desk' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Operations', label: 'Operations' },
    { value: 'IT', label: 'IT Support' }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-primary/10 text-primary';
      case 'supervisor': return 'bg-warning/10 text-warning';
      case 'attorney': return 'bg-accent/10 text-accent';
      case 'receptionist': return 'bg-secondary/10 text-secondary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ?'bg-success/10 text-success' :'bg-error/10 text-error';
  };

  const handleToggleUserStatus = (id) => {
    setUsers(prev => prev.map(user =>
      user.id === id
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleEditPermissions = (user) => {
    setSelectedUser(user);
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = () => {
    if (selectedUser) {
      setUsers(prev => prev.map(user =>
        user.id === selectedUser.id
          ? { ...user, permissions: selectedUser.permissions }
          : user
      ));
      setShowPermissionsModal(false);
      setSelectedUser(null);
    }
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role && newUser.department) {
      setUsers(prev => [...prev, {
        id: Date.now(),
        ...newUser,
        status: 'active',
        lastLogin: null
      }]);
      setNewUser({
        name: '',
        email: '',
        role: '',
        department: '',
        permissions: {
          callHandling: false,
          transcriptAccess: false,
          systemConfig: false,
          userManagement: false,
          reportAccess: false
        }
      });
      setShowAddUserModal(false);
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const permissionLabels = {
    callHandling: 'Call Handling',
    transcriptAccess: 'Transcript Access',
    systemConfig: 'System Configuration',
    userManagement: 'User Management',
    reportAccess: 'Report Access'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">User Management</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user accounts and role-based permissions
          </p>
        </div>
        <Button
          variant="default"
          iconName="UserPlus"
          iconPosition="left"
          onClick={() => setShowAddUserModal(true)}
        >
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Role</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Department</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Last Login</th>
                <th className="text-right p-4 text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-foreground">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-foreground">{user.department}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : 'Never'
                    }
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Shield"
                        onClick={() => handleEditPermissions(user)}
                        title="Edit Permissions"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName={user.status === 'active' ? 'UserX' : 'UserCheck'}
                        onClick={() => handleToggleUserStatus(user.id)}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-error hover:text-error"
                        title="Delete User"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-modal bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg shadow-floating w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Add New User</h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowAddUserModal(false)}
              />
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              />
              <Select
                label="Role"
                placeholder="Select role"
                options={roleOptions}
                value={newUser.role}
                onChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
              />
              <Select
                label="Department"
                placeholder="Select department"
                options={departmentOptions}
                value={newUser.department}
                onChange={(value) => setNewUser(prev => ({ ...prev, department: value }))}
              />
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowAddUserModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.email || !newUser.role || !newUser.department}
              >
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <div className="fixed inset-0 z-modal bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg shadow-floating w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Edit Permissions - {selectedUser.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowPermissionsModal(false)}
              />
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(permissionLabels).map(([key, label]) => (
                <Checkbox
                  key={key}
                  label={label}
                  checked={selectedUser.permissions[key]}
                  onChange={(e) => setSelectedUser(prev => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      [key]: e.target.checked
                    }
                  }))}
                />
              ))}
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowPermissionsModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSavePermissions}
              >
                Save Permissions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPanel;