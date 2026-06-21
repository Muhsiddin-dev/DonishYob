'use client';

import {
  BookOpenIcon,
  UsersIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStatistics } from '@/hooks/useAdmin';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useStatistics();

  const statCards = [
    {
      name: 'Всего книг',
      value: stats?.totalBooks || 0,
      icon: BookOpenIcon,
      color: 'bg-primary-100 text-primary-600',
    },
    {
      name: 'Всего пользователей',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      color: 'bg-secondary-100 text-secondary-600',
    },
    {
      name: 'Всего скачиваний',
      value: stats?.totalDownloads || 0,
      icon: ArrowDownTrayIcon,
      color: 'bg-accent-100 text-accent-600',
    },
    {
      name: 'Активных пользователей',
      value: stats?.activeUsers || 0,
      icon: UserGroupIcon,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Статистика</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-full mb-4"  />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{stat.name}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Books */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Топ книги по скачиваниям</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : stats?.topBooks && stats.topBooks.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.topBooks}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="downloadCount" fill="#3B82F6" name="Скачивания" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Нет данных</p>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Книги по категориям</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Skeleton className="h-64 w-64" />
              </div>
            ) : stats?.categoryStats && stats.categoryStats.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoryName, bookCount }) =>
                        `${categoryName}: ${bookCount}`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="bookCount"
                    >
                      {stats.categoryStats.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Нет данных</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
