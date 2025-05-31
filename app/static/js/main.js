// Variáveis globais para armazenar dados
let studentData = [];
let overviewData = {};
let coursePerformanceData = {};
let genderPerformanceData = {};
let learningStylePerformanceData = {};
let engagementData = {};
let learningPatternsData = {};

// Cores para gráficos
const chartColors = {
    primary: '#4e73df',
    success: '#1cc88a',
    info: '#36b9cc',
    warning: '#f6c23e',
    danger: '#e74a3b',
    secondary: '#858796',
    light: '#f8f9fc',
    dark: '#5a5c69',
    primaryLight: 'rgba(78, 115, 223, 0.2)',
    successLight: 'rgba(28, 200, 138, 0.2)',
    infoLight: 'rgba(54, 185, 204, 0.2)',
    warningLight: 'rgba(246, 194, 62, 0.2)',
    dangerLight: 'rgba(231, 74, 59, 0.2)'
};

// Configurações padrão para gráficos
Chart.defaults.font.family = "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif";
Chart.defaults.color = '#858796';
Chart.defaults.scale.grid.color = 'rgba(0, 0, 0, 0.05)';

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados iniciais
    loadAllData();
    
    // Configurar navegação da sidebar
    setupNavigation();
    
    // Configurar formulário de previsão
    setupPredictionForm();
    
    // Configurar botões de filtro
    setupFilterButtons();
});

// Função para carregar todos os dados necessários
async function loadAllData() {
    try {
        // Mostrar spinner de carregamento
        document.getElementById('loading-spinner').classList.remove('d-none');
        
        // Carregar dados de visão geral
        overviewData = await fetchData('/api/overview');
        
        // Carregar dados de desempenho
        coursePerformanceData = await fetchData('/api/performance/course');
        genderPerformanceData = await fetchData('/api/performance/gender');
        learningStylePerformanceData = await fetchData('/api/performance/learning_style');
        
        // Carregar dados de engajamento
        engagementData = await fetchData('/api/engagement/correlation');
        
        // Carregar dados de padrões de aprendizagem
        learningPatternsData = await fetchData('/api/learning_patterns');
        
        // Carregar lista de estudantes para o formulário de previsão
        await loadStudentList();
        
        // Atualizar a interface com os dados carregados
        updateDashboard();
        
        // Esconder spinner de carregamento
        document.getElementById('loading-spinner').classList.add('d-none');
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Ocorreu um erro ao carregar os dados. Por favor, tente novamente.');
    }
}

