'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { supabase, Client, TimeEntry } from '@/lib/supabase';

type TimeEntryWithClient = TimeEntry & {
  client: Client;
};

export default function Dashboard() {
  const [entries, setEntries] = useState<TimeEntryWithClient[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [entriesRes, clientsRes] = await Promise.all([
      supabase
        .from('time_entries')
        .select('*, client:clients(*)')
        .order('date', { ascending: false }),
      supabase.from('clients').select('*').order('name'),
    ]);

    if (entriesRes.error) console.error('Error:', entriesRes.error);
    if (clientsRes.error) console.error('Error:', clientsRes.error);

    setEntries(entriesRes.data || []);
    setClients(clientsRes.data || []);
    setLoading(false);
  };

  const getHourlyRate = (entry: TimeEntryWithClient) => {
    return entry.client?.hourly_rate || 0;
  };

  // Gefilterte Einträge
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesClient = selectedClient === 'all' || entry.client?.id === selectedClient;
      const matchesMonth = entry.date.startsWith(selectedMonth);
      return matchesClient && matchesMonth;
    });
  }, [entries, selectedClient, selectedMonth]);

  // Berechnungen für aktuellen Monat
  const currentMonthStats = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthEntries = entries.filter((e) => e.date.startsWith(currentMonth));

    const totalHours = monthEntries.reduce((sum, e) => sum + e.hours, 0);
    const totalRevenue = monthEntries.reduce((sum, e) => sum + e.hours * getHourlyRate(e), 0);

    return { totalHours, totalRevenue };
  }, [entries]);

  // Stats pro Kunde für ausgewählten Monat
  const clientStats = useMemo(() => {
    const monthEntries = entries.filter((e) => e.date.startsWith(selectedMonth));

    const stats: Record<string, { name: string; hours: number; revenue: number }> = {};

    monthEntries.forEach((entry) => {
      const clientId = entry.client?.id;
      const clientName = entry.client?.name || 'Unbekannt';

      if (!stats[clientId]) {
        stats[clientId] = { name: clientName, hours: 0, revenue: 0 };
      }

      stats[clientId].hours += entry.hours;
      stats[clientId].revenue += entry.hours * getHourlyRate(entry);
    });

    return Object.values(stats).sort((a, b) => b.revenue - a.revenue);
  }, [entries, selectedMonth]);

  // Diese Woche (Montag bis Sonntag)
  const thisWeekStats = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sonntag, 1 = Montag, ...
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sonntag = 6 Tage zurück, sonst dayOfWeek - 1

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekEntries = entries.filter((e) => {
      const entryDate = new Date(e.date);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });
    const totalHours = weekEntries.reduce((sum, e) => sum + e.hours, 0);

    return { totalHours };
  }, [entries]);

  // Export-Funktion
  const handleCopyForExport = () => {
    const lines = filteredEntries.map((entry) => {
      const rate = getHourlyRate(entry);
      return `${new Date(entry.date).toLocaleDateString('de-DE')}\t${entry.client?.name}\t${entry.description || ''}\t${entry.hours}h\t${(entry.hours * rate).toFixed(2)}€`;
    });

    const header = 'Datum\tKunde\tBeschreibung\tStunden\tBetrag';
    const text = [header, ...lines].join('\n');

    navigator.clipboard.writeText(text);
    alert('In Zwischenablage kopiert! Du kannst es jetzt in Excel/Sheets einfügen.');
  };

  // Gefilterte Stats
  const filteredStats = useMemo(() => {
    const totalHours = filteredEntries.reduce((sum, e) => sum + e.hours, 0);
    const totalRevenue = filteredEntries.reduce((sum, e) => sum + e.hours * getHourlyRate(e), 0);
    return { totalHours, totalRevenue };
  }, [filteredEntries]);

  if (loading) return <div className="text-center py-8">Laden...</div>;

  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const currentMonthName = monthNames[new Date().getMonth()];
  const selectedMonthIndex = parseInt(selectedMonth.split('-')[1]) - 1;
  const selectedMonthName = monthNames[selectedMonthIndex] || '';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Übersichts-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Diese Woche</p>
          <p className="text-3xl font-bold text-gray-900">{thisWeekStats.totalHours.toFixed(1)}h</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Stunden {currentMonthName}</p>
          <p className="text-3xl font-bold text-gray-900">{currentMonthStats.totalHours.toFixed(1)}h</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Netto {currentMonthName}</p>
          <p className="text-3xl font-bold text-[#1e1b4b]">{currentMonthStats.totalRevenue.toFixed(0)} €</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Brutto {currentMonthName}</p>
          <p className="text-3xl font-bold text-[#1e1b4b]">{(currentMonthStats.totalRevenue * 1.19).toFixed(0)} €</p>
          <p className="text-xs text-gray-500">inkl. 19% USt</p>
        </div>
      </div>

      {/* Aufschlüsselung pro Kunde */}
      {clientStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aufschlüsselung {selectedMonthName}</h2>
          <div className="space-y-3">
            {clientStats.map((stat) => (
              <div key={stat.name} className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{stat.name}</span>
                <div className="text-right">
                  <span className="text-gray-500 mr-4">{stat.hours.toFixed(1)}h</span>
                  <span className="font-semibold text-gray-900">{stat.revenue.toFixed(0)} €</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Export */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Export</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monat</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kunde</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">Alle Kunden</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCopyForExport}
            disabled={filteredEntries.length === 0}
            className="bg-[#1e1b4b] text-white px-4 py-2 rounded-lg hover:bg-[#2d2a5e] disabled:bg-gray-400"
          >
            Kopieren für Export
          </button>
        </div>

        {filteredEntries.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>{filteredEntries.length}</strong> Einträge |
              <strong> {filteredStats.totalHours.toFixed(1)}</strong> Stunden |
              <strong> {filteredStats.totalRevenue.toFixed(2)} €</strong>
            </p>
          </div>
        )}
      </div>

      {/* Gefilterte Tabelle */}
      {filteredEntries.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kunde</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Beschreibung</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stunden</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Betrag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEntries.map((entry) => {
                const rate = getHourlyRate(entry);
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{entry.client?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{entry.description || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{entry.hours.toFixed(2)}h</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      {(entry.hours * rate).toFixed(2)} €
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {entries.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <div className="flex justify-center mb-6">
            <Image src="/illustration.png" alt="Illustration" width={200} height={200} className="opacity-80" />
          </div>
          <p className="mb-4">Noch keine Daten vorhanden.</p>
          <p className="text-sm">
            Starte, indem du unter <a href="/clients" className="text-[#1e1b4b] hover:underline font-medium">Kunden</a> deinen ersten Kunden anlegst.
          </p>
        </div>
      )}
    </div>
  );
}
