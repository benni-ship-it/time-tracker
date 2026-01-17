'use client';

import { useState, useEffect } from 'react';
import { supabase, Client, Project } from '@/lib/supabase';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<(Project & { client: Client })[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: '', client_id: '', hourly_rate: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [projectsRes, clientsRes] = await Promise.all([
      supabase
        .from('projects')
        .select('*, client:clients(*)')
        .order('name'),
      supabase
        .from('clients')
        .select('*')
        .order('name'),
    ]);

    if (projectsRes.error) console.error('Error fetching projects:', projectsRes.error);
    if (clientsRes.error) console.error('Error fetching clients:', clientsRes.error);

    setProjects(projectsRes.data || []);
    setClients(clientsRes.data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData = {
      name: formData.name,
      client_id: formData.client_id,
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
    };

    if (editingProject) {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingProject.id);

      if (error) console.error('Error updating project:', error);
    } else {
      const { error } = await supabase
        .from('projects')
        .insert([projectData]);

      if (error) console.error('Error creating project:', error);
    }

    setFormData({ name: '', client_id: '', hourly_rate: '' });
    setShowForm(false);
    setEditingProject(null);
    fetchData();
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      client_id: project.client_id,
      hourly_rate: project.hourly_rate?.toString() || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Projekt wirklich löschen? Alle zugehörigen Zeiteinträge werden ebenfalls gelöscht.')) {
      return;
    }

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) console.error('Error deleting project:', error);
    else fetchData();
  };

  if (loading) return <div className="text-center py-8">Laden...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projekte</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProject(null);
            setFormData({ name: '', client_id: clients[0]?.id || '', hourly_rate: '' });
          }}
          disabled={clients.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          + Neues Projekt
        </button>
      </div>

      {clients.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-yellow-800">
          Erstelle zuerst einen Kunden, bevor du Projekte anlegen kannst.
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingProject ? 'Projekt bearbeiten' : 'Neues Projekt'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kunde</label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Kunde wählen...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Projektname</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stundensatz (€) - leer = Kunden-Rate
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingProject ? 'Speichern' : 'Erstellen'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingProject(null); }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Noch keine Projekte vorhanden.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projekt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kunde</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stundensatz</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{project.client?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {(project.hourly_rate || project.client?.hourly_rate || 0).toFixed(2)} €/h
                    {!project.hourly_rate && <span className="text-gray-400 text-xs ml-1">(Kunde)</span>}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button onClick={() => handleEdit(project)} className="text-blue-600 hover:text-blue-800 mr-4">
                      Bearbeiten
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-800">
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
