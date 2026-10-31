import httpx
import glob
from pathlib import Path

client = httpx.Client(base_url="http://127.0.0.1:8000")

sample_paths = sorted(Path("ecovision-ai/ml/sample_test_images").glob("*_sample.jpg"))
print(f"Found {len(sample_paths)} sample images for testing.")

for p in sample_paths:
    with open(p, "rb") as f:
        res = client.post("/api/classify", files={"file": (p.name, f, "image/jpeg")})
        if res.status_code == 200:
            d = res.json()
            c_name = d["predicted_class"]
            conf = d["confidence_percentage"]
            top3 = [x["category"] for x in d["top_predictions"]]
            print(f"{p.name:22s} -> {c_name:10s} ({conf:5.1f}%) | Top 3: {top3}")
        else:
            print(f"Error {res.status_code} on {p.name}: {res.text}")

# Check analytics
analytics = client.get("/api/analytics").json()
print("\nUpdated Global Analytics Summary:")
print("Total Items Classified:", analytics["total_classifications"])
print("Category Breakdown:", analytics["category_counts"])
