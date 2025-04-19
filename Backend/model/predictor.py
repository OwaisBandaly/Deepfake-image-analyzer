from PIL import Image
import torch
from transformers import AutoProcessor, AutoModelForImageClassification

class ImageAnalyzer:
    def __init__(self):
        self.model_name = "prithivMLmods/Deep-Fake-Detector-Model"
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.processor = AutoProcessor.from_pretrained(self.model_name)
        self.model = AutoModelForImageClassification.from_pretrained(self.model_name)
        self.model.to(self.device)
        self.model.eval()

    def predict(self, img_file):
        img = Image.open(img_file).convert("RGB")
        inputs = self.processor(images=img, return_tensors="pt").to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = torch.nn.functional.softmax(logits, dim=1)
            predicted_class_idx = logits.argmax(dim=1).item()
            confidence = probabilities[0][predicted_class_idx].item()

        reversed_class_idx = 1 - predicted_class_idx
        reversed_label = self.model.config.id2label[reversed_class_idx]

        return reversed_label, round(confidence * 100, 2)


