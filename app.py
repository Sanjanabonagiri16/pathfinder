from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta
import json
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///psychometric_tests.db'
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Add this testQuestions dictionary
testQuestions = {
    'aptitude': [
        # ... (add the 20 aptitude questions here)
    ],
    'verbal-ability': [
        # ... (add the 15 verbal ability questions here)
    ],
    'mock-interviews': [
        # ... (add the 20 mock interview questions here)
    ],
    # Add other test categories as needed
}

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

class TestResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    test_type = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/api/tests', methods=['GET'])
def get_tests():
    tests = [
        {'id': 1, 'name': 'Emotional Intelligence', 'description': 'Assess your emotional intelligence skills'},
        {'id': 2, 'name': 'Aptitude Test', 'description': 'Evaluate your general aptitude'},
        {'id': 3, 'name': 'Verbal Ability', 'description': 'Test your verbal reasoning and communication skills'},
        {'id': 4, 'name': 'Game Aptitude', 'description': 'Measure your gaming skills and potential'},
        {'id': 5, 'name': 'Mock Interviews', 'description': 'Practice and improve your interview skills'},
    ]
    return jsonify(tests)

@app.route('/api/submit_test', methods=['POST'])
@jwt_required()
def submit_test():
    data = request.json
    user_id = get_jwt_identity()
    test_type = data['test_type']
    answers = data['answers']
    
    score = calculate_score(test_type, answers)
    
    test_result = TestResult(user_id=user_id, test_type=test_type, score=score)
    db.session.add(test_result)
    db.session.commit()
    
    return jsonify({'score': score}), 200

@app.route('/api/test_results', methods=['GET'])
@jwt_required()
def get_test_results():
    test_type = request.args.get('test')
    score = int(request.args.get('score'))
    
    details = calculate_detailed_score(test_type, score)
    
    return jsonify({
        'score': score,
        'total': len(testQuestions[test_type]),
        'details': details
    })

@app.route('/api/learning_paths', methods=['GET'])
@jwt_required()
def get_learning_paths():
    test_type = request.args.get('test')
    score = int(request.args.get('score'))
    details = json.loads(request.args.get('details'))
    
    paths = get_learning_paths_for_test(test_type, score, details)
    return jsonify(paths)

