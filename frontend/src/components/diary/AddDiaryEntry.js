import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diaryAPI, plantsAPI } from '../../services/api';
import Toast from '../common/Toast';

const AddDiaryEntry = () => {
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState({
    plant: '',
    activity: '',
    title: '',
    content: '',
    photo: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const res = await plantsAPI.getAll();
        setPlants(res.data);
        setForm((f) => ({ ...f, plant: res.data[0]?._id || '' }));
      } catch {
        setError('Failed to load plants');
      }
      setLoading(false);
    };
    fetchPlants();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm({ ...form, photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await diaryAPI.create(form);
      setToast({ message: 'Diary entry added successfully!', type: 'success' });
      setTimeout(() => navigate('/diary'), 1200);
    } catch (err) {
      setToast({ message: err.response?.data?.msg || 'Failed to add diary entry', type: 'error' });
      setError(err.response?.data?.msg || 'Failed to add diary entry');
    }
    setSaving(false);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: '', type: toast.type }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: toast.type })} />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Add Diary Entry</h1>
        <form className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-900/50 border border-red-800 text-red-300 px-4 py-3 rounded-lg">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Plant</label>
            <select
              name="plant"
              value={form.plant}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg focus:ring-emerald-600 focus:border-emerald-600"
            >
              {plants.map((plant) => (
                <option key={plant._id} value={plant._id}>{plant.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Activity</label>
            <select
              name="activity"
              value={form.activity}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg focus:ring-emerald-600 focus:border-emerald-600"
            >
              <option value="">Select activity</option>
              <option value="watering">Watering</option>
              <option value="fertilizing">Fertilizing</option>
              <option value="pruning">Pruning</option>
              <option value="repotting">Repotting</option>
              <option value="observation">Observation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg focus:ring-emerald-600 focus:border-emerald-600 placeholder-zinc-400"
              placeholder="e.g. Watered the basil"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Notes</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={3}
              className="block w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg focus:ring-emerald-600 focus:border-emerald-600 placeholder-zinc-400"
              placeholder="Describe what you did or observed..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Photo (optional)</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              {saving ? 'Saving...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddDiaryEntry; 