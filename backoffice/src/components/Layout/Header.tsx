import React from 'react';
import { Menu, Bell, Search, LogOut } from 'lucide-react';
import { useAppDispatch  } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { logout } from '../../store/slices/authSlice';
import { useState, useEffect, useRef } from 'react';
import { fetchReservations } from '../../store/slices/reservationSlice';
import { io } from 'socket.io-client';
import {  useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



//interface HeaderProps {
 // onMenuClick: () => void;
//}

const notificationSound = new Audio('/assets/sounds/finding.mp3')
//temps reels 
const SOCKET_URL = 'http://localhost:3000';


export const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { reservations } = useAppSelector(state => state.reservation);

  const [notifCount, setNotifCount] = useState(0);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

  const prevNotifCountRef = useRef(0);
  const navigate = useNavigate();

  {/*const playSound = () => {
      if (!isSoundPlaying) { 
      const sound = notificationSound.cloneNode(true) as HTMLAudioElement;
      
      
      sound.loop = true;
      
      sound.play().then(() => {
      setIsSoundPlaying(true);
       }).catch(e => {
      console.error("Erreur de lecture du son :", e);
      });
      }
    }; */}

    const playSound = () => {
     if (!isSoundPlaying) { // Vérifie si un son n'est PAS en cours
 
        notificationSound.loop = true;
        notificationSound.currentTime = 0; 

        notificationSound.play().then(() => {
        setIsSoundPlaying(true); 
        }).catch(e => {
        console.error("Erreur de lecture du son (probablement bloquée par le navigateur):", e);
        
      });
    }
};

  //notif sound
   const handleStopSoundAndReset = () => {
       if (isSoundPlaying) {
       // Cette fonction arrête maintenant l'objet global 'notificationSound'
       notificationSound.pause();
       notificationSound.currentTime = 0; // Remettre au début
       setIsSoundPlaying(false);
     }
    
  };
  


   useEffect(() => {
    dispatch(fetchReservations({ page: 1, limit: 100, statut: 'EN_ATTENTE' }));
    const socket = io(SOCKET_URL);
    socket.on('connect', () => {
      console.log('Connecté au serveur WebSocket.');
    });

    socket.on('newReservation', (newRes) => {
      console.log('ALERTE TEMPS RÉEL: Nouvelle réservation reçue!', newRes);
     // playSound(); 

      //  Toast de notification
    toast.info(` Nouvelle réservation reçue de ${newRes.nomclient || 'un client'}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });


      dispatch(fetchReservations({ page: 1, limit: 100, statut: 'EN_ATTENTE' }));
    });

    socket.on('disconnect', () => {
      console.log('Déconnecté du serveur WebSocket.');
    });

    return () => {
      socket.disconnect();
    };

  }, [dispatch]);



  useEffect(() => {
    const currentCount = reservations.filter(r => r.statut === 'EN_ATTENTE').length;
   
        if (currentCount === 0) {
      
      handleStopSoundAndReset();
    }else if (currentCount > prevNotifCountRef.current && currentCount > 0 && !isSoundPlaying) {
        playSound();
    }

    
    //compteur affichage
    setNotifCount(currentCount);
    //reference pour prochaine 
    prevNotifCountRef.current = currentCount;
  }, [reservations]);

  const handleLogout = () => {
    handleStopSoundAndReset();
    dispatch(logout());
    navigate("/Login"); 
  };


  //debogage 

  return (
    <>
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 w-full">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="ml-4 flex-1 max-w-xs hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600"
           onClick={handleStopSoundAndReset}
          >
          
       <Bell className={`h-6 w-6 ${notifCount > 0 ? 'animate-bell-ring text-red-600' : ''}`} /> 
        {notifCount > 0 && <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">{notifCount}</span>}
        {isSoundPlaying && <span className="absolute top-0 left-0 text-red-500 text-xs font-bold"></span>} 
        </button>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.nomadmin?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline">
              {user?.nomadmin} {user?.prenomadmin}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

     <ToastContainer />
    </>

  );
};