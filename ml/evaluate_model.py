import os

import joblib
import pandas as pd
from sklearn.metrics import ConfusionMatrixDisplay, accuracy_score, classification_report, roc_auc_score
from sklearn.model_selection import train_test_split

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

df = pd.read_csv('data/processed/final_dataset.csv')
TARGET = 'wastage_label'
FEATURES = joblib.load('ml/feature_columns.pkl')
model = joblib.load('ml/model.pkl')

X = df[FEATURES]
y = df[TARGET]

_, X_test, _, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

print('=== Evaluate on held-out test split (same seed as train_model) ===')
print(f'Accuracy: {accuracy_score(y_test, y_pred):.4f}')
try:
    print(f'ROC-AUC: {roc_auc_score(y_test, y_proba):.4f}')
except ValueError as e:
    print(f'ROC-AUC skipped: {e}')
print(classification_report(y_test, y_pred, target_names=['Normal', 'Wastage']))

importance = pd.Series(model.feature_importances_, index=FEATURES).sort_values(ascending=False)
print('\nTop 12 feature importances:')
print(importance.head(12).to_string())

os.makedirs('ml', exist_ok=True)
out_png = os.path.join('ml', 'confusion_matrix.png')
try:
    disp = ConfusionMatrixDisplay.from_predictions(y_test, y_pred)
    disp.figure_.savefig(out_png, dpi=120, bbox_inches='tight')
    print(f'\nSaved confusion matrix plot to {out_png}')
except Exception as e:
    print(f'\nCould not save confusion matrix plot: {e}')