// Função para buscar dados da API
async function fetchData(endpoint) {
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados de ${endpoint}: ${response.statusText}`);
    }
    return await response.json();
}

// Função para atualizar todo o dashboard com os dados carregados
function updateDashboard() {
    // Atualizar visão geral
    updateOverviewSection();
    
    // Atualizar seção de desempenho
    updatePerformanceSection();
    
    // Atualizar seção de engajamento
    updateEngagementSection();
    
    // Atualizar seção de padrões
    updatePatternsSection();
}

// Função para atualizar a seção de visão geral
function updateOverviewSection() {
    // Atualizar cards de estatísticas
    document.getElementById('total-students').textContent = overviewData.total_students;
    document.getElementById('avg-performance').textContent = overviewData.avg_performance;
    document.getElementById('total-courses').textContent = overviewData.courses.length;
    document.getElementById('total-styles').textContent = Object.keys(overviewData.learning_styles).length;
    
    // Criar gráfico de distribuição por género
    createGenderDistributionChart();
    
    // Criar gráfico de distribuição por estilo de aprendizagem
    createLearningStyleDistributionChart();
}

// Função para criar gráfico de distribuição por género
function createGenderDistributionChart() {
    const ctx = document.getElementById('gender-chart').getContext('2d');
    
    // Preparar dados
    const labels = Object.keys(overviewData.gender_distribution);
    const data = Object.values(overviewData.gender_distribution);
    
    // Definir cores
    const backgroundColors = [chartColors.primary, chartColors.info];
    
    // Criar gráfico
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Função para criar gráfico de distribuição por estilo de aprendizagem
function createLearningStyleDistributionChart() {
    const ctx = document.getElementById('learning-style-chart').getContext('2d');
    
    // Preparar dados
    const labels = Object.keys(overviewData.learning_styles);
    const data = Object.values(overviewData.learning_styles);
    
    // Definir cores
    const backgroundColors = [
        chartColors.primary,
        chartColors.success,
        chartColors.warning
    ];
    
    // Criar gráfico
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Função para atualizar a seção de desempenho
function updatePerformanceSection() {
    // Criar gráfico de desempenho por curso
    createCoursePerformanceChart('average_scores');
    
    // Criar gráfico de desempenho por género
    createGenderPerformanceChart();
    
    // Criar gráfico de desempenho por estilo de aprendizagem
    createLearningStylePerformanceChart();
}

// Função para criar gráfico de desempenho por curso
function createCoursePerformanceChart(metric) {
    const ctx = document.getElementById('course-performance-chart').getContext('2d');
    
    // Limpar gráfico anterior se existir
    if (window.courseChart) {
        window.courseChart.destroy();
    }
    
    // Preparar dados
    const labels = coursePerformanceData.courses;
    const data = coursePerformanceData[metric];
    
    // Definir título baseado na métrica
    let title = 'Média Geral por Curso';
    if (metric === 'attendance') {
        title = 'Frequência por Curso';
    } else if (metric === 'engagement') {
        title = 'Engajamento por Curso';
    }
    
    // Criar gráfico
    window.courseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: chartColors.primaryLight,
                borderColor: chartColors.primary,
                borderWidth: 2,
                borderRadius: 5,
                maxBarThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Função para criar gráfico de desempenho por género
function createGenderPerformanceChart() {
    const ctx = document.getElementById('gender-performance-chart').getContext('2d');
    
    // Preparar dados
    const labels = genderPerformanceData.genders;
    const data = genderPerformanceData.average_scores;
    
    // Definir cores
    const backgroundColors = [
        chartColors.primaryLight,
        chartColors.infoLight
    ];
    
    const borderColors = [
        chartColors.primary,
        chartColors.info
    ];
    
    // Criar gráfico
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Média Geral',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                borderRadius: 5,
                maxBarThickness: 100
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Função para criar gráfico de desempenho por estilo de aprendizagem
function createLearningStylePerformanceChart() {
    const ctx = document.getElementById('learning-style-performance-chart').getContext('2d');
    
    // Preparar dados
    const labels = learningStylePerformanceData.learning_styles;
    const data = learningStylePerformanceData.average_scores;
    
    // Definir cores
    const backgroundColors = [
        chartColors.primaryLight,
        chartColors.successLight,
        chartColors.warningLight
    ];
    
    const borderColors = [
        chartColors.primary,
        chartColors.success,
        chartColors.warning
    ];
    
    // Criar gráfico
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Média Geral',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                borderRadius: 5,
                maxBarThickness: 100
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Função para atualizar a seção de engajamento
function updateEngagementSection() {
    // Criar gráfico de engajamento vs. desempenho
    createEngagementPerformanceChart();
    
    // Criar gráfico de frequência vs. desempenho
    createAttendancePerformanceChart();
    
    // Atualizar tabela de correlação
    updateCorrelationTable();
}

// Função para criar gráfico de engajamento vs. desempenho
function createEngagementPerformanceChart() {
    const ctx = document.getElementById('engagement-performance-chart').getContext('2d');
    
    // Preparar dados
    const data = engagementData.engagement_vs_performance;
    
    // Criar gráfico
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Estudantes',
                data: data.x.map((x, i) => ({
                    x: x,
                    y: data.y[i]
                })),
                backgroundColor: chartColors.primary,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Engajamento'
                    },
                    min: 5,
                    max: 10
                },
                y: {
                    title: {
                        display: true,
                        text: 'Desempenho'
                    },
                    min: 60,
                    max: 100
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            return `${data.names[index]}: Engajamento ${context.parsed.x}, Desempenho ${context.parsed.y}`;
                        }
                    }
                }
            }
        }
    });
}

// Função para criar gráfico de frequência vs. desempenho
function createAttendancePerformanceChart() {
    const ctx = document.getElementById('attendance-performance-chart').getContext('2d');
    
    // Preparar dados
    const data = engagementData.attendance_vs_performance;
    
    // Criar gráfico
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Estudantes',
                data: data.x.map((x, i) => ({
                    x: x,
                    y: data.y[i]
                })),
                backgroundColor: chartColors.info,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Frequência'
                    },
                    min: 70,
                    max: 100
                },
                y: {
                    title: {
                        display: true,
                        text: 'Desempenho'
                    },
                    min: 60,
                    max: 100
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            return `${data.names[index]}: Frequência ${context.parsed.x}%, Desempenho ${context.parsed.y}`;
                        }
                    }
                }
            }
        }
    });
}

// Função para atualizar tabela de correlação
function updateCorrelationTable() {
    const table = document.getElementById('correlation-table');
    const matrix = engagementData.correlation_matrix;
    
    // Atualizar células da tabela
    const cells = table.querySelectorAll('tbody td');
    
    // Engajamento vs Engajamento
    cells[0].textContent = matrix.engagement_score.engagement_score;
    cells[0].style.backgroundColor = getCorrelationColor(matrix.engagement_score.engagement_score);
    
    // Engajamento vs Frequência
    cells[1].textContent = matrix.engagement_score.attendance;
    cells[1].style.backgroundColor = getCorrelationColor(matrix.engagement_score.attendance);
    
    // Engajamento vs Desempenho
    cells[2].textContent = matrix.engagement_score.average_score;
    cells[2].style.backgroundColor = getCorrelationColor(matrix.engagement_score.average_score);
    
    // Frequência vs Engajamento
    cells[3].textContent = matrix.attendance.engagement_score;
    cells[3].style.backgroundColor = getCorrelationColor(matrix.attendance.engagement_score);
    
    // Frequência vs Frequência
    cells[4].textContent = matrix.attendance.attendance;
    cells[4].style.backgroundColor = getCorrelationColor(matrix.attendance.attendance);
    
    // Frequência vs Desempenho
    cells[5].textContent = matrix.attendance.average_score;
    cells[5].style.backgroundColor = getCorrelationColor(matrix.attendance.average_score);
    
    // Desempenho vs Engajamento
    cells[6].textContent = matrix.average_score.engagement_score;
    cells[6].style.backgroundColor = getCorrelationColor(matrix.average_score.engagement_score);
    
    // Desempenho vs Frequência
    cells[7].textContent = matrix.average_score.attendance;
    cells[7].style.backgroundColor = getCorrelationColor(matrix.average_score.attendance);
    
    // Desempenho vs Desempenho
    cells[8].textContent = matrix.average_score.average_score;
    cells[8].style.backgroundColor = getCorrelationColor(matrix.average_score.average_score);
}

// Função para obter cor baseada no valor de correlação
function getCorrelationColor(value) {
    if (value === 1) {
        return 'rgba(200, 200, 200, 0.3)';
    } else if (value >= 0.7) {
        return 'rgba(28, 200, 138, 0.3)';
    } else if (value >= 0.4) {
        return 'rgba(54, 185, 204, 0.3)';
    } else if (value >= 0) {
        return 'rgba(246, 194, 62, 0.2)';
    } else {
        return 'rgba(231, 74, 59, 0.2)';
    }
}

// Função para atualizar a seção de padrões
function updatePatternsSection() {
    // Criar gráfico de desempenho por estilo e curso
    createStyleCourseChart();
    
    // Criar gráfico de progresso
    createProgressChart();
    
    // Atualizar tabelas de melhores desempenhos e alunos com dificuldades
    updatePerformanceTables();
}

// Função para criar gráfico de desempenho por estilo e curso
function createStyleCourseChart() {
    const ctx = document.getElementById('style-course-chart').getContext('2d');
    
    // Verificar se temos os dados necessários
    if (!learningPatternsData || !learningPatternsData.performance_by_style_course) {
        console.error('Dados de padrões de aprendizagem não disponíveis');
        return;
    }
    
    // Preparar dados
    const patterns = learningPatternsData.performance_by_style_course;
    const datasets = [];
    const styles = new Set();
    const courses = new Set();
    
    // Extrair estilos e cursos únicos
    Object.keys(patterns).forEach(key => {
        const [style, course] = key.split(',');
        styles.add(style.replace('(', '').replace("'", '').replace("'", ''));
        courses.add(course.replace(')', '').replace("'", '').replace("'", ''));
    });
    
    // Criar datasets para cada estilo de aprendizagem
    Array.from(styles).forEach((style, index) => {
        const data = [];
        Array.from(courses).forEach(course => {
            const key = `('${style}', '${course}')`;
            if (patterns[key]) {
                data.push(patterns[key].average_score);
            } else {
                data.push(0);
            }
        });
        
        // Definir cores para cada estilo
        let backgroundColor, borderColor;
        if (style === 'Visual') {
            backgroundColor = chartColors.primaryLight;
            borderColor = chartColors.primary;
        } else if (style === 'Auditivo') {
            backgroundColor = chartColors.successLight;
            borderColor = chartColors.success;
        } else {
            backgroundColor = chartColors.warningLight;
            borderColor = chartColors.warning;
        }
        
        datasets.push({
            label: style,
            data: data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 2
        });
    });
    
    // Criar gráfico
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Array.from(courses),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 60,
                    max: 100,
                    ticks: {
                        stepSize: 10
                    }
                }
            }
        }
    });
}

// Função para criar gráfico de progresso
function createProgressChart() {
    const ctx = document.getElementById('progress-chart').getContext('2d');
    
    // Verificar se temos os dados necessários
    if (!learningPatternsData || !learningPatternsData.progress_patterns) {
        console.error('Dados de padrões de progresso não disponíveis');
        return;
    }
    
    // Preparar dados
    const patterns = learningPatternsData.progress_patterns;
    const labels = [];
    const meanData = [];
    const minData = [];
    const maxData = [];
    
    // Extrair dados
    Object.keys(patterns).forEach(key => {
        const [style, course] = key.split(',');
        const styleClean = style.replace('(', '').replace("'", '').replace("'", '');
        const courseClean = course.replace(')', '').replace("'", '').replace("'", '');
        const label = `${styleClean} - ${courseClean}`;
        
        labels.push(label);
        meanData.push(patterns[key].progress.mean);
        minData.push(patterns[key].progress.min);
        maxData.push(patterns[key].progress.max);
    });
    
    // Criar gráfico
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Progresso Médio',
                    data: meanData,
                    backgroundColor: chartColors.primaryLight,
                    borderColor: chartColors.primary,
                    borderWidth: 2
                },
                {
                    label: 'Progresso Mínimo',
                    data: minData,
                    backgroundColor: chartColors.dangerLight,
                    borderColor: chartColors.danger,
                    borderWidth: 2
                },
                {
                    label: 'Progresso Máximo',
                    data: maxData,
                    backgroundColor: chartColors.successLight,
                    borderColor: chartColors.success,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        maxRotation: 90,
                        minRotation: 45
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Progresso (Pontos)'
                    }
                }
            }
        }
    });
}

// Função para atualizar tabelas de desempenho
function updatePerformanceTables() {
    // Verificar se temos os dados necessários
    if (!learningPatternsData) {
        console.error('Dados de padrões de aprendizagem não disponíveis');
        return;
    }
    
    // Atualizar tabela de melhores desempenhos
    const topTable = document.getElementById('top-performers-table').querySelector('tbody');
    topTable.innerHTML = '';
    
    learningPatternsData.top_performers.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.learning_style}</td>
            <td><span class="badge bg-success">${student.average_score}</span></td>
        `;
        topTable.appendChild(row);
    });
    
    // Atualizar tabela de alunos com dificuldades
    const strugglingTable = document.getElementById('struggling-students-table').querySelector('tbody');
    strugglingTable.innerHTML = '';
    
    learningPatternsData.struggling_students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.learning_style}</td>
            <td><span class="badge bg-danger">${student.average_score}</span></td>
        `;
        strugglingTable.appendChild(row);
    });
}

// Função para carregar lista de estudantes para o formulário de previsão
async function loadStudentList() {
    try {
        // Carregar dados dos estudantes
        const response = await fetch('/api/overview');
        const data = await response.json();
        
        // Buscar dados completos dos estudantes (simulado)
        studentData = await fetchStudentData();
        
        // Preencher o select com os estudantes
        const select = document.getElementById('student-select');
        
        studentData.forEach(student => {
            const option = document.createElement('option');
            option.value = student.student_id;
            option.textContent = `${student.name} (${student.course})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar lista de estudantes:', error);
    }
}

