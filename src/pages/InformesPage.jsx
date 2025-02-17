import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import championData from '../assets/200125_LoL_champion_data.csv';
import { jsPDF } from 'jspdf';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const getRoleData = (champions) => {
    const roleCounts = champions.reduce((acc, champion) => {
        const roles = champion.role ? champion.role.split(',') : [];
        roles.forEach(role => {
            acc[role] = (acc[role] || 0) + 1;
        });
        return acc;
    }, {});

    return {
        labels: Object.keys(roleCounts),
        datasets: [{
            label: 'Cantidad de personajes por rol',
            data: Object.values(roleCounts),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };
};

const getPositionData = (champions) => {
    const positionCounts = champions.reduce((acc, champion) => {
        const positions = champion.client_positions ? champion.client_positions.split(',') : [];
        positions.forEach(position => {
            acc[position] = (acc[position] || 0) + 1;
        });
        return acc;
    }, {});

    return {
        labels: Object.keys(positionCounts),
        datasets: [{
            label: 'Cantidad de personajes por posición',
            data: Object.values(positionCounts),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        }],
    };
};

export const InformesPage = () => {
    const [difficulty, setDifficulty] = useState('');
    const [heroType, setHeroType] = useState('');
    const [champions, setChampions] = useState([]);
    const [filteredChampions, setFilteredChampions] = useState([]);
    const [showNoResults, setShowNoResults] = useState(false);

    useEffect(() => {
        Papa.parse(championData, {
            download: true,
            header: true,
            complete: (result) => {
                setChampions(result.data);
            }
        });
    }, []);

    const filterChampions = () => {
        const filtered = champions.filter(champion => 
            (difficulty ? champion.difficulty === difficulty : true) &&
            (heroType ? champion.herotype === heroType : true)
        );
        setFilteredChampions(filtered);
        setShowNoResults(filtered.length === 0);
        return filtered;
    };

    const generatePDF = () => {
        const filtered = filterChampions();
        
        if (filtered.length === 0 && difficulty === '' && heroType === '') {
            setFilteredChampions(champions);
        } else if (filtered.length === 0) {
            return;
        }

        const doc = new jsPDF();
        let yPosition = 20;
        const leftMargin = 15;
        const pageHeight = doc.internal.pageSize.height;
        
        // Funciones auxiliares
        const addLine = (text, size = 12) => {
            if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
            }
            doc.setFontSize(size);
            doc.text(text, leftMargin, yPosition);
            yPosition += size / 2 + 4;
        };

        // Título pequeño en la esquina superior derecha
        doc.setFontSize(10);
        doc.text('Informe de proyecto de Pablo', doc.internal.pageSize.width - 60, 10);

        // Título
        addLine('Informe de Campeones de League of Legends', 20);
        yPosition += 10;

        // Información de filtros
        addLine('Filtros aplicados:');
        addLine(`Dificultad: ${difficulty || 'Todos'}`);
        addLine(`Tipo de héroe: ${heroType || 'Todos'}`);
        addLine(`Total de campeones encontrados: ${filtered.length}`);
        yPosition += 10;

        // Cabecera de la tabla
        doc.setFillColor(200, 220, 255);
        doc.rect(leftMargin, yPosition - 5, 180, 8, 'F');
        doc.setFontSize(10);
        doc.text('Nombre', leftMargin + 2, yPosition);
        doc.text('Tipo', leftMargin + 52, yPosition);
        doc.text('Dificultad', leftMargin + 82, yPosition);
        doc.text('Daño', leftMargin + 112, yPosition);
        doc.text('Defensa', leftMargin + 142, yPosition);
        doc.text('Magia', leftMargin + 172, yPosition);
        yPosition += 10;

        // Datos de los campeones
        doc.setFontSize(9);
        filtered.forEach((champion, index) => {
            if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
            }

            if (index % 2 === 0) {
                doc.setFillColor(240, 240, 240);
                doc.rect(leftMargin, yPosition - 5, 180, 7, 'F');
            }

            doc.text(champion.fullname || champion.title, leftMargin + 2, yPosition);
            doc.text(champion.herotype, leftMargin + 52, yPosition);
            doc.text(champion.difficulty, leftMargin + 82, yPosition);
            doc.text(champion.damage || 'N/A', leftMargin + 112, yPosition);
            doc.text(champion.defense || 'N/A', leftMargin + 142, yPosition);
            doc.text(champion.magic || 'N/A', leftMargin + 172, yPosition);
            
            yPosition += 8;
        });

        yPosition += 10;

        // Resumen estadístico
        const stats = {
            promedioDificultad: filtered.reduce((acc, c) => acc + Number(c.difficulty), 0) / filtered.length,
            promedioDaño: filtered.reduce((acc, c) => acc + Number(c.damage || 0), 0) / filtered.length,
            promedioDefensa: filtered.reduce((acc, c) => acc + Number(c.defense || 0), 0) / filtered.length,
        };

        addLine('Resumen Estadístico', 14);
        addLine(`Promedio de dificultad: ${stats.promedioDificultad.toFixed(2)}`);
        addLine(`Promedio de daño: ${stats.promedioDaño.toFixed(2)}`);
        addLine(`Promedio de defensa: ${stats.promedioDefensa.toFixed(2)}`);

        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Página ${i} de ${pageCount} - Generado el ${new Date().toLocaleDateString()}`,
                doc.internal.pageSize.width / 2,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        doc.save('informe_campeones_lol.pdf');
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl font-bold mb-4">Informes de Campeones</h2>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Dificultad:</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Todos</option>
                            <option value="1">Fácil</option>
                            <option value="2">Medio</option>
                            <option value="3">Difícil</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo de Héroe:</label>
                        <select
                            value={heroType}
                            onChange={(e) => setHeroType(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Todos</option>
                            <option value="Fighter">Luchador</option>
                            <option value="Mage">Mago</option>
                            <option value="Assassin">Asesino</option>
                            <option value="Tank">Tanque</option>
                            <option value="Support">Soporte</option>
                            <option value="Marksman">Tirador</option>
                        </select>
                    </div>
                </div>

                <button 
                    onClick={generatePDF}
                    className="w-full md:w-auto p-2 bg-blue-500 text-white rounded"
                >
                    Generar Informe PDF
                </button>

                {showNoResults && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                        No se encontraron campeones que coincidan con los filtros seleccionados.
                    </div>
                )}

                {filteredChampions.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Vista previa de resultados</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Nombre</th>
                                        <th className="p-2 text-left">Tipo</th>
                                        <th className="p-2 text-left">Dificultad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredChampions.slice(0, 5).map((champion, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="p-2">{champion.fullname || champion.title}</td>
                                            <td className="p-2">{champion.herotype}</td>
                                            <td className="p-2">{champion.difficulty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">Gráfico de Barras: Cantidad de personajes por rol</h3>
                    <Bar data={getRoleData(champions)} options={{ responsive: true }} />
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">Gráfico Circular: Cantidad de personajes por posición</h3>
                    <Pie data={getPositionData(champions)} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
};