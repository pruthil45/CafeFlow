import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Store,
  Users,
  UserCheck,
  UsersRound,
  ShoppingBag,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Edit,
  UserPlus,
  Coffee,
  ChevronDown,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  DASHBOARD_KPI,
  CAFES,
  REVENUE_CHART_DATA,
  ORDERS_CHART_DATA,
  CUSTOMER_GROWTH_DATA,
  RECENT_ACTIVITIES,
  SYSTEM_ALERTS,
  formatINR,
  formatNumber,
} from '../../../data/adminMockData';

const KPI_CARDS = [
  { key: 'totalCafes', icon: Store, iconClass: 'brown' },
  { key: 'activeCafes', icon: Store, iconClass: 'green' },
  { key: 'totalOwners', icon: Users, iconClass: 'blue' },
  { key: 'totalStaff', icon: UsersRound, iconClass: 'purple' },
  { key: 'totalCustomers', icon: UserCheck, iconClass: 'orange' },
  { key: 'totalOrders', icon: ShoppingBag, iconClass: 'green' },
  { key: 'totalRevenue', icon: IndianRupee, iconClass: 'gold' },
  { key: 'avgOrderValue', icon: ShoppingCart, iconClass: 'teal' },
];

function formatKPIValue(key, value) {
  if (key === 'totalRevenue') return formatINR(value);
  if (key === 'avgOrderValue') return `₹${value}`;
  return formatNumber(value);
}

// Activity icon mapper
function ActivityIcon({ type }) {
  switch (type) {
    case 'cafe_created': return <Store size={16} />;
    case 'owner_created': return <UserPlus size={16} />;
    case 'cafe_activated': return <CheckCircle2 size={16} />;
    case 'staff_added': return <UsersRound size={16} />;
    case 'menu_updated': return <Edit size={16} />;
    case 'customer_registered': return <UserPlus size={16} />;
    default: return <Coffee size={16} />;
  }
}

// Alert icon mapper
function AlertIcon({ type }) {
  switch (type) {
    case 'error': return <AlertCircle size={16} />;
    case 'warning': return <AlertTriangle size={16} />;
    case 'info': return <Info size={16} />;
    case 'success': return <CheckCircle2 size={16} />;
    default: return <Info size={16} />;
  }
}

// Custom tooltip for revenue chart
function RevenueTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a0e0a',
        color: '#fff',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '0.78rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div>{formatINR(payload[0].value)}</div>
      </div>
    );
  }
  return null;
}

function OrdersTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a0e0a',
        color: '#fff',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '0.78rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
            {p.name}: {formatNumber(p.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function CustomerTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a0e0a',
        color: '#fff',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '0.78rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div>{formatNumber(payload[0].value)}</div>
      </div>
    );
  }
  return null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [revenueFilter] = useState('Last 30 Days');
  const [ordersFilter] = useState('Last 30 Days');
  const [customerFilter] = useState('Last 6 Months');

  // Get greeting based on time
  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  if (hour >= 17) greeting = 'Good Evening';

  return (
    <div className="admin-dashboard">
      {/* Greeting */}
      <div className="admin-greeting">
        <div className="admin-greeting__text">
          <h1>{greeting}, Admin 👋</h1>
          <p>Here's what's happening across your café platform today.</p>
        </div>
        <button
          className="admin-btn-primary"
          onClick={() => navigate('/admin/cafes/create')}
          id="create-cafe-btn"
        >
          <Plus size={18} />
          Create New Café
        </button>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        {KPI_CARDS.map(({ key, icon: Icon, iconClass }) => {
          const kpi = DASHBOARD_KPI[key];
          const isPositive = kpi.growth >= 0;
          return (
            <div className="admin-kpi-card" key={key}>
              <div className="admin-kpi-card__header">
                <div className={`admin-kpi-card__icon admin-kpi-card__icon--${iconClass}`}>
                  <Icon size={22} />
                </div>
                <button className="admin-kpi-card__more" aria-label="More options">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <div className="admin-kpi-card__label">{kpi.label}</div>
              <div className="admin-kpi-card__value">{formatKPIValue(key, kpi.value)}</div>
              <div className={`admin-kpi-card__growth ${isPositive ? 'admin-kpi-card__growth--positive' : 'admin-kpi-card__growth--negative'}`}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isPositive ? '↑' : '↓'} {Math.abs(kpi.growth)}%
                <span className="admin-kpi-card__growth-text">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="admin-charts-grid">
        {/* Revenue Overview */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div className="admin-chart-card__title">Revenue Overview</div>
            <button className="admin-chart-card__filter">
              {revenueFilter} <ChevronDown size={12} />
            </button>
          </div>
          <div className="admin-chart-card__value">₹32,45,280</div>
          <div className="admin-chart-card__change">
            <TrendingUp size={14} /> ↑ 28% from last month
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <AreaChart data={REVENUE_CHART_DATA}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e87a30" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#e87a30" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eeeb" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9a9088' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9a9088' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                <Tooltip content={<RevenueTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#e87a30" strokeWidth={2.5} fill="url(#revenueGradient)" dot={{ r: 3, fill: '#e87a30' }} activeDot={{ r: 5, fill: '#e87a30' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Overview */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div className="admin-chart-card__title">Orders Overview</div>
            <button className="admin-chart-card__filter">
              {ordersFilter} <ChevronDown size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
            <div>
              <div className="admin-chart-card__value">48,261</div>
              <div className="admin-chart-card__change">
                <TrendingUp size={14} /> ↑ 22% from last month
              </div>
            </div>
          </div>
          <div className="admin-chart-card__legend">
            <div className="admin-chart-card__legend-item">
              <span className="admin-chart-card__legend-dot" style={{ background: '#e87a30' }} />
              Dine-in
            </div>
            <div className="admin-chart-card__legend-item">
              <span className="admin-chart-card__legend-dot" style={{ background: '#d4a04a' }} />
              Takeaway
            </div>
            <div className="admin-chart-card__legend-item">
              <span className="admin-chart-card__legend-dot" style={{ background: '#8B5E3C' }} />
              Delivery
            </div>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={ORDERS_CHART_DATA} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eeeb" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9a9088' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9a9088' }} axisLine={false} tickLine={false} />
                <Tooltip content={<OrdersTooltip />} />
                <Bar dataKey="dineIn" name="Dine-in" fill="#e87a30" radius={[3, 3, 0, 0]} />
                <Bar dataKey="takeaway" name="Takeaway" fill="#d4a04a" radius={[3, 3, 0, 0]} />
                <Bar dataKey="delivery" name="Delivery" fill="#8B5E3C" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div className="admin-chart-card__title">Customer Growth</div>
            <button className="admin-chart-card__filter">
              {customerFilter} <ChevronDown size={12} />
            </button>
          </div>
          <div className="admin-chart-card__value">12,842</div>
          <div className="admin-chart-card__change">
            <TrendingUp size={14} /> ↑ 18% from last month
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <AreaChart data={CUSTOMER_GROWTH_DATA}>
                <defs>
                  <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a04a" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#d4a04a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eeeb" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9a9088' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9a9088' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomerTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#d4a04a" strokeWidth={2.5} fill="url(#customerGradient)" dot={{ r: 3, fill: '#d4a04a' }} activeDot={{ r: 5, fill: '#d4a04a' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className="admin-lower-grid">
        {/* Top Performing Cafés */}
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">Top Performing Cafés</span>
            <button className="admin-card__view-all" onClick={() => navigate('/admin/cafes')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="admin-table-container">
            <table className="admin-cafe-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Café Name</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {CAFES.map((cafe, i) => (
                  <tr key={cafe.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="admin-cafe-table__name-cell">
                        <div className="admin-cafe-table__logo" style={{ background: cafe.color }}>
                          {cafe.name.charAt(0)}
                        </div>
                        <span className="admin-cafe-table__name">{cafe.name}</span>
                      </div>
                    </td>
                    <td>{formatNumber(cafe.orders)}</td>
                    <td>{formatINR(cafe.revenue)}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${cafe.status}`}>
                        <span className="admin-badge__dot" />
                        {cafe.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="admin-table__action-btn" aria-label="More actions">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">Recent Activity</span>
            <button className="admin-card__view-all">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="admin-activity-list">
            {RECENT_ACTIVITIES.map((activity) => (
              <div className="admin-activity-item" key={activity.id}>
                <div
                  className="admin-activity-item__icon"
                  style={{ background: `${activity.color}15`, color: activity.color }}
                >
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="admin-activity-item__content">
                  <div className="admin-activity-item__desc">{activity.description}</div>
                  <div className="admin-activity-item__time">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">System Alerts</span>
            <button className="admin-card__view-all">
              View All <ArrowRight size={14} />
            </button>
          </div>
          {SYSTEM_ALERTS.map((alert) => (
            <div className="admin-alert" key={alert.id}>
              <div
                className="admin-alert__icon"
                style={{ background: `${alert.color}15`, color: alert.color }}
              >
                <AlertIcon type={alert.type} />
              </div>
              <div className="admin-alert__content">
                <div className="admin-alert__title">{alert.title}</div>
                <div className="admin-alert__desc">{alert.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
