import React, { useEffect, useState } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Pagination } from '../components/UI/Pagination';
import { Modal } from '../components/UI/Modal';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchClients, deleteClient } from '../store/slices/clientSlice';
import { Search, MoreVertical, User, Trash2, Calendar, Phone } from 'lucide-react';
import { Car,  Clock, DollarSign } from 'lucide-react';

export const Clients: React.FC = () => {
  const dispatch = useAppDispatch();
  const { clients, loading, total, page, limit } = useAppSelector((state) => state.client);

  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; client: any }>({
    isOpen: false,
    client: null,
  });
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [reservationsClient, setReservationsClient] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);


  //profilee
  const [profileModal, setProfileModal] = useState<{ isOpen: boolean; client: any }>({
  isOpen: false,
  client: null,
});


  useEffect(() => {
    dispatch(fetchClients({ page, limit, search }));
  }, [dispatch, page, search]);

  const handleDelete = async () => {
    if (deleteModal.client) {
      await dispatch(deleteClient(deleteModal.client.idclient));
      setDeleteModal({ isOpen: false, client: null });
      dispatch(fetchClients({ page, limit, search }));
    }
  };

  const totalPages = Math.ceil(total / limit);

  const fetchReservationsByClient = async (clientId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/clients/${clientId}/reservations`);
      const data = await response.json();
      const sorted = (data.reservations || []).sort(
        (a: any, b: any) => new Date(b.datedebut).getTime() - new Date(a.datedebut).getTime()
      );
      setReservationsClient(sorted);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations :', error);
    }
  };
   
  const calculerDuree = (dateDebut: string, dateFin: string) => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    return Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 3600 * 24));
  };

//modale clientttttt
  <Modal
  isOpen={profileModal.isOpen}
  onClose={() => setProfileModal({ isOpen: false, client: null })}
  title={`Profil de ${profileModal.client?.nomclient || ''} ${profileModal.client?.prenomclient || ''}`}
>
  {profileModal.client && (
    <div className="flex flex-col items-center gap-4 text-center">
      {/* Photo */}
      {profileModal.client.photocli ? (
        <img
          src={`http://localhost:3000/${profileModal.client.photocli.replace(/^\//, '')}`}
          alt="Photo client"
          className="w-28 h-28 rounded-full object-cover shadow-md ring-4 ring-emerald-300 dark:ring-emerald-700"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-3xl font-bold text-white uppercase ring-4 ring-emerald-300 dark:ring-emerald-700">
          {profileModal.client.prenomclient?.charAt(0) || profileModal.client.nomclient?.charAt(0) || 'U'}
        </div>
      )}

      {/* Infos */}
      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {profileModal.client.nomclient} {profileModal.client.prenomclient}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          <Phone className="inline w-4 h-4 mr-2 text-emerald-500" />
          {profileModal.client.telclient || 'N/A'}
        </p>
        {profileModal.client.mail && (
          <p className="text-gray-600 dark:text-gray-300">
             {profileModal.client.mail}
          </p>
        )}
        {profileModal.client.adresse && (
          <p className="text-gray-600 dark:text-gray-300">
             {profileModal.client.adresse}
          </p>
        )}
      </div>

      {/* Statut */}
      <span className="text-xs font-semibold bg-emerald-200/70 text-emerald-800 dark:bg-emerald-700 dark:text-white px-3 py-1 rounded-full shadow-sm">
        Client actif
      </span>
    </div>
  )}
