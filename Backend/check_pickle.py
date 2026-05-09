import pickle
import os

model_path = os.path.join(os.path.dirname(__file__), 'model.p')
try:
    with open(model_path, 'rb') as f:
        data = pickle.load(f)
        
    print(f"Type of data: {type(data)}")
    if isinstance(data, dict):
        print(f"Keys: {data.keys()}")
        model = data.get('model', None)
        if model:
            print(f"Model Type: {type(model)}")
            if hasattr(model, 'classes_'):
                print(f"Classes: {model.classes_}")
except Exception as e:
    print(f"Error: {e}")
