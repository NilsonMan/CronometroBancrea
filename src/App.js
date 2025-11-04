import "./App.css";
import React, { useEffect, useMemo, useState } from "react";

// Hook para obtener parámetros de la URL
function useQuery() {
  const { search } = window.location;
  return useMemo(() => new URLSearchParams(search), [search]);
}

// Función que calcula el tiempo inicial del cronómetro
function handleGetTimer(duration = 150, dateInMiliseconds = null) {
  const finalDuration = duration ? parseInt(duration) : 150;
  const finalDateInMiliseconds = dateInMiliseconds ? parseInt(dateInMiliseconds) : null;

  if (finalDateInMiliseconds) {
    const now = Date.now();
    const diff = finalDateInMiliseconds - now;

    if (diff <= 0) {
      return { timer: 0, message: "Se agotó el tiempo" };
    }

    const diffInSeconds = Math.floor(diff / 1000);
    const timerValue = Math.min(finalDuration, diffInSeconds);

    return { timer: timerValue, message: null };
  }

  return { timer: finalDuration, message: null };
}

// Convierte segundos a formato mm:ss
const handleGetTimerText = (currentTimer) => {
  const minutes = Math.floor(currentTimer / 60);
  const seconds = currentTimer % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

function App() {
  const query = useQuery();
  const duration = query.get("duration");
  const dateInMiliseconds = query.get("date");

  const [timer, setTimer] = useState(0);
  const [textTimer, setTextTimer] = useState("");

  // Inicializar timer
  useEffect(() => {
    const { timer: currentTimer, message } = handleGetTimer(
      duration,
      dateInMiliseconds
    );

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
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          setTextTimer("Se agotó el tiempo");
          return 0;
        }
        setTextTimer(handleGetTimerText(newTime));
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Render principal
  return (
    <div
      className={`timer ${
        textTimer === "Se agotó el tiempo" ? "timeout-message" : ""
      }`}
      id="countdown"
    >
      {textTimer}
    </div>
  );
}

export default App;