</Modal>







  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black min-h-screen p-6 rounded-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Gestion des Clients
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Consultez, gérez et analysez vos clients en un clin d’œil
          </p>
        </div>
      </div>

      <Card className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-md shadow-xl border border-gray-200/30 dark:border-gray-700/30 rounded-2xl transition">
        <div className="mb-6 flex justify-between items-center">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Chargement...</p>
        ) : clients.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun client trouvé</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {clients.map((client: any) => (
              <div
                key={client.idclient}
                className="bg-white/80 dark:bg-gray-800/60 border border-gray-200/20 dark:border-gray-700/20 rounded-2xl p-5 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all relative"
              >
                {/* menu contextuel */}
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === client.idclient ? null : client.idclient)
                  }
                  className="absolute right-3 top-3 text-gray-500 hover:text-emerald-600"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {openMenuId === client.idclient && (
                  <div className="absolute right-3 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 w-40 animate-fade-in">
                    <ul className="text-sm text-gray-700 dark:text-gray-300">
                      <li className="px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                          setProfileModal({ isOpen: true, client });
                          setOpenMenuId(null); 
                          }}
                           >
                          <User size={14} /> Profil
                    </li>

                       <li className="px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer flex items-center gap-2"
                        onClick={() => window.location.href = `sms:${client.telclient}`}
                       >
                        <Phone size={14} /> Envoyer SMS 
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer flex items-center gap-2 text-red-600"
                        onClick={() => setDeleteModal({ isOpen: true, client })}
                      >
                        <Trash2 size={14} /> Supprimer
                      </li>
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-5">
                  
                     {client.photocli ? (
                       <img
                     src={`http://localhost:3000/${client.photocli.replace(/^\//, '')}`}
                     alt={`${client.prenomclient} ${client.nomclient}`}
                   className="w-14 h-14 rounded-full object-cover ring-4 ring-emerald-200 dark:ring-emerald-700"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} 
                     />
                   ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-lg font-bold text-white uppercase ring-4 ring-emerald-200 dark:ring-emerald-700 animate-pulse">
                {client.prenomclient?.charAt(0) || client.nomclient?.charAt(0) || 'U'}
              </div>
             )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {client.nomclient} {client.prenomclient}
                    </p>
                    <p className="text-sm text-gray-500">{client.telclient}</p>
                    <span className="text-xs text-emerald-600 font-semibold">Actif</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedClient(client);
                    fetchReservationsByClient(client.idclient);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  Voir réservations
                </button>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) =>
                dispatch(fetchClients({ page: newPage, limit, search }))
              }
            />
          </div>
        )}
      </Card>

      {/* Suppression */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, client: null })}
        title="Supprimer le client"
      >
        <p className="text-gray-700 dark:text-gray-300">
          Êtes-vous sûr de vouloir supprimer{' '}
          <strong>
            {deleteModal.client?.nomclient} {deleteModal.client?.prenomclient}
          </strong>{' '}
          ?
        </p>
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ isOpen: false, client: null })}
          >
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </Modal>

      {/* Détails réservations */}
<Modal
  isOpen={!!selectedClient}
  onClose={() => setSelectedClient(null)}
  title={`Réservations de ${selectedClient?.nomclient || ''} ${selectedClient?.prenomclient || ''}`}
>
  {reservationsClient.length === 0 ? (
    <p className="text-gray-500 text-center">
      Aucune réservation trouvée pour ce client.
    </p>
  ) : (
    <div className="flex gap-6 overflow-x-auto py-2">
      {reservationsClient.map((res: any, index: number) => (
        <div
          key={index}
          className="min-w-[300px] border border-emerald-200/50 rounded-xl p-4 bg-emerald-50/40 dark:bg-emerald-900/20 hover:bg-emerald-100/60 transition flex-shrink-0 flex flex-col gap-3"
        >
          {/* image voiture */}
          {res.voiture?.photo && (
            <img
              src={`http://localhost:3000/${res.voiture.photo.replace(/^\//, '')}`}
              alt="voiture"
              className="w-full h-40 object-cover rounded-lg shadow-sm"
              onError={(e) => (e.currentTarget.src = '/images/placeholder.png')}
            />
          )}

          {/* infos voiture + statut */}
          <div className="flex items-center justify-between text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5" color="#00cc00" />
              <p>{res.voiture?.nomvoiture || 'Voiture inconnue'}</p>
            </div>
            <span className="text-xs bg-emerald-200/70 text-emerald-800 dark:bg-emerald-700 dark:text-white px-2 py-1 rounded-full">
              {res.statut}
            </span>
          </div>

          {/* chauffeur */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <User className="w-5 h-5" color="#00cc00" />
            <p>{res.voiture?.chauffeur?.nomchauffeur || 'Non assigné'}</p>
          </div>

          {res.voiture?.chauffeur?.photo && (
            <img
              src={`http://localhost:3000/${res.voiture.chauffeur.photo}`}
              alt="chauffeur"
              className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-emerald-300 self-center"
            />
          )}

          {/* dates */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Calendar className="w-5 h-5" color="#00cc00" />
            <p>
              Du {new Date(res.datedebut).toLocaleDateString()} au{' '}
              {new Date(res.datefin).toLocaleDateString()}
            </p>
          </div>

          {/* durée */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Clock className="w-5 h-5" color="#00cc00" />
            <p>{res.duree || calculerDuree(res.datedebut, res.datefin)} jours</p>
          </div>

          {/* prix */}
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
            <DollarSign className="w-5 h-5" color="#00cc00" />
            <p>{res.prixtotal} Ar</p>
           </div>
            </div>
          ))}
         </div>
         )}
      </Modal>

    </div>
  );
};
