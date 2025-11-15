import React, { useEffect, useState } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Pagination } from '../components/UI/Pagination';
import { Modal } from '../components/UI/Modal';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchChauffeurs, createChauffeur, updateChauffeur, deleteChauffeur } from '../store/slices/chauffeurSlice';
import type { Chauffeur } from '../types';
import { Plus, MoreVertical, Edit2, Trash2, Phone, User } from 'lucide-react';

export const Chauffeurs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { chauffeurs, loading, total, page, limit } = useAppSelector((state) => state.chauffeur);

  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState<{ isOpen: boolean; chauffeur: Chauffeur | null }>({
    isOpen: false,
    chauffeur: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; chauffeur: Chauffeur | null }>({
    isOpen: false,
    chauffeur: null,
  });
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nomchauffeur: '',
    telchauffeur: '',
    photochauf: '' as string | File,
  });

  useEffect(() => {
    dispatch(fetchChauffeurs({ page, limit, search }));
  }, [dispatch, page, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'photochauf') form.append(key, value as string);
    });
    if (formData.photochauf instanceof File) form.append('photochauf', formData.photochauf);

    if (editModal.chauffeur) {
      await dispatch(updateChauffeur({ id: editModal.chauffeur.idchauffeur, formData: form }));
    } else {
      await dispatch(createChauffeur(form));
    }

    setEditModal({ isOpen: false, chauffeur: null });
    setFormData({ nomchauffeur: '', telchauffeur: '', photochauf: '' });
    dispatch(fetchChauffeurs({ page, limit, search }));
  };

  const handleEdit = (chauffeur: Chauffeur) => {
    setFormData({
      nomchauffeur: chauffeur.nomchauffeur,
      telchauffeur: chauffeur.telchauffeur,
      photochauf:
        chauffeur.photochauf?.startsWith('/')
          ? chauffeur.photochauf
          : `/${chauffeur.photochauf}` || '',
    });
    setEditModal({ isOpen: true, chauffeur });
  };

  const handleDelete = async () => {
    if (deleteModal.chauffeur) {
      await dispatch(deleteChauffeur(deleteModal.chauffeur.idchauffeur));
      setDeleteModal({ isOpen: false, chauffeur: null });
      dispatch(fetchChauffeurs({ page, limit, search }));
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black min-h-screen p-6 rounded-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Gestion des Chauffeurs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Consultez, gérez et suivez vos chauffeurs avec style
          </p>
        </div>
        <Button
          onClick={() => setEditModal({ isOpen: true, chauffeur: null })}
          className="bg-[#00cc00] hover:bg-[#00aa00] text-white font-semibold flex items-center gap-2 shadow-md rounded-xl px-4 py-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Ajouter un chauffeur
        </Button>
      </div>

      <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30 rounded-2xl shadow-xl transition">
        <div className="mb-6 flex justify-between items-center">
          <div className="relative max-w-xs">
            <input
              type="text"
              placeholder="Rechercher un chauffeur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : chauffeurs.length === 0 ? (
          <p className="text-center text-gray-500">Aucun chauffeur trouvé</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {chauffeurs.map((chauffeur) => (
              <div
                key={chauffeur.idchauffeur}
                className="relative bg-white/80 dark:bg-gray-800/60 border border-gray-200/20 dark:border-gray-700/20 rounded-2xl p-5 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                {/* Menu contextuel */}
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === chauffeur.idchauffeur ? null : chauffeur.idchauffeur)
                  }
                  className="absolute right-3 top-3 text-gray-500 hover:text-green-600"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {openMenuId === chauffeur.idchauffeur && (
                  <div className="absolute right-3 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 w-40 animate-fade-in">
                    <ul className="text-sm text-gray-700 dark:text-gray-300">
                      <li
                        className="px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer flex items-center gap-2"
                        onClick={() => handleEdit(chauffeur)}
                      >
                        <Edit2 size={14} /> Modifier
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer flex items-center gap-2 text-red-600"
                        onClick={() => setDeleteModal({ isOpen: true, chauffeur })}
                      >
                        <Trash2 size={14} /> Supprimer
                      </li>
                    </ul>
                  </div>
                )}

                {/* Photo chauffeur */}
                <div className="flex flex-col items-center mb-4">
                  {chauffeur.photochauf ? (
                    <img
                      src={`http://localhost:3000/${chauffeur.photochauf.replace(/^\//, '')}`}
                      alt="chauffeur"
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-green-300 dark:ring-green-700 shadow-md mb-2"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-500 mb-2">
                      {chauffeur.nomchauffeur?.charAt(0) || 'C'}
                    </div>
                  )}

                  <p className="font-semibold text-gray-900 dark:text-white text-center">
                    {chauffeur.nomchauffeur}
                  </p>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <Phone size={14} /> {chauffeur.telchauffeur}
                  </p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-1">
                    Disponible
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => dispatch(fetchChauffeurs({ page: newPage, limit, search }))}
            />
          </div>
        )}
      </Card>

      {/* --- MODAL AJOUT / EDIT --- */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, chauffeur: null })}
        title={editModal.chauffeur ? 'Modifier le chauffeur' : 'Ajouter un chauffeur'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom du Chauffeur
              </label>
              <input
                type="text"
                required
                value={formData.nomchauffeur}
                onChange={(e) => setFormData({ ...formData, nomchauffeur: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Numéro Téléphone
              </label>
              <input
                type="text"
                required
                value={formData.telchauffeur}
                onChange={(e) => setFormData({ ...formData, telchauffeur: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Photo</label>
            {formData.photochauf && (
              <img
                src={
                  typeof formData.photochauf === 'string'
                    ? `http://localhost:3000${formData.photochauf.startsWith('/') ? formData.photochauf : '/' + formData.photochauf}`
                    : URL.createObjectURL(formData.photochauf)
                }
                alt="chauffeur"
                className="h-24 w-24 rounded-full object-cover mb-2 border-2 border-green-400"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, photochauf: e.target.files?.[0] || '' })}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditModal({ isOpen: false, chauffeur: null })}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#00cc00] hover:bg-[#00aa00] text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {editModal.chauffeur ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL SUPPRESSION --- */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, chauffeur: null })}
        title="Supprimer le chauffeur"
      >
        <p className="text-gray-700 dark:text-gray-300">
          Êtes-vous sûr de vouloir supprimer{' '}
          <strong>{deleteModal.chauffeur?.nomchauffeur}</strong> ?
        </p>
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ isOpen: false, chauffeur: null })}
          >
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
};
