// src/pages/AdminsModern.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchAdmins, createAdmin, updateAdmin, deleteAdmin } from '../store/slices/adminSlice';
import type { Administrateur } from '../types';
import { Plus, Edit2, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Admins: React.FC = () => {
  const dispatch = useAppDispatch();
  const { admins, loading } = useAppSelector((s) => s.admin);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Administrateur | null>(null);

  const [form, setForm] = useState({
    nomadmin: '',
    prenomadmin: '',
    emailadmin: '',
    codeacces: '',
    role: 'ADMIN',
  });

  const [showFormPassword, setShowFormPassword] = useState(false);
  const [revealedAdminId, setRevealedAdminId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const openAdd = () => {
    setEditing(null);
    setForm({ nomadmin: '', prenomadmin: '', emailadmin: '', codeacces: '', role: 'ADMIN' });
    setIsModalOpen(true);
    setShowFormPassword(false);
  };

  const openEdit = (admin: Administrateur) => {
    setEditing(admin);
    setForm({
      nomadmin: admin.nomadmin,
      prenomadmin: admin.prenomadmin,
      emailadmin: admin.emailadmin,
      codeacces: '',
      role: admin.role ?? 'ADMIN',
    });
    setIsModalOpen(true);
    setShowFormPassword(false);
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (editing) {
      await dispatch(updateAdmin({ id: editing.idadmin, data: form }));
    } else {
      await dispatch(createAdmin(form));
    }
    await dispatch(fetchAdmins());
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cet administrateur ?')) return;
    await dispatch(deleteAdmin(id));
    await dispatch(fetchAdmins());
  };

  const toggleReveal = (id: number) => {
    setRevealedAdminId((prev) => (prev === id ? null : id));
    if (revealedAdminId !== id) {
      setTimeout(() => {
        setRevealedAdminId((curr) => (curr === id ? null : curr));
      }, 8000);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administrateurs</h1>
          <p className="text-sm text-gray-500">Gérez les administrateurs de votre application</p>
        </div>
       {/* <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>  */}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Chargement...</div>
        ) : admins.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">Aucun administrateur</div>
        ) : (
          admins.map((a) => (
            <motion.article
              key={a.idadmin}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative p-5 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur border border-gray-200 dark:border-white/10 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900 dark:text-white">
                        {a.nomadmin} {a.prenomadmin}
                      </div>
                      <div className="text-sm text-gray-500">{a.emailadmin}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(a)}
                    className="p-2 rounded-md hover:bg-white/5 transition"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(a.idadmin)}
                    className="p-2 rounded-md hover:bg-red-600/10 transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Rôle</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/4 border border-white/6">
                      {a.role ?? 'ADMIN'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleReveal(a.idadmin)}
                      className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/4 hover:bg-white/6 transition text-sm"
                    >
                      {revealedAdminId === a.idadmin ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Masquer
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Révéler
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-400 mb-1">Code d'accès</div>
                  <div className="flex items-center justify-between bg-white/3 p-3 rounded-md border border-white/6">
                    <div className="truncate">
                      {revealedAdminId === a.idadmin ? (a as any).codeacces ?? '••••••••' : '••••••••'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>

      {/* FLOATING BUTTON MOBILE */}
      <button
        onClick={openAdd}
        className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl flex items-center justify-center"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* MODALE CLAIRE */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.form
              onSubmit={handleSubmit}
              className="relative z-10 w-full max-w-xl p-6 rounded-2xl bg-white shadow-xl border border-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-black">
                  {editing ? 'Modifier l’administrateur' : 'Ajouter un administrateur'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Nom</label>
                  <input
                    required
                    value={form.nomadmin}
                    onChange={(e) => setForm({ ...form, nomadmin: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-md bg-white/4 border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Prénom</label>
                  <input
                    required
                    value={form.prenomadmin}
                    onChange={(e) => setForm({ ...form, prenomadmin: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-md bg-white/4 border border-gray-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500">Email</label>
                  <input
                    type="email"
                    required
                    value={form.emailadmin}
                    onChange={(e) => setForm({ ...form, emailadmin: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-md bg-white/4 border border-gray-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">
                    {editing ? 'Nouveau mot de passe (optionnel)' : "Code d'accès"}
                  </label>
                  <div className="relative">
                    <input
                      type={showFormPassword ? 'text' : 'password'}
                      required={!editing}
                      value={form.codeacces}
                      onChange={(e) => setForm({ ...form, codeacces: e.target.value })}
                      className="mt-1 w-full px-3 py-2 rounded-md bg-white/4 border border-gray-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400"
                    >
                      {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Rôle</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-md bg-white/4 border border-gray-200"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-white/4 border border-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
                >
                  {editing ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admins;
