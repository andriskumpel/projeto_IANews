# Dashboard Educacional com IA

Um dashboard interativo para análise de dados educacionais com recursos de inteligência artificial para previsão de desempenho de estudantes.

## Visão Geral

Este projeto consiste num dashboard educacional que utiliza análise de dados e inteligência artificial para fornecer insights sobre o desempenho dos estudantes. O dashboard permite visualizar dados por curso, género, estilo de aprendizagem, além de analisar correlações entre engajamento e desempenho. Também inclui um modelo de machine learning para prever o desempenho futuro dos estudantes.

## Funcionalidades

- **Visão Geral**: Estatísticas gerais e distribuição de estudantes por género e estilo de aprendizagem
- **Análise de Desempenho**: Visualização de desempenho por curso, género e estilo de aprendizagem
- **Análise de Engajamento**: Correlação entre engajamento, frequência e desempenho
- **Previsões com IA**: Previsão de desempenho futuro de estudantes com base em dados históricos
- **Padrões de Aprendizagem**: Identificação de padrões entre diferentes estilos de aprendizagem e cursos

## Tecnologias Utilizadas

### Backend
- Python 3.11
- Flask (Framework web)
- Pandas e NumPy (Análise de dados)
- Scikit-learn (Machine Learning)
- Matplotlib e Plotly (Visualização de dados)

### Frontend
- HTML5, CSS3 e JavaScript
- Bootstrap 5 (Framework CSS)
- Chart.js (Biblioteca de gráficos)
- Fetch API (Comunicação com o backend)

## Estrutura do Projeto

```
edu_dashboard_ai/
├── app/
│   ├── data/
│   │   └── student_data.csv       # Dados de exemplo dos estudantes
│   ├── models/
│   │   └── data_analysis.py       # Funções de análise de dados e ML
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css          # Estilos personalizados
│   │   └── js/
│   │       └── main.js            # JavaScript principal
│   ├── templates/
│   │   └── index.html             # Página principal do dashboard
│   ├── __init__.py                # Inicialização da aplicação Flask
│   └── routes.py                  # Rotas da API e páginas
├── venv/                          # Ambiente virtual Python
├── app.py                         # Ponto de entrada da aplicação
└── README.md                      # Documentação do projeto
```

## Instalação e Execução

### Pré-requisitos
- Python 3.6 ou superior
- pip (gerenciador de pacotes Python)

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/andriskumpel/projeto_IANews.git
cd edu_dashboard_ai
```

2. Crie e ative um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

3. Instale as dependências:
```bash
pip install flask pandas numpy scikit-learn matplotlib plotly
```

4. Execute a aplicação:
```bash
python app.py
```

5. Acesse o dashboard no navegador:
```
http://localhost:5000
```

## Modelo de Machine Learning

O projeto utiliza um modelo simples de regressão linear para prever o desempenho dos estudantes com base em:
- Notas de tarefas anteriores
- Nota da prova intermediária
- Frequência nas aulas
- Nível de engajamento

Este modelo demonstra como a IA pode ser aplicada no contexto educacional para identificar tendências e fornecer recomendações personalizadas.

## Dados de Exemplo

O dashboard utiliza um conjunto de dados simulado com 50 estudantes, incluindo:
- Informações demográficas (idade, género)
- Curso e estilo de aprendizagem
- Notas em tarefas, provas intermediárias e exames finais
- Métricas de frequência e engajamento

## Próximos Passos

- Implementar autenticação de usuários
- Adicionar funcionalidade de upload de dados
- Expandir os modelos de IA para incluir agrupamento de estudantes
- Desenvolver recursos de exportação de relatórios
- Implementar notificações para estudantes em risco

## Autor

Desenvolvido por Manus AI para o GitHub de Andris Kümpel.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
