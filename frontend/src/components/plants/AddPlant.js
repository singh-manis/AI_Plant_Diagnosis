import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { plantsAPI } from '../../services/api';
import Toast from '../common/Toast';

const AddPlant = () => {
  const [form, setForm] = useState({
    name: '',
    species: '',
    location: '',
    potSize: '',
    sunlight: '',
    photo: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const navigate = useNavigate();

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
    setError('');
    setLoading(true);
    try {
      const plantData = { ...form };
      await plantsAPI.create(plantData);
      setToast({ message: 'Plant added successfully!', type: 'success' });
      setTimeout(() => navigate('/plants'), 1200);
    } catch (err) {
      setToast({ message: err.response?.data?.msg || 'Failed to add plant', type: 'error' });
      setError(err.response?.data?.msg || 'Failed to add plant');
    }
    setLoading(false);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: '', type: toast.type }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: toast.type })} />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Add New Plant</h1>
        <form className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-900/50 border border-red-800 text-red-300 px-4 py-3 rounded-lg">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Plant Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg focus:ring-emerald-600 focus:border-emerald-600 placeholder-zinc-400"
              placeholder="e.g. Basil"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Species</label>
            <input
              type="text"
              name="species"
              value={form.species}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg focus:ring-emerald-600 focus:border-emerald-600 placeholder-zinc-400"
              placeholder="e.g. Ocimum basilicum"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg focus:ring-emerald-600 focus:border-emerald-600 placeholder-zinc-400"
              placeholder="e.g. Balcony, Living Room"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Pot Size</label>
              <input
                type="text"
                name="potSize"
                value={form.potSize}
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg focus:ring-emerald-600 focus:border-emerald-600 placeholder-zinc-400"
                placeholder="e.g. Medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Sunlight</label>
              <input
                type="text"
                name="sunlight"
                value={form.sunlight}
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg focus:ring-emerald-600 focus:border-emerald-600 placeholder-zinc-400"
                placeholder="e.g. 4 hours"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Photo</label>
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
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              {loading ? 'Adding...' : 'Add Plant'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPlant; 