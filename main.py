from flask import Flask, request, jsonify, render_template
from pyzbar.pyzbar import decode
from PIL import Image
import io, base64

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/scan', methods=['POST'])
def scan():
    # Get the image data from the request
    dataUrl = request.form['image']
    imageData = dataUrl.split(',')[1].encode('utf-8')

    # Convert the image data to a PIL Image object
    image = Image.open(io.BytesIO(base64.b64decode(imageData)))

    # Decode the barcode
    barcode = decode(image)

    # Return the barcode value as a JSON response
    if barcode:
        return jsonify({'barcode': barcode[0].data.decode('utf-8')})
    else:
        return jsonify({'error': 'No barcode found'})


if __name__ == '__main__':
    app.run(debug=True)
