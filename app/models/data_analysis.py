import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split

def load_student_data():
    """
    Carrega os dados dos estudantes do arquivo CSV
    
    Returns:
        DataFrame: Dados dos estudantes
    """
    try:
        df = pd.read_csv('app/data/student_data.csv')
        return df
    except Exception as e:
        print(f"Erro ao carregar dados: {e}")
        return pd.DataFrame()

def get_performance_by_course():
    """
    Analisa o desempenho dos estudantes por curso
    
    Returns:
        dict: Dados de desempenho por curso
    """
    df = load_student_data()
    
    # Calcular média de notas por curso
    course_performance = df.groupby('course').agg({
        'assignment_1': 'mean',
        'assignment_2': 'mean',
        'assignment_3': 'mean',
        'midterm': 'mean',
        'final_exam': 'mean',
        'attendance': 'mean',
        'engagement_score': 'mean'
    }).round(2)
    
    # Calcular média geral por curso
    course_performance['average_score'] = course_performance[
        ['assignment_1', 'assignment_2', 'assignment_3', 'midterm', 'final_exam']
    ].mean(axis=1).round(2)
    
    # Converter para formato adequado para API
    result = {
        'courses': course_performance.index.tolist(),
        'average_scores': course_performance['average_score'].tolist(),
        'attendance': course_performance['attendance'].tolist(),
        'engagement': course_performance['engagement_score'].tolist(),
        'details': course_performance.to_dict(orient='index')
    }
    
    return result

def get_performance_by_gender():
    """
    Analisa o desempenho dos estudantes por género
    
    Returns:
        dict: Dados de desempenho por género
    """
    df = load_student_data()
    
    # Calcular média de notas por género
    gender_performance = df.groupby('gender').agg({
        'assignment_1': 'mean',
        'assignment_2': 'mean',
        'assignment_3': 'mean',
        'midterm': 'mean',
        'final_exam': 'mean',
        'attendance': 'mean',
        'engagement_score': 'mean'
    }).round(2)
    
    # Calcular média geral por género
    gender_performance['average_score'] = gender_performance[
        ['assignment_1', 'assignment_2', 'assignment_3', 'midterm', 'final_exam']
    ].mean(axis=1).round(2)
    
    # Converter para formato adequado para API
    result = {
        'genders': gender_performance.index.tolist(),
        'average_scores': gender_performance['average_score'].tolist(),
        'attendance': gender_performance['attendance'].tolist(),
        'engagement': gender_performance['engagement_score'].tolist(),
        'details': gender_performance.to_dict(orient='index')
    }
    
    return result

def get_performance_by_learning_style():
    """
    Analisa o desempenho dos estudantes por estilo de aprendizagem
    
    Returns:
        dict: Dados de desempenho por estilo de aprendizagem
    """
    df = load_student_data()
    
    # Calcular média de notas por estilo de aprendizagem
    style_performance = df.groupby('learning_style').agg({
        'assignment_1': 'mean',
        'assignment_2': 'mean',
        'assignment_3': 'mean',
        'midterm': 'mean',
        'final_exam': 'mean',
        'attendance': 'mean',
        'engagement_score': 'mean'
    }).round(2)
    
    # Calcular média geral por estilo de aprendizagem
    style_performance['average_score'] = style_performance[
        ['assignment_1', 'assignment_2', 'assignment_3', 'midterm', 'final_exam']
    ].mean(axis=1).round(2)
    
    # Converter para formato adequado para API
    result = {
        'learning_styles': style_performance.index.tolist(),
        'average_scores': style_performance['average_score'].tolist(),
        'attendance': style_performance['attendance'].tolist(),
        'engagement': style_performance['engagement_score'].tolist(),
        'details': style_performance.to_dict(orient='index')
    }
    
    return result

def get_engagement_correlation():
    """
    Analisa a correlação entre engajamento e desempenho
    
    Returns:
        dict: Dados de correlação entre engajamento e desempenho
    """
    df = load_student_data()
    
    # Calcular média de notas para cada estudante
    df['average_score'] = df[['assignment_1', 'assignment_2', 'assignment_3', 'midterm', 'final_exam']].mean(axis=1)
    
    # Calcular correlação entre engajamento e desempenho
    engagement_corr = df[['engagement_score', 'attendance', 'average_score']].corr().round(3)
    
    # Preparar dados para visualização de dispersão
    scatter_data = df[['student_id', 'name', 'engagement_score', 'attendance', 'average_score']].to_dict(orient='records')
    
    # Converter para formato adequado para API
    result = {
        'correlation_matrix': engagement_corr.to_dict(),
        'scatter_data': scatter_data,
        'engagement_vs_performance': {
            'x': df['engagement_score'].tolist(),
            'y': df['average_score'].tolist(),
            'names': df['name'].tolist()
        },
        'attendance_vs_performance': {
            'x': df['attendance'].tolist(),
            'y': df['average_score'].tolist(),
            'names': df['name'].tolist()
        }
    }
    
    return result

