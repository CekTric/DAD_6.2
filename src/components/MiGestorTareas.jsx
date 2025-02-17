import React, { useReducer, useState } from "react";

// Definir los tipos de acciones
const ACTIONS = {
  ADD_TASK: 'add_task',
  DELETE_TASK: 'delete_task'
};

// Reducer function
const taskReducer = (tasks, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TASK:
      return [...tasks, action.payload];
    case ACTIONS.DELETE_TASK:
      return tasks.filter((_, index) => index !== action.payload);
    default:
      return tasks;
  }
};

export const MiGestorTareas = () => {
  // Estado para el input
  const [inputTask, setInputTask] = useState("");
  
  // useReducer para manejar las tareas
  const [tasks, dispatch] = useReducer(taskReducer, []);

  const addTask = () => {
    if (inputTask.trim()) {
      dispatch({ type: ACTIONS.ADD_TASK, payload: inputTask });
      setInputTask(""); // Limpiar el input después de agregar
    }
  };

  const deleteTask = (index) => {
    dispatch({ type: ACTIONS.DELETE_TASK, payload: index });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestor de Tareas</h1>

      {/* Componente para agregar tarea */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={inputTask}
          onChange={(e) => setInputTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe una tarea"
          className="flex-1 p-2 border rounded"
        />
        <button 
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Añadir tarea
        </button>
      </div>

      {/* Lista de tareas */}
      <ol className="list-decimal list-inside">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center justify-between py-2 border-b">
            <span>{task}</span>
            <button 
              onClick={() => deleteTask(index)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default MiGestorTareas;