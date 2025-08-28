// Start Cam function
export const startCam = () => {

    //Initialize video
    const videoHTML = document.getElementById("video");

    // validate video element
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                videoHTML.srcObject = stream;
            })
            .catch(function(error) {
                console.error("Something went wrong!");
            });
    }
};
