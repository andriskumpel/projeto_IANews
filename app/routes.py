from flask import Blueprint, render_template, jsonify
import pandas as pd
import numpy as np
from app.models.data_analysis import (
    load_student_data,
    get_performance_by_course,
    get_performance_by_gender,
    get_performance_by_learning_style,
    get_engagement_correlation,
    predict_student_performance
)

# Blueprint para as páginas principais
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Página principal do dashboard"""
    return render_template('index.html')

@main_bp.route('/dashboard')
def dashboard():
    """Página do dashboard principal"""
    return render_template('dashboard.html')

# Blueprint para as APIs
api_bp = Blueprint('api', __name__)

@api_bp.route('/overview')
def get_overview():
    """Retorna uma visão geral dos dados dos estudantes"""
    df = load_student_data()
    
    overview = {
        'total_students': len(df),
        'courses': df['course'].unique().tolist(),
        'avg_performance': round(df[['assignment_1', 'assignment_2', 'assignment_3', 'midterm', 'final_exam']].mean().mean(), 2),
        'gender_distribution': df['gender'].value_counts().to_dict(),
        'learning_styles': df['learning_style'].value_counts().to_dict()
    }
    
    return jsonify(overview)

@api_bp.route('/performance/course')
def course_performance():
    """Retorna dados de desempenho por curso"""
    data = get_performance_by_course()
    return jsonify(data)

@api_bp.route('/performance/gender')
def gender_performance():
    """Retorna dados de desempenho por género"""
    data = get_performance_by_gender()
    return jsonify(data)

@api_bp.route('/performance/learning_style')
def learning_style_performance():
    """Retorna dados de desempenho por estilo de aprendizagem"""
    data = get_performance_by_learning_style()
    return jsonify(data)

@api_bp.route('/engagement/correlation')
def engagement_correlation():
    """Retorna correlação entre engajamento e desempenho"""
    data = get_engagement_correlation()
    return jsonify(data)

@api_bp.route('/predict/<int:student_id>')
def predict_performance(student_id):
    """Prevê o desempenho futuro de um estudante com base no histórico"""
    prediction = predict_student_performance(student_id)
    return jsonify(prediction)