def predict_student_performance(student_id):
    """
    Prevê o desempenho futuro de um estudante com base no histórico
    
    Args:
        student_id (int): ID do estudante
        
    Returns:
        dict: Previsão de desempenho
    """
    df = load_student_data()
    
    # Verificar se o estudante existe
    if student_id not in df['student_id'].values:
        return {'error': 'Estudante não encontrado'}
    
    # Preparar dados para treinamento
    # Usamos características como tarefas anteriores, frequência e engajamento para prever a nota final
    X = df[['assignment_1', 'assignment_2', 'assignment_3', 'midterm', 'attendance', 'engagement_score']]
    y = df['final_exam']
    
    # Treinar um modelo simples de regressão linear
    model = LinearRegression()
    model.fit(X, y)
    
    # Obter dados do estudante específico
    student_data = df[df['student_id'] == student_id]
    student_features = student_data[['assignment_1', 'assignment_2', 'assignment_3', 'midterm', 'attendance', 'engagement_score']]
    
    # Fazer previsão
    predicted_score = model.predict(student_features)[0].round(2)
    actual_score = student_data['final_exam'].values[0]
    
    # Calcular diferença e tendência
    difference = predicted_score - actual_score
    trend = "melhoria" if difference > 0 else "declínio" if difference < 0 else "estável"
    
    # Preparar recomendações baseadas nos dados
    recommendations = []
    
    if student_data['attendance'].values[0] < 85:
        recommendations.append("Melhorar a frequência nas aulas")
    
    if student_data['engagement_score'].values[0] < 7.5:
        recommendations.append("Aumentar o engajamento durante as aulas")
    
    if student_data['assignment_1'].values[0] < 75 or student_data['assignment_2'].values[0] < 75 or student_data['assignment_3'].values[0] < 75:
        recommendations.append("Focar em melhorar o desempenho nas tarefas")
    
    if not recommendations:
        recommendations.append("Manter o bom desempenho atual")
    
    # Preparar resposta
    result = {
        'student_id': int(student_id),
        'name': student_data['name'].values[0],
        'course': student_data['course'].values[0],
        'learning_style': student_data['learning_style'].values[0],
        'actual_score': float(actual_score),
        'predicted_score': float(predicted_score),
        'difference': float(difference.round(2)),
        'trend': trend,
        'recommendations': recommendations
    }
    
    return result

def get_learning_patterns():
    """
    Identifica padrões de aprendizagem entre os estudantes
    
    Returns:
        dict: Padrões de aprendizagem identificados
    """
    df = load_student_data()
    
    # Calcular média de notas para cada estudante
    df['average_score'] = df[['assignment_1', 'assignment_2', 'assignment_3', 'midterm', 'final_exam']].mean(axis=1)
    
    # Analisar padrões por estilo de aprendizagem e curso
    patterns_by_style_course = df.groupby(['learning_style', 'course']).agg({
        'average_score': 'mean',
        'engagement_score': 'mean',
        'attendance': 'mean'
    }).round(2)
    
    # Identificar tendências de progresso (comparando tarefas iniciais vs. exame final)
    df['initial_performance'] = df['assignment_1']
    df['final_performance'] = df['final_exam']
    df['progress'] = df['final_performance'] - df['initial_performance']
    
    progress_patterns = df.groupby(['learning_style', 'course']).agg({
        'progress': ['mean', 'min', 'max']
    }).round(2)
    
    # Converter para formato adequado para API
    result = {
        'performance_by_style_course': patterns_by_style_course.to_dict(),
        'progress_patterns': progress_patterns.to_dict(),
        'learning_styles_distribution': df['learning_style'].value_counts().to_dict(),
        'top_performers': df.nlargest(5, 'average_score')[['student_id', 'name', 'course', 'learning_style', 'average_score']].to_dict(orient='records'),
        'struggling_students': df.nsmallest(5, 'average_score')[['student_id', 'name', 'course', 'learning_style', 'average_score']].to_dict(orient='records')
    }
    
    return result
