function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            var video = document.getElementById('video');
            video.srcObject = stream;
            video.play();

            // Processing frames from the camera
            var intervalId = setInterval(function () {
                var canvas = document.getElementById('canvas');
                var context = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                var code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    // Assuming 'data' contains your stored data
                    var data = {
                        code: code.data
                    };

                    // Check if the scanned QR code matches any data
                    if (data.code === code.data) {
                        // Match found, send success message
                        document.getElementById('result').innerText = "QR Code matched successfully: " + data.code;

                        // Stop the camera stream
                        stream.getTracks().forEach(track => track.stop());
                    
                        // Stop processing frames
                        clearInterval(intervalId);

                        // Show the scan again button
                        document.getElementById('scanAgain').style.display = 'block';
                    } else {
                        // No match found
                        document.getElementById('result').innerText = "QR Code does not match any data.";
                    }
                } else {
                    // No QR code detected
                    document.getElementById('result').innerText = "No QR code detected.";
                }
            }, 1000); // Adjust the interval as needed
        })
        .catch(function (err) {
            console.error('Error accessing camera:', err);
        });
}

document.getElementById('scanAgain').addEventListener('click', function () {
    // Clear the result message
    // document.getElementById('result').innerText = "";

    // Hide the scan again button
    // document.getElementById('scanAgain').style.display = 'none';

    // Start the camera again
    startCamera();
});

// Start the camera initially
startCamera();