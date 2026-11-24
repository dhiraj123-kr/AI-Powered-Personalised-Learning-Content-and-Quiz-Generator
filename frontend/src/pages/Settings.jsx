import React, { useState } from 'react';
import { Bell, Globe, Moon, ShieldAlert, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  const handleSave = () => {
    toast.success('Preferences saved successfully!');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure your personal learning studio preferences.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" /> Notifications & Reminders
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Quiz Reminders</p>
                <p className="text-xs text-gray-500">Receive periodic study prompts for weak topics</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-800">Adaptive AI Tips</p>
                <p className="text-xs text-gray-500">Allow AI assistant to suggest remedial flashcards</p>
              </div>
              <input
                type="checkbox"
                checked={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" /> Language & Environment
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Default Content Language</label>
              <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          </div>
        </Card>

        <Button onClick={handleSave} size="md">
          Save Settings
        </Button>
      </div>
    </DashboardLayout>
  );
}
