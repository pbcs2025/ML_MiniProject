import os

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import cross_val_score, train_test_split

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

df = pd.read_csv('data/processed/final_dataset.csv')
TARGET = 'wastage_label'
FEATURES = [c for c in df.columns if c != TARGET]

X = df[FEATURES]
y = df[TARGET]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    class_weight='balanced',
    random_state=42,
)
model.fit(X_train, y_train)

cv_scores = cross_val_score(model, X, y, cv=5, scoring='f1')
print(f'5-fold CV F1: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}')
print(classification_report(y_test, model.predict(X_test), target_names=['Normal', 'Wastage']))
print('Confusion matrix (test):')
print(confusion_matrix(y_test, model.predict(X_test)))

os.makedirs('ml', exist_ok=True)
joblib.dump(model, 'ml/model.pkl')
joblib.dump(FEATURES, 'ml/feature_columns.pkl')
print('Model saved to ml/model.pkl')
