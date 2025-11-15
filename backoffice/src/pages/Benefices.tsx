import React, { useEffect, useState } from 'react';
import { Card } from '../components/UI/Card';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchStatistics } from '../store/slices/statisticsSlice';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
//import { fr } from 'date-fns/locale';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

type StatisticsResponse = {
  reservationsParMois?: { mois: string; total: number }[];
  reservationsParStatut?: { statut: string; total: number }[];
  revenus?: number;
  totalReservations?: number;
  totalVoitures?: number;
};

export const Benefices: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: statistics, loading } = useAppSelector(
    (state) => state.statistics as { data: StatisticsResponse; loading: boolean }
  );

  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  const monthlyData = statistics?.reservationsParMois ?? [];

  useEffect(() => {
    dispatch(fetchStatistics({ startDate, endDate })).then((res) => {
      const payload = res.payload as StatisticsResponse;
      console.log("Réponse complète API:", payload);
      console.log("reservationsParMois:", payload.reservationsParMois);
    });
  }, [dispatch, startDate, endDate]);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    const now = new Date();
    switch (range) {
      case 'week':
        setStartDate(format(subDays(now, 7), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        break;
      case 'month':
        setStartDate(format(startOfMonth(now), 'yyyy-MM-dd'));
        setEndDate(format(endOfMonth(now), 'yyyy-MM-dd'));
        break;
      case '3months':
        setStartDate(format(subDays(now, 90), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        break;
      case 'year':
        setStartDate(format(new Date(now.getFullYear(), 0, 1), 'yyyy-MM-dd'));
        setEndDate(format(new Date(now.getFullYear(), 11, 31), 'yyyy-MM-dd'));
        break;
    }
  };

  const beneficeStats = [
    {
      name: 'Revenus totaux',
      value: `${statistics?.revenus || 0} Ar`,
      icon: DollarSign,
      change: '+15.3%',
      changeType: 'positive',
      color: 'bg-green-500',
    },
    {
      name: 'Réservations payées',
      value: statistics?.totalReservations || 0,
      icon: CreditCard,
      change: '+12.5%',
      changeType: 'positive',
      color: 'bg-blue-500',
    },
    {
      name: 'Revenus moyens/jour',
      value: `${Math.round((statistics?.revenus || 0) / 30)} Ar`,
      icon: TrendingUp,
      change: '+8.1%',
      changeType: 'positive',
      color: 'bg-purple-500',
    },
    {
      name: 'Réservations ce mois',
      value: statistics?.totalReservations || 0,
      icon: Calendar,
      change: '+23.2%',
      changeType: 'positive',
      color: 'bg-orange-500',
    },
  ];

  const totalReservations = monthlyData.reduce((sum, r) => sum + r.total, 0);

const chartData =
  monthlyData.length > 0
    ? monthlyData.map((item) => ({
        mois: item.mois,
        reservations: item.total,
        revenu:
          totalReservations > 0
            ? (item.total / totalReservations) * (statistics?.revenus ?? 0)
            : 0,
      }))
    : [];
    
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bénéfices</h1>
        <p className="text-gray-600 dark:text-gray-400">Analysez vos revenus et performances financières</p>
      </div>

      {/* Date Range Selector */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'week', label: '7 derniers jours' },
              { key: 'month', label: 'Ce mois' },
              { key: '3months', label: '3 derniers mois' },
              { key: 'year', label: 'Cette année' },
              { key: 'custom', label: 'Personnalisé' },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => handleDateRangeChange(option.key)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  dateRange === option.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {beneficeStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <div className={`flex items-center text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Évolution des revenus" className="col-span-1">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip
                formatter={(value: number) => `${Math.round(value).toLocaleString()} Ar`}
                />

                <Legend />
                <Bar dataKey="reservations" fill="#22c55e" name="Réservations" animationDuration={500} />
                <Line type="monotone" dataKey="revenu" stroke="#f97316" name="Revenu moyen" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
          )}
        </Card>

        {/* Répartition par statut */}
        <Card title="Répartition par statut" className="col-span-1">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {statistics?.reservationsParStatut?.map((item) => (
                <div key={item.statut} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      item.statut === 'CONFIRMEE' ? 'bg-green-500' :
                      item.statut === 'EN_ATTENTE' ? 'bg-yellow-500' :
                      item.statut === 'TERMINEE' ? 'bg-blue-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {item.statut.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Additional Insights */}
      <Card title="Analyses détaillées">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-300">
              Meilleur mois
            </h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {statistics?.reservationsParMois?.[0]?.mois || 'N/A'}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {statistics?.reservationsParMois?.[0]?.total || 0} réservations
            </p>
          </div>

          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
              Taux de confirmation
            </h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {statistics?.totalReservations ? 
                Math.round((statistics.reservationsParStatut?.find(r => r.statut === 'CONFIRMEE')?.total || 0) / statistics.totalReservations * 100) : 0}%
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              des réservations
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
              Revenue/véhicule
            </h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {statistics?.totalVoitures ? Math.round((statistics?.revenus || 0) / statistics.totalVoitures) : 0} Ar
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              en moyenne
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
