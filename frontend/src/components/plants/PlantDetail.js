import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { plantsAPI } from '../../services/api';

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = new URLSearchParams(location.search).get('edit') === 'true';

  const [plant, setPlant] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPlant = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await plantsAPI.getById(id);
        setPlant(res.data);
        setForm({
          name: res.data.name || '',
          species: res.data.species || '',
          location: res.data.location || '',
          potSize: res.data.potSize || '',
          sunlight: res.data.sunlight || '',
          photo: null
        });
      } catch (err) {
        setError('Failed to load plant');
      }
      setLoading(false);
    };
    fetchPlant();
  }, [id]);

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
      await plantsAPI.update(id, form);
      navigate('/plants');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update plant');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-400 py-8">{error}</div>;
  }
  if (!plant) {
    return null;
  }

  if (isEdit && form) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Edit Plant</h1>
        <form className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 space-y-6" onSubmit={handleSubmit}>
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
            <label className="block text-sm font-medium text-zinc-300 mb-1">Photo (optional, will replace existing)</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="w-full py-3 px-4 rounded-lg bg-zinc-700 text-zinc-100 font-semibold hover:bg-zinc-600 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
              onClick={() => navigate('/plants')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // View mode
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8">
        {plant.photoUrl ? (
          <img
            src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${plant.photoUrl}`}
            alt={plant.name}
            className="w-32 h-32 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-32 h-32 bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-4xl">🌱</span>
          </div>
        )}
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">{plant.name}</h1>
        <p className="text-zinc-400 mb-1">Species: {plant.species}</p>
        <p className="text-zinc-400 mb-1">Location: {plant.location}</p>
        <p className="text-zinc-400 mb-1">Pot Size: {plant.potSize}</p>
        <p className="text-zinc-400 mb-1">Sunlight: {plant.sunlight}</p>
        <div className="flex gap-2 mt-4">
          <Link
            to={`/plants/${plant._id}?edit=true`}
            className="px-4 py-2 rounded bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow"
          >
            Edit
          </Link>
          <button
            className="px-4 py-2 rounded bg-zinc-700 text-zinc-100 text-sm font-medium hover:bg-zinc-600 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
            onClick={() => navigate('/plants')}
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail; 