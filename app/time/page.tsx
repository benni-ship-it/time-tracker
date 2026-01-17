'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase, Client, TimeEntry } from '@/lib/supabase';

type TimeEntryWithClient = TimeEntry & {
  client: Client;
};

export default function TimePage() {
  const [entries, setEntries] = useState<TimeEntryWithClient[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [formData, setFormData] = useState({
    client_id: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [entriesRes, clientsRes] = await Promise.all([
      supabase
        .from('time_entries')
        .select('*, client:clients(*)')
        .order('date', { ascending: false }),
      supabase
        .from('clients')
        .select('*')
        .order('name'),
    ]);

    if (entriesRes.error) console.error('Error fetching entries:', entriesRes.error);
    if (clientsRes.error) console.error('Error fetching clients:', clientsRes.error);

    setEntries(entriesRes.data || []);
    setClients(clientsRes.data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entryData = {
      client_id: formData.client_id,
      date: formData.date,
      hours: parseFloat(formData.hours),
      description: formData.description || null,
    };

    if (editingEntry) {
      const { error } = await supabase
        .from('time_entries')
        .update(entryData)
        .eq('id', editingEntry.id);
      if (error) console.error('Error updating entry:', error);
    } else {
      const { error } = await supabase
        .from('time_entries')
        .insert([entryData]);
      if (error) console.error('Error creating entry:', error);
    }

    setFormData({
      client_id: formData.client_id,
      date: formData.date,
      hours: '',
      description: '',
    });
    setShowForm(false);
    setEditingEntry(null);
    fetchData();
  };

  const handleEdit = (entry: TimeEntryWithClient) => {
    setEditingEntry(entry);
    setFormData({
      client_id: entry.client_id,
      date: entry.date,
      hours: entry.hours.toString(),
      description: entry.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Zeiteintrag wirklich löschen?')) return;
    const { error } = await supabase.from('time_entries').delete().eq('id', id);
    if (error) console.error('Error deleting entry:', error);
    else fetchData();
  };

  const getHourlyRate = (entry: TimeEntryWithClient) => {
    return entry.client?.hourly_rate || 0;
  };

  const filteredEntries = useMemo(() => {
    if (!selectedMonth) return entries;
    return entries.filter((entry) => entry.date.startsWith(selectedMonth));
  }, [entries, selectedMonth]);

  if (loading) return <div className="text-center py-8">Laden...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Zeiterfassung</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingEntry(null);
            setFormData({
              client_id: clients[0]?.id || '',
              date: new Date().toISOString().split('T')[0],
              hours: '',
              description: '',
            });
          }}
          disabled={clients.length === 0}
          className="bg-[#1e1b4b] text-white px-4 py-2 rounded-lg hover:bg-[#2d2a5e] disabled:bg-gray-400"
        >
          + Zeit erfassen
        </button>
      </div>

      {clients.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-yellow-800">
          Erstelle zuerst einen Kunden, bevor du Zeiten erfassen kannst.
        </div>
      )}

      {/* Monatsfilter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Monat:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <span className="text-sm text-gray-500">
            {filteredEntries.length} Einträge
          </span>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingEntry ? 'Eintrag bearbeiten' : 'Zeit erfassen'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kunde</label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e1b4b]"
                  required
                >
                  <option value="">Kunde wählen...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.hourly_rate}€/h)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e1b4b]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stunden</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e1b4b]"
                placeholder="z.B. 2.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e1b4b]"
                rows={2}
                placeholder="Was hast du gemacht?"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-[#1e1b4b] text-white px-4 py-2 rounded-lg hover:bg-[#2d2a5e]">
                {editingEntry ? 'Speichern' : 'Erfassen'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingEntry(null); }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Keine Zeiteinträge für diesen Monat.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kunde</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Beschreibung</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stunden</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Betrag</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEntries.map((entry) => {
                const rate = getHourlyRate(entry);
                const amount = entry.hours * rate;
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {entry.client?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {entry.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                      {entry.hours.toFixed(2)}h
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                      {amount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button onClick={() => handleEdit(entry)} className="text-[#1e1b4b] hover:text-[#2d2a5e] mr-4">
                        Bearbeiten
                      </button>
                      <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:text-red-800">
                        Löschen
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
