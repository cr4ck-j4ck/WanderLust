fetch("https://aac.saavncdn.com/550/3abd97560a982ebc13b0ab52887fc325_160.mp4")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.blob();
  })
  .then(blob => {
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();
  })
  .catch(error => {
    console.error("There was a problem with the fetch operation:", error);
  });