// Função para buscar dados completos dos estudantes (simulado)
async function fetchStudentData() {
    // Em um cenário real, isso viria de uma API
    // Por enquanto, vamos simular com base nos dados que já temos
    const response = await fetch('/app/data/student_data.csv');
    const csvText = await response.text();
    
    // Parsear CSV manualmente
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const students = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const student = {};
        
        headers.forEach((header, index) => {
            student[header] = values[index];
        });
        
        students.push(student);
    }
    
    return students;
}

// Função para configurar navegação da sidebar
function setupNavigation() {
    const navLinks = document.querySelectorAll('#sidebar .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Navegar para a seção
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Função para configurar formulário de previsão
function setupPredictionForm() {
    const form = document.getElementById('prediction-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const studentId = document.getElementById('student-select').value;
        
        if (!studentId) {
            alert('Por favor, selecione um estudante.');
            return;
        }
        
        try {
            // Buscar previsão para o estudante
            const prediction = await fetchData(`/api/predict/${studentId}`);
            
            // Mostrar resultado da previsão
            displayPredictionResult(prediction);
        } catch (error) {
            console.error('Erro ao buscar previsão:', error);
            alert('Ocorreu um erro ao buscar a previsão. Por favor, tente novamente.');
        }
    });
}

// Função para exibir resultado da previsão
function displayPredictionResult(prediction) {
    // Esconder placeholder e mostrar resultado
    document.getElementById('prediction-placeholder').classList.add('d-none');
    document.getElementById('prediction-result').classList.remove('d-none');
    
    // Preencher dados do estudante
    document.getElementById('student-name').textContent = prediction.name;
    document.getElementById('student-course').textContent = prediction.course;
    document.getElementById('student-style').textContent = prediction.learning_style;
    document.getElementById('student-id').textContent = prediction.student_id;
    
    // Preencher notas
    document.getElementById('actual-score').textContent = prediction.actual_score;
    document.getElementById('predicted-score').textContent = prediction.predicted_score;
    
    // Configurar alerta de tendência
    const trendAlert = document.getElementById('trend-alert');
    trendAlert.className = 'alert';
    
    if (prediction.trend === 'melhoria') {
        trendAlert.classList.add('positive');
        document.getElementById('trend-text').textContent = `Tendência de melhoria: +${prediction.difference} pontos`;
    } else if (prediction.trend === 'declínio') {
        trendAlert.classList.add('negative');
        document.getElementById('trend-text').textContent = `Tendência de declínio: ${prediction.difference} pontos`;
    } else {
        trendAlert.classList.add('neutral');
        document.getElementById('trend-text').textContent = 'Desempenho estável';
    }
    
    // Preencher recomendações
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = '';
    
    prediction.recommendations.forEach(recommendation => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<i class="bi bi-check-circle-fill text-primary me-2"></i> ${recommendation}`;
        recommendationsList.appendChild(li);
    });
}

// Função para configurar botões de filtro
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('[data-metric]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Atualizar gráfico com a métrica selecionada
            const metric = this.getAttribute('data-metric');
            createCoursePerformanceChart(metric);
        });
    });
}
