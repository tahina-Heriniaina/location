import React, { useEffect, useState } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchVoitures, createVoiture, updateVoiture, deleteVoiture } from '../store/slices/voitureSlice';
import type { Voiture } from '../types';
import { Plus, Edit2, Trash2, Search, Users, DollarSign, MoreVertical } from 'lucide-react';
import { chauffeurService } from '../services/chauffeurService';
import type { Chauffeur } from '../types';

export const Voitures: React.FC = () => {
  const dispatch = useAppDispatch();
  const { voitures, loading,  page, limit } = useAppSelector((state) => state.voiture);

  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState<{ isOpen: boolean; voiture: Voiture | null }>({ isOpen: false, voiture: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; voiture: Voiture | null }>({ isOpen: false, voiture: null });
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);

  const [formData, setFormData] = useState({
    nomvoiture: '',
    categorie: 'car' as 'car' | 'moto' | 'truck',
    nombre_places: 1,
    prixparjour: 0,
    photo: '' as string | File,
    description: '',
    localisation: '',
    equipement: '',
    idchauffeur: undefined as number | undefined,
  });

  useEffect(() => {
    chauffeurService.getAll().then((res) => setChauffeurs(res.data.chauffeurs));
  }, []);

  useEffect(() => {
    dispatch(fetchVoitures({ page, limit, search }));
  }, [dispatch, page, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'photo') form.append(key, value as string | Blob);
    });
    if (formData.photo instanceof File) form.append('photo', formData.photo);

    if (editModal.voiture) {
      await dispatch(updateVoiture({ id: editModal.voiture.idvoiture, formData: form }));
    } else {
      await dispatch(createVoiture(form));
    }

    setEditModal({ isOpen: false, voiture: null });
    setFormData({
      nomvoiture: '',
      categorie: 'car',
      nombre_places: 1,
      prixparjour: 0,
      photo: '',
      description: '',
      localisation: '',
      equipement: '',
      idchauffeur: undefined,
    });

    dispatch(fetchVoitures({ page, limit, search }));
  };

  const handleEdit = (voiture: Voiture) => {
    setFormData({
      nomvoiture: voiture.nomvoiture,
      categorie: voiture.categorie,
      nombre_places: voiture.nombre_places,
      prixparjour: voiture.prixparjour,
      photo: voiture.photo?.startsWith('/') ? voiture.photo : `/${voiture.photo}` || '',
      description: voiture.description || '',
      localisation: voiture.localisation || '',
      equipement: voiture.equipement || '',
      idchauffeur: voiture.idchauffeur ?? undefined,
    });
    setEditModal({ isOpen: true, voiture });
  };

  const handleDelete = async () => {
    if (deleteModal.voiture) {
      await dispatch(deleteVoiture(deleteModal.voiture.idvoiture));
      setDeleteModal({ isOpen: false, voiture: null });
      dispatch(fetchVoitures({ page, limit, search }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Voitures</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez votre flotte de véhicules</p>
        </div>
        <Button
          onClick={() => setEditModal({ isOpen: true, voiture: null })}
          icon={<Plus className="h-5 w-5 text-[#00cc00]" />}
          className="bg-[#00cc00] hover:bg-[#00aa00] text-white"
        >
          Ajouter une voiture
        </Button>
      </div>

      {/* Recherche */}
      <Card>
        <div className="mb-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#00cc00]" />
            <input
              type="text"
              placeholder="Rechercher une voiture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#00cc00] focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Chargement...</p>
        ) : voitures.length === 0 ? (
          <p className="text-gray-500 text-center">Aucune voiture trouvée</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {voitures.map((voiture) => (
              <div
                key={voiture.idvoiture}
                className="bg-white/90 dark:bg-gray-800/70 border border-gray-200/20 dark:border-gray-700/20 rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all relative"
              >
                {/* Menu contextuel */}
                <button
                  onClick={() => setOpenMenuId(openMenuId === voiture.idvoiture ? null : voiture.idvoiture)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-[#00cc00]"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {openMenuId === voiture.idvoiture && (
                  <div className="absolute right-3 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 w-36 animate-fade-in">
                    <ul className="text-sm text-gray-700 dark:text-gray-300">
                      <li
                        className="px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer flex items-center gap-2"
                        onClick={() => handleEdit(voiture)}
                      >
                        <Edit2 size={14} className="text-[#00cc00]" /> Modifier
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer flex items-center gap-2 text-red-600"
                        onClick={() => setDeleteModal({ isOpen: true, voiture })}
                      >
                        <Trash2 size={14} /> Supprimer
                      </li>
                    </ul>
                  </div>
                )}

                {/* Image voiture */}
                {voiture.photo && (
                  <img
                    src={voiture.photo.startsWith('/') ? `http://localhost:3000${voiture.photo}` : voiture.photo}
                    alt={voiture.nomvoiture}
                    className="w-full h-44 object-cover rounded-xl mb-4 shadow-sm"
                  />
                )}

                {/* Infos */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-900 dark:text-white">{voiture.nomvoiture}</p>
                    <span className="text-sm text-gray-500">{voiture.categorie}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#00cc00]" />
                    <span>{voiture.nombre_places} places</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#00cc00]" />
                    <span>{voiture.prixparjour} Ar / jour</span>
                  </div>
                </div>

                {/* Chauffeur */}
                <div className="flex items-center gap-2 mb-2">
                  {voiture.chauffeur?.photochauf && (
                    <img
                      src={voiture.chauffeur.photochauf.startsWith('/') ? `http://localhost:3000${voiture.chauffeur.photochauf}` : voiture.chauffeur.photochauf}
                      alt={voiture.chauffeur.nomchauffeur}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#00cc00]"
                    />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Chauffeur: {voiture.chauffeur?.nomchauffeur || 'Non assigné'}
                  </span>
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(voiture)}
                    icon={<Edit2 className="h-4 w-4 text-[#00cc00]" />}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteModal({ isOpen: true, voiture })}
                    icon={<Trash2 className="h-4 w-4" />}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Ajouter/Modifier */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => {
          setEditModal({ isOpen: false, voiture: null });
          setFormData({
            nomvoiture: '',
            categorie: 'car',
            nombre_places: 1,
            prixparjour: 0,
            photo: '',
            description: '',
            localisation: '',
            equipement: '',
            idchauffeur: undefined,
          });
        }}
        title={editModal.voiture ? 'Modifier la voiture' : 'Ajouter une voiture'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom et catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom de la voiture</label>
              <input
                type="text"
                required
                value={formData.nomvoiture}
                onChange={(e) => setFormData({ ...formData, nomvoiture: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#00cc00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value as 'car' | 'moto' | 'truck' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#00cc00]"
              >
                <option value="car">Voiture</option>
                <option value="moto">Moto</option>
                <option value="truck">Camion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de places</label>
              <input
                type="number"
                min="1"
                required
                value={formData.nombre_places}
                onChange={(e) => setFormData({ ...formData, nombre_places: parseInt(e.target.value) })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#00cc00]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prix par jour (Ar)</label>
              <input
                type="number"
                min="0"
                required
                value={formData.prixparjour}
                onChange={(e) => setFormData({ ...formData, prixparjour: parseInt(e.target.value) })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#00cc00]"
              />
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Photo</label>
            {formData.photo && (
              <img
                src={
                  typeof formData.photo === 'string'
                    ? `http://localhost:3000${formData.photo.startsWith('/') ? formData.photo : '/' + formData.photo}`
                    : URL.createObjectURL(formData.photo)
                }
                alt="voiture"
                className="h-36 w-auto mb-2 rounded-lg border border-[#00cc00]"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || '' })}
              className="mt-1 block w-full text-sm text-gray-600 dark:text-gray-300"
            />
          </div>

          {/* Localisation, description, équipements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Localisation</label>
            <input
              type="text"
              value={formData.localisation}
              onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#00cc00]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#00cc00]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Équipements</label>
            <textarea
              value={formData.equipement}
              onChange={(e) => setFormData({ ...formData, equipement: e.target.value })}
              rows={2}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#00cc00]"
            />
          </div>

          {/* Chauffeur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chauffeur</label>
            <select
              value={formData.idchauffeur ?? ''}
              onChange={(e) => setFormData({ ...formData, idchauffeur: Number(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#00cc00]"
            >
              <option value="">-- Sélectionner un chauffeur --</option>
              {chauffeurs.map((ch) => (
                <option key={ch.idchauffeur} value={ch.idchauffeur}>
                  {ch.nomchauffeur}
                </option>
              ))}
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditModal({ isOpen: false, voiture: null });
                setFormData({
                  nomvoiture: '',
                  categorie: 'car',
                  nombre_places: 1,
                  prixparjour: 0,
                  photo: '',
                  description: '',
                  localisation: '',
                  equipement: '',
                  idchauffeur: undefined,
                });
              }}
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-[#00cc00] hover:bg-[#00aa00] text-white">
              {editModal.voiture ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, voiture: null })}
        title="Supprimer la voiture"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Êtes-vous sûr de vouloir supprimer la voiture{' '}
            <strong>{deleteModal.voiture?.nomvoiture}</strong> ? Cette action est irréversible.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, voiture: null })}
            >
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