@app.route('/api/resources', methods=['GET'])
@jwt_required()
def get_resources():
    test_type = request.args.get('test')
    score = int(request.args.get('score'))
    details = json.loads(request.args.get('details'))
    
    resources = get_resources_for_test(test_type, score, details)
    return jsonify(resources)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    logging.info(f"Received registration request for username: {username}, email: {email}")

    if User.query.filter_by(username=username).first():
        logging.warning(f"Registration failed: Username {username} already exists")
        return jsonify({"message": "Username already exists"}), 400

    if User.query.filter_by(email=email).first():
        logging.warning(f"Registration failed: Email {email} already exists")
        return jsonify({"message": "Email already exists"}), 400

    try:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        logging.info(f"User {username} registered successfully")
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        logging.error(f"Error during registration: {str(e)}")
        db.session.rollback()
        return jsonify({"message": "An error occurred during registration"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    # You might want to add the token to a blocklist here
    return jsonify({"message": "Successfully logged out"}), 200

@app.route('/api/verify_token', methods=['GET'])
@jwt_required()
def verify_token():
    current_user = get_jwt_identity()
    return jsonify(valid=True, user_id=current_user), 200

def calculate_score(test_type, answers):
    correct_answers = {
        'aptitude': [
            '4', '12', '60 km/h', '32', '$25', '40 cm²', '9', '180°', '$16,200', '12',
            'Cannot be determined', '4', 'ECPFNG', '25', 'All Zips are Zops', '49', 'Ocean', 'Penguin', '10 feet', 'UJHFS'
        ],
        'emotional-intelligence': ['Very well', 'Always', 'Very comfortable', 'Very well', 'Very often', 'Very easily', 'Very well', 'Daily', 'Very well', 'Very often', 'Very well', 'Always', 'Very well', 'Very often', 'Very well'],
        'verbal-ability': [
            "went", "This is the better of the two options.", 
            "Neither of the students has completed their assignment.", 
            "The gift is for you and me.", "Accommodate", 
            "The cat, which was orange, had green eyes.", 
            "The group of students is studying for their exam.", 
            "She sang beautifully at the concert.", 
            "By the time we arrive, the movie will have already started.", 
            "He likes swimming, running, and riding his bike.", 
            "This book is more interesting than that one.", 
            "The dog's bowls are empty.", 
            "I love cooking; I make pasta every week.", 
            "I have never seen that movie before.", 
            "If I had known, I would have told you."
        ],
        'game-aptitude': [
            "Technological advancement",
            "First Person Shooter",
            # Add more correct answers for game aptitude questions here...
        ],
        'mock-interviews': [
            "Provide a brief overview of education and career",
            "Express interest in company's mission and values",
            "Mention a relevant skill and provide an example",
            "Describe healthy coping mechanisms",
            "Discuss aspirations aligned with the company's growth",
            "Describe the situation, your actions, and the positive outcome",
            "Describe your collaborative approach and give an example",
            "Discuss a real weakness and steps to improve",
            "Highlight your skills and how they match the job requirements",
            "Describe how you listen and learn from feedback",
            "Discuss a range based on market research and your experience",
            "Describe your time management and organizational tools",
            "Describe a failure, the lesson learned, and how you improved",
            "Describe how you communicate and find a resolution",
            "Discuss intrinsic motivators related to the job and industry",
            "Describe your method for assessing urgency and importance",
            "Mention relevant hobbies that demonstrate valuable skills",
            "Describe your methods for continuous learning and professional development",
            "Discuss an environment that aligns with the company culture",
            "Describe your strategies for time management and prioritization"
        ]
    }
    
    score = sum(1 for q, a in answers.items() if a == correct_answers[test_type][int(q)])
    return score

def calculate_detailed_score(test_type, score):
    # This is a simplified example. In a real application, you'd calculate this based on the user's actual answers.
    if test_type == 'aptitude':
        return {
            'quantitative': {'correct': score // 2, 'total': 10},
            'logical': {'correct': score - (score // 2), 'total': 10}
        }
    elif test_type == 'verbal-ability':
        return {
            'grammar': {'correct': score // 3, 'total': 5},
            'vocabulary': {'correct': score // 3, 'total': 5},
            'comprehension': {'correct': score - 2 * (score // 3), 'total': 5}
        }
    elif test_type == 'mock-interviews':
        return {
            'communication': {'correct': score // 4, 'total': 5},
            'problem-solving': {'correct': score // 4, 'total': 5},
            'behavioral': {'correct': score // 4, 'total': 5},
            'technical': {'correct': score - 3 * (score // 4), 'total': 5}
        }
    elif test_type == 'game-aptitude':
        return {
            'strategy': {'correct': score // 3, 'total': 5},
            'gaming-terms': {'correct': score // 3, 'total': 5},
            'reflexes': {'correct': score - 2 * (score // 3), 'total': 5}
        }
    # Add other test types as needed

def get_learning_paths_for_test(test_type, score, details):
    weak_areas = [area for area, scores in details.items() if scores['correct'] / scores['total'] < 0.6]
    
    paths = {
        'aptitude': [
            {'name': 'Basic Math Skills', 'url': '#', 'description': 'Improve your fundamental math skills', 'area': 'quantitative'},
            {'name': 'Advanced Problem Solving', 'url': '#', 'description': 'Learn advanced problem-solving techniques', 'area': 'quantitative'},
            {'name': 'Logical Reasoning', 'url': '#', 'description': 'Enhance your logical thinking abilities', 'area': 'logical'},
        ],
        'verbal-ability': [
            {'name': 'Grammar Essentials', 'url': '#', 'description': 'Master the basics of English grammar', 'area': 'grammar'},
            {'name': 'Vocabulary Building', 'url': '#', 'description': 'Expand your vocabulary', 'area': 'vocabulary'},
            {'name': 'Reading Comprehension', 'url': '#', 'description': 'Improve your reading and understanding skills', 'area': 'comprehension'},
        ],
        'mock-interviews': [
            {'name': 'Effective Communication', 'url': '#', 'description': 'Learn to communicate clearly and confidently', 'area': 'communication'},
            {'name': 'Problem-Solving Strategies', 'url': '#', 'description': 'Develop your problem-solving skills', 'area': 'problem-solving'},
            {'name': 'Behavioral Interview Prep', 'url': '#', 'description': 'Prepare for behavioral interview questions', 'area': 'behavioral'},
            {'name': 'Technical Interview Skills', 'url': '#', 'description': 'Sharpen your technical interview skills', 'area': 'technical'},
        ],
        'game-aptitude': [
            {'name': 'Gaming Basics', 'url': '#', 'description': 'Learn the fundamentals of gaming', 'area': 'gaming-terms'},
            {'name': 'Strategy Game Mastery', 'url': '#', 'description': 'Improve your strategic thinking in games', 'area': 'strategy'},
            {'name': 'Reflex Training', 'url': '#', 'description': 'Enhance your reflexes for faster-paced games', 'area': 'reflexes'},
        ],
    }
    
    return [path for path in paths[test_type] if path['area'] in weak_areas]

def get_resources_for_test(test_type, score, details):
    weak_areas = [area for area, scores in details.items() if scores['correct'] / scores['total'] < 0.6]
    
    resources = {
        'emotional-intelligence': [
            {
                'title': 'HelpGuide - Emotional Intelligence Toolkit',
                'url': 'https://www.helpguide.org/articles/mental-health/emotional-intelligence-toolkit.htm',
                'description': 'A comprehensive toolkit with free, practical exercises to improve emotional intelligence.',
                'area': 'emotional-intelligence'
            },
            {
                'title': 'Greater Good in Action - Emotional Intelligence Practices',
                'url': 'https://ggia.berkeley.edu/practice/emotional_intelligence',
                'description': 'Free science-based practices to boost emotional intelligence and social skills.',
                'area': 'emotional-intelligence'
            },
            {
                'title': 'Mind Tools - Developing Emotional Intelligence',
                'url': 'https://www.mindtools.com/pages/article/newCDV_59.htm',
                'description': 'Learn how to manage emotions, improve relationships, and increase decision-making effectiveness.',
                'area': 'emotional-intelligence'
            }
        ],
        'aptitude': [
            {
                'title': 'Khan Academy - Logical Reasoning',
                'url': 'https://www.khanacademy.org/test-prep/lsat/lsat-lessons/lsat-logic',
                'description': 'Free lessons covering logical and critical reasoning, which are vital for aptitude tests.',
                'area': 'logical'
            },
            {
                'title': 'Coursera - Introduction to Logic',
                'url': 'https://www.coursera.org/learn/logic-introduction',
                'description': 'Learn about deductive reasoning and argumentation (Free Audit Option).',
                'area': 'logical'
            },
            {
                'title': 'Khan Academy - Basic Math and Algebra',
                'url': 'https://www.khanacademy.org/math',
                'description': 'Strengthen your foundational math and reasoning skills that are essential for numerical reasoning tests.',
                'area': 'quantitative'
            },
            {
                'title': 'OpenStax - Free Math Textbooks',
                'url': 'https://openstax.org/subjects/math',
                'description': 'Free textbooks on math topics like algebra and statistics.',
                'area': 'quantitative'
            }
        ],
        'verbal-ability': [
            {
                'title': 'Project Gutenberg - Free eBooks for Vocabulary Building',
                'url': 'https://www.gutenberg.org/',
                'description': 'Access classic books that help build vocabulary and verbal reasoning skills.',
                'area': 'vocabulary'
            },
            {
                'title': 'Khan Academy - Reading Comprehension',
                'url': 'https://www.khanacademy.org/test-prep/sat/reading-writing/reading-passage-reading/v/how-to-approach-reading-passages',
                'description': 'Lessons on reading comprehension, critical for verbal reasoning.',
                'area': 'comprehension'
            },
            {
                'title': 'LinkedIn Learning - Developing Communication Skills for Workplace',
                'url': 'https://www.linkedin.com/learning/topics/communication',
                'description': 'Enhance your communication and verbal reasoning skills through structured learning paths.',
                'area': 'grammar'
            }
        ],
        'mock-interviews': [
            {
                'title': 'Pramp - Mock Interviews',
                'url': 'https://www.pramp.com/',
                'description': 'Practice mock interviews with peers to improve your interview skills.',
                'area': 'behavioral'
            },
            {
                'title': 'LeetCode - Problem Solving',
                'url': 'https://leetcode.com/',
                'description': 'Platform for technical interview preparation and problem-solving skills.',
                'area': 'technical'
            },
            {
                'title': 'Positive Psychology - Self-Awareness',
                'url': 'https://positivepsychology.com/self-awareness/',
                'description': 'Free articles and exercises to enhance self-awareness and personality understanding.',
                'area': 'personal'
            },
            {
                'title': 'Verywell Mind - Personality and Self-Improvement',
                'url': 'https://www.verywellmind.com/self-improvement-4157212',
                'description': 'A collection of free resources on improving personality traits and self-awareness.',
                'area': 'personal'
            }
        ],
    }
    
    return [resource for resource in resources[test_type] if resource['area'] in weak_areas]

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)