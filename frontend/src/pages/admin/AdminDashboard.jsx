import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Layers, Award, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';
import { adminAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await adminAPI.getStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Fetching administrative statistics..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Administrator Console</h1>
        <p className="text-xs text-gray-500 mt-1">Platform overview, user activity, and curriculum management.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          color="purple"
          subtext="Active accounts"
        />
        <StatCard
          title="Curriculum Subjects"
          value={stats?.totalSubjects || 0}
          icon={BookOpen}
          color="blue"
          subtext={`${stats?.totalTopics || 0} total topics`}
        />
        <StatCard
          title="Quiz Attempts"
          value={stats?.totalQuizAttempts || 0}
          icon={Award}
          color="emerald"
          subtext={`${stats?.avgPlatformScore || 0}% platform avg`}
        />
        <StatCard
          title="AI Notes Generated"
          value={stats?.totalNotesGenerated || 0}
          icon={Sparkles}
          color="amber"
          subtext="Saved study files"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-base font-bold text-gray-900 mb-2">Student Management</h3>
          <p className="text-xs text-gray-500 mb-4">View enrolled students, inspect quiz activity, and manage access.</p>
          <Link to="/admin/students">
            <Button size="sm">Manage Students</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-bold text-gray-900 mb-2">Curriculum & Topics</h3>
          <p className="text-xs text-gray-500 mb-4">Add new academic courses, chapters, and topics for AI synthesis.</p>
          <Link to="/admin/subjects">
            <Button size="sm" variant="secondary">Manage Subjects & Topics</Button>
          </Link>
        </Card>
      </div>

      {/* Recent Students Table */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Recent Student Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Learning Level</th>
                <th className="pb-3 font-semibold">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentUsers?.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50">
                  <td className="py-3 font-bold text-gray-900">{u.name}</td>
                  <td className="py-3 text-gray-600">{u.email}</td>
                  <td className="py-3">
                    <span className="capitalize px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold text-[10px]">
                      {u.learningLevel}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
