import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import cv2
import matplotlib.pyplot as plt

# -----------------------------------------
# 1. Load the Local Image
# -----------------------------------------
image_path = 'satellite.jpg'
image_bgr = cv2.imread(image_path)
if image_bgr is None:
    raise Exception(f"Failed to load image from {image_path}")

image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
original_height, original_width, _ = image_rgb.shape

plt.figure(figsize=(8, 8))
plt.imshow(image_rgb)
plt.title("Original Image")
plt.axis("off")
plt.show()

# -----------------------------------------
# 2. Preprocess the Image for the Detection Model
# -----------------------------------------
model_input_size = (320, 320)
input_image = cv2.resize(image_rgb, model_input_size)

# Create a uint8 tensor (do not normalize)
input_tensor = tf.convert_to_tensor(input_image, dtype=tf.uint8)
input_tensor = tf.expand_dims(input_tensor, axis=0)

# -----------------------------------------
# 3. Load and Run Object Detection Using TensorFlow Hub Model
# -----------------------------------------
print("Loading the object detection model from TensorFlow Hub ...")
detector = hub.load("https://tfhub.dev/tensorflow/ssd_mobilenet_v2/fpnlite_320x320/1")
print("Model loaded. Running inference...")

outputs = detector(input_tensor)

detection_boxes   = outputs['detection_boxes'][0].numpy()
detection_scores  = outputs['detection_scores'][0].numpy()
detection_classes = outputs['detection_classes'][0].numpy().astype(np.int64)

# -----------------------------------------
# 4. Annotate the Original Image with Detections
# -----------------------------------------
annotated_image = image_rgb.copy()
confidence_threshold = 0.5

for i in range(len(detection_scores)):
    if detection_scores[i] >= confidence_threshold:
        ymin, xmin, ymax, xmax = detection_boxes[i]
        start_point = (int(xmin * original_width), int(ymin * original_height))
        end_point   = (int(xmax * original_width), int(ymax * original_height))
        cv2.rectangle(annotated_image, start_point, end_point, color=(255, 0, 0), thickness=2)

plt.figure(figsize=(8, 8))
plt.imshow(annotated_image)
plt.title(f"Detection Results (Confidence ≥ {confidence_threshold})")
plt.axis("off")
plt.show()

print("Processing complete.")
