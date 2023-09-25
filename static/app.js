$(function() {
  // Get references to the video element and scan button
  var video = document.getElementById('video');
  var scanButton = document.getElementById('scan-button');

  // Request permission to access the camera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      // Set the source of the video element to the camera stream
      video.srcObject = stream;
      video.play();
    });

  // Listen for click events on the scan button
  scanButton.addEventListener('click', function() {
    // Pause the video stream to freeze the frame
    video.pause();

    // Draw the current frame onto a canvas element
    var canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image to a data URL
    var dataUrl = canvas.toDataURL();

    // Send a POST request to the Flask application with the data URL
    $.ajax({
      type: 'POST',
      url: '/scan',
      data: { image: dataUrl },
      success: function(data) {
        alert('Barcode scanned: ' + data.barcode);
      },
      error: function() {
        alert('Error scanning barcode');
      }
    });

    // Resume the video stream
    video.play();
  });
});
