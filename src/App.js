import "./App.css";
import React, { useEffect, useMemo, useState } from "react";

function useQuery() {
  const { search } = window.location;
  return useMemo(() => new URLSearchParams(search), [search]);
}

function handleGetTimer(duration = 150, dateInMiliseconds = null) {
  const finalDuration = duration ? parseInt(duration) : 150;
  const finalDateInMiliseconds = dateInMiliseconds ? parseInt(dateInMiliseconds) : null;

  if (finalDateInMiliseconds) {
    const now = Date.now();
    const diff = finalDateInMiliseconds - now; // milisegundos restantes hasta la fecha

    if (diff <= 0) {
      // ya pasó la fecha
      return { timer: 0, message: "Se agotó el tiempo" };
    }

    const diffInSeconds = Math.floor(diff / 1000);

    // si la fecha permite usar toda la duración → usar duration
    // si no → usar el tiempo real que queda
    const timerValue = Math.min(finalDuration, diffInSeconds);

    return { timer: timerValue, message: null };
  }

  // si no hay fecha → usar duración normal
  return { timer: finalDuration, message: null };
}


const handleGetTimerText = (currentTimer) => {
  const minutes = Math.floor(currentTimer / 60);
  const seconds = currentTimer % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

function App() {
  const query = useQuery();
  const duration = query.get("duration");
  const dateInMiliseconds = query.get("date");

  const [timer, setTimer] = useState(0);
  const [textTimer, setTextTimer] = useState("");

  // Inicializar timer
  useEffect(() => {
    const { timer: currentTimer, message } = handleGetTimer(duration, dateInMiliseconds);

    if (message) {
      setTimer(0);
      setTextTimer(message);
    } else {
      setTimer(currentTimer);
      setTextTimer(handleGetTimerText(currentTimer));
    }
  }, [duration, dateInMiliseconds]);

  // Intervalo del contador
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // limpiar al desmontar
  }, [timer]);

  // actualizar texto cada vez que timer cambia
  useEffect(() => {
    if (timer > 0) {
      setTextTimer(handleGetTimerText(timer));
    } else if (timer === 0) {
      setTextTimer("Se agotó el tiempo");
    }
  }, [timer]);

  // let date1 = new Date(); date1.setMinutes(date1.getMinutes() + 2); console.log(date1.getTime())
  return (
    <div className="timer" id="countdown">
      {textTimer}
    </div>
  );
}

export default App;
