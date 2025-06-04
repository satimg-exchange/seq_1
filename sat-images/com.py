from PIL import Image

images = [
    Image.open("c1.jpg"),
    Image.open("c2.jpg"),
    Image.open("p4.jpg"),
    Image.open("satellite.jpg")
]

# All images should have the same height
widths, heights = zip(*(img.size for img in images))
total_width = sum(widths)
max_height = max(heights)

combined = Image.new('RGB', (total_width, max_height))

x_offset = 0
for img in images:
    combined.paste(img, (x_offset, 0))
    x_offset += img.width

combined.save("combined.png")
