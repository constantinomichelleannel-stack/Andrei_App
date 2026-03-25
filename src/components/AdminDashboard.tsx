import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Activity, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Search,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  UserPlus,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchWithAuth } = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetchWithAuth('/api/admin/users'),
        fetchWithAuth('/api/admin/stats')
      ]);
      
      if (usersRes.ok && statsRes.ok) {
        const usersData = await usersRes.json();
        const statsData = await statsRes.json();
        setUsers(usersData);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateRole = async (uid: string, newRole: 'user' | 'admin') => {
    try {
      const res = await fetchWithAuth(`/api/admin/users/${uid}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Control Center</h1>
          <p className="text-slate-500 mt-1">Manage users, system health, and global analytics.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Activity size={18} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Total Users" 
          value={stats?.users || 0} 
          color="blue"
          trend="+12% this month"
        />
        <StatCard 
          icon={FileText} 
          label="Documents" 
          value={stats?.documents || 0} 
          color="emerald"
          trend="+5 new today"
        />
        <StatCard 
          icon={BookOpen} 
          label="Research Notes" 
          value={stats?.notes || 0} 
          color="amber"
          trend="+24 this week"
        />
        <StatCard 
          icon={TrendingUp} 
          label="System Health" 
          value="99.9%" 
          color="indigo"
          trend="All systems operational"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <Shield size={20} className="text-indigo-600" /> User Management
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {user.display_name?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.display_name || 'Anonymous'}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' 
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                          : 'bg-slate-50 text-slate-600 border border-slate-100'
                      }`}>
                        {user.role === 'admin' ? <ShieldCheck size={10} /> : <Users size={10} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} /> {new Date(user.last_login).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleUpdateRole(user.uid, user.role === 'admin' ? 'user' : 'admin')}
                          className={`p-2 rounded-lg transition-all ${
                            user.role === 'admin' 
                              ? 'text-amber-600 hover:bg-amber-50' 
                              : 'text-indigo-600 hover:bg-indigo-50'
                          }`}
                          title={user.role === 'admin' ? "Revoke Admin" : "Make Admin"}
                        >
                          {user.role === 'admin' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity size={20} className="text-indigo-600" /> Recent Logins
            </h2>
            <div className="space-y-4">
              {stats?.recentUsers?.map((user: any) => (
                <div key={user.uid} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {user.display_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{user.display_name || 'Anonymous'}</p>
                      <p className="text-[10px] text-slate-400">{new Date(user.last_login).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
            <h3 className="font-serif font-bold text-xl mb-2">System Status</h3>
            <p className="text-indigo-100 text-sm mb-6">All core services are performing within optimal parameters.</p>
            <div className="space-y-3">
              <StatusItem label="API Gateway" status="operational" />
              <StatusItem label="Database" status="operational" />
              <StatusItem label="AI Inference" status="operational" />
              <StatusItem label="File Storage" status="operational" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, trend }: any) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
    >
      <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-serif font-bold text-slate-900">{value}</h3>
      <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
        <TrendingUp size={10} className="text-emerald-500" /> {trend}
      </p>
    </motion.div>
  );
};

const StatusItem = ({ label, status }: any) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-indigo-100">{label}</span>
    <span className="flex items-center gap-1.5 font-bold">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      {status}
    </span>
  </div>
);
